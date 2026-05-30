"use client";

import Link from "next/link";
import { Bell, Play, Pause, Search } from "lucide-react";
import { PLAYLISTS, ALL_TRACKS, getPlaylistTracks } from "@/lib/playlists";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";

/* ── EQ bars ── */
function EqBars() {
  return (
    <span className="flex items-end gap-[2px] w-3.5 h-3.5">
      <span className="flex-1 rounded-[1px] bg-white origin-bottom" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
      <span className="flex-1 rounded-[1px] bg-white origin-bottom" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
      <span className="flex-1 rounded-[1px] bg-white origin-bottom" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
    </span>
  );
}

/* ── Recently Played card — image 2 top section ── */
function PlaylistCard({ playlist }: { playlist: typeof PLAYLISTS[0] }) {
  const { play, toggle, playing, activeTrack } = usePlayer();
  const tracks = getPlaylistTracks(playlist);
  const isActive = tracks.some(t => t.id === activeTrack?.id);

  return (
    <Link href={`/playlist/${playlist.id}`} className="shrink-0 flex flex-col gap-2 w-[120px]">
      <div className="w-[120px] h-[120px] rounded-xl overflow-hidden bg-white/5 relative">
        <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
      </div>
      <p className="text-[13px] font-medium text-white/80 truncate">{playlist.name}</p>
    </Link>
  );
}

/* ── Recommend row — image 2 bottom section ── */
function RecommendRow({ track, index }: { track: typeof ALL_TRACKS[0]; index: number }) {
  const { play, toggle, playing, activeTrack } = usePlayer();
  const isActive = activeTrack?.id === track.id;
  const isPlaying = isActive && playing;

  return (
    <button
      onClick={() => isActive ? toggle() : play(track, ALL_TRACKS)}
      className="flex items-center gap-3 w-full text-left py-2 hover:bg-white/5 rounded-xl px-2 -mx-2 transition-colors group"
    >
      {/* Art */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/5 shrink-0">
        {track.image && <img src={track.image} alt={track.album} className="w-full h-full object-cover" />}
        {isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <EqBars />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-[14px] font-bold truncate leading-tight", isActive ? "text-[#6c8fff]" : "text-white")}>
          {track.album}
        </p>
        <p className="text-[12px] text-white/45 truncate mt-0.5">{track.artist}</p>
        {/* Stream count — image 2 style */}
        <p className="text-[11px] text-white/25 mt-1">
          {((index + 1) * 37 + 14).toString()}k / streams
        </p>
      </div>

      {/* Chevron */}
      <div className={cn("text-white/20 group-hover:text-white/50 transition-colors shrink-0", isActive && "text-[#6c8fff]")}>
        <Play className={cn("w-4 h-4", isPlaying ? "hidden" : "fill-current")} />
      </div>
    </button>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#080c14]">
      <div className="flex-1 px-5 pt-12 pb-4 max-w-lg mx-auto w-full">

        {/* ── Header — image 2: avatar + name + bell ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6c8fff] to-[#3d5afe] flex items-center justify-center shrink-0">
              <span className="text-[14px] font-black text-white">P</span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">PrivatePlayer</p>
              <p className="text-[11px] text-white/40">Personal collection</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* ── Big title + search — image 2 ── */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <h1 className="text-[28px] font-black text-white leading-tight max-w-[200px]">
            Listen The Latest Music
          </h1>
          <Link
            href="/browse"
            className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0 mt-1"
          >
            <Search className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Recently Played — horizontal scroll ── */}
        <section className="mb-7">
          <h2 className="text-[15px] font-bold text-white mb-4">Recently Played</h2>
          <div className="flex gap-4 overflow-x-auto -mx-5 px-5 pb-2">
            {PLAYLISTS.map(pl => <PlaylistCard key={pl.id} playlist={pl} />)}
          </div>
        </section>

        {/* ── Recommend for you — vertical list ── */}
        <section>
          <h2 className="text-[15px] font-bold text-white mb-4">Recommend for you</h2>
          <div className="space-y-1">
            {ALL_TRACKS.map((track, i) => (
              <RecommendRow key={track.id} track={track} index={i} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
