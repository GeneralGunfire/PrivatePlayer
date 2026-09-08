"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "pp.favorites";

// Module-level cache so every hook instance shares one source of truth —
// same sharing pattern use-playlists.ts uses for its Redis-backed store,
// just backed by localStorage here since favorites are a personal,
// per-device toggle with no reason to round-trip to the server.
let _ids: Set<string> | null = null;
let _listeners: Array<(ids: Set<string>) => void> = [];

function load(): Set<string> {
  if (_ids) return _ids;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    _ids = new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    _ids = new Set();
  }
  return _ids;
}

function persist(ids: Set<string>) {
  _ids = ids;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Storage full/unavailable — favorites just won't survive a reload.
  }
  _listeners.forEach((fn) => fn(ids));
}

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(() => load());

  useEffect(() => {
    const fn = (next: Set<string>) => setIds(new Set(next));
    _listeners.push(fn);
    return () => {
      _listeners = _listeners.filter((f) => f !== fn);
    };
  }, []);

  const isFavorite = useCallback((trackId: string) => ids.has(trackId), [ids]);

  const toggleFavorite = useCallback((trackId: string) => {
    const next = new Set(load());
    if (next.has(trackId)) next.delete(trackId);
    else next.add(trackId);
    persist(next);
  }, []);

  return { favoriteIds: ids, isFavorite, toggleFavorite };
}
