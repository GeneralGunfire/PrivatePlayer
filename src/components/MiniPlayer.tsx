"use client";

import { motion } from "framer-motion";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { usePlayer } from "@/lib/player-context";

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, next, prev, openPlayer, progress } = usePlayer();
  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-lg"
      style={{ zIndex: 55 }}
    >
      <div
        onClick={openPlayer}
        className="glass p-2 pl-3 pr-4 flex items-center gap-4 rounded-3xl cursor-pointer hover:bg-white/10 transition-all active:scale-[0.98]"
      >
        {/* Art */}
        <div className="w-12 h-12 bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold truncate tracking-tight">{currentTrack.title}</h4>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold truncate">
            {currentTrack.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={prev} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <SkipBack size={18} fill="currentColor" className="opacity-40" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying
              ? <Pause size={18} fill="currentColor" />
              : <Play  size={18} fill="currentColor" className="ml-0.5" />
            }
          </button>
          <button onClick={next} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <SkipForward size={18} fill="currentColor" className="opacity-40" />
          </button>
        </div>
      </div>

      {/* Progress hairline at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 rounded-b-2xl overflow-hidden">
        <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}
