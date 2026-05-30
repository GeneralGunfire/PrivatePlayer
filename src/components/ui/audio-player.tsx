"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/tracks";

// ── Helpers ──────────────────────────────────────────────
const formatTime = (seconds: number = 0) => {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ── Progress / Volume Slider ─────────────────────────────
const Slider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) => (
  <div
    className={cn("relative w-full h-[3px] bg-white/10 rounded-full cursor-pointer group", className)}
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      onChange(Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100));
    }}
  >
    <div
      className="absolute top-0 left-0 h-full bg-white/70 rounded-full group-hover:bg-white transition-colors duration-150"
      style={{ width: `${value}%` }}
    />
    <div
      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
      style={{ left: `calc(${value}% - 6px)` }}
    />
  </div>
);

// ── Main Component ────────────────────────────────────────
interface AudioPlayerProps {
  track: Track | null;
  tracks: Track[];
  onNext: () => void;
  onPrev: () => void;
  isVisible: boolean;
  onClose: () => void;
}

const AudioPlayer = ({ track, tracks, onNext, onPrev, isVisible, onClose }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Load new track when it changes
  useEffect(() => {
    if (!audioRef.current || !track) return;
    const wasPlaying = isPlaying;
    audioRef.current.src = track.src;
    audioRef.current.load();
    if (wasPlaying) audioRef.current.play().catch(() => {});
    setProgress(0);
    setCurrentTime(0);
  }, [track?.id]);

  const togglePlay = () => {
    if (!audioRef.current || !track) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isFinite(pct) ? pct : 0);
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current?.duration) return;
    const time = (value / 100) * audioRef.current.duration;
    if (isFinite(time)) {
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    const v = value / 100;
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    audioRef.current.volume = next ? 0 : volume;
  };

  const handleEnded = () => {
    if (isRepeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      onNext();
    }
  };

  const handleNext = () => {
    if (isShuffle && tracks.length > 1) {
      // pick random track (not current)
      const others = tracks.filter((t) => t.id !== track?.id);
      const random = others[Math.floor(Math.random() * others.length)];
      const idx = tracks.findIndex((t) => t.id === random.id);
      // bubble up via index difference — simplest: just call onNext and accept order
    }
    onNext();
    setIsPlaying(true);
  };

  const handlePrev = () => {
    // If > 3 seconds in, restart; else go to previous
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      onPrev();
      setIsPlaying(true);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="player"
          className="player-panel"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
        >
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Progress bar — full width at top */}
          <Slider value={progress} onChange={handleSeek} className="rounded-none" />

          <div className="flex items-center gap-4 px-6 py-3">
            {/* Cover + info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {track?.image && (
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                  <img src={track.image} alt={track.album} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold uppercase tracking-widest truncate">
                  {track?.album ?? "—"}
                </p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest truncate">
                  {track?.artist ?? ""}
                </p>
              </div>
            </div>

            {/* Centre controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
                className={cn("text-white/40 hover:text-white h-8 w-8", isShuffle && "text-yellow-300")}
              >
                <Shuffle className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="text-white/70 hover:text-white h-8 w-8"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:text-yellow-300 h-10 w-10 border border-white/10 rounded-full"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="text-white/70 hover:text-white h-8 w-8"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
                className={cn("text-white/40 hover:text-white h-8 w-8", isRepeat && "text-yellow-300")}
              >
                <Repeat className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Right — time + volume + close */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className="text-white/30 text-[10px] tabular-nums hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white/40 hover:text-white h-7 w-7">
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </Button>
              <div className="w-20 hidden sm:block">
                <Slider value={isMuted ? 0 : volume * 100} onChange={handleVolumeChange} />
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white/30 hover:text-white h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayer;
