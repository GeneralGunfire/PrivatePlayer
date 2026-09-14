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
 * Type scale used across every page (Home/Search/Library/Playlist), kept
 * here as the reference for the rest — a real hierarchy instead of the
 * old flat "everything is bold+uppercase+letter-spaced" treatment, which
 * gave the page title, section labels, and track titles nearly identical
 * visual weight.
 *
 *   Page title      text-[28px] font-semibold tracking-[-0.01em]   sentence case
 *   Section label   text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40   structural only
 *   Row title       text-[15px] font-medium   sentence case, this is content, not a label
 *   Row meta        text-[13px] text-white/40   sentence case
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
    <div className="pb-52 pt-8 px-6 max-w-2xl mx-auto">
      <header className="mb-10">
        <h1 className="text-[28px] font-semibold tracking-[-0.01em]">Your music</h1>
        <p className="text-white/40 text-sm mt-1">
          {allTracks.length} songs{playlists.length > 0 ? ` · ${playlists.length} playlists` : ""}
        </p>
      </header>

      {playlists.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">Playlists</h2>
            <Link href="/library" className="text-[13px] text-white/40 hover:text-white transition-colors">
              See all
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
            {playlists.map(playlist => (
              <motion.div key={playlist.id} whileTap={{ scale: 0.96 }} transition={TAP} className="shrink-0 w-28 sm:w-32">
                <Link href={`/playlist/${playlist.id}`} className="block group">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2.5 hidden sm:block">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" decoding="async"
                    />
                  </div>
                  <h3 className="font-medium text-[14px] truncate">{playlist.name}</h3>
                  <p className="text-[12px] text-white/40 mt-0.5">
                    {playlist.tracks.length} tracks
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-baseline mb-3">
          <div className="flex items-center gap-5">
            {(["all", "favorites"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-[0.08em] pb-3 -mb-px border-b-2 transition-colors",
                  filter === f
                    ? "text-white border-white"
                    : "text-white/40 border-transparent hover:text-white/70",
                )}
              >
                {f === "all" ? "All songs" : "Favorites"}
              </button>
            ))}
          </div>
          <Link href="/search" className="text-[13px] text-white/40 hover:text-white transition-colors">
            Browse
          </Link>
        </div>

        {source.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Heart size={26} className="text-white/20" />
            <p className="text-white/50 text-sm">No favorites yet</p>
            <p className="text-white/30 text-[13px] max-w-[220px]">
              Tap the heart on any song to pin it here.
            </p>
          </div>
        ) : (
          <div>
            {items.map((track, idx) => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              const favorited = isFavorite(track.id);
              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.99 }}
                  transition={TAP}
                  onClick={() => handleTrack(track)}
                  className={cn(
                    "track-row group -mx-3 px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-colors duration-150 rounded-lg",
                    isActive ? "bg-white/6" : "hover:bg-white/4"
                  )}
                >
                  <span className="text-[13px] font-mono text-white/25 hidden md:block w-5 text-right shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  {/* Cover hidden on mobile per direction — generated
                      placeholder art isn't worth the space there; desktop
                      keeps it since there's room to spare. */}
                  <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-white/5 hidden sm:block">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    {playing && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="flex items-end gap-px h-3.5">
                          <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                          <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                          <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                        </span>
                      </div>
                    )}
                  </div>
                  {playing && (
                    <span className="flex items-end gap-px h-3 sm:hidden shrink-0">
                      <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                      <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                      <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-medium text-[15px] truncate", isActive ? "text-white" : "text-white/90")}>{track.title}</h4>
                    <p className="text-[13px] text-white/40 truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                        favorited ? "text-white" : "text-white/25 hover:text-white/60 hover:bg-white/8",
                      )}
                    >
                      <Heart size={15} fill={favorited ? "currentColor" : "none"} />
                    </button>
                    <span className="text-[13px] font-mono text-white/30 tracking-tight hidden sm:inline tabular-nums">
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
            whileTap={{ scale: 0.98 }} transition={TAP}
            onClick={loadMore}
            className="w-full mt-2 py-3 text-[13px] text-white/40 hover:text-white transition-colors"
          >
            Show {Math.min(remaining, 10)} more &middot; {remaining} remaining
          </motion.button>
        )}
      </section>
    </div>
  );
}
