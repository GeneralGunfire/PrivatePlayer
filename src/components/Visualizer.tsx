"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 40;

/**
 * Renders live frequency bars driven by the player's AnalyserNode.
 * Draws on a canvas via rAF — bypasses React render cycles entirely
 * so it stays smooth regardless of app re-renders.
 */
export default function Visualizer({
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
        const binsPerBar = Math.max(1, Math.floor(bins.length / BAR_COUNT));
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < binsPerBar; j++) sum += bins[i * binsPerBar + j] ?? 0;
          const avg = sum / binsPerBar / 255; // 0..1
          // Ease toward target for a springy, non-jittery feel
          smoothed[i] += (avg - smoothed[i]) * 0.35;
        }
      } else {
        // Idle/paused — gently decay bars to zero
        for (let i = 0; i < BAR_COUNT; i++) smoothed[i] *= 0.9;
      }

      const gap = width * 0.006;
      const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const maxBarHeight = height * 0.92;
      const minBarHeight = height * 0.04;

      for (let i = 0; i < BAR_COUNT; i++) {
        const h = Math.max(minBarHeight, smoothed[i] * maxBarHeight);
        const x = i * (barWidth + gap);
        const y = height - h;
        const alpha = 0.25 + smoothed[i] * 0.65;
        ctx2d.fillStyle = `rgba(255,255,255,${alpha})`;
        const r = Math.min(barWidth / 2, 4 * dpr);
        ctx2d.beginPath();
        if (typeof ctx2d.roundRect === "function") {
          ctx2d.roundRect(x, y, barWidth, h, r);
        } else {
          ctx2d.rect(x, y, barWidth, h);
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
