"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Play, Pause } from "lucide-react";
import { ALL_TRACKS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function Search() {
  const [query, setQuery] = useState("");
  const { currentTrack, isPlaying, selectTrack, togglePlay, openPlayer } = usePlayer();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_TRACKS;
    return ALL_TRACKS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    );
  }, [query]);

  const { items, hasMore, remaining, loadMore } = usePaged(filtered);

  const handleTrack = (track: typeof ALL_TRACKS[0]) => {
    if (currentTrack?.id === track.id) togglePlay();
    else { selectTrack(track, filtered); openPlayer(); }
  };

  const featured = ALL_TRACKS.slice(0, 4);
  const showFeatured = query.trim() === "";

  return (
    <div className="pb-52 pt-8 px-6 max-w-2xl mx-auto space-y-8">

      <h1 className="text-4xl font-bold uppercase italic tracking-tighter">All Songs</h1>

      {/* Search bar */}
      <div className="relative group">
        <SearchIcon
          className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/55 transition-colors"
          size={18}
        />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, artist or album"
          className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl pl-13 pr-5 text-sm font-medium placeholder:text-white/20 focus:outline-none focus:bg-white/8 focus:border-white/22 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white/60 hover:text-white text-[10px] font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/* Featured cards */}
      {showFeatured && (
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold mb-4">Featured</h2>
          <div className="grid grid-cols-2 gap-3">
            {featured.map(track => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.96 }}
                  transition={TAP}
                  onClick={() => handleTrack(track)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy" decoding="async"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    {playing
                      ? <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <Pause size={13} fill="black" className="text-black" />
                        </div>
                      : <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={13} fill="white" className="ml-0.5" />
                        </div>
                    }
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-bold uppercase tracking-tight truncate leading-tight text-white">{track.title}</p>
                    <p className="text-[10px] text-white/45 uppercase tracking-widest font-bold truncate mt-0.5">{track.artist}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Track list */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold mb-4">
          {query
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
            : `All tracks · ${ALL_TRACKS.length}`}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-12 font-bold uppercase tracking-widest">
            No tracks found
          </p>
        ) : (
          <>
            <div className="space-y-0.5">
              {items.map((track, i) => {
                const isActive = currentTrack?.id === track.id;
                const playing  = isActive && isPlaying;
                return (
                  <motion.div
                    key={track.id}
                    whileTap={{ scale: 0.985 }}
                    transition={TAP}
                    onClick={() => handleTrack(track)}
                    className={cn(
                      "track-row group flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-colors duration-150 border border-transparent",
                      isActive
                        ? "bg-white/10 border-white/12"
                        : "bg-white/4 hover:bg-white/8 hover:border-white/8 active:bg-white/12"
                    )}
                  >
                    <span className="text-[10px] font-mono text-white/20 hidden md:block w-5 text-right shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        loading="lazy" decoding="async"
                      />
                      {playing && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                          <span className="flex items-end gap-px h-4">
                            <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                            <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                            <span className="w-0.5 bg-white rounded-full" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-bold text-sm truncate uppercase tracking-tight", isActive ? "text-white" : "text-white/90")}>
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest truncate mt-0.5">
                        {track.artist} · {track.album}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono text-white/25 group-hover:text-white/50 transition-colors tracking-widest">
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
                whileTap={{ scale: 0.97 }} transition={TAP}
                onClick={loadMore}
                className="w-full mt-3 py-3.5 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 active:bg-white/12 transition-colors text-[11px] font-bold uppercase tracking-widest text-white/45 hover:text-white/75"
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
