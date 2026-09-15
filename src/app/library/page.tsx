"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, Loader2, Upload, Trash2, Music } from "lucide-react";
import { usePlaylists } from "@/lib/use-playlists";
import { usePlayer } from "@/lib/player-context";
import { useUploadedTracks } from "@/lib/use-uploaded-tracks";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function Library() {
  const { playlists, createPlaylist } = usePlaylists();
  const { tracks: uploadedTracks, uploading, upload, remove } = useUploadedTracks();
  const { selectTrack, openPlayer } = usePlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await createPlaylist(name.trim());
    setName("");
    setCreating(false);
    setSaving(false);
  };

  return (
    <div className="pb-52 pt-8 px-6 max-w-2xl mx-auto">
      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]">Library</h1>
          <p className="text-white/40 text-sm mt-1">
            {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }} transition={TAP}
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-black text-[13px] font-medium"
        >
          <Plus size={15} strokeWidth={2.5} />
          New
        </motion.button>
      </header>

      {/* Upload — stored in IndexedDB (see uploaded-tracks.ts), works
          fully offline once cached, appears in Home/Search/DJ picker
          automatically since useLibrary() merges these in. */}
      <section className="mb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,.mp3"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) upload(e.target.files); e.target.value = ""; }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/6 hover:bg-white/9 transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 size={18} className="animate-spin text-white/60" /> : <Upload size={18} className="text-white/60" />}
          <span className="text-[15px] font-medium">{uploading ? "Uploading…" : "Upload MP3s"}</span>
        </button>

        {uploadedTracks.length > 0 && (
          <div className="mt-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 mb-2">
              Uploaded · {uploadedTracks.length}
            </h2>
            <div>
              {uploadedTracks.map((track) => (
                <div
                  key={track.id}
                  className="track-row group -mx-3 px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/4 transition-colors"
                >
                  <button
                    onClick={() => { selectTrack(track, uploadedTracks); openPlayer(); }}
                    className="flex-1 min-w-0 flex items-center gap-3 text-left"
                  >
                    <Music size={16} className="text-white/30 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-[15px] truncate">{track.title}</p>
                      <p className="text-[13px] text-white/40 truncate">{track.artist}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => remove(track.id)}
                    aria-label="Remove upload"
                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-white/25 hover:text-white/70 hover:bg-white/8 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="bg-white/6 rounded-xl p-4 space-y-3 mb-8"
          >
            <p className="text-[13px] text-white/50">Playlist name</p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false); }}
              placeholder="My Playlist"
              className="w-full bg-white/8 rounded-lg px-4 py-3 text-[15px] placeholder:text-white/25 focus:outline-none transition-colors"
            />
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }} transition={TAP}
                onClick={handleCreate}
                disabled={!name.trim() || saving}
                className="flex-1 py-2.5 rounded-lg bg-white text-black text-[13px] font-medium disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : "Create"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }} transition={TAP}
                onClick={() => { setCreating(false); setName(""); }}
                className="px-5 py-2.5 rounded-lg bg-white/8 text-[13px] text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist grid — cover art hidden on mobile per direction; the
          list falls back to a plain row of name + count on small screens
          rather than an empty tile. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-x-5 sm:gap-y-7">
        {playlists.map(playlist => (
          <motion.div key={playlist.id} whileTap={{ scale: 0.98 }} transition={TAP}>
            <Link href={`/playlist/${playlist.id}`} className="flex sm:block items-center gap-3 group -mx-3 sm:mx-0 px-3 sm:px-0 py-2.5 sm:py-0 rounded-lg hover:bg-white/4 sm:hover:bg-transparent transition-colors">
              <div className="hidden sm:block aspect-square rounded-lg overflow-hidden mb-3 relative">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" decoding="async"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-[15px] truncate">{playlist.name}</h4>
                <p className="text-[13px] text-white/40 mt-0.5">
                  {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {playlists.length === 0 && !creating && (
        <div className="flex flex-col items-center py-16 text-center gap-2">
          <p className="text-white/50 text-sm">No playlists yet</p>
          <p className="text-white/30 text-[13px]">Tap New to create your first playlist</p>
        </div>
      )}
    </div>
  );
}
