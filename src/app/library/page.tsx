"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, Loader2 } from "lucide-react";
import { usePlaylists } from "@/lib/use-playlists";

const TAP = { type: "spring" as const, damping: 14, stiffness: 500, mass: 0.4 };

export default function Library() {
  const { playlists, createPlaylist } = usePlaylists();
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
    <div className="pb-52 pt-8 px-6 space-y-8 max-w-2xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold uppercase italic tracking-tighter">Your Library</h1>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">
            {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.88 }} transition={TAP}
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={14} strokeWidth={3} />
          New
        </motion.button>
      </header>

      {/* Create playlist modal */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="bg-white/6 border border-white/12 rounded-2xl p-4 space-y-3"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Playlist Name</p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false); }}
              placeholder="My Playlist"
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }} transition={TAP}
                onClick={handleCreate}
                disabled={!name.trim() || saving}
                className="flex-1 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : "Create"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }} transition={TAP}
                onClick={() => { setCreating(false); setName(""); }}
                className="px-5 py-2.5 rounded-xl bg-white/8 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist grid */}
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
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center shadow-xl">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-sm tracking-tight uppercase truncate">{playlist.name}</h4>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-0.5">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {playlists.length === 0 && !creating && (
        <div className="flex flex-col items-center py-16 text-center gap-3">
          <p className="text-white/20 text-sm font-bold uppercase tracking-widest">No playlists yet</p>
          <p className="text-white/12 text-xs">Tap New to create your first playlist</p>
        </div>
      )}
    </div>
  );
}
