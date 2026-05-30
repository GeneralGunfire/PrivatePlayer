"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ALL_TRACKS, PLAYLISTS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";

export default function Home() {
  const { selectTrack, openPlayer, currentTrack, isPlaying } = usePlayer();

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleTrack = (track: typeof ALL_TRACKS[0]) => {
    selectTrack(track, ALL_TRACKS);
    openPlayer();
  };

  return (
    <div className="pb-32 pt-8 px-6 space-y-10 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold uppercase italic tracking-tighter mb-2">{greet()}</h1>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            Ready to dive into your next audio journey?
          </p>
        </div>
      </header>

      {/* Featured Banner */}
      <section className="relative h-64 rounded-3xl overflow-hidden group glass">
        <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
            alt="Featured"
            className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />
        <div className="absolute bottom-8 left-8 z-20">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] mb-4 inline-block font-bold">
            Now Playing
          </span>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">
            Coldplay
          </h1>
          <p className="text-white/60 text-sm font-medium tracking-tight">
            {PLAYLISTS[0].tracks.length} Tracks • British Rock
          </p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-80 h-80 bg-white/10 rounded-full blur-[60px]" />
      </section>

      {/* Quick Queue — playlists horizontal scroll */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold uppercase tracking-tight">Quick Queue</h2>
          <span className="text-[10px] text-white/40 uppercase tracking-widest cursor-pointer hover:text-white transition-colors font-bold">
            View All
          </span>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6">
          {PLAYLISTS.map((playlist, idx) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex-shrink-0 w-48 group cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 glass border-white/10">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => playlist.tracks[0] && handleTrack(playlist.tracks[0])}
                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold tracking-tight truncate uppercase text-sm">{playlist.name}</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 truncate">
                {playlist.tracks.length} tracks
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Played — track list */}
      <section>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Recently Played</h2>
        <div className="space-y-2">
          {ALL_TRACKS.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleTrack(track)}
              className="group p-3 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-2xl flex items-center gap-4 cursor-pointer transition-all"
            >
              <span className="text-[10px] font-mono text-white/30 hidden md:block">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 glass border-white/5">
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate uppercase tracking-tight">{track.title}</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">
                  {track.artist}
                </p>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-white/40 group-hover:text-white transition-colors">
                {track.duration}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
