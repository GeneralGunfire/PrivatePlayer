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

/**
 * No built-in/featured playlists (the old "Featured Coldplay" auto-playlist
 * was removed per explicit request) — every playlist a user sees is one
 * they created themselves. Kept as a function (not a plain []) so callers
 * that expect this shape keep working if a real built-in playlist is ever
 * reintroduced.
 */
export function builtInPlaylists(): Playlist[] {
  return [];
}
