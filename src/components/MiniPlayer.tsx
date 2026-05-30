"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { usePlayer } from "@/lib/player-context";

const SPRING = { type: "spring" as const, damping: 40, stiffness: 460, mass: 0.5 };
const TAP    = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function MiniPlayer() {
  const { currentTrack, isPlaying, isLoading, togglePlay, next, prev, openPlayer, progress } = usePlayer();
  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 110, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 110, opacity: 0 }}
      transition={SPRING}
      style={{ willChange: "transform, opacity", zIndex: 55, bottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}
      className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-lg"
    >
      <div
        onClick={openPlayer}
        className="relative glass rounded-3xl cursor-pointer overflow-hidden"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Active state flash on press */}
        <motion.div
          className="absolute inset-0 bg-white/5 pointer-events-none"
          initial={false}
          whileTap={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.2 }}
        />

        {/* Progress hairline */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/6">
          <div
            className="h-full bg-white/55 origin-left"
            style={{
              width: "100%",
              transform: `scaleX(${progress / 100})`,
              transition: "transform 0.3s linear",
            }}
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Spinning disc art */}
          <div className="relative w-11 h-11 shrink-0">
            <div
              className="w-full h-full"
              style={{
                animation: "spin-disc 20s linear infinite",
                animationPlayState: isPlaying && !isLoading ? "running" : "paused",
                willChange: "transform",
              }}
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover rounded-full border border-white/10"
                loading="eager" decoding="async"
              />
            </div>
            {/* Spindle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-black/70 border border-white/25" />
            </div>
            {/* Loading ring */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white/70"
                  style={{ animation: "spin-disc 0.8s linear infinite" }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold truncate tracking-tight leading-tight">{currentTrack.title}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/35 font-bold truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
            <motion.button
              whileTap={{ scale: 0.78 }} transition={TAP}
              onClick={prev}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/35 hover:text-white/70 hover:bg-white/8 transition-colors"
            >
              <SkipBack size={16} fill="currentColor" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }} transition={TAP}
              onClick={togglePlay}
              style={{ willChange: "transform" }}
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_14px_rgba(255,255,255,0.18)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.div key="load"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-end gap-0.5 h-4"
                  >
                    {[0, 0.12, 0.06].map((d, i) => (
                      <span key={i} className="w-0.5 bg-black/50 rounded-full"
                        style={{ animation: `eq${i + 1} 0.6s ease-in-out ${d}s infinite` }} />
                    ))}
                  </motion.div>
                ) : isPlaying ? (
                  <motion.div key="pause"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Pause size={16} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div key="play"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.78 }} transition={TAP}
              onClick={next}
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/35 hover:text-white/70 hover:bg-white/8 transition-colors"
            >
              <SkipForward size={16} fill="currentColor" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
