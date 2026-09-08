"use client";

import { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { useLibrary } from "@/lib/use-library";
import type { Track } from "@/lib/data";

interface DeckBPickerProps {
  onPick: (track: Track) => void;
  onClose: () => void;
}

/**
 * Full-screen track picker for Deck B — a sheet rather than a dropdown
 * (Udaan's desktop version is a small anchored popover, which doesn't
 * have room on a phone), sourced from the same live library scan the
 * rest of the site uses.
 */
export function DeckBPicker({ onPick, onClose }: DeckBPickerProps) {
  const { tracks } = useLibrary();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
  }, [tracks, query]);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/8 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white/25" size={16} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Load a track onto Deck B"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pr-4 pl-10 text-sm outline-none placeholder:text-white/25 focus:border-white/20"
          />
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/60 hover:bg-white/12"
        >
          <X size={16} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 pb-[env(safe-area-inset-bottom,0px)]">
        {filtered.map((track) => (
          <button
            key={track.id}
            onClick={() => onPick(track)}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-white/6 active:bg-white/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/8 text-sm font-bold uppercase text-white/40">
              {track.title.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold uppercase tracking-tight">{track.title}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/35">{track.artist}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-white/25">No matches</p>
        )}
      </div>
    </div>
  );
}
