"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 40;
// Below this level a bar is treated as silent and not drawn at all — an
// earlier version floored every bar's height so idle/loading state always
// showed a flat row across the bottom, which read as dull grey debris
// rather than "nothing playing yet."
const SILENCE_THRESHOLD = 0.015;

/**
 * Bottom-anchored bar visualizer, flat white on black — no gradient, no
 * glow bloom. Matches the app's monochrome direction: hierarchy comes
 * from opacity, not color, so the bars use a single white fill whose
 * opacity tracks loudness (quiet = faint, loud = fully opaque) instead of
 * a colored gradient climbing the bar height.
 */
export default function CenterVisualizer({
  analyser,
  isPlaying,
  className,
}: {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const smoothedRef = useRef<number[]>(new Array(BAR_COUNT).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    if (analyser && !dataRef.current) {
      dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    }

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const { width, height } = canvas;
      ctx2d.clearRect(0, 0, width, height);
      if (!width || !height) return;

      const smoothed = smoothedRef.current;

      if (analyser && dataRef.current && isPlaying) {
        analyser.getByteFrequencyData(dataRef.current);
        const bins = dataRef.current;
        const usableBins = Math.floor(bins.length * 0.5);
        const binsPerBar = Math.max(1, Math.floor(usableBins / BAR_COUNT));
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < binsPerBar; j++) sum += bins[i * binsPerBar + j] ?? 0;
          const avg = sum / binsPerBar / 255;
          smoothed[i] += (avg - smoothed[i]) * 0.35;
        }
      } else {
        for (let i = 0; i < BAR_COUNT; i++) smoothed[i] *= 0.88;
      }

      const gap = width * 0.012;
      const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const level = Math.min(1, smoothed[i] * 1.8);
        if (level < SILENCE_THRESHOLD) continue;

        const barHeight = Math.max(level * height, barWidth * 0.6);
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Opacity, not color, carries loudness — 35% at a bare whisper up
        // to fully opaque white at peak, same "hierarchy through opacity"
        // rule as the rest of the app's monochrome surfaces.
        ctx2d.fillStyle = `rgba(255,255,255,${0.35 + level * 0.65})`;

        const r = Math.min(barWidth / 2, 3 * dpr);
        ctx2d.beginPath();
        if (typeof ctx2d.roundRect === "function") {
          ctx2d.roundRect(x, y, barWidth, barHeight, r);
        } else {
          ctx2d.rect(x, y, barWidth, barHeight);
        }
        ctx2d.fill();
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isPlaying]);

  return <canvas ref={canvasRef} className={className} />;
}
