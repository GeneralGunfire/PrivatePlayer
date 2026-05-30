"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, Play, Pause } from "lucide-react";
import { ALL_TRACKS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

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
    <div className="pb-32 pt-8 px-6 max-w-2xl mx-auto space-y-8">

      <h1 className="text-4xl font-bold uppercase italic tracking-tighter">All Songs</h1>

      {/* Search bar */}
      <div className="relative group">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/60 transition-colors" size={20} />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); }}
          placeholder="Search by title, artist or album…"
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm font-medium placeholder:text-white/20 focus:outline-none focus:bg-white/8 focus:border-white/25 backdrop-blur-md transition-all"
        />
      </div>

      {/* Featured cards — only when not searching */}
      {showFeatured && (
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4">Featured</h2>
          <div className="grid grid-cols-2 gap-3">
            {featured.map(track => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => handleTrack(track)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
                >
                  <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    {playing
                      ? <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center"><Pause size={14} fill="black" className="text-black" /></div>
                      : <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play size={14} fill="white" className="ml-0.5" /></div>
                    }
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-bold uppercase tracking-tight truncate leading-tight text-white">{track.title}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold truncate mt-0.5">{track.artist}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Track list */}
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4">
          {query ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : `All tracks · ${ALL_TRACKS.length}`}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-white/25 text-sm text-center py-12 font-bold uppercase tracking-widest">No tracks found</p>
        ) : (
          <>
            <div className="space-y-1">
              {items.map((track, i) => {
                const isActive = currentTrack?.id === track.id;
                const playing  = isActive && isPlaying;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleTrack(track)}
                    className={cn(
                      "group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-white/10",
                      isActive ? "bg-white/8" : "bg-white/5 hover:bg-white/8"
                    )}
                  >
                    <span className="text-[10px] font-mono text-white/25 hidden md:block w-5 text-right shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      {playing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="flex items-end gap-0.5 h-4">
                            <span className="w-0.5 bg-white rounded-full origin-bottom" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                            <span className="w-0.5 bg-white rounded-full origin-bottom" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                            <span className="w-0.5 bg-white rounded-full origin-bottom" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate uppercase tracking-tight text-white">{track.title}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate mt-0.5">
                        {track.artist} · {track.album}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono text-white/30 group-hover:text-white/60 transition-colors tracking-widest">
                        {track.duration}
                      </span>
                      <TrackMenu trackId={track.id} />
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full mt-4 py-3.5 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 transition-colors text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80"
              >
                Show {Math.min(remaining, 10)} more · {remaining} left
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
