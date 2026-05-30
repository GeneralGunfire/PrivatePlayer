"use client";

import { motion } from "framer-motion";
import { Grid2X2, Filter } from "lucide-react";
import { PLAYLISTS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";

export default function Library() {
  const { selectTrack, openPlayer } = usePlayer();

  return (
    <div className="pb-32 pt-8 px-6 space-y-8 max-w-2xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold uppercase italic tracking-tighter text-center">Your Library</h1>
      </header>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold uppercase tracking-tight">Your Playlists</h3>
          <div className="flex items-center gap-4 text-white/40">
            <Filter size={18} />
            <Grid2X2 size={18} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {PLAYLISTS.map(playlist => (
            <motion.div
              key={playlist.id}
              whileHover={{ y: -5 }}
              onClick={() => {
                if (playlist.tracks[0]) { selectTrack(playlist.tracks[0], playlist.tracks); openPlayer(); }
              }}
              className="space-y-4 cursor-pointer group"
            >
              <div className="aspect-square rounded-3xl overflow-hidden glass relative border-white/10 group-hover:border-white/30 transition-all duration-500">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-1">
                <h4 className="font-bold text-sm tracking-tight uppercase mb-1 truncate">{playlist.name}</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                  {playlist.tracks.length} tracks
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
