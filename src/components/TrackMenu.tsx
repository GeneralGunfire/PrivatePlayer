"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Plus, Check, Loader2, X, Download, Heart, Pin } from "lucide-react";
import { usePlaylists } from "@/lib/use-playlists";
import { useFavorites } from "@/lib/use-favorites";
import { usePinned } from "@/lib/use-pinned";
import { ALL_TRACKS } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Props {
  trackId: string;
  currentPlaylistId?: string;
}

const MENU_WIDTH = 240;
const MENU_MARGIN = 12;

export default function TrackMenu({ trackId, currentPlaylistId }: Props) {
  const [open, setOpen]       = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(null);
  const triggerRef            = useRef<HTMLButtonElement>(null);
  const menuRef                = useRef<HTMLDivElement>(null);
  const { playlists, toggleTrack } = usePlaylists();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isPinned, togglePinned } = usePinned();
  const favorited = isFavorite(trackId);
  const pinned = isPinned(trackId);

  // Only show user-created playlists in the add menu (there are no
  // built-in ones any more — every playlist here is user-created).
  const userPlaylists = playlists.filter(p => p.id.startsWith("pl_"));

  // Positioned against the trigger button's own real screen position
  // rather than a fixed viewport offset — the old version anchored every
  // instance to a hardcoded `bottom: calc(...+100px)` regardless of where
  // on the (often long) track list the clicked "..." button actually was,
  // so menus opened from a row near the top of a long playlist rendered
  // far from the click, and had no max-height/scroll of their own, so a
  // playlist list long enough to fill the menu could overflow off the
  // bottom of the screen with the rest of the content unreachable.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    function place() {
      const rect = triggerRef.current!.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const safeBottom = 16; // rough safe-area buffer; env() isn't readable from JS

      // Prefer opening above-and-left of the trigger (matches the old
      // bottom-right-docked feel) but flip to whichever side actually has
      // room, both horizontally and vertically, rather than assuming.
      let left = rect.right - MENU_WIDTH;
      if (left < MENU_MARGIN) left = rect.left;
      left = Math.min(Math.max(left, MENU_MARGIN), viewportW - MENU_WIDTH - MENU_MARGIN);

      const spaceAbove = rect.top - MENU_MARGIN;
      const spaceBelow = viewportH - rect.bottom - MENU_MARGIN - safeBottom;
      const openAbove = spaceAbove > spaceBelow;

      const maxHeight = Math.max(160, (openAbove ? spaceAbove : spaceBelow));
      const top = openAbove
        ? Math.max(MENU_MARGIN, rect.top - Math.min(maxHeight, 420))
        : rect.bottom + 4;

      setPosition({ top, left, maxHeight: Math.min(maxHeight, 420) });
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
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
    const url = track.src;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        ref={triggerRef}
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

      {open && position && createPortal(
        <div
          ref={menuRef}
          className="fixed rounded-xl surface shadow-2xl overflow-hidden z-500 flex flex-col"
          style={{ top: position.top, left: position.left, width: MENU_WIDTH, maxHeight: position.maxHeight }}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
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

          <div className="overflow-y-auto min-h-0">
            <button
              onClick={() => { toggleFavorite(trackId); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 active:bg-white/12 transition-colors text-left"
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", favorited ? "bg-accent-2/20" : "bg-white/5")}>
                <Heart size={14} className={favorited ? "text-accent-2-bright" : "text-white/60"} fill={favorited ? "currentColor" : "none"} />
              </div>
              <span className="flex-1 text-sm font-medium">{favorited ? "Remove from Favorites" : "Add to Favorites"}</span>
            </button>

            <button
              onClick={() => { togglePinned(trackId); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 active:bg-white/12 transition-colors text-left"
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", pinned ? "bg-accent-2/20" : "bg-white/5")}>
                <Pin size={14} className={pinned ? "text-accent-2-bright" : "text-white/60"} fill={pinned ? "currentColor" : "none"} />
              </div>
              <span className="flex-1 text-sm font-medium">{pinned ? "Unpin from Library" : "Pin to Library"}</span>
            </button>

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
        </div>,
        document.body,
      )}
    </div>
  );
}
