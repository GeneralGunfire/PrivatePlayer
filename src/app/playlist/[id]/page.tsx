"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Shuffle, Clock3, ListMusic, Pencil, Trash2, Check, X } from "lucide-react";
import { PLAYLISTS } from "@/lib/data";
import { usePlayer } from "@/lib/player-context";
import { usePlaylists } from "@/lib/use-playlists";
import { usePaged } from "@/lib/use-paged";
import TrackMenu from "@/components/TrackMenu";
import { cn } from "@/lib/utils";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { playlists, renamePlaylist, deletePlaylist } = usePlaylists();
  const playlist = playlists.find(p => p.id === id);

  // Only 404 for non-Coldplay built-in playlists that don't exist
  const isBuiltIn = PLAYLISTS.some(p => p.id === id);
  if (!playlist && !isBuiltIn) notFound();
  if (!playlist) notFound();

  const { currentTrack, isPlaying, selectTrack, togglePlay, openPlayer, shuffle, toggleShuffle } = usePlayer();
  const [hovered, setHovered] = useState(-1);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(playlist.name);
  const { items, hasMore, remaining, loadMore } = usePaged(playlist.tracks);

  const isUserPlaylist = id.startsWith("pl_");
  const isPlaylistPlaying = playlist.tracks.some(t => t.id === currentTrack?.id) && isPlaying;

  const handlePlay = () => {
    if (!playlist.tracks.length) return;
    const first = playlist.tracks[0];
    currentTrack?.id === first.id ? togglePlay() : (selectTrack(first, playlist.tracks), openPlayer());
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === playlist.name) { setRenaming(false); return; }
    await renamePlaylist(id, newName.trim());
    setRenaming(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${playlist.name}"?`)) return;
    await deletePlaylist(id);
    router.push("/library");
  };

  return (
    <div className="pb-52 pt-0 max-w-2xl mx-auto">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl mb-6">
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${playlist.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) brightness(0.28) saturate(1.6)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-black" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5 px-6 pt-16 pb-6">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" loading="eager" decoding="async" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 mb-2 font-bold">Playlist</p>

            {/* Name — editable for user playlists */}
            {renaming ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
                  className="flex-1 bg-white/10 border border-white/25 rounded-xl px-3 py-1.5 text-xl font-black uppercase italic tracking-tighter text-white focus:outline-none focus:border-white/40"
                />
                <motion.button whileTap={{ scale: 0.88 }} transition={TAP} onClick={handleRename} className="p-2 rounded-xl bg-white text-black"><Check size={16} /></motion.button>
                <motion.button whileTap={{ scale: 0.88 }} transition={TAP} onClick={() => setRenaming(false)} className="p-2 rounded-xl bg-white/10 text-white/60"><X size={16} /></motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none truncate">
                  {playlist.name}
                </h1>
                {isUserPlaylist && (
                  <motion.button whileTap={{ scale: 0.88 }} transition={TAP} onClick={() => { setNewName(playlist.name); setRenaming(true); }} className="p-1.5 text-white/30 hover:text-white/70 transition-colors shrink-0">
                    <Pencil size={14} />
                  </motion.button>
                )}
              </div>
            )}

            <p className="text-[11px] text-white/22 font-bold uppercase tracking-widest">
              {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-6 mb-6">
        <motion.button
          whileTap={{ scale: 0.88 }} transition={TAP}
          onClick={handlePlay}
          disabled={playlist.tracks.length === 0}
          style={{ willChange: "transform" }}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.18)] hover:shadow-[0_0_45px_rgba(255,255,255,0.28)] transition-shadow disabled:opacity-30"
        >
          {isPlaylistPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }} transition={TAP}
          onClick={toggleShuffle}
          className={cn("w-11 h-11 rounded-full flex items-center justify-center border transition-all",
            shuffle ? "text-white bg-white/12 border-white/22" : "text-white/35 border-white/10 hover:text-white/60 hover:bg-white/6"
          )}
        >
          <Shuffle size={18} />
        </motion.button>

        {isUserPlaylist && (
          <motion.button
            whileTap={{ scale: 0.88 }} transition={TAP}
            onClick={handleDelete}
            className="ml-auto w-11 h-11 rounded-full flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 border border-white/8 hover:border-red-400/20 transition-all"
          >
            <Trash2 size={16} />
          </motion.button>
        )}
      </div>

      {/* Track list */}
      <div className="px-4">
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-white/15" />
            </div>
            <p className="text-white/25 text-sm font-bold uppercase tracking-widest">No tracks yet</p>
            <p className="text-white/15 text-xs">Tap ··· on any song to add it here</p>
          </div>
        ) : (
          <>
            <div className="grid items-center gap-3 px-3 pb-2 mb-1 border-b border-white/6" style={{ gridTemplateColumns: "24px 48px 1fr auto" }}>
              <span className="text-[10px] text-white/20 font-bold text-center">#</span>
              <span />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/20 font-bold">Title</span>
              <Clock3 className="w-3 h-3 text-white/20" />
            </div>

            {items.map((track, i) => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.985 }} transition={TAP}
                  className={cn(
                    "track-row grid items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 border border-transparent",
                    hovered === i || isActive ? "bg-white/8 border-white/10" : "hover:bg-white/5 active:bg-white/10"
                  )}
                  style={{ gridTemplateColumns: "24px 48px 1fr auto" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(-1)}
                  onClick={() => { selectTrack(track, playlist.tracks); openPlayer(); }}
                >
                  <div className="flex items-center justify-center h-4">
                    {hovered === i ? (
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                    ) : playing ? (
                      <span className="flex items-end gap-px h-3.5 w-3.5">
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                      </span>
                    ) : (
                      <span className={cn("text-[11px] font-mono font-bold", isActive ? "text-white" : "text-white/25")}>{i + 1}</span>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                    {track.coverUrl
                      ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      : <div className="w-full h-full flex items-center justify-center"><ListMusic className="w-5 h-5 text-white/15" /></div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-bold truncate uppercase tracking-tight", isActive ? "text-white" : "text-white/85")}>{track.title}</p>
                    <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest truncate mt-0.5">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-white/25 tracking-widest">{track.duration}</span>
                    <TrackMenu trackId={track.id} currentPlaylistId={id} />
                  </div>
                </motion.div>
              );
            })}

            {hasMore && (
              <motion.button
                whileTap={{ scale: 0.97 }} transition={TAP}
                onClick={loadMore}
                className="w-full mt-3 py-3.5 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 active:bg-white/12 transition-colors text-[11px] font-bold uppercase tracking-widest text-white/45 hover:text-white/75"
              >
                Show {Math.min(remaining, 10)} more &middot; {remaining} remaining
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
