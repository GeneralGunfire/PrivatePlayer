export interface Track { id: string; title: string; artist: string; album: string; coverUrl: string; duration: string; src: string; }
export interface Playlist { id: string; name: string; description?: string; coverUrl: string; tracks: Track[]; }

/**
 * Library — sourced from /library.json, a static file written at build time
 * by scripts/build-library.mjs (reads real ID3/Vorbis/etc. tags out of
 * public/music/ via music-metadata). Replaces a hand-maintained 199-entry
 * array that had already drifted from the 191 real files on disk, and
 * existed only because nothing read real tag data — the exact gap Udaan's
 * own Rust backend (`lofty`) already closed on the desktop side. "Same
 * songs as Udaan" means the same source of truth: the folder's real tags,
 * not a second hand-typed catalog.
 *
 * This used to be a per-request API route (src/app/api/library/route.ts)
 * that scanned public/music/ on every call. On Vercel, Next.js's file
 * tracer followed those file reads into public/music/ and bundled the
 * entire 1.3GB of mp3s into that route's serverless function, which
 * exceeded Vercel's function size limit and failed the deploy. The music
 * folder's contents are fixed at deploy time anyway (adding a track means
 * a new git push and redeploy), so scanning once at build time and serving
 * the result as a static JSON asset removes the serverless function
 * entirely — same data, no per-request work, no function to bundle mp3s into.
 *
 * Eager-fetched once at module load (same pattern use-music-files.ts used
 * for its file list) and cached, so every page that reads ALL_TRACKS after
 * the first load gets it synchronously with zero loading flash — matching
 * "should play instantly" — while the very first paint of the app still
 * needs one real network round trip to populate it.
 */

// Used only if a track has no cover of its own AND the whole library has
// no cover art to borrow from (an all-untagged library) — should be rare
// in practice since most files here have real embedded art.
const FALLBACK_COVER = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80";

function formatDuration(seconds: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) return "--:--";
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export let ALL_TRACKS: Track[] = [];

let loaded = false;
let loadPromise: Promise<Track[]> | null = null;
let listeners: Array<(tracks: Track[]) => void> = [];

async function fetchLibrary(): Promise<Track[]> {
  try {
    const res = await fetch("/library.json");
    const json = await res.json();
    const raw: {
      id: string; title: string; artist: string; album: string;
      durationSeconds: number | null; src: string; coverUrl: string | null;
    }[] = json.tracks ?? [];
    return raw.map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      duration: formatDuration(t.durationSeconds),
      src: t.src,
      // Real embedded cover art extracted at build time; tracks with none
      // of their own borrow one from another track that has it (matches
      // Udaan's own private-player behavior — see build-library.mjs).
      coverUrl: t.coverUrl ?? FALLBACK_COVER,
    }));
  } catch {
    return [];
  }
}

/** Kicks off the library load once, sharable by every caller. */
export function ensureLibraryLoaded(): Promise<Track[]> {
  if (loaded) return Promise.resolve(ALL_TRACKS);
  if (loadPromise) return loadPromise;
  loadPromise = fetchLibrary().then((tracks) => {
    ALL_TRACKS = tracks;
    loaded = true;
    loadPromise = null;
    listeners.forEach((fn) => fn(tracks));
    listeners = [];
    return tracks;
  });
  return loadPromise;
}

/** Subscribe to the one library-loaded event — used by useLibrary() below. */
export function onLibraryLoaded(fn: (tracks: Track[]) => void): () => void {
  if (loaded) {
    fn(ALL_TRACKS);
    return () => {};
  }
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

export function isLibraryLoaded(): boolean {
  return loaded;
}

// Kick off the fetch immediately at module load (client-side only) — by
// the time the first component mounts and calls useLibrary(), this is
// usually already resolved or close to it.
if (typeof window !== "undefined") {
  ensureLibraryLoaded();
}

// Track IDs are base64url(filename) with padding stripped — see
// scripts/build-library.mjs. Listed by filename in the comment so this
// stays readable/editable without having to decode anything by hand.
const HOUSE_PLAYLIST_TRACK_IDS = [
  "QmV0dGVyIE9mZiBBbG9uZS5tcDM", // Better Off Alone.mp3
  "RG9uZSB0ZWxsIGVtLm1wMw", // Done tell em.mp3
  "RnJlZSBZb3VyIE1pbmQubXAz", // Free Your Mind.mp3
  "SG93IGRlZXAgaXMgeW91ciBsb3ZlLm1wMw", // How deep is your love.mp3
  "S2F2a2F6IC0gU3Rhcmx5Lm1wMw", // Kavkaz - Starly.mp3
  "TWFzc2l2ZSBEcmFrZS5tcDM", // Massive Drake.mp3
  "TXkgRGVzdGlueS5tcDM", // My Destiny.mp3
  "TXkgTG92ZSBSb3V0ZSA5NC5tcDM", // My Love Route 94.mp3
  "U2hvdyBNZSBMb3ZlIFJvYmluIFMubXAz", // Show Me Love Robin S.mp3
  "U3VnYXIgYW5kIEJyb3duaWVzLm1wMw", // Sugar and Brownies.mp3
  "VGhlIGNvbG9yIFZpb2xldCBUb3J5IExhbmV6Lm1wMw", // The color Violet Tory Lanez.mp3
  "V29ybGQsIEhvbGQgb24gQm9iIFNpbmNsYWlyLm1wMw", // World, Hold on Bob Sinclair.mp3
  "Q2FsdmluIEhhcnJpcywgUmloYW5uYSAtIFRoaXMgSXMgV2hhdCBZb3UgQ2FtZSBGb3IgKE9mZmljaWFsIFZpZGVvKS5tcDM", // This Is What You Came For (Calvin Harris, Rihanna)
  "QmVsaWV2ZSBNZSBieSBOYXZvcy5tcDM", // Believe Me by Navos
];

/**
 * One built-in playlist — "House" — baked into the static build rather
 * than a user-created (Redis-backed) one, per explicit request that it
 * "should appear on all devices" and be there "when user is installing
 * app": a built-in playlist ships in the bundle itself (same as the
 * library, see data.ts's own module comment), so it's there offline and
 * on first install with no network round trip or per-device account state
 * required. The old "Featured Coldplay" auto-playlist was removed per an
 * earlier explicit request, but that was about not auto-generating
 * playlists from taste — a real one the user asked for by name is a
 * different thing. User-created playlists (the "pl_" ones from
 * use-playlists.ts) still work exactly as before, layered on top of this.
 */
export function builtInPlaylists(): Playlist[] {
  const tracks = HOUSE_PLAYLIST_TRACK_IDS
    .map((id) => ALL_TRACKS.find((t) => t.id === id))
    .filter((t): t is Track => Boolean(t));

  if (tracks.length === 0) return [];

  return [
    {
      id: "house",
      name: "House",
      coverUrl: tracks[0].coverUrl,
      tracks,
    },
  ];
}
