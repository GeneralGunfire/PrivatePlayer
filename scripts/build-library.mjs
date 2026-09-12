// Runs at build time (see package.json's "prebuild") to scan public/music/
// once and write the result to public/library.json as a plain static asset.
//
// This replaces the old src/app/api/library/route.ts, which ran the same
// scan per-request inside a serverless function. On Vercel, Next.js's file
// tracer followed readdir()/parseFile() calls into public/music/ and bundled
// the entire 1.3GB of mp3s into that function's deployment package, which
// exceeds Vercel's per-function size limit and fails the deploy outright.
//
// The music folder's contents are fixed at deploy time anyway (adding a
// track means a new git push and redeploy, same as any other static asset),
// so there's no need to scan on every request — scanning once here and
// serving the result as a static file removes the serverless function
// entirely for this data.
import { readdir, stat, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { parseFile } from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MUSIC_DIR = path.join(ROOT, "public", "music");
const COVERS_DIR = path.join(ROOT, "public", "covers");
const OUTPUT_FILE = path.join(ROOT, "public", "library.json");

const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"]);

const MIME_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Matches Udaan's own private-player behavior: tracks that DO have an
 * embedded cover picture show it; tracks that DON'T borrow one at random
 * from another track in the library that has real art (Udaan does this
 * once, permanently, by writing the borrowed picture into the file's own
 * ID3 tag on import — see src-tauri/src/audio_library/mod.rs's
 * find_random_cover). This site can't rewrite users' mp3 files, so the
 * same "borrow a real cover rather than show a generic placeholder" idea
 * is applied here instead: computed once at build time, deterministically
 * per track (hash of the filename) so the same track doesn't visually
 * flicker between different borrowed covers across rebuilds.
 */
function pickRandomCoverIndex(seedKey, poolSize) {
  const hash = createHash("sha1").update(seedKey).digest();
  return hash.readUInt32BE(0) % poolSize;
}

// Checked-in, hand-generated pool (see generate-fallback-covers.mjs) used
// only when a track has no embedded cover of its own AND no other track
// in the library has real art to borrow — true of this whole library
// today, since none of its files carry ID3 pictures.
const FALLBACK_COVER_COUNT = 12;

/**
 * Most files here are YouTube downloads with no real ID3 tags — parseFile
 * then falls back to the raw filename as the title, which is unreadable
 * ("Adele - Hello (Official Music Video)" as one field). This derives a
 * clean Artist/Title split from that same YouTube-style filename pattern
 * when real tags are missing, rather than either showing the raw filename
 * or maintaining a second hand-typed catalog that can drift from the real
 * folder (which is the exact problem the live scan itself replaced).
 */
function parseFromFilename(fileName) {
  let name = path.basename(fileName, path.extname(fileName));

  const noisePattern = /\s*[([][^()[\]]*(?:official|video|audio|lyric|hd|4k|remaster|visualizer|hq)[^()[\]]*[)\]]\s*$/i;
  while (noisePattern.test(name)) {
    name = name.replace(noisePattern, "").trim();
  }
  const bareNoisePattern = /\s*[-–]\s*official\s+(?:video|audio|music\s+video|lyric\s+video)\s*$/i;
  while (bareNoisePattern.test(name)) {
    name = name.replace(bareNoisePattern, "").trim();
  }

  const dashMatch = name.match(/^(.+?)\s[-–]\s(.+)$/);
  if (dashMatch) {
    return { artist: dashMatch[1].trim(), title: dashMatch[2].trim() };
  }
  return { artist: null, title: name.trim() || fileName };
}

async function scanLibrary() {
  const entries = await readdir(MUSIC_DIR);
  const files = entries.filter((f) => AUDIO_EXTENSIONS.has(path.extname(f).toLowerCase()));

  await rm(COVERS_DIR, { recursive: true, force: true });
  await mkdir(COVERS_DIR, { recursive: true });

  const tracks = await Promise.all(
    files.map(async (fileName) => {
      const fullPath = path.join(MUSIC_DIR, fileName);
      const fallbackTitle = path.basename(fileName, path.extname(fileName));
      const id = Buffer.from(fileName).toString("base64url");
      const parsed = parseFromFilename(fileName);

      try {
        const meta = await parseFile(fullPath, { duration: true, skipCovers: false });
        const common = meta.common;
        const picture = common.picture?.[0];
        let ownCoverUrl = null;
        if (picture?.data?.length) {
          const ext = MIME_EXT[picture.format?.toLowerCase()] ?? "jpg";
          const coverFile = `${id}.${ext}`;
          await writeFile(path.join(COVERS_DIR, coverFile), Buffer.from(picture.data));
          ownCoverUrl = `/covers/${coverFile}`;
        }
        return {
          id,
          fileName,
          title: common.title?.trim() || parsed.title || fallbackTitle,
          artist: common.artist?.trim() || common.artists?.[0]?.trim() || parsed.artist || "Unknown Artist",
          // Empty rather than "Unknown Album" — almost none of this
          // library's files carry real album tags (YouTube-audio rips,
          // no ID3 data at all), so that placeholder was showing up on
          // nearly every track across the UI as repetitive noise. An
          // empty string lets each render site simply omit the album
          // when there's nothing real to show, same as `common.album`
          // being absent in the first place.
          album: common.album?.trim() || "",
          durationSeconds: meta.format.duration ?? null,
          ownCoverUrl,
          src: `/music/${encodeURIComponent(fileName)}`,
        };
      } catch {
        return {
          id,
          fileName,
          title: parsed.title || fallbackTitle,
          artist: parsed.artist || "Unknown Artist",
          album: "",
          durationSeconds: null,
          ownCoverUrl: null,
          src: `/music/${encodeURIComponent(fileName)}`,
        };
      }
    }),
  );

  // Second pass — matches Udaan's own private-player behavior: any track
  // with no embedded cover of its own borrows one from a track that does,
  // rather than showing a generic placeholder (see this file's doc comment
  // on pickRandomCoverIndex for why, and Udaan's find_random_cover for the
  // desktop-side equivalent this mirrors).
  const withCovers = tracks.filter((t) => t.ownCoverUrl);
  for (const track of tracks) {
    if (track.ownCoverUrl) {
      track.coverUrl = track.ownCoverUrl;
    } else if (withCovers.length > 0) {
      const idx = pickRandomCoverIndex(track.id, withCovers.length);
      track.coverUrl = withCovers[idx].ownCoverUrl;
    } else {
      const idx = pickRandomCoverIndex(track.id, FALLBACK_COVER_COUNT);
      track.coverUrl = `/covers-fallback/${idx}.svg`;
    }
    delete track.ownCoverUrl;
  }

  tracks.sort((a, b) => a.title.localeCompare(b.title));
  return tracks;
}

async function main() {
  try {
    await stat(MUSIC_DIR);
  } catch {
    console.warn(`[build-library] ${MUSIC_DIR} not found — writing empty library.json`);
    await writeFile(OUTPUT_FILE, JSON.stringify({ tracks: [] }));
    return;
  }

  const tracks = await scanLibrary();
  await writeFile(OUTPUT_FILE, JSON.stringify({ tracks }));
  const withOwnArt = tracks.filter((t) => t.coverUrl).length;
  console.log(`[build-library] wrote ${tracks.length} tracks to public/library.json (${withOwnArt} with cover art)`);
}

main().catch((err) => {
  console.error("[build-library] failed:", err);
  process.exit(1);
});
