"use client";

import Link from "next/link";
import { Play, Pause, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { motion } from "framer-motion";

export default function MiniPlayer() {
  const { activeTrack, playing, toggle, next, progress } = usePlayer();
  if (!activeTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden mx-3 mb-2 overflow-hidden rounded-2xl"
      style={{
        background: "rgba(22,28,48,0.97)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(30px)",
      }}
    >
      {/* Thin progress hairline at top */}
      <div className="h-0.5 bg-white/10 w-full">
        <div className="h-full bg-white/60 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Art — tap to open Now Playing */}
        <Link href="/now-playing" className="shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
            {activeTrack.image && (
              <img src={activeTrack.image} alt={activeTrack.album} className="w-full h-full object-cover" />
            )}
          </div>
        </Link>

        {/* Track info */}
        <Link href="/now-playing" className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white truncate">{activeTrack.album}</p>
          <p className="text-[11px] text-white/45 truncate mt-0.5">{activeTrack.artist}</p>
        </Link>

        {/* Play/pause */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 active:scale-90 transition-transform"
        >
          {playing
            ? <Pause className="w-4 h-4 text-black fill-black" />
            : <Play  className="w-4 h-4 text-black fill-black translate-x-px" />
          }
        </button>

        {/* Skip */}
        <button
          onClick={next}
          className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white shrink-0 active:scale-90 transition-all"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
