"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { usePlayer } from "@/lib/player-context";

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, next, prev, openPlayer, progress } = usePlayer();
  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 120, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 120, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-lg"
      style={{ zIndex: 55 }}
    >
      <div
        onClick={openPlayer}
        className="relative glass rounded-3xl cursor-pointer overflow-hidden active:scale-[0.97] transition-transform duration-100"
      >
        {/* Progress hairline — top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/6 overflow-hidden rounded-t-3xl">
          <motion.div
            className="h-full bg-white/60 origin-left rounded-full"
            style={{ scaleX: progress / 100 }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </div>

        <div className="flex items-center gap-3 p-2.5 pr-3">
          {/* Rotating art */}
          <div className="relative w-12 h-12 shrink-0">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
              className="w-full h-full"
            >
              <motion.img
                key={currentTrack.id}
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover rounded-full border border-white/10 shadow-lg"
              />
            </motion.div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-black/70 border border-white/20" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <motion.h4
              key={currentTrack.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-bold truncate tracking-tight"
            >
              {currentTrack.title}
            </motion.h4>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={prev}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipBack size={17} fill="currentColor" className="opacity-40" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={togglePlay}
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Pause size={17} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Play size={17} fill="currentColor" className="ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={next}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipForward size={17} fill="currentColor" className="opacity-40" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
