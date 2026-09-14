"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Play, Pause } from "lucide-react";
import type { Track } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { useLibrary } from "@/lib/use-library";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function Search() {
  const [query, setQuery] = useState("");
  const { currentTrack, isPlaying, selectTrack, togglePlay, openPlayer } = usePlayer();
  const { tracks: allTracks } = useLibrary();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTracks;
    return allTracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    );
  }, [query, allTracks]);

  const { items, hasMore, remaining, loadMore } = usePaged(filtered);

  const handleTrack = (track: Track) => {
    if (currentTrack?.id === track.id) togglePlay();
    else { selectTrack(track, filtered); openPlayer(); }
  };

  const featured = allTracks.slice(0, 4);
  const showFeatured = query.trim() === "";

  return (
    <div className="pb-52 pt-8 px-6 max-w-2xl mx-auto">

      <h1 className="text-[28px] font-semibold tracking-[-0.01em] mb-6">Search</h1>

      <div className="relative group mb-8">
        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors"
          size={17}
        />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, artist or album"
          className="w-full h-12 bg-white/6 rounded-xl pl-11 pr-5 text-[15px] placeholder:text-white/30 focus:outline-none focus:bg-white/9 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white/60 hover:text-white text-[10px]"
          >
            ×
          </button>
        )}
      </div>

      {/* Featured cards — hidden on mobile, no track-cover art there per
          direction; on mobile this section would just be 4 empty tiles. */}
      {showFeatured && (
        <section className="hidden sm:block mb-10">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 mb-4">Featured</h2>
          <div className="grid grid-cols-2 gap-3">
            {featured.map(track => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.97 }}
                  transition={TAP}
                  onClick={() => handleTrack(track)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy" decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute top-3 right-3">
                    {playing
                      ? <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                          <Pause size={13} fill="black" className="text-black" />
                        </div>
                      : <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={13} fill="white" className="ml-0.5" />
                        </div>
                    }
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <p className="text-[15px] font-medium truncate leading-tight text-white">{track.title}</p>
                    <p className="text-[13px] text-white/60 truncate mt-0.5">{track.artist}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 mb-3">
          {query
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
            : `All tracks · ${allTracks.length}`}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-12">
            No tracks found
          </p>
        ) : (
          <>
            <div>
              {items.map((track, i) => {
                const isActive = currentTrack?.id === track.id;
                const playing  = isActive && isPlaying;
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
                      {i + 1}
                    </span>
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-white/5 hidden sm:block">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy" decoding="async"
                      />
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
                      <h4 className={cn("font-medium text-[15px] truncate", isActive ? "text-white" : "text-white/90")}>
                        {track.title}
                      </h4>
                      <p className="text-[13px] text-white/40 truncate">
                        {track.artist}{track.album ? ` · ${track.album}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[13px] font-mono text-white/30 tracking-tight tabular-nums">
                        {track.duration}
                      </span>
                      <TrackMenu trackId={track.id} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hasMore && (
              <motion.button
                whileTap={{ scale: 0.98 }} transition={TAP}
                onClick={loadMore}
                className="w-full mt-2 py-3 text-[13px] text-white/40 hover:text-white transition-colors"
              >
                Show {Math.min(remaining, 10)} more &middot; {remaining} remaining
              </motion.button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
