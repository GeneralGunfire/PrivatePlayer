"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Single shared reading of the current playback's overall loudness (RMS
 * over the low/mid frequency range, 0..1, smoothed), sampled once per
 * frame off the same AnalyserNode the visualizer bars read. Lets other
 * chrome around the expanded player — the play button's glow, the
 * scrubber rail — pulse in sync with the same audio the bars are
 * reacting to, instead of the bars being a visual island disconnected
 * from the rest of the UI.
 */
export function useAudioLevel(analyser: AnalyserNode | null, isPlaying: boolean): number {
  const [level, setLevel] = useState(0);
  const rafRef = useRef<number | null>(null);
  const smoothedRef = useRef(0);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    if (analyser && !dataRef.current) {
      dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    }

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (analyser && dataRef.current && isPlaying) {
        analyser.getByteFrequencyData(dataRef.current);
        const bins = dataRef.current;
        const usableBins = Math.floor(bins.length * 0.5);
        let sum = 0;
        for (let i = 0; i < usableBins; i++) sum += bins[i];
        const avg = sum / usableBins / 255;
        smoothedRef.current += (avg - smoothedRef.current) * 0.25;
      } else {
        smoothedRef.current *= 0.9;
      }
      setLevel(smoothedRef.current);
    };
    tick();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, isPlaying]);

  return level;
}
