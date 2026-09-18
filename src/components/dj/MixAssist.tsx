"use client";

import { Scale } from "lucide-react";
import { useLoudness } from "@/lib/dj/hooks/useLoudness";
import { matchLoudnessDb } from "@/lib/dj/loudness";
import type { Track } from "@/lib/data";

interface MixAssistProps {
  trackA: Track | null;
  trackB: Track | null;
  onMatchLoudness: (db: number) => void;
}

/**
 * Mobile-adapted slice of Udaan desktop's Mix Assist — loudness-matching
 * only, not the full BPM/key panel. BPM/key correctly stayed out of this
 * site's DJ board (DeckStrip.tsx: a fake reading is worse than none, since
 * Udaan's real ones come from Rust-side analysis this site has no backend
 * for) — but RMS loudness is honestly computable client-side from decoded
 * PCM (see lib/dj/loudness.ts), so there's no reason to leave "how loud is
 * each deck" unanswered the way BPM/key are. This is also the single
 * biggest lever for a mix actually sounding good: two tracks at mismatched
 * perceived loudness is the most common cause of one deck burying the
 * other, independent of any EQ/effect choice.
 */
export function MixAssist({ trackA, trackB, onMatchLoudness }: MixAssistProps) {
  const { analysis: analysisA, loading: loadingA } = useLoudness(trackA);
  const { analysis: analysisB, loading: loadingB } = useLoudness(trackB);
  const analysing = loadingA || loadingB;
  const offsetDb = matchLoudnessDb(analysisA, analysisB);

  if (!trackA || !trackB) return null;

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mix</span>
      <button
        onClick={() => offsetDb !== null && onMatchLoudness(offsetDb)}
        disabled={offsetDb === null}
        title={
          analysing
            ? "Analysing loudness…"
            : offsetDb === null
              ? "Loudness matching needs both tracks analysed"
              : `Set Deck B trim to ${offsetDb > 0 ? "+" : ""}${offsetDb}dB so both decks sound equally loud`
        }
        className="flex flex-col items-center gap-1 rounded-xl border border-white/12 px-3 py-2 text-white/70 transition-colors hover:border-white/25 hover:text-white disabled:opacity-30"
      >
        <Scale size={16} />
        <span className="text-[9px] font-bold uppercase tracking-widest">
          {analysing ? "Analysing…" : "Match level"}
        </span>
      </button>
    </div>
  );
}
