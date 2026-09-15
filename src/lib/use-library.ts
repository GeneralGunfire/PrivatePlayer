"use client";

import { useEffect, useMemo, useState } from "react";
import { ensureLibraryLoaded, onLibraryLoaded, type Track } from "./data";
import { useUploadedTracks } from "./use-uploaded-tracks";

/**
 * Reactive view of the live-scanned library (see data.ts / /library.json),
 * merged with any locally-uploaded tracks (see use-uploaded-tracks.ts).
 * Merged here rather than per-page so every consumer — Home, Search, the
 * DJ board's deck pickers, playlists — sees uploaded tracks automatically
 * with no separate wiring.
 *
 * Components that need to re-render once the async scan resolves use this;
 * code that only needs a synchronous snapshot after the app has already
 * loaded (TrackMenu, use-playlists' idsToTracks) can keep reading the
 * module-level ALL_TRACKS export directly, same as before — that snapshot
 * intentionally does NOT include uploads, since it's a fire-and-forget
 * lookup path with no reactive merge step; those call sites only need
 * tracks that are already playing/queued, which uploaded tracks reach via
 * their own selectTrack() call, same as any other track.
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
  const uploaded = useUploadedTracks();

  useEffect(() => {
    ensureLibraryLoaded();
    return onLibraryLoaded((next) => {
      setTracks(next);
      setLoading(false);
    });
  }, []);

  const merged = useMemo(() => [...uploaded.tracks, ...tracks], [uploaded.tracks, tracks]);

  return { tracks: merged, loading: loading || uploaded.loading };
}
