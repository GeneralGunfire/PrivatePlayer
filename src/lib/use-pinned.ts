"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "pp.pinned";

// A separate concept from favorites (use-favorites.ts / the heart icon):
// pinning is "always show this at the top of Library regardless of what
// playlist/filter I'm looking at" — explicitly asked for as its own
// section, not folded into the existing Liked Songs mechanism. Same
// module-level-cache + localStorage pattern as favorites since it has the
// same shape of requirement (personal, per-device, no reason to round-trip
// to the server).
let _ids: Set<string> | null = null;
let _listeners: Array<(ids: Set<string>) => void> = [];

// "How Deep Is Your Love" ships pinned by default on a fresh install —
// per explicit request ("add the song ... as a pinned song"). Only ever
// applied once: if the stored set already exists (even if the user later
// unpinned it), that choice is respected rather than silently re-added.
const DEFAULT_PINNED_ID = "SG93IGRlZXAgaXMgeW91ciBsb3ZlLm1wMw"; // How deep is your love.mp3

function load(): Set<string> {
  if (_ids) return _ids;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      _ids = new Set([DEFAULT_PINNED_ID]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([..._ids]));
    } else {
      _ids = new Set(JSON.parse(raw) as string[]);
    }
  } catch {
    _ids = new Set([DEFAULT_PINNED_ID]);
  }
  return _ids;
}

function persist(ids: Set<string>) {
  _ids = ids;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Storage full/unavailable — pins just won't survive a reload.
  }
  _listeners.forEach((fn) => fn(ids));
}

export function usePinned() {
  const [ids, setIds] = useState<Set<string>>(() => load());

  useEffect(() => {
    const fn = (next: Set<string>) => setIds(new Set(next));
    _listeners.push(fn);
    return () => {
      _listeners = _listeners.filter((f) => f !== fn);
    };
  }, []);

  const isPinned = useCallback((trackId: string) => ids.has(trackId), [ids]);

  const togglePinned = useCallback((trackId: string) => {
    const next = new Set(load());
    if (next.has(trackId)) next.delete(trackId);
    else next.add(trackId);
    persist(next);
  }, []);

  return { pinnedIds: ids, isPinned, togglePinned };
}
