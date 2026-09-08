import type { Effect, ParamSpec, ParamValues } from './types'
import { RAMP, safeParam } from './types'

/**
 * Base for any effect that cannot be transparent when placed inline.
 *
 * The rule from `Effect`'s contract: a filter is not transparent because
 * its modulator is parked, and a reverb is not transparent because its
 * wet gain is low — a low wet gain is "a quiet effect", not "no effect".
 * The only structure that makes 0% genuinely mean bypass is a parallel
 * split where the dry path is untouched:
 *
 *     input ──┬─→ dry gain ─────────────┬─→ output
 *             └─→ [processing] → wet ───┘
 *
 * At mix=0 the wet gain is zero and the dry gain is unity, so the output
 * is the input, sample for sample, regardless of what the processing
 * nodes are doing. Subclasses build the processing between `wetIn` and
 * `wetOut` and never touch the dry path.
 */
export abstract class WetDryEffect implements Effect {
  abstract readonly id: string
  abstract readonly label: string
  abstract readonly params: readonly ParamSpec[]

  readonly input: GainNode
  readonly output: GainNode
  protected readonly dry: GainNode
  protected readonly wet: GainNode
  protected readonly ctx: AudioContext

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.input = ctx.createGain()
    this.output = ctx.createGain()
    this.dry = ctx.createGain()
    this.wet = ctx.createGain()
    this.dry.gain.value = 1
    this.wet.gain.value = 0
    this.input.connect(this.dry)
    this.dry.connect(this.output)
    this.wet.connect(this.output)
  }

  /** Subclasses call this once, from their constructor, to insert their
   * processing nodes into the wet path. */
  protected wire(wetIn: AudioNode, wetOut: AudioNode): void {
    this.input.connect(wetIn)
    wetOut.connect(this.wet)
  }

  /**
   * Sets the wet/dry balance. `mix` is 0..1.
   *
   * Constant-gain (not equal-power) crossfade: dry = 1 - mix. For an
   * effect whose wet path is a *processed copy of the same signal*, an
   * equal-power law (which keeps dry at 0.707 at mix=0.5) would make the
   * middle of the range noticeably louder than either end, since the two
   * paths are correlated rather than independent sources.
   */
  protected setMix(mix: number, now: number): void {
    const m = safeParam(Math.min(1, Math.max(0, mix)), 0)
    this.wet.gain.setTargetAtTime(m, now, RAMP)
    this.dry.gain.setTargetAtTime(1 - m, now, RAMP)
  }

  abstract apply(values: ParamValues, now: number): void

  dispose(): void {
    try {
      this.input.disconnect()
      this.output.disconnect()
      this.dry.disconnect()
      this.wet.disconnect()
    } catch {
      // Already disconnected.
    }
  }
}
