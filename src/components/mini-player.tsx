"use client";

import Link from "next/link";
import { Play, Pause, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { motion } from "framer-motion";

export default function MiniPlayer() {
  const { activeTrack, playing, toggle, next, queue, index } = usePlayer();
  if (!activeTrack) return null;

  const upNext = queue[index + 1] ?? null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden mx-3 mb-1 rounded-2xl overflow-hidden"
      style={{ background: "rgba(30,30,40,0.96)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Progress hairline */}
      <ProgressLine />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Art */}
        <Link href="/now-playing" className="shrink-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
            {activeTrack.image && (
              <img src={activeTrack.image} alt={activeTrack.album} className="w-full h-full object-cover" />
            )}
          </div>
        </Link>

        {/* Info */}
        <Link href="/now-playing" className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white truncate leading-tight">{activeTrack.album}</p>
          <p className="text-[11px] text-white/50 truncate mt-0.5">{activeTrack.artist}</p>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
          >
            {playing
              ? <Pause className="w-4 h-4 text-black fill-black" />
              : <Play  className="w-4 h-4 text-black fill-black translate-x-px" />
            }
          </button>
          <button onClick={next} className="w-9 h-9 flex items-center justify-center text-white/60 active:scale-95 transition-transform">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Up next pill */}
        {upNext && (
          <div className="hidden sm:flex items-center gap-2 bg-white/8 rounded-xl px-3 py-1.5 shrink-0">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Up next</span>
            <div className="w-6 h-6 rounded overflow-hidden bg-white/10 shrink-0">
              {upNext.image && <img src={upNext.image} alt={upNext.album} className="w-full h-full object-cover" />}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProgressLine() {
  const { progress } = usePlayer();
  return (
    <div className="h-0.5 bg-white/10 w-full">
      <div className="h-full bg-white/60 transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
  );
}
