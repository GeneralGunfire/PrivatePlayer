"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Play, Pause, Shuffle, Clock3, ListMusic } from "lucide-react";
import { PLAYLISTS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { usePlaylists } from "@/lib/use-playlists";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const defaultPlaylist = PLAYLISTS.find(p => p.id === id);
  if (!defaultPlaylist) notFound();

  const { playlists } = usePlaylists();
  const playlist = playlists.find(p => p.id === id) ?? defaultPlaylist;

  const { currentTrack, isPlaying, selectTrack, togglePlay, openPlayer, shuffle, toggleShuffle } = usePlayer();
  const [hovered, setHovered] = useState(-1);
  const { items, hasMore, remaining, loadMore } = usePaged(playlist.tracks);

  const isPlaylistPlaying = playlist.tracks.some(t => t.id === currentTrack?.id) && isPlaying;

  const handlePlay = () => {
    if (!playlist.tracks.length) return;
    const first = playlist.tracks[0];
    currentTrack?.id === first.id ? togglePlay() : (selectTrack(first, playlist.tracks), openPlayer());
  };

  const handleTrack = (track: typeof playlist.tracks[0]) => {
    selectTrack(track, playlist.tracks);
    openPlayer();
  };

  return (
    <div className="pb-32 pt-0 max-w-2xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl mb-6">
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${playlist.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) brightness(0.3) saturate(1.8)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black" />
        <div className="relative z-10 flex flex-col sm:flex-row items-end gap-5 px-6 pt-16 pb-6">
          <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-2xl shrink-0 glass">
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
          </div>
          <div className="pb-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">Playlist</p>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-[13px] text-white/45 mb-1">{playlist.description}</p>
            )}
            <p className="text-[11px] text-white/25 font-bold uppercase tracking-widest">
              {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-6 mb-6">
        <button
          onClick={handlePlay}
          disabled={playlist.tracks.length === 0}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
        >
          {isPlaylistPlaying
            ? <Pause size={24} fill="currentColor" />
            : <Play  size={24} fill="currentColor" className="ml-0.5" />}
        </button>
        <button
          onClick={toggleShuffle}
          className={cn("p-2.5 rounded-full transition-colors", shuffle ? "text-white bg-white/10" : "text-white/30 hover:text-white hover:bg-white/8")}
        >
          <Shuffle size={20} />
        </button>
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest ml-2">
          Tap ··· on any song to add/remove
        </p>
      </div>

      {/* Track list */}
      <div className="px-4">
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-2">
            <ListMusic className="w-12 h-12 text-white/15" />
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest">No tracks yet</p>
            <p className="text-white/20 text-xs">Go to any song and tap ··· to add it here</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="grid items-center gap-4 px-3 pb-2 mb-1 border-b border-white/6"
              style={{ gridTemplateColumns: "24px 48px 1fr auto" }}
            >
              <span className="text-[10px] text-white/25 font-bold text-center">#</span>
              <span />
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-bold">Title</span>
              <Clock3 className="w-3 h-3 text-white/25" />
            </div>

            {items.map((track, i) => {
              const isActive = currentTrack?.id === track.id;
              const isRow    = isActive && isPlaying;
              const hovering = hovered === i;

              return (
                <div
                  key={track.id}
                  className={cn(
                    "group grid items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                    hovering ? "bg-white/8" : isActive ? "bg-white/5" : "hover:bg-white/5"
                  )}
                  style={{ gridTemplateColumns: "24px 48px 1fr auto" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(-1)}
                  onClick={() => handleTrack(track)}
                >
                  {/* Index / eq bars */}
                  <div className="flex items-center justify-center h-4">
                    {hovering ? (
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                    ) : isRow ? (
                      <span className="flex items-end gap-0.5 h-3.5 w-3.5">
                        <span className="flex-1 rounded-sm bg-white origin-bottom" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                        <span className="flex-1 rounded-sm bg-white origin-bottom" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                        <span className="flex-1 rounded-sm bg-white origin-bottom" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                      </span>
                    ) : (
                      <span className={cn("text-[11px] font-mono font-bold", isActive ? "text-white" : "text-white/30")}>
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Art */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                    {track.coverUrl
                      ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ListMusic className="w-5 h-5 text-white/20" /></div>
                    }
                  </div>

                  {/* Title + artist */}
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate uppercase tracking-tight text-white">{track.title}</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate mt-0.5">{track.artist}</p>
                  </div>

                  {/* Duration + 3-dot menu */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-white/30 tracking-widest">{track.duration}</span>
                    <TrackMenu trackId={track.id} currentPlaylistId={id} />
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full mt-3 py-3.5 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 transition-colors text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80"
              >
                Show {Math.min(remaining, 10)} more · {remaining} left
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
