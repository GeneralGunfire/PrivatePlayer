// Generates a small fixed pool of gradient cover-art SVGs, once, checked
// into git (public/covers-fallback/*.svg — NOT gitignored, unlike the
// per-track library.json/covers/ build output, since this pool is stable
// hand-authored art rather than something regenerated every build).
//
// Why this exists: none of this library's mp3s carry embedded ID3 cover
// pictures (they're YouTube-audio rips with no real tags at all — see
// build-library.mjs's own doc comment), so there's no genuine artwork to
// borrow from track to track the way Udaan's desktop app does (it embeds
// a real borrowed cover into each imported file's own tag). This pool is
// the closest honest equivalent: real generated art, not one flat
// placeholder repeated 202 times, that build-library.mjs assigns to
// cover-less tracks the same deterministic way it would borrow a real one.
//
// v4 (ground-up rebuild) — restricted to green, blue, black, and white
// only, per explicit direction; earlier versions used a wide hue wheel
// (violet/amber/rose/gold/red/magenta) that no longer matches the app's
// palette. Covers are also now hidden on mobile everywhere they're used
// (Home, Search, Library, playlist rows/hero) — this pool only ever
// renders on desktop, where there's room to spare.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "covers-fallback");

// Three-stop gradients spanning only green, blue, black, and white — each
// entry still a believable tonal family (not a random pair) so they read
// as designed. Angles vary per entry so adjacent covers in a list don't
// all lean the same direction. A couple of entries lean toward white/grey
// at one end (rather than every stop being a saturated hue) so the pool
// doesn't read as a single blue-green gradient repeated with noise.
const GRADIENTS = [
  { stops: ["#050708", "#3d7ab8", "#5aa3e0"], angle: 135 }, // blue
  { stops: ["#050708", "#2fae7a", "#45db9c"], angle: 120 }, // green
  { stops: ["#050708", "#1c3a4a", "#3d7ab8"], angle: 145 }, // deep blue
  { stops: ["#050708", "#153a2c", "#2fae7a"], angle: 130 }, // deep green
  { stops: ["#0b0f11", "#2fae7a", "#5aa3e0"], angle: 150 }, // green → blue
  { stops: ["#050708", "#3d7ab8", "#2fae7a"], angle: 125 }, // blue → green
  { stops: ["#0b0f11", "#1c3a4a", "#153a2c"], angle: 140 }, // near-black teal
  { stops: ["#050708", "#4a8bcc", "#e8f4ff"], angle: 115 }, // blue → white
  { stops: ["#050708", "#38c48a", "#eafff2"], angle: 135 }, // green → white
  { stops: ["#050708", "#0b0f11", "#1c3a4a"], angle: 150 }, // near-black
  { stops: ["#050708", "#5aa3e0", "#ffffff"], angle: 120 }, // blue → white, brighter
  { stops: ["#050708", "#45db9c", "#ffffff"], angle: 145 }, // green → white, brighter
];

const SIZE = 400;

function svgFor(index) {
  const { stops, angle } = GRADIENTS[index % GRADIENTS.length];
  const id = `cov${index}`;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * 0.5;
  const dy = Math.sin(rad) * 0.5;
  const x1 = (0.5 - dx).toFixed(3);
  const y1 = (0.5 - dy).toFixed(3);
  const x2 = (0.5 + dx).toFixed(3);
  const y2 = (0.5 + dy).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="g${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <stop offset="0" stop-color="${stops[0]}" />
      <stop offset="0.55" stop-color="${stops[1]}" />
      <stop offset="1" stop-color="${stops[2]}" />
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g${id})" />
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (let i = 0; i < GRADIENTS.length; i++) {
    await writeFile(path.join(OUT_DIR, `${i}.svg`), svgFor(i));
  }
  console.log(`[generate-fallback-covers] wrote ${GRADIENTS.length} covers to public/covers-fallback/`);
}

main();
