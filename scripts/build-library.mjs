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
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFile } from "music-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MUSIC_DIR = path.join(ROOT, "public", "music");
const OUTPUT_FILE = path.join(ROOT, "public", "library.json");

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

  const tracks = await Promise.all(
    files.map(async (fileName) => {
      const fullPath = path.join(MUSIC_DIR, fileName);
      const fallbackTitle = path.basename(fileName, path.extname(fileName));
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
  console.log(`[build-library] wrote ${tracks.length} tracks to public/library.json`);
}

main().catch((err) => {
  console.error("[build-library] failed:", err);
  process.exit(1);
});
