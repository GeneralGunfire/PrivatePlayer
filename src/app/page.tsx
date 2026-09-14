"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { Track } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { usePlaylists } from "@/lib/use-playlists";
import { useFavorites } from "@/lib/use-favorites";
import { useLibrary } from "@/lib/use-library";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

type Filter = "all" | "favorites";

/**
 * Home — no time-of-day greeting. "Good Evening" over a stat line was
 * called out directly as the thing making pages feel like a generic app
 * template; a plain count line does the same informational job without
 * performing a greeting nobody asked for.
 */
export default function Home() {
  const { selectTrack, openPlayer, currentTrack, isPlaying } = usePlayer();
  const { playlists } = usePlaylists();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { tracks: allTracks } = useLibrary();
  const [filter, setFilter] = useState<Filter>("all");

  const source = useMemo(
    () => (filter === "favorites" ? allTracks.filter((t) => isFavorite(t.id)) : allTracks),
    [filter, isFavorite, allTracks],
  );
  const { items, hasMore, remaining, loadMore } = usePaged(source);

  const handleTrack = (track: Track) => {
    selectTrack(track, source);
    openPlayer();
  };

  return (
    <div className="pb-52 pt-6 px-6 space-y-8 max-w-2xl mx-auto">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tight">Your Music</h1>
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
          {allTracks.length} songs{playlists.length > 0 ? ` · ${playlists.length} playlists` : ""}
        </p>
      </header>

      {playlists.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Playlists</h2>
            <Link href="/library" className="text-[10px] text-white/35 uppercase tracking-widest hover:text-white transition-colors font-bold">
              See All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 scrollbar-none">
            {playlists.map(playlist => (
              <motion.div key={playlist.id} whileTap={{ scale: 0.94 }} transition={TAP} className="shrink-0 w-32 sm:w-36">
                <Link href={`/playlist/${playlist.id}`} className="block group">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 border border-white/10 group-hover:border-white/25 transition-colors hidden sm:block">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" decoding="async"
                    />
                  </div>
                  <h3 className="font-bold tracking-tight truncate uppercase text-xs">{playlist.name}</h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                    {playlist.tracks.length} tracks
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">
            {filter === "favorites" ? "Favorites" : "All Songs"}
          </h2>
          <Link href="/search" className="text-[10px] text-white/35 uppercase tracking-widest hover:text-white transition-colors font-bold">
            Browse
          </Link>
        </div>

        <div className="flex gap-2 mb-5">
          {(["all", "favorites"] as const).map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              transition={TAP}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                filter === f
                  ? "bg-white text-black"
                  : "bg-white/6 text-white/45 hover:bg-white/10 hover:text-white/70",
              )}
            >
              {f === "all" ? "All" : "Favorites"}
            </motion.button>
          ))}
        </div>

        {source.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Heart size={26} className="text-white/20" />
            <p className="text-white/40 text-sm">No favorites yet</p>
            <p className="text-white/25 text-xs max-w-[220px]">
              Tap the heart on any song to pin it here.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {items.map((track, idx) => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              const favorited = isFavorite(track.id);
              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.985 }}
                  transition={TAP}
                  onClick={() => handleTrack(track)}
                  className={cn(
                    "track-row group px-3 py-2.5 border border-transparent rounded-xl flex items-center gap-3 cursor-pointer transition-colors duration-150",
                    isActive
                      ? "bg-white/8 border-white/15"
                      : "bg-white/4 hover:bg-white/8 hover:border-white/8 active:bg-white/12"
                  )}
                >
                  <span className="text-[10px] font-mono text-white/20 hidden md:block w-5 text-right shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {/* Cover hidden on mobile per explicit direction — covers
                      are generated placeholder art, not real album art, so
                      they're not worth the space on a small screen; desktop
                      keeps them since there's room to spare. */}
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-white/5 hidden sm:block">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    {playing && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span className="flex items-end gap-px h-4">
                          <span className="w-0.5 bg-accent-2-bright rounded-full" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                          <span className="w-0.5 bg-accent-bright rounded-full" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                          <span className="w-0.5 bg-accent-2-bright rounded-full" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                        </span>
                      </div>
                    )}
                  </div>
                  {playing && (
                    <span className="flex items-end gap-px h-3.5 sm:hidden shrink-0">
                      <span className="w-0.5 bg-accent-2-bright rounded-full" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                      <span className="w-0.5 bg-accent-bright rounded-full" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                      <span className="w-0.5 bg-accent-2-bright rounded-full" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-bold text-sm truncate uppercase tracking-tight", isActive ? "text-white" : "text-white/90")}>{track.title}</h4>
                    <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest truncate mt-0.5">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                        favorited ? "text-accent-2-bright" : "text-white/25 hover:text-white/60 hover:bg-white/8",
                      )}
                    >
                      <Heart size={15} fill={favorited ? "currentColor" : "none"} />
                    </button>
                    <span className="text-[10px] font-mono tracking-widest text-white/25 group-hover:text-white/50 transition-colors hidden sm:inline">
                      {track.duration}
                    </span>
                    <TrackMenu trackId={track.id} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {hasMore && (
          <motion.button
            whileTap={{ scale: 0.97 }} transition={TAP}
            onClick={loadMore}
            className="w-full mt-3 py-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 active:bg-white/12 transition-colors text-[11px] font-bold uppercase tracking-widest text-white/45 hover:text-white/75"
          >
            Show {Math.min(remaining, 10)} more &middot; {remaining} remaining
          </motion.button>
        )}
      </section>
    </div>
  );
}
