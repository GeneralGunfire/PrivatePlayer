"use client";

import { useEffect, useState } from "react";
import { analyseLoudness, type LoudnessAnalysis } from "../loudness";
import type { Track } from "@/lib/data";

/** Reactive wrapper around analyseLoudness() for one deck's loaded track —
 *  re-runs whenever the track changes, null while unanalysed/analysing. */
export function useLoudness(track: Track | null): { analysis: LoudnessAnalysis | null; loading: boolean } {
  const [analysis, setAnalysis] = useState<LoudnessAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!track) {
      setAnalysis(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    analyseLoudness(track.src).then((result) => {
      if (cancelled) return;
      setAnalysis(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [track?.src]);

  return { analysis, loading };
}
