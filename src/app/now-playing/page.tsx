"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, MoreHorizontal, Heart, Shuffle, Repeat, SkipBack, SkipForward, Play, Pause, ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ── Waveform scrubber ── */
function Waveform() {
  const { progress, seekTo } = usePlayer();
  const BARS = 60;

  return (
    <div
      className="relative w-full flex items-center gap-[2px] cursor-pointer select-none"
      style={{ height: 48 }}
      onClick={e => {
        const r = e.currentTarget.getBoundingClientRect();
        seekTo(((e.clientX - r.left) / r.width) * 100);
      }}
    >
      {Array.from({ length: BARS }).map((_, i) => {
        const pct = (i / BARS) * 100;
        const past = pct <= progress;
        // Create a natural-looking waveform shape
        const height = 20 + Math.abs(Math.sin(i * 0.4) * 22 + Math.sin(i * 0.13) * 16 + Math.sin(i * 0.07) * 10);
        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-150"
            style={{
              height: `${Math.min(height, 48)}px`,
              background: past ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.18)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Up Next list ── */
function UpNextPanel({ onClose }: { onClose: () => void }) {
  const { queue, index, play } = usePlayer();
  const upcoming = queue.slice(index + 1, index + 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 400, damping: 38 }}
      className="absolute inset-x-0 bottom-0 rounded-t-3xl overflow-hidden"
      style={{ background: "rgba(18,18,28,0.97)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <h3 className="text-base font-bold text-white">Up Next</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="px-6 pb-8 text-sm text-white/30">No more tracks in queue</p>
      ) : (
        <ul className="pb-8">
          {upcoming.map((track, i) => (
            <li
              key={track.id}
              onClick={() => { play(track, queue); onClose(); }}
              className="flex items-center gap-4 px-6 py-3 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 shrink-0">
                {track.image && <img src={track.image} alt={track.album} className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-white truncate">{track.album}</p>
                <p className="text-[12px] text-white/45 truncate mt-0.5">{track.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/* ── Time display ── */
function fmtRemaining(current: number, dur: number) {
  if (!dur || !isFinite(dur)) return "-0:00";
  const rem = dur - current;
  return `-${Math.floor(rem / 60)}:${Math.floor(rem % 60).toString().padStart(2, "0")}`;
}
function fmtCurrent(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

/* ── Main ── */
export default function NowPlaying() {
  const router = useRouter();
  const {
    activeTrack, playing, toggle, next, prev,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    currentTime, duration, queue, index,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [liked, setLiked] = useState(false);

  const upNext = queue[index + 1] ?? null;

  if (!activeTrack) {
    return (
      <div className="flex items-center justify-center h-[100dvh] text-white/30">
        <div className="text-center">
          <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nothing playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[100dvh] overflow-hidden bg-[#0d0d0d]">

      {/* ── Ambient background — blurred album art ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeTrack.id}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 scale-150"
            style={{
              backgroundImage: `url(${activeTrack.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(90px) saturate(1.8) brightness(0.35)",
            }}
          />
          {/* Dark vignette overlay */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)" }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col h-full px-6 pt-safe">

        {/* Header row */}
        <div className="flex items-center justify-between pt-4 pb-2 shrink-0">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors active:scale-90">
            <ChevronDown className="w-6 h-6" />
          </button>
          <span className="text-[13px] font-semibold text-white tracking-wide">Now Playing</span>
          <button className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Album art */}
        <div className="flex-1 flex items-center justify-center py-4 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTrack.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              {activeTrack.image
                ? <img src={activeTrack.image} alt={activeTrack.album} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/10 flex items-center justify-center"><ListMusic className="w-16 h-16 text-white/20" /></div>
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Title + like */}
        <div className="flex items-start justify-between shrink-0 mb-4">
          <div className="min-w-0 flex-1 mr-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTrack.id + "-title"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[22px] font-bold text-white leading-tight truncate"
              >
                {activeTrack.album}
              </motion.p>
            </AnimatePresence>
            <p className="text-[14px] text-white/50 mt-1 truncate">{activeTrack.artist}</p>
          </div>
          <button
            onClick={() => setLiked(l => !l)}
            className={cn("shrink-0 w-9 h-9 flex items-center justify-center transition-all active:scale-90 mt-1", liked ? "text-[#a78bfa]" : "text-white/40 hover:text-white")}
          >
            <Heart className={cn("w-5 h-5", liked && "fill-current")} />
          </button>
        </div>

        {/* Waveform scrubber */}
        <div className="shrink-0 mb-3">
          <Waveform />
          <div className="flex justify-between mt-2">
            <span className="text-[12px] text-white/50 tabular-nums">{fmtCurrent(currentTime)}</span>
            <span className="text-[12px] text-white/50 tabular-nums">{fmtRemaining(currentTime, duration)}</span>
          </div>
        </div>

        {/* Transport */}
        <div className="flex items-center justify-between shrink-0 mb-6">
          <button
            onClick={toggleShuffle}
            className={cn("w-10 h-10 flex items-center justify-center transition-colors active:scale-90", shuffle ? "text-white" : "text-white/30 hover:text-white/60")}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button onClick={prev} className="w-12 h-12 flex items-center justify-center text-white hover:text-white/80 transition-colors active:scale-90">
            <SkipBack className="w-8 h-8 fill-current" />
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

          <button onClick={next} className="w-12 h-12 flex items-center justify-center text-white hover:text-white/80 transition-colors active:scale-90">
            <SkipForward className="w-8 h-8 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={cn("w-10 h-10 flex items-center justify-center transition-colors active:scale-90", repeat ? "text-white" : "text-white/30 hover:text-white/60")}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Up Next pill — image 1 style */}
        <div className="shrink-0 pb-safe mb-2">
          <button
            onClick={() => setShowQueue(true)}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <ListMusic className="w-4 h-4 text-white/40 shrink-0" />
            {upNext ? (
              <>
                <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-white/35 font-semibold">Up next</span>
                  <span className="text-[13px] font-medium text-white/70 truncate w-full mt-0.5">{upNext.album}</span>
                </div>
                <div className="w-8 h-8 rounded-md overflow-hidden bg-white/10 shrink-0">
                  {upNext.image && <img src={upNext.image} alt={upNext.album} className="w-full h-full object-cover" />}
                </div>
              </>
            ) : (
              <span className="text-[13px] text-white/30 flex-1">Queue is empty</span>
            )}
          </button>
        </div>

      </div>

      {/* ── Up Next panel overlay ── */}
      <AnimatePresence>
        {showQueue && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/50 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQueue(false)}
            />
            <div className="absolute inset-x-0 bottom-0 z-30">
              <UpNextPanel onClose={() => setShowQueue(false)} />
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
