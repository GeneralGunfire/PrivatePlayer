export interface Track { id: string; title: string; artist: string; album: string; coverUrl: string; duration: string; src: string; }
export interface Playlist { id: string; name: string; description?: string; coverUrl: string; tracks: Track[]; }

/**
 * Library — sourced live from /api/library, which reads real ID3/Vorbis/etc.
 * tags out of public/music/ via music-metadata (see that route's own doc
 * comment). Replaces a hand-maintained 199-entry array that had already
 * drifted from the 191 real files on disk, and existed only because nothing
 * read real tag data — the exact gap Udaan's own Rust backend (`lofty`)
 * already closed on the desktop side. "Same songs as Udaan" means the same
 * source of truth: the folder's real tags, not a second hand-typed catalog.
 *
 * Eager-fetched once at module load (same pattern use-music-files.ts used
 * for its file list) and cached, so every page that reads ALL_TRACKS after
 * the first load gets it synchronously with zero loading flash — matching
 * "should play instantly" — while the very first paint of the app still
 * needs one real network round trip to populate it.
 */

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
    const res = await fetch("/api/library");
    const json = await res.json();
    const raw: {
      id: string; title: string; artist: string; album: string;
      durationSeconds: number | null; src: string;
    }[] = json.tracks ?? [];
    return raw.map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      duration: formatDuration(t.durationSeconds),
      src: t.src,
      // No real cover art endpoint on this site yet (Udaan's has
      // audio_library_read_cover for embedded pictures) — a stable
      // placeholder rather than none, same look every load.
      coverUrl: FALLBACK_COVER,
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
 * "Featured Coldplay" — resolved by artist match against whatever the real
 * library actually contains, rather than a hardcoded list of numeric track
 * ids (which broke the moment ids became filename-derived, and would have
 * silently pointed at the wrong tracks if left in place). Empty until the
 * library has loaded; recomputed each time PLAYLISTS is read.
 */
export function builtInPlaylists(): Playlist[] {
  const coldplayTracks = ALL_TRACKS.filter((t) => t.artist.toLowerCase().includes("coldplay"));
  if (coldplayTracks.length === 0) return [];
  return [
    {
      id: "coldplay",
      name: "Coldplay",
      description: "Every Coldplay track in the collection",
      coverUrl: coldplayTracks[0]?.coverUrl ?? FALLBACK_COVER,
      tracks: coldplayTracks,
    },
  ];
}
