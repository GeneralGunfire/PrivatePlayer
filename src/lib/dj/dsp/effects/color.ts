import type { Effect, ParamSpec, ParamValues } from '../types'
import { RAMP, num, nyquistOf, safeParam } from '../types'
import { WetDryEffect } from '../wetDry'

const ENHANCER: ParamSpec = {
  key: 'enhancer',
  label: 'Enhancer',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}

/**
 * The classic DJ "enhancer"/exciter: a high shelf above ~9kHz that adds
 * perceived air and clarity. Inline rather than wet/dry because a shelf
 * at exactly 0dB gain is a genuine no-op — unlike a bandpass or a
 * lowpass, whose shape colours the signal even at rest.
 */
export class EnhancerEffect implements Effect {
  readonly id = 'enhancer'
  readonly label = 'Enhancer'
  readonly params = [ENHANCER] as const
  readonly input: BiquadFilterNode
  readonly output: BiquadFilterNode

  constructor(ctx: AudioContext) {
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'highshelf'
    shelf.frequency.value = 9000
    shelf.gain.value = 0
    this.input = shelf
    this.output = shelf
  }

  apply(values: ParamValues, now: number): void {
    this.input.gain.setTargetAtTime(safeParam((num(values, ENHANCER) / 100) * 12, 0), now, RAMP)
  }
}

const MUFFLE: ParamSpec = {
  key: 'muffle',
  label: 'Muffle',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}

const MUFFLE_MIN_HZ = 300
const MUFFLE_MAX_HZ = 20000

/** Resonant lowpass swept down for transitions — "muffle"/filter-down.
 * Wet/dry so 0 is a true bypass rather than a lowpass parked at a
 * device-dependent ceiling. */
export class MuffleEffect extends WetDryEffect {
  readonly id = 'muffle'
  readonly label = 'Muffle'
  readonly params = [MUFFLE] as const
  private readonly lp: BiquadFilterNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.lp = ctx.createBiquadFilter()
    this.lp.type = 'lowpass'
    this.lp.frequency.value = MUFFLE_MAX_HZ
    this.lp.Q.value = 0.7
    this.wire(this.lp, this.lp)
  }

  apply(values: ParamValues, now: number): void {
    const amount = num(values, MUFFLE)
    const fraction = 1 - amount / 100
    const hz = MUFFLE_MIN_HZ * Math.pow(MUFFLE_MAX_HZ / MUFFLE_MIN_HZ, fraction)
    this.lp.frequency.setTargetAtTime(safeParam(hz, MUFFLE_MIN_HZ, nyquistOf(this.ctx)), now, RAMP)
    this.setMix(amount / 100, now)
  }
}

const WAH_DEPTH: ParamSpec = {
  key: 'wahDepth',
  label: 'Wah',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}
const WAH_RATE: ParamSpec = {
  key: 'wahRate',
  label: 'Rate',
  min: 0.5,
  max: 8,
  neutral: 2,
  step: 0.1,
  format: (v) => `${v.toFixed(1)}Hz`,
}

const WAH_LFO_DEPTH_HZ = 900

/**
 * Auto-wah: an LFO sweeps a resonant bandpass. The canonical example of
 * why WetDryEffect exists — a Q=6 bandpass attenuates everything outside
 * its narrow passband whether or not its LFO is moving, so placing it
 * inline meant it filtered 100% of playback at all times even with the
 * depth knob at zero. That was a real, shipped bug.
 */
export class WahEffect extends WetDryEffect {
  readonly id = 'wah'
  readonly label = 'Wah'
  readonly params = [WAH_DEPTH, WAH_RATE] as const
  private readonly bp: BiquadFilterNode
  private readonly lfo: OscillatorNode
  private readonly lfoGain: GainNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.bp = ctx.createBiquadFilter()
    this.bp.type = 'bandpass'
    this.bp.frequency.value = 1200
    this.bp.Q.value = 6
    this.lfo = ctx.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 2
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = 0
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.bp.frequency)
    this.lfo.start()
    this.wire(this.bp, this.bp)
  }

  apply(values: ParamValues, now: number): void {
    const depth = num(values, WAH_DEPTH)
    this.lfo.frequency.setTargetAtTime(safeParam(num(values, WAH_RATE), 2), now, RAMP)
    this.lfoGain.gain.setTargetAtTime(safeParam((depth / 100) * WAH_LFO_DEPTH_HZ, 0), now, RAMP)
    this.setMix(depth / 100, now)
  }

  dispose(): void {
    try {
      this.lfo.stop()
      this.lfo.disconnect()
      this.lfoGain.disconnect()
    } catch {
      // Already stopped.
    }
    super.dispose()
  }
}

const DRIVE: ParamSpec = {
  key: 'drive',
  label: 'Drive',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}

