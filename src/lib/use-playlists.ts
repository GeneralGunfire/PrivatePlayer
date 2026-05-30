"use client";

import { useState, useEffect, useCallback } from "react";
import { ALL_TRACKS, PLAYLISTS, type Playlist, type Track } from "./data";

export type PlaylistOverrides = Record<string, string[]>;

/** Merge default playlists with server-persisted overrides */
function applyOverrides(overrides: PlaylistOverrides): Playlist[] {
  return PLAYLISTS.map(pl => {
    if (overrides[pl.id] === undefined) return pl;
    const ids = overrides[pl.id];
    const tracks = ids
      .map(id => ALL_TRACKS.find(t => t.id === id))
      .filter(Boolean) as Track[];
    return { ...pl, tracks };
  });
}

/** Get the current effective track IDs for a playlist (default or overridden) */
function currentIds(overrides: PlaylistOverrides, playlistId: string): string[] {
  if (overrides[playlistId] !== undefined) return overrides[playlistId];
  const pl = PLAYLISTS.find(p => p.id === playlistId);
  return pl ? pl.tracks.map(t => t.id) : [];
}

// Module-level cache shared across all hook instances
let _cache: PlaylistOverrides | null = null;
let _listeners: Array<(o: PlaylistOverrides) => void> = [];

function notify(o: PlaylistOverrides) {
  _cache = o;
  _listeners.forEach(fn => fn({ ...o }));
}

async function fetchOverrides(): Promise<PlaylistOverrides> {
  if (_cache) return _cache;
  const r = await fetch("/api/playlists");
  const data = await r.json();
  _cache = data;
  return data;
}

async function persist(playlistId: string, trackIds: string[]): Promise<boolean> {
  const res = await fetch(`/api/playlists/${playlistId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackIds }),
  });
  return res.ok;
}

export function usePlaylists() {
  const [overrides, setOverrides] = useState<PlaylistOverrides>(_cache ?? {});
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    const fn = (o: PlaylistOverrides) => setOverrides(o);
    _listeners.push(fn);
    if (!_cache) {
      fetchOverrides().then(o => { setOverrides(o); setLoading(false); });
    } else {
      setLoading(false);
    }
    return () => { _listeners = _listeners.filter(f => f !== fn); };
  }, []);

  const playlists = applyOverrides(overrides);

  /** Toggle a track into/out of a playlist and persist immediately */
  const toggleTrack = useCallback(async (playlistId: string, trackId: string) => {
    const ids = currentIds(_cache ?? {}, playlistId);
    const already = ids.includes(trackId);
    const newIds = already ? ids.filter(id => id !== trackId) : [...ids, trackId];
    // Optimistic update
    const next = { ...(_cache ?? {}), [playlistId]: newIds };
    notify(next);
    await persist(playlistId, newIds);
  }, []);

  const addTrack = useCallback(async (playlistId: string, trackId: string) => {
    const ids = currentIds(_cache ?? {}, playlistId);
    if (ids.includes(trackId)) return;
    const newIds = [...ids, trackId];
    const next = { ...(_cache ?? {}), [playlistId]: newIds };
    notify(next);
    await persist(playlistId, newIds);
  }, []);

  const removeTrack = useCallback(async (playlistId: string, trackId: string) => {
    const ids = currentIds(_cache ?? {}, playlistId);
    const newIds = ids.filter(id => id !== trackId);
    const next = { ...(_cache ?? {}), [playlistId]: newIds };
    notify(next);
    await persist(playlistId, newIds);
  }, []);

  return { playlists, loading, toggleTrack, addTrack, removeTrack };
}
