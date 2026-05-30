"use client";

import Link from "next/link";
import { Play, Pause, Search } from "lucide-react";
import { PLAYLISTS, ALL_TRACKS, getPlaylistTracks } from "@/lib/playlists";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* ── Horizontal playlist card ── */
function PlaylistCard({ playlist }: { playlist: typeof PLAYLISTS[0] }) {
  const { play, toggle, playing, activeTrack } = usePlayer();
  const tracks = getPlaylistTracks(playlist);
  const isActive = tracks.some(t => t.id === activeTrack?.id);

  return (
    <Link href={`/playlist/${playlist.id}`} className="shrink-0 flex flex-col gap-2 w-32 group">
      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white/5">
        <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {/* Colour tint */}
        <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${playlist.color}99, transparent)` }} />
        {/* Play button on hover */}
        <button
          onClick={e => {
            e.preventDefault();
            if (!tracks.length) return;
            isActive ? toggle() : play(tracks[0], tracks);
          }}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isActive && playing
            ? <Pause className="w-4 h-4 text-black fill-black" />
            : <Play  className="w-4 h-4 text-black fill-black translate-x-px" />
          }
        </button>
      </div>
      <p className="text-[13px] font-medium text-white truncate">{playlist.name}</p>
    </Link>
  );
}

/* ── Recommended track row ── */
function TrackRow({ track, rank }: { track: typeof ALL_TRACKS[0]; rank: number }) {
  const { play, toggle, playing, activeTrack, queue } = usePlayer();
  const isActive = activeTrack?.id === track.id;

  return (
    <button
      onClick={() => isActive ? toggle() : play(track, ALL_TRACKS)}
      className="flex items-center gap-4 w-full text-left py-2.5 px-1 rounded-xl hover:bg-white/5 active:bg-white/8 transition-colors group"
    >
      {/* Art */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0">
        {track.image && <img src={track.image} alt={track.album} className="w-full h-full object-cover" />}
        {isActive && playing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <EqBars />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-[14px] font-semibold truncate", isActive ? "text-[#a78bfa]" : "text-white")}>{track.album}</p>
        <p className="text-[12px] text-white/45 truncate mt-0.5">{track.artist}</p>
      </div>

      {/* Play icon on hover */}
      <div className={cn("shrink-0 transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
        {isActive && playing
          ? <Pause className="w-4 h-4 text-white/60" />
          : <Play  className="w-4 h-4 text-white/60" />
        }
      </div>
    </button>
  );
}

function EqBars() {
  return (
    <span className="flex items-end gap-[2px] h-4 w-4">
      {[
        { anim: "eq1 0.8s ease-in-out infinite" },
        { anim: "eq2 0.8s ease-in-out 0.15s infinite" },
        { anim: "eq3 0.8s ease-in-out 0.07s infinite" },
      ].map((s, i) => (
        <span key={i} className="flex-1 rounded-sm bg-white origin-bottom" style={{ animation: s.anim }} />
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <div className="px-5 pt-8 pb-6 max-w-xl mx-auto md:max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[13px] text-white/40 mb-0.5">Welcome back</p>
          <h1 className="text-[26px] font-black text-white leading-tight">{greet()}</h1>
        </div>
        <Link href="/browse" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/12 transition-colors mt-1">
          <Search className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Recently played / playlists horizontal scroll ── */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[17px] font-bold text-white">Your Playlists</h2>
          <Link href="/browse" className="text-[12px] text-white/35 hover:text-white/70 transition-colors">See all</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5">
          {PLAYLISTS.map(pl => <PlaylistCard key={pl.id} playlist={pl} />)}
        </div>
      </section>

      {/* ── Recommended / all tracks ── */}
      <section>
        <h2 className="text-[17px] font-bold text-white mb-4">All Tracks</h2>
        <div className="space-y-1">
          {ALL_TRACKS.map((track, i) => (
            <TrackRow key={track.id} track={track} rank={i + 1} />
          ))}
        </div>
      </section>

    </div>
  );
}
