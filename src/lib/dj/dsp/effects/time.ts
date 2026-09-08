import type { ParamSpec, ParamValues } from '../types'
import { RAMP, num, safeParam } from '../types'
import { WetDryEffect } from '../wetDry'

const ECHO_AMOUNT: ParamSpec = {
  key: 'echoAmount',
  label: 'Echo',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}
const ECHO_TIME: ParamSpec = {
  key: 'echoTimeMs',
  label: 'Time',
  min: 40,
  max: 1000,
  neutral: 280,
  step: 5,
  format: (v) => `${Math.round(v)}ms`,
}
const ECHO_FEEDBACK: ParamSpec = {
  key: 'echoFeedback',
  label: 'Repeats',
  min: 0,
  max: 85,
  neutral: 35,
  format: (v) => `${Math.round(v)}%`,
}

/** Beat divisions the echo time can snap to when a BPM is known. */
export const ECHO_DIVISIONS = [
  { label: '1/16', beats: 0.25 },
  { label: '1/8', beats: 0.5 },
  { label: '1/4', beats: 1 },
  { label: '1/2', beats: 2 },
  { label: '1 bar', beats: 4 },
] as const

/** Converts a beat division to milliseconds at a given tempo. Used by the
 * UI to offer tempo-synced echo times once a track has been analysed —
 * the "syncable to BPM" requirement. Returns null when no usable tempo is
 * known, so the caller falls back to the free-running millisecond knob. */
export function divisionToMs(bpm: number | null, beats: number): number | null {
  if (!bpm || !Number.isFinite(bpm) || bpm <= 0) return null
  return (60000 / bpm) * beats
}

/** Feedback ceiling. Above roughly 0.85 a delay line becomes unstable and
 * builds toward runaway self-oscillation, which is a genuine speaker
 * hazard rather than a creative setting, so the knob cannot reach it. */
const MAX_FEEDBACK = 0.85

/**
 * Feedback delay with a damped repeat path. The lowpass inside the
 * feedback loop is what stops repeats from turning into harsh metallic
 * ringing as they accumulate: each pass loses a little treble, the way a
 * real tape or analogue delay does.
 */
export class EchoEffect extends WetDryEffect {
  readonly id = 'echo'
  readonly label = 'Echo'
  readonly params = [ECHO_AMOUNT, ECHO_TIME, ECHO_FEEDBACK] as const
  private readonly delay: DelayNode
  private readonly feedback: GainNode
  private readonly damping: BiquadFilterNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.delay = ctx.createDelay(2.0)
    this.delay.delayTime.value = 0.28
    this.feedback = ctx.createGain()
    this.feedback.gain.value = 0.35
    this.damping = ctx.createBiquadFilter()
    this.damping.type = 'lowpass'
    this.damping.frequency.value = 3200
    this.delay.connect(this.damping)
    this.damping.connect(this.feedback)
    this.feedback.connect(this.delay)
    this.wire(this.delay, this.delay)
  }

  apply(values: ParamValues, now: number): void {
    this.delay.delayTime.setTargetAtTime(safeParam(num(values, ECHO_TIME) / 1000, 0.28, 2), now, RAMP)
    this.feedback.gain.setTargetAtTime(
      safeParam(Math.min(MAX_FEEDBACK, num(values, ECHO_FEEDBACK) / 100), 0.35),
      now,
      RAMP,
    )
    this.setMix(num(values, ECHO_AMOUNT) / 100, now)
  }
}

const REVERB_AMOUNT: ParamSpec = {
  key: 'reverbAmount',
  label: 'Reverb',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}
const REVERB_SIZE: ParamSpec = {
  key: 'reverbSize',
  label: 'Size',
  min: 0,
  max: 100,
  neutral: 45,
  format: (v) => `${Math.round(v)}%`,
}

/**
 * Convolution reverb over a synthesised impulse response — exponentially
 * decaying filtered noise, rather than a recorded IR file. Nothing to
 * ship or load, and entirely convincing for a coloration send.
 *
 * Changing size regenerates the impulse, which allocates a multi-second
 * stereo buffer, so it is quantised to 5% steps: a knob drag would
 * otherwise allocate a fresh buffer on every pointer-move.
 */
