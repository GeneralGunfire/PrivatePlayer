"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePlaylists } from "@/lib/use-playlists";
import { Play } from "lucide-react";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function Library() {
  const { playlists } = usePlaylists();

  return (
    <div className="pb-52 pt-8 px-6 space-y-8 max-w-2xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold uppercase italic tracking-tighter">Your Library</h1>
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">
          {playlists.length} playlists
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {playlists.map(playlist => (
          <motion.div key={playlist.id} whileTap={{ scale: 0.95 }} transition={TAP}>
            <Link href={`/playlist/${playlist.id}`} className="block group">
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/8 group-hover:border-white/20 transition-all duration-300 mb-3 relative">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  loading="lazy" decoding="async"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center shadow-xl">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-sm tracking-tight uppercase truncate">{playlist.name}</h4>
              <p className="text-[10px] text-white/28 font-bold uppercase tracking-[0.2em] mt-0.5">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
