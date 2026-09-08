import type { Effect, ParamSpec, ParamValues } from './types'
import { defaultsFor } from './types'
import { TrimEffect, ThreeBandEqEffect, FilterSweepEffect } from './effects/channel'
import { EnhancerEffect, MuffleEffect, WahEffect, DistortionEffect, BitcrushEffect } from './effects/color'
import { EchoEffect, ReverbEffect, FlangerEffect, PhaserEffect, GateEffect } from './effects/time'

/**
 * An ordered list of effects wired input-to-output, with one place that
 * knows how to build the standard deck chain.
 *
 * Chain order follows the real DJ mixer channel-strip convention:
 *
 *   trim → EQ (+kills) → enhancer → muffle → filter sweep
 *        → colour FX (drive, crush) → modulation FX (flanger, phaser)
 *        → time FX (echo, reverb) → gate → output
 *
 * The ordering is not arbitrary. Trim comes first so every later stage
 * sees a consistent level. EQ precedes the colour and time effects so
 * that a boosted band is what gets driven or echoed, matching what a DJ
 * expects when they push the bass and hear the delay follow. Time-based
 * effects come near the end because reverberating an already-distorted
 * signal sounds like a room, whereas distorting an already-reverberated
 * signal sounds like a broken speaker. The gate is last so it chops the
 * finished sound, including its reverb tail — which is the whole point of
 * a trance gate.
 */
export class EffectChain {
  readonly effects: readonly Effect[]
  readonly input: AudioNode
  readonly output: AudioNode
  private readonly byId: Map<string, Effect>

  constructor(effects: Effect[]) {
    if (effects.length === 0) throw new Error('EffectChain requires at least one effect')
    this.effects = effects
    this.byId = new Map(effects.map((e) => [e.id, e]))
    for (let i = 0; i < effects.length - 1; i++) {
      effects[i].output.connect(effects[i + 1].input)
    }
    this.input = effects[0].input
    this.output = effects[effects.length - 1].output
  }

  /** Every parameter across every effect, in chain order — the schema the
   * UI renders from, so adding an effect adds its controls automatically
   * rather than requiring a matching UI edit. */
  get params(): ParamSpec[] {
    return this.effects.flatMap((e) => [...e.params])
  }

  /**
   * Pushes a full parameter set to every effect.
   *
   * Each effect is wrapped individually: a live AudioParam call can throw
   * for reasons outside any single value's validity — a context closed
   * underneath the call, or a driver-specific range rejection — and an
   * exception escaping here would propagate synchronously out of a knob's
   * onChange handler. With no error boundary above it that unmounts the
   * entire React tree, which is exactly what "the screen goes blank
   * mid-drag" turned out to be. One bad effect degrades to one skipped
   * update; the rest of the chain still applies.
   */
  apply(values: ParamValues, now: number): void {
    for (const effect of this.effects) {
      try {
        effect.apply(values, now)
      } catch (err) {
        console.error(`DSP: effect "${effect.id}" failed to apply (update skipped, playback continues):`, err)
      }
    }
  }

  get(id: string): Effect | undefined {
    return this.byId.get(id)
  }

  dispose(): void {
    for (const effect of this.effects) {
      try {
        effect.dispose?.()
        effect.output.disconnect()
      } catch {
        // Already disconnected.
      }
    }
  }
}

/** Builds the standard per-deck chain. Both decks and every stem lane use
 * this same factory, so they cannot drift apart in ordering or defaults. */
export function createDeckChain(ctx: AudioContext): EffectChain {
  return new EffectChain([
    new TrimEffect(ctx),
    new ThreeBandEqEffect(ctx),
    new EnhancerEffect(ctx),
    new MuffleEffect(ctx),
    new FilterSweepEffect(ctx),
    new WahEffect(ctx),
    new DistortionEffect(ctx),
    new BitcrushEffect(ctx),
    new FlangerEffect(ctx),
    new PhaserEffect(ctx),
    new EchoEffect(ctx),
    new ReverbEffect(ctx),
    new GateEffect(ctx),
  ])
}

/**
 * A lighter chain for individual stems. Stems are already a filtered view
 * of the source, and four of these run per deck, so they get level and
 * tone shaping plus one send rather than the full twelve-stage rack —
 * twelve stages times four stems times two decks would be ninety-six
 * effect instances competing for the audio thread.
 */
export function createStemChain(ctx: AudioContext): EffectChain {
  return new EffectChain([
    new TrimEffect(ctx),
    new ThreeBandEqEffect(ctx),
    new FilterSweepEffect(ctx),
    new ReverbEffect(ctx),
  ])
}

/** Neutral values for a chain — every knob at its documented rest
 * position, which by the Effect contract must be inaudible. */
export function chainDefaults(chain: EffectChain): ParamValues {
  return defaultsFor(chain.params)
}

/** The canonical default set for a deck chain, computed once from the
 * schema rather than hand-maintained as a literal — a hand-written
 * defaults object silently drifts the moment an effect gains a parameter,
 * and a missing default means that knob starts at whatever `num()` falls
 * back to rather than at a deliberate rest value. */
export function deckChainDefaults(): ParamValues {
  // A throwaway OfflineAudioContext is enough to instantiate the chain and
  // read its schema; no audio is ever rendered through it. This runs once
  // at module scope, not per deck.
  const probe = new OfflineAudioContext(2, 1, 44100) as unknown as AudioContext
  const chain = createDeckChain(probe)
  const defaults = chainDefaults(chain)
  chain.dispose()
  return defaults
}