/**
 * Waveshaper distortion. The curve is rebuilt only when the drive amount
 * actually changes bucket — a WaveShaperNode curve is a plain array that
 * must be regenerated wholesale, far too expensive to redo on every
 * pointer-move of a knob, so it is quantised to 1% steps.
 */
export class DistortionEffect extends WetDryEffect {
  readonly id = 'distortion'
  readonly label = 'Drive'
  readonly params = [DRIVE] as const
  private shaper: WaveShaperNode
  /** Starts at 0, matching the curve installed in the constructor, so the
   * first `apply` at rest is a no-op rather than a redundant reassignment.
   * That matters beyond efficiency: some implementations (including
   * node-web-audio-api, and per spec `WaveShaperNode.curve` is only
   * specified as settable once per node in some engines) throw
   * "cannot assign curve twice" on the second write, which silently
   * disabled this effect entirely until an offline render caught it. */
  private lastCurveBucket = 0

  constructor(ctx: AudioContext) {
    super(ctx)
    this.shaper = ctx.createWaveShaper()
    this.shaper.oversample = '2x'
    this.shaper.curve = makeDistortionCurve(0)
    this.wire(this.shaper, this.shaper)
  }

  apply(values: ParamValues, now: number): void {
    const drive = num(values, DRIVE)
    const bucket = Math.round(drive)
    if (bucket !== this.lastCurveBucket) {
      this.lastCurveBucket = bucket
      this.setCurve(makeDistortionCurve(bucket))
    }
    this.setMix(drive / 100, now)
  }

  /**
   * Swaps in a new shaping curve by replacing the node rather than
   * writing `curve` again. `WaveShaperNode.curve` cannot be assigned
   * twice in every implementation — it throws outright in some — so a
   * long-lived node whose curve follows a knob is not portable. Building
   * a replacement and re-patching it into the wet path is cheap (a
   * WaveShaperNode holds only its curve array) and works everywhere.
   */
  private setCurve(curve: Float32Array<ArrayBuffer>): void {
    try {
      const next = this.ctx.createWaveShaper()
      next.oversample = '2x'
      next.curve = curve
      this.input.disconnect(this.shaper)
      this.shaper.disconnect()
      this.input.connect(next)
      next.connect(this.wet)
      this.shaper = next
    } catch (err) {
      console.error('Drive: failed to swap shaping curve (previous curve retained):', err)
    }
  }
}

/** Standard arctangent-style soft-clip curve. `amount` 0..100 maps to how
 * hard the knee bends; at 0 the curve is very nearly the identity, which
 * is why the wet path is additionally faded to silence at that setting. */
function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const k = amount * 3
  const samples = 1024
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x))
  }
  return curve
}

const CRUSH: ParamSpec = {
  key: 'bitcrush',
  label: 'Crush',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}

/**
 * Bit-depth reduction for lo-fi texture, via a ScriptProcessorNode.
 *
 * ScriptProcessorNode is deprecated in favour of AudioWorklet, and that
 * is a deliberate trade-off here rather than an oversight: an
 * AudioWorklet requires its processor to be loaded from a separate module
 * URL at runtime, which in a Tauri app means shipping a loose asset file
 * and resolving it through the asset protocol — a build and packaging
 * concern for one optional effect. ScriptProcessorNode needs none of that
 * and is still supported in the WebView2 runtime this app targets. If
 * several effects eventually need sample-level access, moving them
 * together to a single worklet module becomes worth the packaging cost.
 *
 * The processor is a passthrough at 16 bits and the wet path is silent at
 * 0%, so it is inaudible at rest.
 */
export class BitcrushEffect extends WetDryEffect {
  readonly id = 'bitcrush'
  readonly label = 'Crush'
  readonly params = [CRUSH] as const
  private readonly proc: ScriptProcessorNode
  private bits = 16

  constructor(ctx: AudioContext) {
    super(ctx)
    this.proc = ctx.createScriptProcessor(2048, 2, 2)
    this.proc.onaudioprocess = (e) => {
      const step = Math.pow(0.5, this.bits)
      for (let ch = 0; ch < e.inputBuffer.numberOfChannels; ch++) {
        const input = e.inputBuffer.getChannelData(ch)
        const output = e.outputBuffer.getChannelData(ch)
        for (let i = 0; i < input.length; i++) {
          output[i] = step * Math.floor(input[i] / step + 0.5)
        }
      }
    }
    this.wire(this.proc, this.proc)
  }

  apply(values: ParamValues, now: number): void {
    const amount = num(values, CRUSH)
    // 16 bits (transparent) down to 2 bits (heavily crushed).
    this.bits = 16 - (amount / 100) * 14
    this.setMix(amount / 100, now)
  }

  dispose(): void {
    this.proc.onaudioprocess = null
    try {
      this.proc.disconnect()
    } catch {
      // Already disconnected.
    }
    super.dispose()
  }
}
