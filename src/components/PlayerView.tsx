"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";
import TrackMenu from "@/components/TrackMenu";

function fmt(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// ── Scrubber ──────────────────────────────────────────────
function Scrubber({ progress, currentTime, duration, onSeek, disabled }: {
  progress: number; currentTime: number; duration: string;
  onSeek: (pct: number) => void; disabled?: boolean;
}) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const [drag, setDrag]         = useState(false);
  const [hover, setHover]       = useState(false);
  const [hoverPct, setHoverPct] = useState(0);
  const [local, setLocal]       = useState<number | null>(null);

  const totalSec = (() => {
    const p = duration.split(":").map(Number);
    return (p[0] ?? 0) * 60 + (p[1] ?? 0);
  })();

  const pct = local ?? progress;

  const getX = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const { left, width } = trackRef.current.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
  }, []);

  useEffect(() => {
    if (!drag) return;
    const mv = (e: MouseEvent | TouchEvent) => setLocal(getX("touches" in e ? e.touches[0].clientX : e.clientX));
    const up = (e: MouseEvent | TouchEvent) => {
      const x = "changedTouches" in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      setLocal(null); setDrag(false); onSeek(getX(x));
    };
    window.addEventListener("mousemove", mv);   window.addEventListener("mouseup",   up);
    window.addEventListener("touchmove", mv, { passive: true }); window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup",  up);
      window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up);
    };
  }, [drag, getX, onSeek]);

  const thumbSize = drag ? 18 : hover ? 14 : 10;

  return (
    <div className="space-y-1.5 select-none">
      <div
        ref={trackRef}
        className={cn("relative h-10 flex items-center", disabled ? "cursor-default opacity-40" : "cursor-pointer")}
        onMouseEnter={() => !disabled && setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={e => !disabled && setHoverPct(getX(e.clientX))}
        onMouseDown={e => { if (disabled) return; e.preventDefault(); setDrag(true); setLocal(getX(e.clientX)); }}
        onTouchStart={e => { if (disabled) return; setDrag(true); setLocal(getX(e.touches[0].clientX)); }}
      >
        {/* Rail */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-white/12">
          {/* Fill */}
          <div
            className="absolute left-0 top-0 h-full bg-white rounded-full"
            style={{
              width: "100%",
              transform: `scaleX(${pct / 100})`,
              transformOrigin: "left center",
              transition: drag ? "none" : "transform 0.08s linear",
            }}
          />
        </div>

        {/* Thumb */}
        <div
          className="absolute top-1/2 pointer-events-none"
          style={{
            left: `${pct}%`,
            width: thumbSize, height: thumbSize,
            transform: "translate(-50%, -50%)",
            transition: "width 0.12s ease, height 0.12s ease",
          }}
        >
          <div className={cn(
            "w-full h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-opacity duration-150",
            hover || drag ? "opacity-100" : "opacity-0"
          )} />
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {(hover || drag) && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.08 }}
              className="absolute -top-7 px-2 py-0.5 bg-white/15 backdrop-blur-sm rounded-md text-[10px] font-mono font-bold text-white pointer-events-none border border-white/10"
              style={{ left: `${hoverPct}%`, transform: "translateX(-50%)" }}
            >
              {fmt((hoverPct / 100) * totalSec)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest text-white/30 px-0.5">
        <span>{fmt(currentTime)}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}

// ── Loading indicator — three pulsing bars ────────────────
function LoadingBars() {
  return (
    <div className="flex items-end gap-px h-5">
      {[0, 0.15, 0.07].map((delay, i) => (
        <span
          key={i}
          className="w-1 bg-white/70 rounded-full"
          style={{ animation: `eq${i + 1} 0.7s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </div>
  );
}

// ── Control button base ───────────────────────────────────
function CtrlBtn({ onClick, active, children, className }: {
  onClick: () => void; active?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.82 }}
      transition={{ type: "spring", damping: 15, stiffness: 500, mass: 0.4 }}
      className={cn(
        "relative flex items-center justify-center rounded-xl transition-colors duration-150",
        active
          ? "text-white bg-white/14 border border-white/20"
          : "text-white/35 hover:text-white/70 active:text-white",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

// ── PlayerView ────────────────────────────────────────────
const SLIDE = { type: "spring" as const, damping: 40, stiffness: 440, mass: 0.55 };

export default function PlayerView() {
  const {
    currentTrack, isPlaying, isLoading, togglePlay, next, prev, closePlayer,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    progress, seek, currentTime,
  } = usePlayer();

  if (!currentTrack) return null;

  const bgSrc = currentTrack.coverUrl.replace(/\?.*/, "") + "?w=600&q=55&auto=format";
  const discSrc = currentTrack.coverUrl.replace(/\?.*/, "") + "?w=400&q=80&auto=format";

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={SLIDE}
      style={{ willChange: "transform" }}
      className="fixed inset-0 z-[100] flex flex-col px-6 pt-10 pb-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            src={bgSrc}
            alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
            style={{ filter: "blur(48px) saturate(1.2) brightness(0.28)", willChange: "opacity" }}
            loading="eager" decoding="async"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <motion.button
          onClick={closePlayer}
          whileTap={{ scale: 0.86 }}
          transition={{ type: "spring", damping: 15, stiffness: 500, mass: 0.4 }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 active:bg-white/20 transition-colors"
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </motion.button>

        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.45em] text-white/25 font-black mb-0.5">Now Playing</p>
          <p className="text-[11px] font-bold tracking-tight uppercase text-white/55 truncate max-w-[200px]">
            {currentTrack.album}
          </p>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          <TrackMenu trackId={currentTrack.id} />
        </div>
      </div>

      {/* Artwork + title */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="relative">
          {/* Ambient glow — opacity only, GPU layer */}
          <motion.div
            animate={{ opacity: isPlaying ? [0.1, 0.28, 0.1] : 0.06 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "opacity" }}
            className="absolute inset-[-20px] rounded-full bg-white/10 blur-xl pointer-events-none"
          />

          {/* Disc */}
          <div
            className="w-60 h-60 md:w-68 md:h-68 relative z-10 rounded-full"
            style={{
              animation: "spin-disc 26s linear infinite",
              animationPlayState: isPlaying && !isLoading ? "running" : "paused",
              willChange: "transform",
            }}
          >
            <div className="absolute inset-0 rounded-full shadow-[0_16px_60px_rgba(0,0,0,0.8)]" />
            <div className="w-full h-full p-1.5 bg-white/6 rounded-full border border-white/12">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentTrack.id}
                  src={discSrc}
                  alt={currentTrack.title}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover rounded-full"
                  loading="eager" decoding="async"
                />
              </AnimatePresence>
            </div>
            {/* Center spindle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-black/80 border border-white/20 z-20" />
          </div>

          {/* Loading overlay — only visible while buffering */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 rounded-full bg-black/55 flex items-center justify-center z-30"
              >
                <LoadingBars />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Track info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-8 text-center px-4 w-full"
            style={{ willChange: "transform, opacity" }}
          >
            <h1 className="text-3xl md:text-[2rem] font-black uppercase italic tracking-tighter leading-none mb-2 truncate">
              {currentTrack.title}
            </h1>
            <p className="text-xs text-white/40 font-bold uppercase tracking-[0.25em]">
              {currentTrack.artist}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="space-y-4 bg-white/5 border border-white/8 p-5 rounded-[1.75rem] mt-6 shrink-0 backdrop-blur-xl">
        <Scrubber
          progress={progress}
          currentTime={currentTime}
          duration={currentTrack.duration}
          onSeek={seek}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <CtrlBtn onClick={toggleShuffle} active={shuffle} className="w-9 h-9">
            <Shuffle size={17} />
          </CtrlBtn>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={prev}
              whileTap={{ scale: 0.84 }}
              transition={{ type: "spring", damping: 15, stiffness: 500, mass: 0.4 }}
              className="w-11 h-11 flex items-center justify-center text-white/55 hover:text-white rounded-full hover:bg-white/8 transition-colors active:text-white"
            >
              <SkipBack size={24} fill="currentColor" />
            </motion.button>

            {/* Play / Pause — main button */}
            <motion.button
              onClick={togglePlay}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", damping: 15, stiffness: 500, mass: 0.4 }}
              style={{ willChange: "transform" }}
              className="w-[66px] h-[66px] bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.22)] hover:shadow-[0_0_45px_rgba(255,255,255,0.35)] transition-shadow"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.div key="loading"
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-end gap-[2px] h-5"
                  >
                    {[0, 0.12, 0.06].map((d, i) => (
                      <span key={i} className="w-1 bg-black/60 rounded-full"
                        style={{ animation: `eq${i + 1} 0.6s ease-in-out ${d}s infinite` }} />
                    ))}
                  </motion.div>
                ) : isPlaying ? (
                  <motion.div key="pause"
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Pause size={27} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div key="play"
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Play size={27} fill="currentColor" className="ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={next}
              whileTap={{ scale: 0.84 }}
              transition={{ type: "spring", damping: 15, stiffness: 500, mass: 0.4 }}
              className="w-11 h-11 flex items-center justify-center text-white/55 hover:text-white rounded-full hover:bg-white/8 transition-colors active:text-white"
            >
              <SkipForward size={24} fill="currentColor" />
            </motion.button>
          </div>

          <CtrlBtn onClick={toggleRepeat} active={repeat} className="w-9 h-9">
            <Repeat size={17} />
          </CtrlBtn>
        </div>
      </div>
    </motion.div>
  );
}
