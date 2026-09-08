"use client";

import { useEffect, useRef } from 'react'

interface LevelMeterProps {
  analyser: AnalyserNode | null
  isPlaying: boolean
}

/** Vertical peak/RMS level meter — a pure read tap off the shared analyser
 * (getFloatTimeDomainData), never inserted into the signal chain, so it
 * carries zero risk of degrading playback the way the DJ effects chain's
 * earlier bugs did. Two bars: RMS (average loudness, brand blue) with a
 * brighter peak-hold cap that decays slowly, matching a real mixer's
 * channel meter. */
export function LevelMeter({ analyser, isPlaying }: LevelMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const peakRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dataArray = new Float32Array(analyser?.fftSize ?? 256)

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (!canvas || !ctx) return
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      let rms = 0
      if (analyser && isPlaying) {
        analyser.getFloatTimeDomainData(dataArray)
        let sumSquares = 0
        for (let i = 0; i < dataArray.length; i++) sumSquares += dataArray[i] * dataArray[i]
        rms = Math.sqrt(sumSquares / dataArray.length)
      }

      // Peak-hold: jumps up instantly, decays slowly — the classic VU
      // meter behavior that makes transient hits visible rather than
      // averaged away.
      peakRef.current = Math.max(rms, peakRef.current - 0.015)

      const fillHeight = Math.min(1, rms * 2.2) * height
      const peakY = height - Math.min(1, peakRef.current * 2.2) * height

      const gradient = ctx.createLinearGradient(0, height, 0, 0)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
      gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.55)')
      gradient.addColorStop(1, 'rgba(255, 90, 90, 0.75)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, height - fillHeight, width, fillHeight)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.fillRect(0, peakY - 1.5, width, 2)

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [analyser, isPlaying])

  return (
    <div className="h-full w-2 overflow-hidden rounded-full bg-white/8">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  )
}
