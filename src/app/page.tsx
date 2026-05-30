"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { ALL_TRACKS } from "@/lib/data";
// playlists come from usePlaylists hook (live counts)
import { usePlayer } from "@/lib/player-context";
import { usePlaylists } from "@/lib/use-playlists";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

export default function Home() {
  const { selectTrack, openPlayer, currentTrack, isPlaying } = usePlayer();
  const { playlists } = usePlaylists();
  const { items, hasMore, remaining, loadMore, total } = usePaged(ALL_TRACKS);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleTrack = (track: typeof ALL_TRACKS[0]) => {
    selectTrack(track, ALL_TRACKS);
    openPlayer();
  };

  return (
    <div className="pb-32 pt-8 px-6 space-y-10 max-w-2xl mx-auto">

      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold uppercase italic tracking-tighter mb-2">{greet()}</h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
          {total} songs · {playlists.length} playlists
        </p>
      </header>

      {/* Featured Banner */}
      <section className="relative h-56 rounded-3xl overflow-hidden group glass">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
            alt="Featured"
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] mb-3 inline-block font-bold">
            Featured
          </span>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-1 leading-none">Coldplay</h2>
          <p className="text-white/50 text-xs font-medium">
            {playlists.find(p => p.id === "coldplay")?.tracks.length ?? 0} Tracks
          </p>
        </div>
        <Link
          href="/playlist/coldplay"
          className="absolute right-6 bottom-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Play size={20} fill="currentColor" className="ml-0.5" />
        </Link>
      </section>

      {/* Playlists horizontal scroll */}
      <section>
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-xl font-bold uppercase tracking-tight">Playlists</h2>
          <Link href="/library" className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition-colors font-bold">
            See All
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-3 -mx-6 px-6 scrollbar-none">
          {playlists.map(playlist => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="flex-shrink-0 w-40 group">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 border border-white/10 group-hover:border-white/25 transition-colors">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold tracking-tight truncate uppercase text-sm">{playlist.name}</h3>
              <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest mt-0.5">
                {playlist.tracks.length} tracks
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* All Songs — paginated */}
      <section>
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-xl font-bold uppercase tracking-tight">All Songs</h2>
          <Link href="/search" className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white transition-colors font-bold">
            Browse
          </Link>
        </div>
        <div className="space-y-1">
          {items.map((track, idx) => {
            const isActive = currentTrack?.id === track.id;
            const playing  = isActive && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => handleTrack(track)}
                className={cn(
                  "group p-3 border border-transparent rounded-2xl flex items-center gap-4 cursor-pointer transition-colors",
                  isActive ? "bg-white/8 border-white/10" : "bg-white/4 hover:bg-white/8 hover:border-white/8"
                )}
              >
                <span className="text-[10px] font-mono text-white/25 hidden md:block w-5 text-right shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-white/5">
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
                  <h4 className="font-bold text-sm truncate uppercase tracking-tight">{track.title}</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate mt-0.5">{track.artist}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono tracking-widest text-white/35 group-hover:text-white/60 transition-colors">
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
      </section>
    </div>
  );
}
