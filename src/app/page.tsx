"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { PLAYLISTS, getPlaylistTracks } from "@/lib/playlists";
import { usePlayer } from "@/lib/player-context";

export default function Home() {
  const { play, toggle, playing, activeTrack } = usePlayer();

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="px-4 md:px-8 pt-8 pb-32 md:pb-10 max-w-5xl mx-auto">

      <h1 className="text-2xl md:text-3xl font-black text-white mb-6">{greet()}</h1>

      {/* Quick-access grid — top 4 playlists */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-10">
        {PLAYLISTS.slice(0, 6).map(pl => {
          const tracks = getPlaylistTracks(pl);
          const isActive = tracks.some(t => t.id === activeTrack?.id);

          return (
            <Link
              key={pl.id}
              href={`/playlist/${pl.id}`}
              className="group flex items-center gap-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors overflow-hidden pr-3"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 overflow-hidden">
                <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-[13px] md:text-sm text-white truncate flex-1">{pl.name}</span>
              <button
                onClick={e => {
                  e.preventDefault();
                  if (!tracks.length) return;
                  isActive ? toggle() : play(tracks[0], tracks);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 shrink-0"
              >
                {isActive && playing
                  ? <span className="w-3 h-3 border-l-2 border-r-2 border-black" />
                  : <Play className="w-4 h-4 text-black fill-black translate-x-[1px]" />
                }
              </button>
            </Link>
          );
        })}
      </div>

      {/* All playlists */}
      <h2 className="text-lg font-bold text-white mb-4">Your playlists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {PLAYLISTS.map(pl => {
          const tracks = getPlaylistTracks(pl);
          const isActive = tracks.some(t => t.id === activeTrack?.id);

          return (
            <Link
              key={pl.id}
              href={`/playlist/${pl.id}`}
              className="group relative rounded-lg overflow-hidden bg-white/[0.04] hover:bg-white/[0.08] transition-colors p-4 flex flex-col gap-3"
            >
              {/* Cover */}
              <div className="aspect-square w-full rounded-md overflow-hidden shadow-xl relative">
                <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `linear-gradient(135deg, ${pl.color}66, transparent)` }}
                />
                {/* Hover play */}
                <button
                  onClick={e => {
                    e.preventDefault();
                    if (!tracks.length) return;
                    isActive ? toggle() : play(tracks[0], tracks);
                  }}
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1ed760] flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isActive && playing
                    ? <span className="w-3 h-3 border-l-2 border-r-2 border-black" />
                    : <Play className="w-4 h-4 text-black fill-black translate-x-[1px]" />
                  }
                </button>
              </div>

              <div>
                <p className="font-semibold text-[13px] text-white truncate">{pl.name}</p>
                <p className="text-[11px] text-white/45 truncate mt-0.5 leading-snug">{pl.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
