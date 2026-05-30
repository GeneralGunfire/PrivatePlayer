"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";
import TrackMenu from "@/components/TrackMenu";

function fmt(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

// ── Scrubber ──────────────────────────────────────────────
function Scrubber({
  progress,
  currentTime,
  duration,
  onSeek,
}: {
  progress: number;
  currentTime: number;
  duration: string;
  onSeek: (pct: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoverPct, setHoverPct] = useState(0);
  const [localPct, setLocalPct] = useState<number | null>(null);

  // parse duration string "m:ss" → seconds
  const totalSec = (() => {
    const parts = duration.split(":").map(Number);
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  })();

  const displayPct = localPct ?? progress;

  const getPct = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const { left, width } = trackRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - left) / width)) * 100;
  }, []);

  // mouse
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    setLocalPct(getPct(e.clientX));
  }, [dragging, getPct]);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const pct = getPct(e.clientX);
    setLocalPct(null);
    setDragging(false);
    onSeek(pct);
  }, [dragging, getPct, onSeek]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  // touch
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    setLocalPct(getPct(e.touches[0].clientX));
  }, [dragging, getPct]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!dragging) return;
    const pct = getPct(e.changedTouches[0].clientX);
    setLocalPct(null);
    setDragging(false);
    onSeek(pct);
  }, [dragging, getPct, onSeek]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, onTouchMove, onTouchEnd]);

  const hoverSec = (hoverPct / 100) * totalSec;

  return (
    <div className="space-y-2 select-none">
      {/* track */}
      <div
        ref={trackRef}
        className="relative h-10 flex items-center cursor-pointer group/scrub"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); }}
        onMouseMove={e => setHoverPct(getPct(e.clientX))}
        onMouseDown={e => {
          e.preventDefault();
          setDragging(true);
          setLocalPct(getPct(e.clientX));
        }}
        onTouchStart={e => {
          setDragging(true);
          setLocalPct(getPct(e.touches[0].clientX));
        }}
        onClick={e => {
          if (!dragging) onSeek(getPct(e.clientX));
        }}
      >
        {/* rail */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-white/10 overflow-hidden">
          {/* buffered visual (static decoration) */}
          <div className="absolute inset-0 bg-white/5" />
          {/* filled */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-white rounded-full origin-left"
            style={{ width: `${displayPct}%` }}
            transition={{ duration: dragging ? 0 : 0.08, ease: "linear" }}
          />
        </div>

        {/* hover time tooltip */}
        <AnimatePresence>
          {(hovered || dragging) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.12 }}
              className="absolute -top-8 px-2 py-1 bg-white/15 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-white pointer-events-none"
              style={{ left: `${hoverPct}%`, transform: "translateX(-50%)" }}
            >
              {fmt(hoverSec)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${displayPct}%` }}
          animate={{
            width: dragging ? 20 : hovered ? 16 : 12,
            height: dragging ? 20 : hovered ? 16 : 12,
            x: dragging ? -10 : hovered ? -8 : -6,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div
            className={cn(
              "w-full h-full rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-opacity",
              dragging || hovered ? "opacity-100" : "opacity-0 group-hover/scrub:opacity-100"
            )}
          />
        </motion.div>
      </div>

      {/* times */}
      <div className="flex justify-between text-[10px] font-mono font-bold tracking-[0.15em] text-white/35 uppercase px-0.5">
        <span>{fmt(currentTime)}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}

// ── Main PlayerView ───────────────────────────────────────
export default function PlayerView() {
  const {
    currentTrack, isPlaying, togglePlay, next, prev, closePlayer,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    progress, seek, currentTime,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 32, stiffness: 280, mass: 0.9 }}
      className="fixed inset-0 z-[100] flex flex-col px-6 pt-10 pb-10 overflow-hidden"
    >
      {/* Dynamic blurred background from album art */}
      <div className="absolute inset-0 -z-10">
        <motion.img
          key={currentTrack.id}
          src={currentTrack.coverUrl}
          alt=""
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full object-cover"
          style={{ filter: "blur(60px) saturate(1.4) brightness(0.35)" }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={closePlayer}
          className="p-3 bg-white/8 hover:bg-white/14 rounded-xl border border-white/10 transition-colors"
        >
          <ChevronDown size={20} />
        </motion.button>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black mb-0.5">Now Playing</p>
          <h2 className="text-xs font-bold tracking-tight uppercase text-white/70">{currentTrack.album}</h2>
        </div>
        <div className="p-1">
          <TrackMenu trackId={currentTrack.id} />
        </div>
      </div>

      {/* Artwork */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="relative">
          {/* Outer glow rings */}
          <motion.div
            animate={{ opacity: isPlaying ? [0.15, 0.35, 0.15] : 0.08 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-24px] rounded-full border border-white/20"
          />
          <motion.div
            animate={{ opacity: isPlaying ? [0.06, 0.18, 0.06] : 0.04 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute inset-[-44px] rounded-full border border-white/10"
          />

          {/* Rotating disc — CSS animation so it pauses in-place instead of snapping to 0 */}
          <div
            className="w-64 h-64 md:w-72 md:h-72 relative z-10"
            style={{
              animation: "spin-disc 28s linear infinite",
              animationPlayState: isPlaying ? "running" : "paused",
            }}
          >
            {/* disc shadow */}
            <div className="absolute inset-0 rounded-full shadow-[0_20px_80px_rgba(0,0,0,0.6)]" />
            <div className="w-full h-full p-1.5 bg-white/8 rounded-full border border-white/15">
              <motion.img
                key={currentTrack.id}
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/60 border border-white/20 z-20" />
          </div>
        </div>

        {/* Title & artist */}
        <motion.div
          key={currentTrack.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-10 text-center px-4"
        >
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 leading-none line-clamp-2">
            {currentTrack.title}
          </h1>
          <p className="text-sm text-white/45 font-bold uppercase tracking-[0.2em]">
            {currentTrack.artist}
          </p>
        </motion.div>
      </div>

      {/* Controls card */}
      <div className="relative space-y-6 bg-white/6 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] mt-6">
        {/* Scrubber */}
        <Scrubber
          progress={progress}
          currentTime={currentTime}
          duration={currentTrack.duration}
          onSeek={seek}
        />

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleShuffle}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              shuffle
                ? "text-white bg-white/12 border border-white/20"
                : "text-white/30 hover:text-white/60 hover:bg-white/6"
            )}
          >
            <Shuffle size={18} />
          </motion.button>

          <div className="flex items-center gap-5">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={prev}
              className="p-3 text-white/60 hover:text-white hover:bg-white/8 rounded-full transition-all"
            >
              <SkipBack size={26} fill="currentColor" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-[72px] h-[72px] bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-shadow"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Pause size={30} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Play size={30} fill="currentColor" className="ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={next}
              className="p-3 text-white/60 hover:text-white hover:bg-white/8 rounded-full transition-all"
            >
              <SkipForward size={26} fill="currentColor" />
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleRepeat}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              repeat
                ? "text-white bg-white/12 border border-white/20"
                : "text-white/30 hover:text-white/60 hover:bg-white/6"
            )}
          >
            <Repeat size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
