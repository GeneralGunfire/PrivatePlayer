"use client";

import { useEffect, useState } from "react";
import { ensureLibraryLoaded, onLibraryLoaded, type Track } from "./data";

/**
 * Reactive view of the live-scanned library (see data.ts / /api/library).
 * Components that need to re-render once the async scan resolves use this;
 * code that only needs a synchronous snapshot after the app has already
 * loaded (TrackMenu, use-playlists' idsToTracks) can keep reading the
 * module-level ALL_TRACKS export directly, same as before.
 *
 * Always starts empty on the FIRST render, full stop — never seeded from
 * the live ALL_TRACKS module value. That module-level array is fetched
 * eagerly (data.ts kicks off the request the instant it's imported
 * client-side), and on a fast local network that fetch can resolve before
 * React's hydration pass for a given component even runs. Seeding this
 * hook's initial useState from ALL_TRACKS meant this component's very
 * first client render could already have 191 real tracks while the
 * server-rendered HTML it's hydrating against has zero (SSR always sees
 * an empty library, since it never runs client-side fetches) — a genuine
 * hydration mismatch, not a false positive. Only ever applying real data
 * from the onLibraryLoaded effect (which by definition runs after mount,
 * post-hydration) removes that race entirely.
 */
export function useLibrary(): { tracks: Track[]; loading: boolean } {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureLibraryLoaded();
    return onLibraryLoaded((next) => {
      setTracks(next);
      setLoading(false);
    });
  }, []);

  return { tracks, loading };
}
