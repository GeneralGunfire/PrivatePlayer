"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Pause, Shuffle, Clock3, ListMusic } from "lucide-react";
import { PLAYLISTS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { usePlaylists } from "@/lib/use-playlists";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

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
    <div className="pb-52 pt-0 max-w-2xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl mb-6">
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${playlist.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) brightness(0.28) saturate(1.6)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-black" />
        <div className="relative z-10 flex flex-col sm:flex-row items-end gap-5 px-6 pt-16 pb-6">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
              loading="eager" decoding="async"
            />
          </div>
          <div className="pb-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 mb-2 font-bold">Playlist</p>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-[13px] text-white/40 mb-1">{playlist.description}</p>
            )}
            <p className="text-[11px] text-white/22 font-bold uppercase tracking-widest">
              {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-6 mb-6">
        <motion.button
          whileTap={{ scale: 0.88 }} transition={TAP}
          onClick={handlePlay}
          disabled={playlist.tracks.length === 0}
          style={{ willChange: "transform" }}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.18)] hover:shadow-[0_0_45px_rgba(255,255,255,0.28)] transition-shadow disabled:opacity-30"
        >
          {isPlaylistPlaying
            ? <Pause size={24} fill="currentColor" />
            : <Play  size={24} fill="currentColor" className="ml-0.5" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }} transition={TAP}
          onClick={toggleShuffle}
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center border transition-all",
            shuffle
              ? "text-white bg-white/12 border-white/22"
              : "text-white/35 border-white/10 hover:text-white/60 hover:bg-white/6 hover:border-white/18"
          )}
        >
          <Shuffle size={18} />
        </motion.button>

        <p className="text-[10px] text-white/18 font-bold uppercase tracking-widest ml-1">
          {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
        </p>
      </div>

      {/* Track list */}
      <div className="px-4">
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-white/15" />
            </div>
            <p className="text-white/25 text-sm font-bold uppercase tracking-widest">No tracks yet</p>
            <p className="text-white/15 text-xs">Tap ··· on any song to add it here</p>
          </div>
        ) : (
          <>
            {/* Column header */}
            <div
              className="grid items-center gap-3 px-3 pb-2 mb-1 border-b border-white/6"
              style={{ gridTemplateColumns: "24px 48px 1fr auto" }}
            >
              <span className="text-[10px] text-white/20 font-bold text-center">#</span>
              <span />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/20 font-bold">Title</span>
              <Clock3 className="w-3 h-3 text-white/20" />
            </div>

            {items.map((track, i) => {
              const isActive  = currentTrack?.id === track.id;
              const playing   = isActive && isPlaying;
              const hovering  = hovered === i;

              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.985 }}
                  transition={TAP}
                  className={cn(
                    "track-row grid items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 border border-transparent",
                    hovering || isActive
                      ? "bg-white/8 border-white/10"
                      : "hover:bg-white/5 active:bg-white/10"
                  )}
                  style={{ gridTemplateColumns: "24px 48px 1fr auto" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(-1)}
                  onClick={() => handleTrack(track)}
                >
                  {/* Index / EQ */}
                  <div className="flex items-center justify-center h-4">
                    {hovering ? (
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                    ) : playing ? (
                      <span className="flex items-end gap-px h-3.5 w-3.5">
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                      </span>
                    ) : (
                      <span className={cn("text-[11px] font-mono font-bold", isActive ? "text-white" : "text-white/25")}>
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Art */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                    {track.coverUrl
                      ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      : <div className="w-full h-full flex items-center justify-center"><ListMusic className="w-5 h-5 text-white/15" /></div>
                    }
                  </div>

                  {/* Title + artist */}
                  <div className="min-w-0">
                    <p className={cn("text-sm font-bold truncate uppercase tracking-tight", isActive ? "text-white" : "text-white/85")}>
                      {track.title}
                    </p>
                    <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>

                  {/* Duration + menu */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-white/25 tracking-widest">{track.duration}</span>
                    <TrackMenu trackId={track.id} currentPlaylistId={id} />
                  </div>
                </motion.div>
              );
            })}

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
      </div>
    </div>
  );
}
