"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 40;

/**
 * Large audio-reactive bar visualizer that fills the center of the
 * expanded player in place of album artwork. Bottom-anchored bars rising
 * from a baseline (matching Udaan's own desktop SoundBars.tsx — the
 * pattern this mirrors), driven by the same AnalyserNode as the edge
 * lighting, colored with the app's accent rather than flat white so
 * they stay visible against the black background even at low levels.
 *
 * Previously mirror-symmetric from a center line at near-zero opacity —
 * against a solid black background with no album art anchor, that read
 * as a near-invisible row of dots inside a mostly-empty container.
 * Bottom-anchored bars with a real accent-color gradient and a taller
 * minimum height give the space something to actually show even when
 * quiet.
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

    // Canvas gradients can't resolve CSS custom properties directly, so
    // the accent color is read from the resolved computed style once
    // (same approach as Udaan's SoundBars.tsx).
    const accentColor = getComputedStyle(canvas).getPropertyValue("--color-accent-bright").trim() || "#3d648f";

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
        // Bias toward the lower/mid bins (bass+vocal range reads as the
        // "musical" part of a spectrum) rather than a linear spread
        // across the full range, most of which is near-silent high
        // frequency — same reasoning as Udaan's SoundBars.tsx.
        const usableBins = Math.floor(bins.length * 0.5);
        const binsPerBar = Math.max(1, Math.floor(usableBins / BAR_COUNT));
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < binsPerBar; j++) sum += bins[i * binsPerBar + j] ?? 0;
          const avg = sum / binsPerBar / 255;
          smoothed[i] += (avg - smoothed[i]) * 0.35;
        }
      } else {
        for (let i = 0; i < BAR_COUNT; i++) smoothed[i] *= 0.9;
      }

      const gap = width * 0.01;
      const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const level = Math.max(0.05, Math.min(1, smoothed[i] * 1.8));
        const barHeight = level * height;
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        const gradient = ctx2d.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, accentColor);
        gradient.addColorStop(1, `color-mix(in srgb, ${accentColor} 55%, white)`);
        ctx2d.fillStyle = gradient;

        const r = Math.min(barWidth / 2, 4 * dpr);
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