export class ReverbEffect extends WetDryEffect {
  readonly id = 'reverb'
  readonly label = 'Reverb'
  readonly params = [REVERB_AMOUNT, REVERB_SIZE] as const
  private readonly convolver: ConvolverNode
  private lastSizeBucket = -1

  constructor(ctx: AudioContext) {
    super(ctx)
    this.convolver = ctx.createConvolver()
    this.setSize(45)
    this.wire(this.convolver, this.convolver)
  }

  private setSize(size: number): void {
    const bucket = Math.round(size / 5)
    if (bucket === this.lastSizeBucket) return
    this.lastSizeBucket = bucket
    const seconds = 0.4 + (size / 100) * 3.6
    this.convolver.buffer = createImpulseResponse(this.ctx, seconds, 3.2)
  }

  apply(values: ParamValues, now: number): void {
    this.setSize(num(values, REVERB_SIZE))
    this.setMix(num(values, REVERB_AMOUNT) / 100, now)
  }
}

function createImpulseResponse(ctx: AudioContext, durationSeconds: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = Math.max(1, Math.floor(sampleRate * durationSeconds))
  const impulse = ctx.createBuffer(2, length, sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return impulse
}

const FLANGER_DEPTH: ParamSpec = {
  key: 'flangerDepth',
  label: 'Flanger',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}
const FLANGER_RATE: ParamSpec = {
  key: 'flangerRate',
  label: 'Rate',
  min: 0.05,
  max: 5,
  neutral: 0.5,
  step: 0.05,
  format: (v) => `${v.toFixed(2)}Hz`,
}

/**
 * Flanger: a very short modulated delay summed against the dry signal,
 * with feedback for the characteristic jet-sweep resonance. The comb
 * filtering comes from the interference between the two paths, so this is
 * one of the few effects whose whole identity depends on the wet/dry sum
 * that WetDryEffect already provides.
 */
export class FlangerEffect extends WetDryEffect {
  readonly id = 'flanger'
  readonly label = 'Flanger'
  readonly params = [FLANGER_DEPTH, FLANGER_RATE] as const
  private readonly delay: DelayNode
  private readonly lfo: OscillatorNode
  private readonly lfoGain: GainNode
  private readonly feedback: GainNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.delay = ctx.createDelay(0.02)
    this.delay.delayTime.value = 0.003
    this.lfo = ctx.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 0.5
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = 0
    this.feedback = ctx.createGain()
    this.feedback.gain.value = 0.5
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.delay.delayTime)
    this.delay.connect(this.feedback)
    this.feedback.connect(this.delay)
    this.lfo.start()
    this.wire(this.delay, this.delay)
  }

  apply(values: ParamValues, now: number): void {
    const depth = num(values, FLANGER_DEPTH)
    this.lfo.frequency.setTargetAtTime(safeParam(num(values, FLANGER_RATE), 0.5), now, RAMP)
    // Sweeps up to 2ms around a 3ms centre — the classic flanger range.
    this.lfoGain.gain.setTargetAtTime(safeParam((depth / 100) * 0.002, 0), now, RAMP)
    this.setMix(depth / 100, now)
  }

  dispose(): void {
    try {
      this.lfo.stop()
      this.lfo.disconnect()
      this.lfoGain.disconnect()
      this.feedback.disconnect()
    } catch {
      // Already stopped.
    }
    super.dispose()
  }
}

const PHASER_DEPTH: ParamSpec = {
  key: 'phaserDepth',
  label: 'Phaser',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}
const PHASER_RATE: ParamSpec = {
  key: 'phaserRate',
  label: 'Rate',
  min: 0.05,
  max: 5,
  neutral: 0.4,
  step: 0.05,
  format: (v) => `${v.toFixed(2)}Hz`,
}

/** Number of allpass stages. Four is the classic voicing — each stage
 * contributes one notch to the swept comb pattern. */
const PHASER_STAGES = 4

/**
 * Phaser: a cascade of allpass filters whose corner frequencies are swept
 * together by one LFO. Unlike the flanger, the notches are not
 * harmonically spaced, which is what gives the phaser its distinctly
 * smoother, more vocal character.
 */
export class PhaserEffect extends WetDryEffect {
  readonly id = 'phaser'
  readonly label = 'Phaser'
  readonly params = [PHASER_DEPTH, PHASER_RATE] as const
  private readonly stages: BiquadFilterNode[] = []
  private readonly lfo: OscillatorNode
  private readonly lfoGain: GainNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.lfo = ctx.createOscillator()
    this.lfo.type = 'sine'
    this.lfo.frequency.value = 0.4
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = 0
    this.lfo.connect(this.lfoGain)

