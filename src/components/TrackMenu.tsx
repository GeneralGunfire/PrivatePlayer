"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Plus, Check, Loader2, X, Download } from "lucide-react";
import { usePlaylists } from "@/lib/use-playlists";
import { ALL_TRACKS } from "@/lib/data";
import { TRACK_SRC_MAP } from "@/lib/track-src-map";
import { cn } from "@/lib/utils";

interface Props {
  trackId: string;
  currentPlaylistId?: string;
}

export default function TrackMenu({ trackId, currentPlaylistId }: Props) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const menuRef               = useRef<HTMLDivElement>(null);
  const { playlists, toggleTrack } = usePlaylists();

  // Only show user-created playlists (not built-in Coldplay) in the add menu
  const userPlaylists = playlists.filter(p => p.id.startsWith("pl_"));

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  const handle = async (playlistId: string) => {
    setPending(playlistId);
    await toggleTrack(playlistId, trackId);
    setPending(null);
  };

  const handleDownload = () => {
    const track = ALL_TRACKS.find(t => t.id === trackId);
    if (!track) return;
    const url = TRACK_SRC_MAP[track.id] ?? track.src;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full transition-all",
          open
            ? "bg-white/15 text-white"
            : "text-white/40 hover:text-white/70 hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
        )}
        aria-label="Song options"
      >
        <MoreHorizontal size={17} />
      </button>

      {open && (
        <div
          className="fixed right-4 w-60 rounded-2xl border border-white/12 bg-[#111]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-500"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)" }}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
              Song Options
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/8"
            >
              <X size={12} />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 active:bg-white/12 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/5">
              <Download size={14} className="text-white/60" />
            </div>
            <span className="flex-1 text-sm font-medium">Download</span>
          </button>

          <div className="mx-4 my-1 h-px bg-white/8" />

          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 px-4 pb-1">
            Add to Playlist
          </p>

          {userPlaylists.length === 0 ? (
            <div className="px-4 pb-4 pt-1">
              <p className="text-xs text-white/30 leading-relaxed">
                No playlists yet.{" "}
                <a href="/library" className="text-white/60 underline underline-offset-2">Create one</a>
                {" "}in Your Library.
              </p>
            </div>
          ) : (
            <>
              {userPlaylists.map(pl => {
                const inPlaylist = pl.tracks.some(t => t.id === trackId);
                const loading    = pending === pl.id;
                return (
                  <button
                    key={pl.id}
                    onClick={() => handle(pl.id)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 active:bg-white/12 transition-colors text-left group/item disabled:opacity-40"
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
              <div className="h-2" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
