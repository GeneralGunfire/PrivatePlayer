"use client";

import { useMemo, useRef, useState } from 'react'

interface WaveformProps {
  currentTime: number
  duration: number
  onSeek: (percent: number) => void
  /** Seeded per-track so the same track always renders the same bar
   * pattern — there's no real decoded waveform data available cheaply
   * (would need decoding the whole file client-side), so this is a
   * deterministic decorative approximation, same spirit as the scenery
   * cover-art placeholders. */
  seed: string
}

const BAR_COUNT = 64

/** Waveform-style progress display — a played/unplayed bar pattern instead
 * of a plain line, matching the reference DJ software's visual language.
 * Still fully seekable by click/drag like the plain scrubber it replaces
 * in the DJ deck view. */
export function Waveform({ currentTime, duration, onSeek, seed }: WaveformProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [dragPercent, setDragPercent] = useState(0)

  const bars = useMemo(() => generateBars(seed, BAR_COUNT), [seed])
  const percent = duration > 0 ? (dragging ? dragPercent : (currentTime / duration) * 100) : 0
  const playedBars = Math.round((percent / 100) * BAR_COUNT)

  function percentFromClientX(clientX: number): number {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    setDragPercent(percentFromClientX(e.clientX))
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return
    setDragPercent(percentFromClientX(e.clientX))
  }
  function handlePointerUp(e: React.PointerEvent) {
    if (!dragging) return
    setDragging(false)
    onSeek(percentFromClientX(e.clientX))
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="flex h-10 cursor-pointer items-center gap-[2px]"
      style={{ touchAction: "none" }}
    >
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-full transition-colors"
          style={{
            height: `${height * 100}%`,
            backgroundColor: i < playedBars ? "var(--color-accent-bright)" : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </div>
  )
}

function generateBars(seed: string, count: number): number[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const bars: number[] = []
  let state = Math.abs(hash) || 1
  for (let i = 0; i < count; i++) {
    // Simple LCG for a deterministic, seed-stable pseudo-random sequence.
    state = (state * 1103515245 + 12345) & 0x7fffffff
    const rand = (state % 1000) / 1000
    bars.push(0.25 + rand * 0.7)
  }
  return bars
}
