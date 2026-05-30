"use client";

import Link from "next/link";
import { usePlaylists } from "@/lib/use-playlists";

export default function Library() {
  const { playlists } = usePlaylists();

  return (
    <div className="pb-32 pt-8 px-6 space-y-8 max-w-2xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold uppercase italic tracking-tighter">Your Library</h1>
        <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mt-2">
          {playlists.length} playlists
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {playlists.map(playlist => (
          <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="group block">
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/8 group-hover:border-white/25 transition-colors mb-3">
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <h4 className="font-bold text-sm tracking-tight uppercase truncate">{playlist.name}</h4>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-0.5">
              {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
