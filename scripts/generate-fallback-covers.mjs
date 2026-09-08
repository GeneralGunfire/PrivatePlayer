// Generates a small fixed pool of stylized cover-art SVGs, once, checked
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
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "covers-fallback");

// Variations on the site's own accent (#2c4a6e / #365a84 / #3d648f) plus a
// few analogous dark tones, so these read as "part of this app" rather
// than generic stock gradients.
const PALETTES = [
  ["#0d1b2a", "#2c4a6e"],
  ["#1b1033", "#4a2c6e"],
  ["#0a2a24", "#2c6e5a"],
  ["#2a1a0d", "#6e4a2c"],
  ["#1a0d2a", "#5a2c6e"],
  ["#0d2a1f", "#2c6e4a"],
  ["#2a0d1a", "#6e2c4a"],
  ["#0d1a2a", "#2c5a6e"],
  ["#221a2a", "#5a3d6e"],
  ["#1a2a0d", "#4a6e2c"],
  ["#2a0d2a", "#6e2c6e"],
  ["#0d2a2a", "#2c6e6e"],
];

// Abstract geometric motifs (rotated bars / arcs), not literal icons —
// each combined with its palette gives a distinct silhouette at
// thumbnail size, which is what actually reads as "different cover" in a
// scrolling list rather than the exact gradient hue.
function motif(index, id) {
  const seed = index * 37;
  const bars = Array.from({ length: 4 }, (_, i) => {
    const angle = (seed + i * 47) % 360;
    const x = 200 + Math.cos((angle * Math.PI) / 180) * 90;
    const y = 200 + Math.sin((angle * Math.PI) / 180) * 90;
    const w = 60 + ((seed + i * 23) % 80);
    return `<rect x="${x - w / 2}" y="${y - 8}" width="${w}" height="16" rx="8" fill="url(#g${id})" opacity="${0.35 + (i % 3) * 0.15}" transform="rotate(${angle} ${x} ${y})" />`;
  }).join("");
  const cx = 100 + ((seed * 3) % 200);
  const cy = 100 + ((seed * 7) % 200);
  const r = 70 + (seed % 60);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${id})" opacity="0.5" />${bars}`;
}

function svgFor(index) {
  const [c1, c2] = PALETTES[index % PALETTES.length];
  const id = `cov${index}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}" />
      <stop offset="1" stop-color="${c2}" />
    </linearGradient>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c2}" />
      <stop offset="1" stop-color="${c1}" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg${id})" />
  ${motif(index, id)}
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (let i = 0; i < PALETTES.length; i++) {
    await writeFile(path.join(OUT_DIR, `${i}.svg`), svgFor(i));
  }
  console.log(`[generate-fallback-covers] wrote ${PALETTES.length} covers to public/covers-fallback/`);
}

main();
