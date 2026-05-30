"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/tracks";

const fmt = (s: number = 0) => {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

// ── Slim scrub/volume bar ────────────────────────────────
const Rail = ({
  value, onChange, green = false, className,
}: {
  value: number; onChange: (v: number) => void; green?: boolean; className?: string;
}) => (
  <div
    className={cn("relative h-1 rounded-full cursor-pointer group", className)}
    style={{ background: "rgba(255,255,255,0.12)" }}
    onClick={e => {
      const r = e.currentTarget.getBoundingClientRect();
      onChange(Math.min(Math.max(((e.clientX - r.left) / r.width) * 100, 0), 100));
    }}
  >
    <div
      className="absolute inset-y-0 left-0 rounded-full transition-colors duration-150"
      style={{
        width: `${value}%`,
        background: green ? "#1ed760" : "rgba(255,255,255,0.75)",
      }}
    />
    {/* Thumb — only visible on hover */}
    <div
      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow pointer-events-none"
      style={{ left: `calc(${value}% - 6px)` }}
    />
  </div>
);

// ── Icon button helper ───────────────────────────────────
const Btn = ({
  onClick, active = false, accent = false, size = "md", children, className,
}: {
  onClick?: () => void; active?: boolean; accent?: boolean;
  size?: "sm" | "md" | "lg"; children: React.ReactNode; className?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center rounded-full transition-all duration-100 shrink-0",
      size === "sm" && "w-7 h-7",
      size === "md" && "w-8 h-8",
      size === "lg" && "w-10 h-10",
      accent
        ? "bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95"
        : "hover:text-white text-white/60 active:scale-90",
      active && !accent && "text-[#1ed760] hover:text-[#1ed760]",
      className
    )}
  >
    {children}
  </button>
);

// ── Main ─────────────────────────────────────────────────
interface AudioPlayerProps {
  track: Track | null;
  tracks: Track[];
  onNext: () => void;
  onPrev: () => void;
  isVisible: boolean;
  onClose: () => void;
}

const AudioPlayer = ({ track, tracks, onNext, onPrev, isVisible, onClose }: AudioPlayerProps) => {
  const audioRef  = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent]   = useState(0);
  const [dur, setDur]           = useState(0);
  const [shuffle, setShuffle]   = useState(false);
  const [repeat, setRepeat]     = useState(false);
  const [vol, setVol]           = useState(1);
  const [muted, setMuted]       = useState(false);

  // Swap src when track changes
  useEffect(() => {
    if (!audioRef.current || !track) return;
    const wasPlaying = playing;
    audioRef.current.src = track.src;
    audioRef.current.load();
    setProgress(0); setCurrent(0);
    if (wasPlaying) audioRef.current.play().catch(() => {});
  }, [track?.id]);

  const togglePlay = () => {
    if (!audioRef.current || !track) return;
    playing ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isFinite(pct) ? pct : 0);
    setCurrent(audioRef.current.currentTime);
    setDur(audioRef.current.duration || 0);
  };

  const handleSeek = (v: number) => {
    if (!audioRef.current?.duration) return;
    const t = (v / 100) * audioRef.current.duration;
    if (isFinite(t)) { audioRef.current.currentTime = t; setProgress(v); }
  };

  const changeVol = (v: number) => {
    const n = v / 100;
    setVol(n); setMuted(n === 0);
    if (audioRef.current) audioRef.current.volume = n;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.volume = next ? 0 : vol;
  };

  const next = () => { onNext(); setPlaying(true); };

  const prev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else { onPrev(); setPlaying(true); }
  };

  const ended = () => {
    if (repeat && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); }
    else next();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="bar"
          className="fixed bottom-0 inset-x-0 z-50 bg-[#181818] border-t border-white/[0.06]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 420, damping: 42 }}
        >
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDur(audioRef.current?.duration || 0)}
            onEnded={ended}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Full-width scrub rail */}
          <Rail value={progress} onChange={handleSeek} green className="mx-0 rounded-none" />

          <div className="flex items-center px-4 py-2.5 gap-3">

            {/* ── Left: art + track info ── */}
            <div className="flex items-center gap-3 min-w-0 w-[220px] shrink-0">
              {track?.image && (
                <div className="w-10 h-10 rounded shrink-0 overflow-hidden bg-white/5 shadow">
                  <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-[13px] font-medium truncate leading-snug">
                  {track?.album ?? "—"}
                </p>
                <p className="text-white/50 text-[11px] truncate mt-[1px]">
                  {track?.artist ?? ""}
                </p>
              </div>
            </div>

            {/* ── Centre: transport ── */}
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <Btn onClick={() => setShuffle(s => !s)} active={shuffle} size="sm">
                  <Shuffle className="w-3.5 h-3.5" />
                </Btn>
                <Btn onClick={prev} size="md">
                  <SkipBack className="w-4 h-4 fill-current" />
                </Btn>
                <Btn onClick={togglePlay} accent size="lg">
                  {playing
                    ? <Pause className="w-5 h-5 text-black fill-black" />
                    : <Play  className="w-5 h-5 text-black fill-black translate-x-[1px]" />
                  }
                </Btn>
                <Btn onClick={next} size="md">
                  <SkipForward className="w-4 h-4 fill-current" />
                </Btn>
                <Btn onClick={() => setRepeat(r => !r)} active={repeat} size="sm">
                  <Repeat className="w-3.5 h-3.5" />
                </Btn>
              </div>

              {/* Timestamps + progress */}
              <div className="hidden sm:flex items-center gap-2 w-full max-w-sm">
                <span className="text-[10px] text-white/40 tabular-nums w-8 text-right shrink-0">{fmt(current)}</span>
                <Rail value={progress} onChange={handleSeek} className="flex-1" />
                <span className="text-[10px] text-white/40 tabular-nums w-8 shrink-0">{fmt(dur)}</span>
              </div>
            </div>

            {/* ── Right: volume + close ── */}
            <div className="hidden sm:flex items-center gap-2 w-[220px] justify-end shrink-0">
              <Btn onClick={toggleMute} size="sm">
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </Btn>
              <Rail value={muted ? 0 : vol * 100} onChange={changeVol} className="w-24" />
              <Btn onClick={onClose} size="sm" className="ml-2 text-white/30">
                <ChevronDown className="w-4 h-4" />
              </Btn>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayer;
