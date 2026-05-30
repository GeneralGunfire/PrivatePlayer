"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal, SkipBack, SkipForward, Play, Pause, Volume2, ListMusic, Shuffle, Repeat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ── Waveform scrubber — dense bars like image 1 ── */
function Waveform() {
  const { progress, seekTo, duration } = usePlayer();
  const BARS = 80;

  // Deterministic natural-looking heights
  const heights = Array.from({ length: BARS }, (_, i) => {
    const a = Math.sin(i * 0.37) * 0.4;
    const b = Math.sin(i * 0.11) * 0.3;
    const c = Math.sin(i * 0.73) * 0.2;
    return 0.1 + Math.abs(a + b + c);
  });
  const max = Math.max(...heights);
  const normalised = heights.map(h => h / max);

  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={e => {
        const r = e.currentTarget.getBoundingClientRect();
        seekTo(((e.clientX - r.left) / r.width) * 100);
      }}
    >
      <div className="flex items-center gap-[2.5px]" style={{ height: 52 }}>
        {normalised.map((h, i) => {
          const pct = (i / BARS) * 100;
          const played = pct <= progress;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors duration-150"
              style={{
                height: `${Math.max(h * 100, 12)}%`,
                background: played
                  ? "rgba(255,255,255,0.92)"
                  : "rgba(255,255,255,0.18)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Up Next queue panel ── */
function QueuePanel({ onClose }: { onClose: () => void }) {
  const { queue, index, play } = usePlayer();
  const upcoming = queue.slice(index + 1);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 380, damping: 40 }}
      className="absolute inset-x-0 bottom-0 rounded-t-3xl overflow-hidden z-30"
      style={{ background: "rgba(12,16,26,0.98)", border: "1px solid rgba(255,255,255,0.08)", maxHeight: "70vh" }}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/[0.06]">
        <h3 className="text-[15px] font-bold text-white">Up Next</h3>
        <button onClick={onClose} className="text-[13px] text-white/40 hover:text-white">Done</button>
      </div>
      <div className="overflow-y-auto pb-8">
        {upcoming.length === 0 ? (
          <p className="px-6 py-8 text-sm text-white/30 text-center">Queue is empty</p>
        ) : (
          upcoming.map((track, i) => (
            <button
              key={track.id}
              onClick={() => { play(track, queue); onClose(); }}
              className="flex items-center gap-4 w-full px-5 py-3.5 hover:bg-white/5 transition-colors text-left border-b border-white/[0.04]"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 shrink-0">
                {track.image && <img src={track.image} alt={track.album} className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white truncate">{track.album}</p>
                <p className="text-[12px] text-white/45 mt-0.5 truncate">{track.artist}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}

function fmt(s: number) {
  if (!isFinite(s) || !s) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function fmtRemaining(cur: number, dur: number) {
  if (!dur || !isFinite(dur)) return "-0:00";
  const r = dur - cur;
  return `-${Math.floor(r / 60)}:${Math.floor(r % 60).toString().padStart(2, "0")}`;
}

export default function NowPlaying() {
  const router = useRouter();
  const {
    activeTrack, playing, toggle, next, prev,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    currentTime, duration, queue, index,
  } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);

  const upNext = queue[index + 1] ?? null;

  if (!activeTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-[#080c14]">
        <ListMusic className="w-14 h-14 text-white/15 mb-4" />
        <p className="text-white/30 text-sm">Nothing playing</p>
        <button onClick={() => router.back()} className="mt-6 text-[13px] text-white/40 hover:text-white/70">← Go back</button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[100dvh] overflow-hidden">

      {/* ── Ambient background from album art ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeTrack.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Art blurred into full bg */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${activeTrack.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(100px) saturate(2.5) brightness(0.3)",
              transform: "scale(1.5)",
            }}
          />
          {/* Deep dark vignette — makes it feel like image 1 */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)" }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header — exact image 1: ← · Now Playing · ... */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4 shrink-0">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white active:scale-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <span className="text-[15px] font-bold text-white tracking-wide">Now Playing</span>
          <button className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Album art — full width, square, rounded corners — image 1 style */}
        <div className="px-5 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTrack.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full aspect-square rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
            >
              {activeTrack.image
                ? <img src={activeTrack.image} alt={activeTrack.album} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/10 flex items-center justify-center"><ListMusic className="w-20 h-20 text-white/20" /></div>
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Title + artist — left aligned, image 1 */}
        <div className="px-5 mt-5 shrink-0">
          <p className="text-[20px] font-bold text-white leading-tight truncate">{activeTrack.album}</p>
          <p className="text-[14px] text-white/50 mt-1 truncate">{activeTrack.artist}</p>
        </div>

        {/* Waveform — image 1 signature element */}
        <div className="px-5 mt-4 shrink-0">
          <Waveform />
          <div className="flex justify-between mt-2">
            <span className="text-[12px] text-white/50 tabular-nums">{fmt(currentTime)}</span>
            <span className="text-[12px] text-white/50 tabular-nums">{fmtRemaining(currentTime, duration)}</span>
          </div>
        </div>

        {/* Controls — image 1: « ⏸ » large, evenly spaced */}
        <div className="flex items-center justify-between px-8 mt-5 shrink-0">
          <button
            onClick={prev}
            className="text-white active:scale-90 transition-transform"
          >
            <SkipBack className="w-10 h-10 fill-current" />
          </button>

          <button
            onClick={toggle}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
          >
            {playing
              ? <Pause className="w-7 h-7 text-black fill-black" />
              : <Play  className="w-7 h-7 text-black fill-black translate-x-[2px]" />
            }
          </button>

          <button
            onClick={next}
            className="text-white active:scale-90 transition-transform"
          >
            <SkipForward className="w-10 h-10 fill-current" />
          </button>
        </div>

        {/* Shuffle + Repeat row below main controls */}
        <div className="flex items-center justify-between px-10 mt-4 shrink-0">
          <button
            onClick={toggleShuffle}
            className={cn("transition-all active:scale-90", shuffle ? "text-white" : "text-white/30")}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={toggleRepeat}
            className={cn("transition-all active:scale-90", repeat ? "text-white" : "text-white/30")}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom row — image 1 exact: [volume pill] [up-next pill] */}
        <div className="flex items-center justify-between gap-3 px-5 mt-auto mb-8 shrink-0 pb-safe">
          {/* Volume pill */}
          <button
            className="flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Volume2 className="w-5 h-5 text-white" />
          </button>

          {/* Up Next pill */}
          <button
            onClick={() => setShowQueue(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-1"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {upNext ? (
              <>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Up next</p>
                  <p className="text-[13px] font-semibold text-white truncate mt-0.5">{upNext.album}</p>
                </div>
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 shrink-0">
                  {upNext.image && <img src={upNext.image} alt={upNext.album} className="w-full h-full object-cover" />}
                </div>
              </>
            ) : (
              <span className="text-[13px] text-white/30">Queue empty</span>
            )}
          </button>
        </div>

      </div>

      {/* ── Queue overlay ── */}
      <AnimatePresence>
        {showQueue && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/60 z-20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowQueue(false)}
            />
            <QueuePanel onClose={() => setShowQueue(false)} />
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
