/**
 * The DSP node abstraction the whole audio engine is built from.
 *
 * Replaces the previous approach, where `createDjEffectsChain` hardcoded
 * one fixed graph and `applyDjSettings` was a single function that knew
 * every effect's parameter mapping. That worked for a fixed six-effect
 * rack but made adding an effect a three-place edit (interface field,
 * construction block, apply block) with nothing enforcing they stayed in
 * sync — and made per-deck or per-stem chain variation impossible, since
 * there was exactly one chain shape in the codebase.
 *
 * Here each effect owns its own nodes, its own parameter schema, and its
 * own apply logic, so a chain is just an ordered list of them.
 */

/** How a parameter is presented and constrained in the UI. */
export interface ParamSpec {
  key: string
  label: string
  min: number
  max: number
  /** Value rendered as the control's neutral/rest position. */
  neutral: number
  step?: number
  /** Formats a value for display, e.g. `+3dB` or `45%`. */
  format?: (v: number) => string
  /** Rendered as a button rather than a knob. */
  kind?: 'knob' | 'toggle'
}

export type ParamValues = Record<string, number | boolean>

/**
 * One processing stage. Implementations must satisfy two contracts:
 *
 *  1. **Inert at defaults.** With every parameter at its `neutral` value,
 *     the effect must be *inaudible* — not "subtle", not "quiet", but
 *     genuinely bit-transparent as far as the listener is concerned.
 *     Inserting a chain must never change how a track sounds until the
 *     user touches something. Two real bugs came from violating this: a
 *     parked Q=6 bandpass filtering 100% of playback because its LFO was
 *     at zero, and a compressor defaulting to on with real gain reduction.
 *     A filter is not transparent because its modulator is still; a
 *     compressor is not transparent because the music is quiet. When an
 *     effect can't be inert inline, it must be wet/dry blended (see
 *     `WetDryEffect`) so 0% wet is a true bypass.
 *
 *  2. **Never throw into a live AudioParam.** `apply` receives already-
 *     validated values, but must still be defensive: a non-finite value
 *     makes `setTargetAtTime` throw synchronously from inside a knob's
 *     onChange handler, and an uncaught exception there unmounts the whole
 *     React tree (this is what "the screen goes blank mid-drag" was).
 *     `Chain.apply` wraps every effect, so an individual effect failing
 *     degrades to "this update was skipped" rather than taking down the UI.
 */
export interface Effect {
  readonly id: string
  readonly label: string
  readonly params: readonly ParamSpec[]
  /** Signal enters here. */
  readonly input: AudioNode
  /** Signal leaves here. */
  readonly output: AudioNode
  /** Retunes live nodes. Called on every parameter change — must not
   * rebuild the graph, only set AudioParams. */
  apply(values: ParamValues, now: number): void
  /** Releases anything that isn't garbage-collected on disconnect, e.g. a
   * started OscillatorNode. Called when the chain is torn down. */
  dispose?(): void
}

/** Factory signature every effect module exports. */
export type EffectFactory = (ctx: AudioContext) => Effect

export function defaultsFor(params: readonly ParamSpec[]): ParamValues {
  const out: ParamValues = {}
  for (const p of params) out[p.key] = p.kind === 'toggle' ? p.neutral !== 0 : p.neutral
  return out
}

/** Reads a numeric param, falling back to its neutral if absent or unusable. */
export function num(values: ParamValues, spec: ParamSpec): number {
  const v = values[spec.key]
  return typeof v === 'number' && Number.isFinite(v) ? v : spec.neutral
}

export function bool(values: ParamValues, spec: ParamSpec): boolean {
  const v = values[spec.key]
  return typeof v === 'boolean' ? v : spec.neutral !== 0
}

export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20)
}

/** Standard smoothing constant for every parameter ramp. An instant jump
 * on a live signal produces an audible click; 30ms is fast enough to feel
 * immediate and slow enough to be silent. */
export const RAMP = 0.03

/**
 * Guards a value bound for a live AudioParam. Closes off two real failure
 * modes: non-finite values (NaN/Infinity from upstream math or a
 * momentarily-undefined prop) which make `setTargetAtTime` throw, and
 * frequencies at or above the context's Nyquist limit, which are out of
 * range for a BiquadFilterNode and throw on some engines rather than
 * clamping. Never assume a 44.1/48kHz device — USB and virtual audio
 * adapters do expose lower rates.
 */
export function safeParam(value: number, fallback: number, max?: number): number {
  if (!Number.isFinite(value)) return fallback
  if (max !== undefined) return Math.min(value, max)
  return value
}

export function nyquistOf(ctx: BaseAudioContext): number {
  return ctx.sampleRate / 2
}
