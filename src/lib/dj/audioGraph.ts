/**
 * The single AudioContext and master bus shared by BOTH decks.
 *
 * Why this exists: Deck A (usePlayerEngine) and Deck B (useDeckB) each used
 * to call `new AudioContext()` and connect straight to their own
 * `ctx.destination`. That worked — both contexts reach the same physical
 * output device, so you heard both decks — but it made a whole class of
 * features structurally impossible:
 *
 *   - There was no single node carrying the summed A+B signal, so a master
 *     EQ / compressor / limiter had nowhere to attach. Putting one on each
 *     deck separately is NOT the same thing: two independent limiters can't
 *     see each other's peaks, so the actual summed output could still clip.
 *   - Two AudioContexts have two independent clocks that drift relative to
 *     each other, so nothing sample-accurate across decks (beatmatching,
 *     phase-aligned sync, per-stem alignment) can be built on them.
 *
 * The isolation that motivated the split is preserved without the split:
 * each deck still gets its own effects chain and its own deck gain node, so
 * nothing Deck B does can perturb Deck A's signal. They now merely share a
 * clock and a summing point.
 *
 * Lifetime: created lazily on the first real user gesture (browsers refuse
 * to start an AudioContext before one) and then kept for the life of the
 * page. It is deliberately never closed — Deck A is the app-wide "now
 * playing" engine that outlives the player overlay, and
 * `createMediaElementSource` can only be called ONCE per <audio> element
 * ever, so tearing the context down would permanently orphan both decks'
 * elements.
 */

export interface MasterBus {
  ctx: AudioContext
  /** Where each deck connects its output. Sums Deck A + Deck B. */
  input: GainNode
  /** Master 3-band EQ, applied to the summed signal. */
  low: BiquadFilterNode
  mid: BiquadFilterNode
  high: BiquadFilterNode
  /** Brickwall-ish limiter protecting the final output from clipping. */
  limiter: DynamicsCompressorNode
  /** Final output trim, post-limiter. */
  output: GainNode
  /** FFT tap on the summed post-master signal — for a master level meter. */
  analyser: AnalyserNode
}

export interface MasterSettings {
  /** -12..+12 dB, 0 = flat. */
  low: number
  mid: number
  high: number
  /** Opt-in brickwall limiter. Off by default: like every knob in
   * djEffects.ts, this must be genuinely inert at rest. A limiter is not
   * transparent just because the material is quiet — it changes dynamics
   * whenever it engages, so the user opts in. */
  limiterEnabled: boolean
  /** Output ceiling in dB when the limiter is on. -1 dBFS is the usual
   * streaming target; leave more headroom for club systems. */
  ceilingDb: number
  /** 0..1.5 final output gain, 1 = unity. */
  outputGain: number
}

export const MASTER_DEFAULTS: MasterSettings = {
  low: 0,
  mid: 0,
  high: 0,
  limiterEnabled: false,
  ceilingDb: -1,
  outputGain: 1,
}

let sharedCtx: AudioContext | null = null
let sharedBus: MasterBus | null = null

/** Non-creating accessor — returns null before the first user gesture. */
export function getMasterBus(): MasterBus | null {
  return sharedBus
}

/**
 * Returns the shared context + master bus, building them on first call.
 * Safe to call from either deck, in any order, as many times as you like.
 * Returns null only if constructing an AudioContext throws (no audio
 * device, or called before any user gesture on a strict browser).
 */
export function ensureMasterBus(): MasterBus | null {
  if (sharedBus) return sharedBus
  try {
    const ctx = sharedCtx ?? new AudioContext()
    sharedCtx = ctx

    const input = ctx.createGain()
    input.gain.value = 1

    const low = ctx.createBiquadFilter()
    low.type = 'lowshelf'
    low.frequency.value = 200
    low.gain.value = 0

    const mid = ctx.createBiquadFilter()
    mid.type = 'peaking'
    mid.frequency.value = 1000
    mid.Q.value = 0.7
    mid.gain.value = 0

    const high = ctx.createBiquadFilter()
    high.type = 'highshelf'
    high.frequency.value = 5000
    high.gain.value = 0

    // Constructed at fully transparent settings (0 dB threshold, 1:1 ratio
    // — no gain reduction is possible regardless of knee/attack/release),
    // so there is no window at graph-construction time where audio is
    // limited before applyMasterSettings' first call lands. Same reasoning
    // as the compressor in djEffects.ts, which had exactly that bug.
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = 0
    limiter.knee.value = 0
    limiter.ratio.value = 1
    limiter.attack.value = 0.003
    limiter.release.value = 0.1

    const output = ctx.createGain()
    output.gain.value = 1

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.55

    input.connect(low)
    low.connect(mid)
    mid.connect(high)
    high.connect(limiter)
    limiter.connect(output)
    output.connect(analyser)
    analyser.connect(ctx.destination)

    sharedBus = { ctx, input, low, mid, high, limiter, output, analyser }
    return sharedBus
  } catch (err) {
    console.error('Failed to create shared audio context / master bus:', err)
    return null
  }
}

/** Resumes the shared context if the browser suspended it. */
export function resumeSharedContext(): void {
  if (sharedCtx?.state === 'suspended') void sharedCtx.resume()
}

function dbToLinear(db: number): number {
  return Math.pow(10, db / 20)
}

/** Same defensive posture as applyDjSettings — a bad value or a closed
 * context degrades to "this update was skipped", never an uncaught
 * exception thrown synchronously out of a knob's onChange handler (which,
 * with no error boundary, unmounts the whole React tree). */
export function applyMasterSettings(bus: MasterBus, settings: MasterSettings, now: number): void {
  try {
    const RAMP = 0.03
    const safe = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback)

    bus.low.gain.setTargetAtTime(safe(settings.low, 0), now, RAMP)
    bus.mid.gain.setTargetAtTime(safe(settings.mid, 0), now, RAMP)
    bus.high.gain.setTargetAtTime(safe(settings.high, 0), now, RAMP)

    // Ratio 20:1 with a hard knee is the practical brickwall shape a
    // DynamicsCompressorNode can express; the threshold doubles as the
    // ceiling. Off = threshold 0 / ratio 1, which cannot reduce gain at all.
    bus.limiter.threshold.setTargetAtTime(
      settings.limiterEnabled ? safe(settings.ceilingDb, -1) : 0,
      now,
      RAMP,
    )
    bus.limiter.ratio.setTargetAtTime(settings.limiterEnabled ? 20 : 1, now, RAMP)

    bus.output.gain.setTargetAtTime(safe(dbToLinear(0) * settings.outputGain, 1), now, RAMP)
  } catch (err) {
    console.error('Master bus: failed to apply settings (update skipped, playback continues):', err)
  }
}
