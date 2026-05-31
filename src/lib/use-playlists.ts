"use client";

import { useState, useEffect, useCallback } from "react";
import { ALL_TRACKS, PLAYLISTS, type Playlist, type Track } from "./data";

// ── Types ──────────────────────────────────────────────────────────────────
export interface UserPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}

type UserStore = Record<string, UserPlaylist>;

// ── Module-level cache so all hook instances share state ───────────────────
let _store: UserStore | null = null;
let _listeners: Array<(s: UserStore) => void> = [];
let _fetching = false;

function notify(s: UserStore) {
  _store = { ...s };
  _listeners.forEach(fn => fn(_store!));
}

async function fetchStore(): Promise<UserStore> {
  if (_store) return _store;
  if (_fetching) {
    return new Promise(resolve => {
      const unsub = () => { _listeners = _listeners.filter(f => f !== unsub); resolve(_store!); };
      _listeners.push(unsub);
    });
  }
  _fetching = true;
  try {
    const r = await fetch("/api/playlists");
    const raw: UserStore = r.ok ? await r.json() : {};
    // Only keep user-created playlists (id starts with "pl_")
    // This filters out any old built-in playlist IDs stored in Redis
    const data: UserStore = Object.fromEntries(
      Object.entries(raw).filter(([id]) => id.startsWith("pl_"))
    );
    _store = data;
    _fetching = false;
    return data;
  } catch {
    _fetching = false;
    _store = {};
    return {};
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function idsToTracks(ids: string[]): Track[] {
  return ids.map(id => ALL_TRACKS.find(t => t.id === id)).filter(Boolean) as Track[];
}

function userToPlaylist(u: UserPlaylist): Playlist {
  return {
    id: u.id,
    name: u.name,
    coverUrl: idsToTracks(u.trackIds)[0]?.coverUrl ??
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    tracks: idsToTracks(u.trackIds),
  };
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function usePlaylists() {
  const [store, setStore] = useState<UserStore>(_store ?? {});
  const [loading, setLoading] = useState(!_store);

  useEffect(() => {
    const fn = (s: UserStore) => setStore({ ...s });
    _listeners.push(fn);
    if (!_store) {
      fetchStore().then(s => { setStore(s); setLoading(false); });
    } else {
      setLoading(false);
    }
    return () => { _listeners = _listeners.filter(f => f !== fn); };
  }, []);

  // Merge built-in Coldplay playlist + user playlists
  const playlists: Playlist[] = [
    ...PLAYLISTS,
    ...Object.values(store).map(userToPlaylist),
  ];

  // ── Create playlist ──────────────────────────────────────────────────────
  const createPlaylist = useCallback(async (name: string): Promise<string | null> => {
    const r = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!r.ok) return null;
    const created: UserPlaylist = await r.json();
    const next = { ...(_store ?? {}), [created.id]: created };
    notify(next);
    return created.id;
  }, []);

  // ── Rename playlist ──────────────────────────────────────────────────────
  const renamePlaylist = useCallback(async (playlistId: string, name: string) => {
    const s = _store ?? {};
    if (!s[playlistId]) return;
    // Optimistic
    const next = { ...s, [playlistId]: { ...s[playlistId], name } };
    notify(next);
    await fetch(`/api/playlists/${playlistId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  }, []);

  // ── Delete playlist ──────────────────────────────────────────────────────
  const deletePlaylist = useCallback(async (playlistId: string) => {
    const s = { ...(_store ?? {}) };
    if (!s[playlistId]) return;
    delete s[playlistId];
    notify(s);
    await fetch(`/api/playlists/${playlistId}`, { method: "DELETE" });
  }, []);

  // ── Toggle track ─────────────────────────────────────────────────────────
  const toggleTrack = useCallback(async (playlistId: string, trackId: string) => {
    const s = _store ?? {};
    if (!s[playlistId]) return;
    const ids = s[playlistId].trackIds;
    const newIds = ids.includes(trackId)
      ? ids.filter(id => id !== trackId)
      : [...ids, trackId];
    // Optimistic
    const next = { ...s, [playlistId]: { ...s[playlistId], trackIds: newIds } };
    notify(next);
    await fetch(`/api/playlists/${playlistId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackIds: newIds }),
    });
  }, []);

  return { playlists, loading, createPlaylist, renamePlaylist, deletePlaylist, toggleTrack };
}
