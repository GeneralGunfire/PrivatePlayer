"use client";

import { useEffect, useRef } from "react";

const BANDS = 24; // vertical segments per side

/**
 * Ambient edge lighting that reacts to the currently playing audio —
 * light glows along the left/right screen edges, brighter and taller
 * near the frequency bands that are loud right now (like MusicViz Edge).
 * Renders on two full-height canvases pinned to the sides so it sits
 * behind all player UI without disturbing layout.
 */
export default function EdgeGlow({
  analyser,
  isPlaying,
  color = "255,255,255",
}: {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  color?: string;
}) {
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const smoothedRef = useRef<number[]>(new Array(BANDS).fill(0));

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;
    const lCtx = left.getContext("2d");
    const rCtx = right.getContext("2d");
    if (!lCtx || !rCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      for (const c of [left, right]) {
        const rect = c.getBoundingClientRect();
        c.width = rect.width * dpr;
        c.height = rect.height * dpr;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    if (analyser && !dataRef.current) {
      dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    }

    const drawSide = (ctx: CanvasRenderingContext2D, w: number, h: number, fromLeft: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const smoothed = smoothedRef.current;
      const bandHeight = h / BANDS;

      for (let i = 0; i < BANDS; i++) {
        const energy = smoothed[i]; // 0..1
        if (energy < 0.02) continue;

        const y = i * bandHeight;
        const glowWidth = w * (0.15 + energy * 0.85);
        const alpha = 0.08 + energy * 0.55;

        const grad = fromLeft
          ? ctx.createLinearGradient(0, 0, glowWidth, 0)
          : ctx.createLinearGradient(w, 0, w - glowWidth, 0);
        grad.addColorStop(0, `rgba(${color},${alpha})`);
        grad.addColorStop(1, `rgba(${color},0)`);

        ctx.fillStyle = grad;
        const padding = bandHeight * 0.08;
        if (fromLeft) {
          ctx.fillRect(0, y + padding, glowWidth, bandHeight - padding * 2);
        } else {
          ctx.fillRect(w - glowWidth, y + padding, glowWidth, bandHeight - padding * 2);
        }
      }
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const smoothed = smoothedRef.current;

      if (analyser && dataRef.current && isPlaying) {
        analyser.getByteFrequencyData(dataRef.current);
        const bins = dataRef.current;
        // Weight toward the lower/mid frequency range where music energy concentrates —
        // skip the sparse high-frequency tail so the edges don't look mostly dark.
        const usableBins = Math.floor(bins.length * 0.75);
        const binsPerBand = Math.max(1, Math.floor(usableBins / BANDS));
        for (let i = 0; i < BANDS; i++) {
          let sum = 0;
          for (let j = 0; j < binsPerBand; j++) sum += bins[i * binsPerBand + j] ?? 0;
          const avg = sum / binsPerBand / 255;
          smoothed[i] += (avg - smoothed[i]) * 0.28;
        }
      } else {
        for (let i = 0; i < BANDS; i++) smoothed[i] *= 0.92;
      }

      drawSide(lCtx, left.width, left.height, true);
      drawSide(rCtx, right.width, right.height, false);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isPlaying, color]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      <canvas ref={leftRef} className="absolute left-0 top-0 h-full w-40" />
      <canvas ref={rightRef} className="absolute right-0 top-0 h-full w-40" />
    </div>
  );
}