    let prev: BiquadFilterNode | null = null
    for (let i = 0; i < PHASER_STAGES; i++) {
      const ap = ctx.createBiquadFilter()
      ap.type = 'allpass'
      // Stagger the stages across the spectrum so the notches spread out
      // rather than stacking at one frequency.
      ap.frequency.value = 400 * Math.pow(2, i)
      ap.Q.value = 0.7
      this.lfoGain.connect(ap.frequency)
      if (prev) prev.connect(ap)
      this.stages.push(ap)
      prev = ap
    }
    this.lfo.start()
    this.wire(this.stages[0], this.stages[this.stages.length - 1])
  }

  apply(values: ParamValues, now: number): void {
    const depth = num(values, PHASER_DEPTH)
    this.lfo.frequency.setTargetAtTime(safeParam(num(values, PHASER_RATE), 0.4), now, RAMP)
    this.lfoGain.gain.setTargetAtTime(safeParam((depth / 100) * 800, 0), now, RAMP)
    this.setMix(depth / 100, now)
  }

  dispose(): void {
    try {
      this.lfo.stop()
      this.lfo.disconnect()
      this.lfoGain.disconnect()
      for (const s of this.stages) s.disconnect()
    } catch {
      // Already stopped.
    }
    super.dispose()
  }
}

const GATE_DEPTH: ParamSpec = {
  key: 'gateDepth',
  label: 'Gate',
  min: 0,
  max: 100,
  neutral: 0,
  format: (v) => (v === 0 ? 'off' : `${Math.round(v)}%`),
}
const GATE_RATE: ParamSpec = {
  key: 'gateRate',
  label: 'Rate',
  min: 0.5,
  max: 16,
  neutral: 4,
  step: 0.5,
  format: (v) => `${v.toFixed(1)}Hz`,
}

/**
 * Rhythmic trance gate — a square LFO chopping the signal. This is a
 * performance/percussive effect, not a noise gate: it does not follow an
 * envelope, it cuts on a fixed pulse, which is what makes it useful for
 * building tension over a sustained pad or a breakdown.
 *
 * The LFO drives a gain node's own gain, offset so the wet path swings
 * between silence and unity rather than between -1 and +1 (which would
 * invert phase on the negative half rather than muting).
 */
export class GateEffect extends WetDryEffect {
  readonly id = 'gate'
  readonly label = 'Gate'
  readonly params = [GATE_DEPTH, GATE_RATE] as const
  private readonly chop: GainNode
  private readonly lfo: OscillatorNode
  private readonly lfoGain: GainNode

  constructor(ctx: AudioContext) {
    super(ctx)
    this.chop = ctx.createGain()
    // Sits at unity so the wet path is a clean passthrough until the LFO
    // is given amplitude — the wet/dry mix is what silences it at rest.
    this.chop.gain.value = 1
    this.lfo = ctx.createOscillator()
    this.lfo.type = 'square'
    this.lfo.frequency.value = 4
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = 0
    this.lfo.connect(this.lfoGain)
    this.lfoGain.connect(this.chop.gain)
    this.lfo.start()
    this.wire(this.chop, this.chop)
  }

  apply(values: ParamValues, now: number): void {
    const depth = num(values, GATE_DEPTH)
    this.lfo.frequency.setTargetAtTime(safeParam(num(values, GATE_RATE), 4), now, RAMP)
    // A square wave swinging ±0.5 around the node's resting 1.0 takes the
    // wet path between 0.5 and 1.5; scaling by depth and pulling the
    // resting value down in step keeps the peak at unity while the
    // trough reaches true silence at full depth.
    const d = depth / 100
    this.chop.gain.setTargetAtTime(safeParam(1 - d / 2, 1), now, RAMP)
    this.lfoGain.gain.setTargetAtTime(safeParam(d / 2, 0), now, RAMP)
    this.setMix(d, now)
  }

  dispose(): void {
    try {
      this.lfo.stop()
      this.lfo.disconnect()
      this.lfoGain.disconnect()
      this.chop.disconnect()
    } catch {
      // Already stopped.
    }
    super.dispose()
  }
}
