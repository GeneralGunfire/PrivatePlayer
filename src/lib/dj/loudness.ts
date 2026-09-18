/**
 * Client-side loudness analysis — the one piece of Udaan's desktop Mix
 * Assist genuinely missing from the website's DJ board (see DeckStrip.tsx's
 * own comment: BPM/key were dropped because a *fake* reading is worse than
 * none, since Udaan's real versions come from Rust-side beat/key-detection
 * DSP this site has no backend for). Loudness is different — RMS is a
 * cheap, honest measurement computable directly from decoded PCM in the
 * browser, no backend needed, so there's no reason to leave "how loud is
 * this track" unanswered the way BPM/key correctly are.
 *
 * This is the actual highest-leverage lever for "make the mix sound good":
 * two tracks mastered a decade apart can differ by 10+ dB in perceived
 * loudness while sharing an identical peak, and mixing them un-matched is
 * the single most common cause of one deck burying the other or a
 * transition suddenly jumping in volume — long before any EQ/effect choice
 * matters.
 */

export interface LoudnessAnalysis {
  /** Root-mean-square level across the whole track, linear 0..1. */
  rms: number
  /** True sample peak across the whole track, linear 0..1. */
  peak: number
}

const cache = new Map<string, LoudnessAnalysis | null>()
const inFlight = new Map<string, Promise<LoudnessAnalysis | null>>()

/**
 * Decodes the track once via OfflineAudioContext (never touches the real
 * playback graph or its clock) and computes RMS/peak across the full
 * signal. Cached per src so re-opening the DJ board or re-picking the same
 * track on Deck B doesn't redecode.
 */
export async function analyseLoudness(src: string): Promise<LoudnessAnalysis | null> {
  if (cache.has(src)) return cache.get(src)!
  const pending = inFlight.get(src)
  if (pending) return pending

  const promise = (async () => {
    try {
      const res = await fetch(src)
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
      const arrayBuffer = await res.arrayBuffer()

      // A throwaway context purely for decoding — decodeAudioData doesn't
      // need a running context, but the constructor requires SOME sample
      // rate/channel count, and this one is never connected to output.
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const decodeCtx = new AC()
      let buffer: AudioBuffer
      try {
        buffer = await decodeCtx.decodeAudioData(arrayBuffer)
      } finally {
        void decodeCtx.close()
      }

      let sumSquares = 0
      let sampleCount = 0
      let peak = 0
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
        const data = buffer.getChannelData(ch)
        // Every sample, not a downsampled stride — RMS over a full ~3-4
        // minute track at 44.1kHz is still well under a second of work,
        // and this only ever runs once per track (cached after).
        for (let i = 0; i < data.length; i++) {
          const v = data[i]
          sumSquares += v * v
          const abs = Math.abs(v)
          if (abs > peak) peak = abs
        }
        sampleCount += data.length
      }

      if (sampleCount === 0) return null
      const rms = Math.sqrt(sumSquares / sampleCount)
      const result: LoudnessAnalysis = { rms, peak }
      cache.set(src, result)
      return result
    } catch (err) {
      console.error('Loudness analysis failed for', src, err)
      cache.set(src, null)
      return null
    } finally {
      inFlight.delete(src)
    }
  })()

  inFlight.set(src, promise)
  return promise
}

const MIN_SUGGESTION_DB = -12
const MAX_SUGGESTION_DB = 12

/**
 * The trim offset (dB) that would bring `to`'s loudness in line with
 * `from`'s — same "match the other deck" question as Udaan's
 * gainStaging.ts matchLoudness(), same clamping to the trim knob's real
 * range so a suggestion is never handed to the UI that the knob can't
 * actually reach.
 */
export function matchLoudnessDb(from: LoudnessAnalysis | null, to: LoudnessAnalysis | null): number | null {
  if (!from || !to) return null
  if (from.rms <= 0 || to.rms <= 0) return null
  const diff = 20 * Math.log10(from.rms / to.rms)
  if (!Number.isFinite(diff)) return null
  return Number(Math.max(MIN_SUGGESTION_DB, Math.min(MAX_SUGGESTION_DB, diff)).toFixed(1))
}
