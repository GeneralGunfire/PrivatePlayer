"use client";

import React, { useState } from "react";
import { Play, Pause, Clock3, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/tracks";

// ── Helpers ───────────────────────────────────────────────
function formatDuration(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Track Row ─────────────────────────────────────────────
interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isHovered: boolean;
  onHover: (i: number) => void;
  onLeave: () => void;
  onClick: (i: number) => void;
}

const TrackRow = ({
  track,
  index,
  isActive,
  isPlaying,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: TrackRowProps) => {
  const showPlayIcon = isHovered || (isActive && isPlaying);

  return (
    <motion.div
      className={cn(
        "grid items-center gap-4 px-4 py-2 rounded-md group cursor-pointer select-none",
        "transition-colors duration-100",
        isHovered ? "bg-white/5" : "bg-transparent",
        isActive && !isHovered ? "bg-white/3" : ""
      )}
      style={{
        gridTemplateColumns: "16px 40px 1fr auto auto",
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      onClick={() => onClick(index)}
      layout
    >
      {/* Col 1 — number / play indicator */}
      <div className="flex items-center justify-center w-4 h-4 shrink-0">
        <AnimatePresence mode="wait">
          {showPlayIcon ? (
            <motion.span
              key="icon"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.1 }}
            >
              {isActive && isPlaying && !isHovered ? (
                // Animated bars when playing
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-green-400 rounded-sm animate-[musicbar_0.8s_ease-in-out_infinite]" style={{ height: "60%", animationDelay: "0s" }} />
                  <span className="w-0.5 bg-green-400 rounded-sm animate-[musicbar_0.8s_ease-in-out_infinite]" style={{ height: "100%", animationDelay: "0.2s" }} />
                  <span className="w-0.5 bg-green-400 rounded-sm animate-[musicbar_0.8s_ease-in-out_infinite]" style={{ height: "40%", animationDelay: "0.4s" }} />
                </span>
              ) : (
                <Play
                  className={cn(
                    "w-3.5 h-3.5 fill-current",
                    isActive ? "text-green-400" : "text-white"
                  )}
                />
              )}
            </motion.span>
          ) : (
            <motion.span
              key="num"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={cn(
                "text-sm tabular-nums",
                isActive ? "text-green-400" : "text-white/40"
              )}
            >
              {index + 1}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Col 2 — album art */}
      <div className="w-10 h-10 rounded shrink-0 overflow-hidden bg-white/5">
        {track.image ? (
          <img
            src={track.image}
            alt={track.album}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
      </div>

      {/* Col 3 — title + artist */}
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate leading-snug",
            isActive ? "text-green-400" : "text-white"
          )}
        >
          {track.album}
        </p>
        <p className="text-xs text-white/50 truncate mt-0.5">{track.artist}</p>
      </div>

      {/* Col 4 — heart (liked) */}
      <button
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded",
          "text-white/40 hover:text-white"
        )}
        onClick={(e) => e.stopPropagation()}
        aria-label="Like"
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Col 5 — duration */}
      <span className="text-sm text-white/40 tabular-nums w-10 text-right shrink-0">
        {track.duration ? formatDuration(track.duration) : track.year}
      </span>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────
interface MusicPortfolioProps {
  tracks: Track[];
  activeTrackIndex: number;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

const MusicPortfolio = ({
  tracks,
  activeTrackIndex,
  isPlaying,
  onTrackSelect,
}: MusicPortfolioProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // Hero uses the active track's image, falls back to first
  const heroTrack = tracks[activeTrackIndex] ?? tracks[0];

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-32">

      {/* ── Hero banner ── */}
      <div className="relative h-64 overflow-hidden">
        {/* Blurred background */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-60 transition-all duration-700"
          style={{ backgroundImage: `url(${heroTrack?.image})` }}
        />
        {/* Gradient fade to page bg */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#121212]/60 to-[#121212]" />

        {/* Content */}
        <div className="relative z-10 flex items-end h-full px-6 pb-6 gap-5">
          <div className="w-40 h-40 rounded-lg shadow-2xl overflow-hidden shrink-0 bg-white/5">
            {heroTrack?.image && (
              <img
                src={heroTrack.image}
                alt="Playlist cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Playlist</p>
            <h1 className="text-4xl font-bold text-white leading-tight">PrivatePlayer</h1>
            <p className="text-sm text-white/50 mt-2">
              {tracks.length} {tracks.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Action row ── */}
      <div className="flex items-center gap-6 px-6 py-4">
        <button
          className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          onClick={() => onTrackSelect(activeTrackIndex >= 0 ? activeTrackIndex : 0)}
        >
          {isPlaying && activeTrackIndex >= 0 ? (
            <Pause className="w-6 h-6 text-black fill-black" />
          ) : (
            <Play className="w-6 h-6 text-black fill-black translate-x-0.5" />
          )}
        </button>
      </div>

      {/* ── Table header ── */}
      <div
        className="grid items-center gap-4 px-4 mb-2 border-b border-white/10 pb-2 mx-2"
        style={{ gridTemplateColumns: "16px 40px 1fr auto auto" }}
      >
        <span className="text-xs text-white/40 text-center">#</span>
        <span />
        <span className="text-xs uppercase tracking-widest text-white/40">Title</span>
        <span />
        <Clock3 className="w-3.5 h-3.5 text-white/40 ml-auto" />
      </div>

      {/* ── Track list ── */}
      <div className="px-2">
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
  );
};

export default MusicPortfolio;
