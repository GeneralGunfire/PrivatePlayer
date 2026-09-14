"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 32;
// Below this a bar is drawn at 0 height rather than floored to a minimum
// — a floor meant every bar had *some* height even at total silence,
// which at low levels made adjacent bars' minimum stubs touch and read
// as one solid connected strip instead of distinct bars.
const SILENCE_THRESHOLD = 0.01;
// Fraction of the canvas given to the reflection below the bars, and how
// far that reflection fades out.
const REFLECTION_HEIGHT = 0.32;
const REFLECTION_GAP = 0.04;

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
          // Slower attack/faster release than before (0.22 vs the old
          // 0.35) — the old rate snapped hard enough between frames that
          // neighboring bars could visibly jump past each other at the
          // top edge for a frame, reading as "overlap." This settles
          // smoothly instead.
          smoothed[i] += (avg - smoothed[i]) * 0.22;
        }
      } else {
        for (let i = 0; i < BAR_COUNT; i++) smoothed[i] *= 0.9;
      }

      // Bar geometry — gap and width both derived from the same unit so
      // (barWidth + gap) * BAR_COUNT - gap exactly equals the canvas
      // width with no rounding slop that could leave bars overlapping
      // by a fractional pixel at certain widths.
      const unit = width / (BAR_COUNT + (BAR_COUNT - 1) * 0.28);
      const barWidth = unit;
      const gap = unit * 0.28;
      const r = Math.min(barWidth / 2, 3 * dpr);

      const barsAreaHeight = height * (1 - REFLECTION_HEIGHT - REFLECTION_GAP);
      const reflectionTop = height * (1 - REFLECTION_HEIGHT);

      for (let i = 0; i < BAR_COUNT; i++) {
        const level = Math.min(1, smoothed[i] * 1.9);
        if (level < SILENCE_THRESHOLD) continue;

        const barHeight = level * barsAreaHeight;
        const x = i * (barWidth + gap);
        const y = barsAreaHeight - barHeight;
        const opacity = 0.4 + level * 0.6;

        // Main bar
        ctx2d.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx2d.beginPath();
        if (typeof ctx2d.roundRect === "function") {
          ctx2d.roundRect(x, y, barWidth, barHeight, r);
        } else {
          ctx2d.rect(x, y, barWidth, barHeight);
        }
        ctx2d.fill();

        // Reflection — same bar mirrored below the gap, height capped to
        // the reflection band and fading to transparent with a gradient
        // rather than a flat dim copy, so it reads as a surface
        // reflection rather than a second bar.
        const reflHeight = Math.min(barHeight, height * REFLECTION_HEIGHT);
        const reflGrad = ctx2d.createLinearGradient(0, reflectionTop, 0, reflectionTop + reflHeight);
        reflGrad.addColorStop(0, `rgba(255,255,255,${opacity * 0.35})`);
        reflGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx2d.fillStyle = reflGrad;
        ctx2d.beginPath();
        if (typeof ctx2d.roundRect === "function") {
          ctx2d.roundRect(x, reflectionTop, barWidth, reflHeight, r);
        } else {
          ctx2d.rect(x, reflectionTop, barWidth, reflHeight);
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
