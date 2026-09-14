"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Shuffle, ListMusic, Pencil, Trash2, Check, X } from "lucide-react";
import { builtInPlaylists } from "@/lib/data";
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

  const isBuiltIn = builtInPlaylists().some(p => p.id === id);
  if (!playlist && !isBuiltIn) notFound();
  if (!playlist) notFound();

  const { currentTrack, isPlaying, selectTrack, togglePlay, openPlayer, shuffle, toggleShuffle } = usePlayer();
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
    <div className="pb-52 max-w-2xl mx-auto">

      {/* Header — cover art anchors the identity on desktop, name carries
          it alone on mobile. The playlist name is the real title of this
          page, so it gets the same weight Home/Search/Library's page
          titles get, not a smaller "content label" treatment. */}
      <div className="pt-10 pb-8 px-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="hidden sm:block w-32 h-32 rounded-xl overflow-hidden shrink-0">
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" loading="eager" decoding="async" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 mb-2">Playlist</p>

            {renaming ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
                  className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-2xl font-semibold tracking-[-0.01em] text-white focus:outline-none"
                />
                <motion.button whileTap={{ scale: 0.9 }} transition={TAP} onClick={handleRename} className="p-2 rounded-lg bg-white text-black"><Check size={16} /></motion.button>
                <motion.button whileTap={{ scale: 0.9 }} transition={TAP} onClick={() => setRenaming(false)} className="p-2 rounded-lg bg-white/10 text-white/60"><X size={16} /></motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-[32px] font-semibold tracking-[-0.01em] text-white leading-none truncate">
                  {playlist.name}
                </h1>
                {isUserPlaylist && (
                  <motion.button whileTap={{ scale: 0.9 }} transition={TAP} onClick={() => { setNewName(playlist.name); setRenaming(true); }} className="p-1.5 text-white/30 hover:text-white/70 transition-colors shrink-0">
                    <Pencil size={14} />
                  </motion.button>
                )}
              </div>
            )}

            <p className="text-white/40 text-sm">
              {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
            </p>

            <div className="flex items-center gap-3 mt-5">
              <motion.button
                whileTap={{ scale: 0.9 }} transition={TAP}
                onClick={handlePlay}
                disabled={playlist.tracks.length === 0}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-30"
              >
                {isPlaylistPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }} transition={TAP}
                onClick={toggleShuffle}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  shuffle ? "text-white bg-white/12" : "text-white/40 hover:text-white/70 hover:bg-white/6"
                )}
              >
                <Shuffle size={17} />
              </motion.button>

              {isUserPlaylist && (
                <motion.button
                  whileTap={{ scale: 0.9 }} transition={TAP}
                  onClick={handleDelete}
                  className="ml-auto w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="px-4">
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center gap-3">
            <ListMusic className="w-8 h-8 text-white/20" />
            <p className="text-white/50 text-sm">No tracks yet</p>
            <p className="text-white/30 text-[13px]">Tap ··· on any song to add it here</p>
          </div>
        ) : (
          <>
            {items.map((track, i) => {
              const isActive = currentTrack?.id === track.id;
              const playing  = isActive && isPlaying;
              return (
                <motion.div
                  key={track.id}
                  whileTap={{ scale: 0.99 }} transition={TAP}
                  className={cn(
                    "track-row grid grid-cols-[24px_1fr_auto] sm:grid-cols-[24px_44px_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150",
                    isActive ? "bg-white/6" : "hover:bg-white/4"
                  )}
                  onClick={() => { selectTrack(track, playlist.tracks); openPlayer(); }}
                >
                  <div className="flex items-center justify-center h-4">
                    {playing ? (
                      <span className="flex items-end gap-px h-3.5 w-3.5">
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq1 0.8s ease-in-out infinite" }} />
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq2 0.8s ease-in-out 0.15s infinite" }} />
                        <span className="flex-1 rounded-sm bg-white" style={{ animation: "eq3 0.8s ease-in-out 0.07s infinite" }} />
                      </span>
                    ) : (
                      <span className={cn("text-[13px] font-mono tabular-nums", isActive ? "text-white" : "text-white/30")}>{i + 1}</span>
                    )}
                  </div>
                  <div className="hidden sm:block w-11 h-11 rounded-md overflow-hidden bg-white/5 shrink-0">
                    {track.coverUrl
                      ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      : <div className="w-full h-full flex items-center justify-center"><ListMusic className="w-5 h-5 text-white/15" /></div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-[15px] font-medium truncate", isActive ? "text-white" : "text-white/90")}>{track.title}</p>
                    <p className="text-[13px] text-white/40 truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-mono text-white/30 tabular-nums">{track.duration}</span>
                    <TrackMenu trackId={track.id} currentPlaylistId={id} />
                  </div>
                </motion.div>
              );
            })}

            {hasMore && (
              <motion.button
                whileTap={{ scale: 0.98 }} transition={TAP}
                onClick={loadMore}
                className="w-full mt-2 py-3 text-[13px] text-white/40 hover:text-white transition-colors"
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
