import { NextResponse } from "next/server";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { parseFile } from "music-metadata";

/**
 * Live library scan — reads real ID3/Vorbis/etc. tags out of every audio
 * file in public/music/ via music-metadata, the same job Udaan's Rust
 * backend does with `lofty` in audio_library/mod.rs (see its own
 * `read_track_tags`). Replaces the old hand-maintained `data.ts` array
 * (parsed out of YouTube-style filenames, and already drifted — 199
 * hardcoded entries against 191 real files on disk) with the actual
 * folder contents, so this site always shows the same songs Udaan does
 * without a second catalog to keep in sync by hand.
 *
 * Cached in-memory per server process (a library scan of ~200 files reading
 * real tag data isn't free) and invalidated only by restart — matches
 * Udaan's own "rescan on demand" model rather than re-reading tags on
 * every request.
 */

const MUSIC_DIR = path.join(process.cwd(), "public", "music");
const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"]);

/**
 * Most files here are YouTube downloads with no real ID3 tags — parseFile
 * then falls back to the raw filename as the title, which is unreadable
 * ("Adele - Hello (Official Music Video)" as one field). This derives a
 * clean Artist/Title split from that same YouTube-style filename pattern
 * when real tags are missing, rather than either showing the raw filename
 * or maintaining a second hand-typed catalog that can drift from the real
 * folder (which is the exact problem the live scan itself replaced).
 */
function parseFromFilename(fileName: string): { title: string; artist: string | null } {
  let name = path.basename(fileName, path.extname(fileName));

  // Strip trailing bracketed/parenthesized YouTube noise: (Official Video),
  // (Official Music Video), (Audio), [4K], (Lyrics), (HD), etc. — repeated,
  // since some files stack more than one, e.g. "...(Official Video) [HD]".
  const noisePattern = /\s*[([][^()[\]]*(?:official|video|audio|lyric|hd|4k|remaster|visualizer|hq)[^()[\]]*[)\]]\s*$/i;
  while (noisePattern.test(name)) {
    name = name.replace(noisePattern, "").trim();
  }
  // Same noise words again, but as a bare trailing "- Official Audio" /
  // "- Official Video" suffix with no brackets at all — a second, distinct
  // pattern this folder's filenames also use.
  const bareNoisePattern = /\s*[-–]\s*official\s+(?:video|audio|music\s+video|lyric\s+video)\s*$/i;
  while (bareNoisePattern.test(name)) {
    name = name.replace(bareNoisePattern, "").trim();
  }

  // "Artist - Title" is the dominant pattern in this folder — split on the
  // first " - " (a plain hyphen surrounded by spaces, not a word-internal
  // hyphen like "Non-Blondes" or an em/en dash used mid-title).
  const dashMatch = name.match(/^(.+?)\s[-–]\s(.+)$/);
  if (dashMatch) {
    return { artist: dashMatch[1].trim(), title: dashMatch[2].trim() };
  }
  return { artist: null, title: name.trim() || fileName };
}

export interface LibraryTrack {
  id: string;
  fileName: string;
  title: string;
  artist: string;
  album: string;
  durationSeconds: number | null;
  hasCoverArt: boolean;
  src: string;
}

let cache: LibraryTrack[] | null = null;
let cachePromise: Promise<LibraryTrack[]> | null = null;

async function scanLibrary(): Promise<LibraryTrack[]> {
  const entries = await readdir(MUSIC_DIR);
  const files = entries.filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()));

  const tracks = await Promise.all(
    files.map(async (fileName): Promise<LibraryTrack> => {
      const fullPath = path.join(MUSIC_DIR, fileName);
      const fallbackTitle = path.basename(fileName, path.extname(fileName));
      // Stable id derived from the filename (not an array index) so a
      // track's id survives new songs being added to the folder — an
      // index-based id would silently reassign every id after it whenever
      // one file is added/removed, breaking favorites/playlists/queue
      // position, all of which key off this id.
      const id = Buffer.from(fileName).toString("base64url");

      const parsed = parseFromFilename(fileName);

      try {
        const meta = await parseFile(fullPath, { duration: true, skipCovers: true });
        const common = meta.common;
        return {
          id,
          fileName,
          title: common.title?.trim() || parsed.title || fallbackTitle,
          artist: common.artist?.trim() || common.artists?.[0]?.trim() || parsed.artist || "Unknown Artist",
          album: common.album?.trim() || "Unknown Album",
          durationSeconds: meta.format.duration ?? null,
          hasCoverArt: (common.picture?.length ?? 0) > 0,
          src: `/music/${encodeURIComponent(fileName)}`,
        };
      } catch {
        // Unreadable tags (corrupt file, unsupported codec) — still list
        // it rather than silently dropping a real file from the library.
        return {
          id,
          fileName,
          title: parsed.title || fallbackTitle,
          artist: parsed.artist || "Unknown Artist",
          album: "Unknown Album",
          durationSeconds: null,
          hasCoverArt: false,
          src: `/music/${encodeURIComponent(fileName)}`,
        };
      }
    }),
  );

  tracks.sort((a, b) => a.title.localeCompare(b.title));
  return tracks;
}

async function getLibrary(): Promise<LibraryTrack[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = scanLibrary()
    .then((tracks) => {
      cache = tracks;
      cachePromise = null;
      return tracks;
    })
    .catch((err) => {
      cachePromise = null;
      throw err;
    });
  return cachePromise;
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Confirm the folder actually exists before scanning — a missing
    // public/music/ should read as "empty library", not a 500.
    await stat(MUSIC_DIR);
    const tracks = await getLibrary();
    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] });
  }
}
