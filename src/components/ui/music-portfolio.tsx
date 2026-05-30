"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Clock3, Heart, Shuffle, ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/tracks";

function formatDuration(s: number) {
  if (!s || !isFinite(s)) return "—";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

// ── Animated equaliser bars (playing indicator) ───────────
const EqBars = ({ color = "#1ed760" }: { color?: string }) => (
  <span className="flex items-end gap-[2px] h-[14px] w-[14px]">
    {[0, 0.2, 0.1].map((delay, i) => (
      <span
        key={i}
        className="flex-1 rounded-[1px] origin-bottom"
        style={{
          background: color,
          animation: `eqbar 0.9s ease-in-out ${delay}s infinite alternate`,
        }}
      />
    ))}
  </span>
);

// ── Single track row ──────────────────────────────────────
interface RowProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isHovered: boolean;
  onHover: (i: number) => void;
  onLeave: () => void;
  onClick: (i: number) => void;
}

const TrackRow = ({ track, index, isActive, isPlaying, isHovered, onHover, onLeave, onClick }: RowProps) => {
  const highlight = isActive;
  const showPlay  = isHovered;
  const showBars  = isActive && isPlaying && !isHovered;
  const showNum   = !isHovered && !showBars;

  return (
    <div
      className={cn(
        "group grid items-center gap-x-4 px-3 py-2.5 rounded-[4px] cursor-pointer select-none transition-colors duration-75",
        isHovered ? "bg-white/[0.07]" : "bg-transparent"
      )}
      style={{ gridTemplateColumns: "18px 44px 1fr 28px 52px" }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      onClick={() => onClick(index)}
    >
      {/* # / icon */}
      <div className="flex items-center justify-center text-sm tabular-nums">
        {showBars && <EqBars />}
        {showPlay && (
          <Play className={cn("w-3.5 h-3.5 fill-current", highlight ? "text-[#1ed760]" : "text-white")} />
        )}
        {showNum && (
          <span className={highlight ? "text-[#1ed760]" : "text-white/50"}>{index + 1}</span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-11 h-11 rounded overflow-hidden bg-white/5 shrink-0">
        {track.image
          ? <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-white/10 flex items-center justify-center"><ListMusic className="w-4 h-4 text-white/20" /></div>
        }
      </div>

      {/* Title + artist */}
      <div className="min-w-0">
        <p className={cn("text-[13px] font-medium truncate leading-[1.3]", highlight ? "text-[#1ed760]" : "text-white")}>
          {track.album}
        </p>
        <p className="text-[12px] text-white/50 truncate mt-[1px] group-hover:text-white/70 transition-colors">
          {track.artist}
        </p>
      </div>

      {/* Heart */}
      <button
        onClick={e => e.stopPropagation()}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white flex items-center justify-center"
        aria-label="Save"
      >
        <Heart className="w-[15px] h-[15px]" />
      </button>

      {/* Duration or year */}
      <span className="text-[12px] text-white/50 tabular-nums text-right pr-1">
        {track.duration ? formatDuration(track.duration) : track.year}
      </span>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────
interface MusicPortfolioProps {
  tracks: Track[];
  activeTrackIndex: number;
  isPlaying: boolean;
  onTrackSelect: (i: number) => void;
}

const MusicPortfolio = ({ tracks, activeTrackIndex, isPlaying, onTrackSelect }: MusicPortfolioProps) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const heroTrack = activeTrackIndex >= 0 ? tracks[activeTrackIndex] : tracks[0];
  const prevImage = useRef(heroTrack?.image ?? "");

  // Keep previous image ref for crossfade
  useEffect(() => {
    if (heroTrack?.image) prevImage.current = heroTrack.image;
  }, [heroTrack?.image]);

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none pb-28">

      {/* ════ HERO ════ */}
      <div className="relative overflow-hidden" style={{ paddingBottom: "2rem" }}>

        {/* Full-bleed blurred bg — crossfades on track change */}
        <AnimatePresence mode="sync">
          <motion.div
            key={heroTrack?.image}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroTrack?.image})`, filter: "blur(72px) brightness(0.35) saturate(1.6)", transform: "scale(1.15)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        </AnimatePresence>

        {/* Bottom gradient into page */}
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-[#121212] pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 flex items-end gap-6 px-8 pt-10 pb-0">

          {/* Cover art */}
          <motion.div
            key={heroTrack?.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="shrink-0 w-48 h-48 rounded-md overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
          >
            {heroTrack?.image
              ? <img src={heroTrack.image} alt={heroTrack.album} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-white/5 flex items-center justify-center"><ListMusic className="w-10 h-10 text-white/20" /></div>
            }
          </motion.div>

          {/* Meta */}
          <div className="pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-2">Playlist</p>
            <h1 className="text-5xl font-black tracking-tight text-white mb-4 leading-none">
              PrivatePlayer
            </h1>
            <p className="text-[13px] text-white/50">
              {tracks.length} {tracks.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      {/* ════ ACTION BAR ════ */}
      <div className="flex items-center gap-5 px-8 py-5">
        <button
          onClick={() => onTrackSelect(activeTrackIndex >= 0 ? activeTrackIndex : 0)}
          className="w-14 h-14 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg hover:scale-[1.04] hover:bg-[#1fdf64] active:scale-[0.97] transition-all duration-100"
        >
          {isPlaying && activeTrackIndex >= 0
            ? <Pause  className="w-6 h-6 text-black fill-black" />
            : <Play   className="w-6 h-6 text-black fill-black translate-x-[2px]" />
          }
        </button>
        <button className="text-white/40 hover:text-white transition-colors">
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* ════ TRACK TABLE ════ */}
      <div className="px-5">

        {/* Column headers */}
        <div
          className="grid items-center gap-x-4 px-3 pb-2 mb-1 border-b border-white/[0.08]"
          style={{ gridTemplateColumns: "18px 44px 1fr 28px 52px" }}
        >
          <span className="text-[11px] text-white/40 text-center">#</span>
          <span />
          <span className="text-[11px] uppercase tracking-[0.1em] text-white/40">Title</span>
          <span />
          <Clock3 className="w-3.5 h-3.5 text-white/40 ml-auto" />
        </div>

        {/* Rows */}
        <div className="mt-1">
          {tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              isActive={activeTrackIndex === i}
              isPlaying={isPlaying && activeTrackIndex === i}
              isHovered={hoveredIndex === i}
              onHover={setHoveredIndex}
              onLeave={() => setHoveredIndex(-1)}
              onClick={onTrackSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPortfolio;
