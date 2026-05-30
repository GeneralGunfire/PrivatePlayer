"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Plus, Check, Loader2 } from "lucide-react";
import { usePlaylists } from "@/lib/use-playlists";
import { cn } from "@/lib/utils";

interface Props {
  trackId: string;
  currentPlaylistId?: string;
}

export default function TrackMenu({ trackId }: Props) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const menuRef               = useRef<HTMLDivElement>(null);
  const { playlists, toggleTrack } = usePlaylists();

  // Close on outside click / scroll
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handle = async (playlistId: string) => {
    setPending(playlistId);
    await toggleTrack(playlistId, trackId);
    setPending(null);
    // don't auto-close so user can multi-add
  };

  return (
    <div ref={menuRef} className="relative" onClick={e => e.stopPropagation()}>
      {/* 3-dot trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full transition-all",
          open
            ? "bg-white/15 text-white"
            : "text-white/25 hover:text-white/70 hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
        )}
        aria-label="Song options"
      >
        <MoreHorizontal size={17} />
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-56 rounded-2xl border border-white/12 bg-[#111]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[200]">
          <p className="px-4 pt-3 pb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
            Playlists
          </p>
          {playlists.map(pl => {
            const inPlaylist = pl.tracks.some(t => t.id === trackId);
            const loading    = pending === pl.id;
            return (
              <button
                key={pl.id}
                onClick={() => handle(pl.id)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 transition-colors text-left group/item disabled:opacity-40"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-white/5">
                  <img src={pl.coverUrl} alt={pl.name} className="w-full h-full object-cover" />
                </div>
                <span className="flex-1 text-sm font-medium truncate">{pl.name}</span>
                <span className="shrink-0">
                  {loading ? (
                    <Loader2 size={14} className="text-white/40 animate-spin" />
                  ) : inPlaylist ? (
                    <Check size={14} className="text-white" />
                  ) : (
                    <Plus size={14} className="text-white/30 group-hover/item:text-white/70 transition-colors" />
                  )}
                </span>
              </button>
            );
          })}
          <div className="h-1" />
        </div>
      )}
    </div>
  );
}
