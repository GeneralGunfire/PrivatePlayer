import type { Effect, ParamSpec, ParamValues } from '../types'
import { RAMP, bool, dbToLinear, num, nyquistOf, safeParam } from '../types'
import { WetDryEffect } from '../wetDry'

/** Below this a "killed" band is inaudible rather than merely quiet —
 * a real mixer's EQ kill is a hard cut, not a deep trim. */
const KILL_GAIN_DB = -40

const TRIM: ParamSpec = {
  key: 'gain',
  label: 'Trim',
  min: -12,
  max: 12,
  neutral: 0,
  format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}dB`,
}

/** Channel input trim — the first stage of the strip, used to match
 * loudness between tracks mastered decades apart before any EQ is
 * applied. Inline (not wet/dry) because a gain node at unity genuinely is
 * transparent, unlike a filter. */
export class TrimEffect implements Effect {
  readonly id = 'trim'
  readonly label = 'Trim'
  readonly params = [TRIM] as const
  readonly input: GainNode
  readonly output: GainNode

  constructor(ctx: AudioContext) {
    this.input = ctx.createGain()
    this.output = this.input
  }

  apply(values: ParamValues, now: number): void {
    this.input.gain.setTargetAtTime(safeParam(dbToLinear(num(values, TRIM)), 1), now, RAMP)
  }
}

function fmtDb(v: number): string {
  return `${v > 0 ? '+' : ''}${Math.round(v)}dB`
}

const BASS: ParamSpec = { key: 'bass', label: 'Bass', min: -15, max: 15, neutral: 0, format: fmtDb }
const MID: ParamSpec = { key: 'mid', label: 'Mid', min: -15, max: 15, neutral: 0, format: fmtDb }
const TREBLE: ParamSpec = { key: 'treble', label: 'Treble', min: -15, max: 15, neutral: 0, format: fmtDb }
const KILL_BASS: ParamSpec = { key: 'killBass', label: 'Kill Bass', min: 0, max: 1, neutral: 0, kind: 'toggle' }
const KILL_MID: ParamSpec = { key: 'killMid', label: 'Kill Mid', min: 0, max: 1, neutral: 0, kind: 'toggle' }
const KILL_TREBLE: ParamSpec = { key: 'killTreble', label: 'Kill Treble', min: 0, max: 1, neutral: 0, kind: 'toggle' }

/**
 * Three-band EQ with per-band kill switches. Kill is modeled as a boolean
 * that forces the band to a hard cut *without* destroying the knob's
 * stored value, so releasing kill restores exactly where the knob was —
 * the behaviour of a real mixer's kill button, which is a separate
 * control from the band's own pot.
 *
 * Kills ramp at the same 30ms as everything else: a hard cut should still
 * be a fast fade, not a literal click.
 */
export class ThreeBandEqEffect implements Effect {
  readonly id = 'eq'
  readonly label = 'EQ'
  readonly params = [BASS, MID, TREBLE, KILL_BASS, KILL_MID, KILL_TREBLE] as const
  readonly input: BiquadFilterNode
  readonly output: BiquadFilterNode
  private readonly bass: BiquadFilterNode
  private readonly mid: BiquadFilterNode
  private readonly treble: BiquadFilterNode

  constructor(ctx: AudioContext) {
    this.bass = ctx.createBiquadFilter()
    this.bass.type = 'lowshelf'
    this.bass.frequency.value = 200

    this.mid = ctx.createBiquadFilter()
    this.mid.type = 'peaking'
    this.mid.frequency.value = 1000
    this.mid.Q.value = 0.9

    this.treble = ctx.createBiquadFilter()
    this.treble.type = 'highshelf'
    this.treble.frequency.value = 5000

    this.bass.connect(this.mid)
    this.mid.connect(this.treble)
    this.input = this.bass
    this.output = this.treble
  }

  apply(values: ParamValues, now: number): void {
    const b = bool(values, KILL_BASS) ? KILL_GAIN_DB : num(values, BASS)
    const m = bool(values, KILL_MID) ? KILL_GAIN_DB : num(values, MID)
    const t = bool(values, KILL_TREBLE) ? KILL_GAIN_DB : num(values, TREBLE)
    this.bass.gain.setTargetAtTime(safeParam(b, 0), now, RAMP)
    this.mid.gain.setTargetAtTime(safeParam(m, 0), now, RAMP)
    this.treble.gain.setTargetAtTime(safeParam(t, 0), now, RAMP)
  }
}

const SWEEP: ParamSpec = {
  key: 'filterSweep',
  label: 'Filter',
  min: -100,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : v < 0 ? `LP ${Math.abs(Math.round(v))}` : `HP ${Math.round(v)}`),
}

const FILTER_LOWPASS_MIN_HZ = 200
const FILTER_HIGHPASS_MAX_HZ = 4000

/**
 * The single most-used performance knob on a real mixer: one control,
 * two directions. Negative sweeps a lowpass down (progressively removing
 * treble), positive sweeps a highpass up (thinning toward just treble).
 * The two filters sit in series in the wet path, so only one is ever
 * narrowing at a time — the other stays parked wide open.
 *
 * Wet/dry rather than inline for the reason in `WetDryEffect`: a filter
 * parked at a "wide open" resting frequency still has a response, and
 * "wide open" is bounded by the device's Nyquist rather than infinity.
 */
export class FilterSweepEffect extends WetDryEffect {
  readonly id = 'filter'
  readonly label = 'Filter'
  readonly params = [SWEEP] as const
  private readonly low: BiquadFilterNode
  private readonly high: BiquadFilterNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.low = ctx.createBiquadFilter()
    this.low.type = 'lowpass'
    this.low.frequency.value = 20000
    this.low.Q.value = 0.8
    this.high = ctx.createBiquadFilter()
    this.high.type = 'highpass'
    this.high.frequency.value = 20
    this.high.Q.value = 0.8
    this.low.connect(this.high)
    this.wire(this.low, this.high)
  }

  apply(values: ParamValues, now: number): void {
    const sweep = num(values, SWEEP)
    const nyquist = nyquistOf(this.ctx)
    const lowHz =
      sweep < 0 ? FILTER_LOWPASS_MIN_HZ * Math.pow(20000 / FILTER_LOWPASS_MIN_HZ, 1 + sweep / 100) : 20000
    const highHz = sweep > 0 ? 20 + (FILTER_HIGHPASS_MAX_HZ - 20) * (sweep / 100) : 20
    this.low.frequency.setTargetAtTime(safeParam(lowHz, FILTER_LOWPASS_MIN_HZ, nyquist), now, RAMP)
    this.high.frequency.setTargetAtTime(safeParam(highHz, 20, nyquist), now, RAMP)
    this.setMix(Math.abs(sweep) / 100, now)
  }
}
