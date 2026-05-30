"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Play, Pause, Shuffle, Clock3, Heart, ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYLISTS, getPlaylistTracks } from "@/lib/playlists";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

const fmt = (s?: number) => {
  if (!s || !isFinite(s)) return "—";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

const EqBars = () => (
  <span className="flex items-end gap-[2px] w-3.5 h-3.5">
    {[0, 0.15, 0.07].map((d, i) => (
      <span key={i} className="flex-1 rounded-[1px] bg-[#1ed760] origin-bottom"
        style={{ animation: `eqbar 0.9s ease-in-out ${d}s infinite alternate` }} />
    ))}
  </span>
);

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const playlist = PLAYLISTS.find(p => p.id === id);
  if (!playlist) notFound();

  const tracks   = getPlaylistTracks(playlist);
  const { activeTrack, playing, play, toggle, shuffle, toggleShuffle } = usePlayer();
  const [hovered, setHovered] = useState(-1);

  const isPlaylistActive = tracks.some(t => t.id === activeTrack?.id);

  const handlePlay = () => {
    if (!tracks.length) return;
    if (isPlaylistActive) { toggle(); return; }
    play(tracks[0], tracks);
  };

  return (
    <div className="min-h-screen pb-32 md:pb-10">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* Blurred bg */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${playlist.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) brightness(0.25) saturate(1.8)",
          }}
        />
        {/* Colour tint */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(to bottom right, ${playlist.color}80, transparent)` }}
        />
        {/* Fade to page */}
        <div className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-end sm:items-end gap-5 px-5 md:px-8 pt-12 pb-7">
          {/* Cover */}
          <div className="w-44 h-44 md:w-52 md:h-52 rounded-md overflow-hidden shadow-2xl shrink-0 bg-white/5">
            <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
          </div>
          {/* Meta */}
          <div className="pb-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2 font-semibold">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-3">
              {playlist.name}
            </h1>
            <p className="text-[13px] text-white/50 mb-1">{playlist.description}</p>
            <p className="text-[12px] text-white/35">
              {tracks.length} {tracks.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Action row ── */}
      <div className="flex items-center gap-4 px-5 md:px-8 py-5">
        <button
          onClick={handlePlay}
          disabled={tracks.length === 0}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all",
            tracks.length === 0
              ? "bg-white/10 cursor-not-allowed"
              : "bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95"
          )}
        >
          {isPlaylistActive && playing
            ? <Pause className="w-6 h-6 text-black fill-black" />
            : <Play  className="w-6 h-6 text-black fill-black translate-x-[2px]" />
          }
        </button>
        <button
          onClick={toggleShuffle}
          className={cn(
            "transition-colors",
            shuffle ? "text-[#1ed760]" : "text-white/40 hover:text-white"
          )}
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* ── Track table ── */}
      <div className="px-2 md:px-5">

        {tracks.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ListMusic className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/50 text-sm">No tracks yet</p>
            <p className="text-white/30 text-xs mt-1">Add songs to this playlist from your library</p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div
              className="grid items-center gap-x-4 px-3 pb-2 mb-1 border-b border-white/[0.07]"
              style={{ gridTemplateColumns: "18px 44px 1fr 28px 52px" }}
            >
              <span className="text-[11px] text-white/35 text-center">#</span>
              <span />
              <span className="text-[11px] uppercase tracking-[0.1em] text-white/35">Title</span>
              <span />
              <Clock3 className="w-3.5 h-3.5 text-white/35 ml-auto" />
            </div>

            {/* Rows */}
            <div>
              {tracks.map((track, i) => {
                const isActive  = activeTrack?.id === track.id;
                const isPlaying = isActive && playing;
                const isHovered = hovered === i;
                const showBars  = isActive && isPlaying && !isHovered;
                const showPlay  = isHovered;
                const showNum   = !showBars && !showPlay;

                return (
                  <motion.div
                    key={track.id}
                    className={cn(
                      "grid items-center gap-x-4 px-3 py-2.5 rounded-[4px] cursor-pointer select-none transition-colors duration-75",
                      isHovered ? "bg-white/[0.07]" : isActive ? "bg-white/[0.03]" : ""
                    )}
                    style={{ gridTemplateColumns: "18px 44px 1fr 28px 52px" }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(-1)}
                    onClick={() => play(track, tracks)}
                    layout
                  >
                    {/* # / icon */}
                    <div className="flex items-center justify-center text-sm tabular-nums">
                      <AnimatePresence mode="wait">
                        {showBars && <motion.span key="bars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}><EqBars /></motion.span>}
                        {showPlay && <motion.span key="play" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                          <Play className={cn("w-3.5 h-3.5 fill-current", isActive ? "text-[#1ed760]" : "text-white")} />
                        </motion.span>}
                        {showNum && <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}
                          className={cn("text-sm", isActive ? "text-[#1ed760]" : "text-white/40")}
                        >{i + 1}</motion.span>}
                      </AnimatePresence>
                    </div>

                    {/* Art */}
                    <div className="w-11 h-11 rounded overflow-hidden shrink-0 bg-white/5">
                      {track.image
                        ? <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ListMusic className="w-4 h-4 text-white/20" /></div>
                      }
                    </div>

                    {/* Title + artist */}
                    <div className="min-w-0">
                      <p className={cn("text-[13px] font-medium truncate leading-snug", isActive ? "text-[#1ed760]" : "text-white")}>
                        {track.album}
                      </p>
                      <p className="text-[12px] text-white/45 truncate mt-[1px]">{track.artist}</p>
                    </div>

                    {/* Heart */}
                    <button onClick={e => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 text-white/35 hover:text-white transition-opacity flex items-center justify-center"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    >
                      <Heart className="w-[15px] h-[15px]" />
                    </button>

                    {/* Duration */}
                    <span className="text-[12px] text-white/40 tabular-nums text-right pr-1">
                      {track.duration ? fmt(track.duration) : track.year}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
