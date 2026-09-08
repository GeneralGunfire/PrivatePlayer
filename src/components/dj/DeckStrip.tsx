"use client";

import { Play, Pause } from "lucide-react";
import { Waveform } from "./Waveform";
import { LevelMeter } from "./LevelMeter";
import { EffectRack } from "./EffectRack";
import type { ParamSpec, ParamValues } from "@/lib/dj/dsp";
import type { Track } from "@/lib/data";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** The minimal surface both Deck A (the app-wide player) and Deck B
 *  (useDeckB) satisfy — one channel strip drives either without knowing
 *  which, same as Udaan's desktop DeckLike interface. */
export interface DeckLike {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  analyser: AnalyserNode | null;
  djEffects: ParamValues;
  setDjEffects: (patch: ParamValues) => void;
  togglePlay: () => void;
  seek: (fractionalPercent: number) => void;
}

interface DeckStripProps {
  deck: DeckLike;
  specs: ParamSpec[];
  side: "A" | "B";
  extra?: React.ReactNode;
}

/**
 * One full DJ channel strip, mobile-adapted from Udaan's desktop
 * DeckChannelStrip — same vertical hierarchy (identity/transport on top,
 * rack beneath) but full-width rather than one of three side-by-side
 * columns, since two decks side by side don't fit a phone screen. BPM/key
 * tags and hot cues are dropped — both are backed by Udaan's Rust-side
 * offline analysis/SQLite, which doesn't exist on this site, and a fake
 * BPM reading would be worse than none.
 */
export function DeckStrip({ deck, specs, side, extra }: DeckStripProps) {
  const { track } = deck;
  const accent = side === "A" ? "var(--color-accent)" : "var(--color-accent-bright)";
  const loaded = Boolean(track);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-white/5"
          >
            {track ? (
              <div className="flex h-full w-full items-center justify-center bg-white/10 text-lg font-black uppercase text-white/40">
                {track.title.charAt(0)}
              </div>
            ) : (
              <span className="text-2xl text-white/15">—</span>
            )}
          </div>
          <span
            className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {side}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold uppercase tracking-tight" title={track?.title}>
            {track?.title ?? "No track loaded"}
          </p>
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/35" title={track?.artist}>
            {track?.artist ?? "—"}
          </p>
          {loaded && (
            <span className="text-[10px] tabular-nums text-white/30">
              {formatTime(deck.currentTime)} / {formatTime(deck.duration)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={deck.togglePlay}
          disabled={!loaded}
          aria-label={deck.isPlaying ? `Pause deck ${side}` : `Play deck ${side}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          style={{ backgroundColor: accent }}
        >
          {deck.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-10 min-w-0 flex-1">
          <Waveform currentTime={deck.currentTime} duration={deck.duration} onSeek={deck.seek} seed={track?.id ?? "none"} />
        </div>
        <LevelMeter analyser={deck.analyser} isPlaying={deck.isPlaying} />
      </div>

      {extra}

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
        <EffectRack specs={specs} values={deck.djEffects} onChange={deck.setDjEffects} />
      </div>
    </div>
  );
}
