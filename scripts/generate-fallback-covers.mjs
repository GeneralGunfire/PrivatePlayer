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
// v3 — v1 (flat two-stop dark gradient + faint bars) was muddy/invisible.
// v2 (bright geometric motifs — rings/bursts/bands/orbits) was explicitly
// rejected as unprofessional. This pass: plain, clean multi-stop
// gradients only — no shapes, lines, or icons — varied by angle and hue
// per index so the pool still reads as distinct at a glance, closer to
// how Spotify/Apple Music generate a placeholder cover from a color pair.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "covers-fallback");

// Three-stop gradients, each a believable tonal family (not random hue
// pairs) so they read as designed rather than generated noise. Angles
// vary per entry too, so adjacent covers in a list don't all lean the
// same direction.
const GRADIENTS = [
  { stops: ["#0d1b2a", "#2c4a6e", "#3d648f"], angle: 135 }, // app accent blue
  { stops: ["#150a24", "#3d2a6e", "#6a4fc9"], angle: 120 }, // violet
  { stops: ["#06201a", "#1f5c46", "#3ea885"], angle: 145 }, // emerald
  { stops: ["#241505", "#7a4a1a", "#c97f3d"], angle: 130 }, // amber
  { stops: ["#200a14", "#6e2c4a", "#c9527f"], angle: 150 }, // rose
  { stops: ["#0a1a1e", "#1f5c66", "#3ea8b8"], angle: 125 }, // teal
  { stops: ["#1c1405", "#7a5c1a", "#c9a13d"], angle: 140 }, // gold
  { stops: ["#12081f", "#3d2a6e", "#5c4fc9"], angle: 115 }, // indigo
  { stops: ["#200a0a", "#6e2c2c", "#c9524f"], angle: 135 }, // red
  { stops: ["#081f14", "#1f5c33", "#3ea85e"], angle: 150 }, // green
  { stops: ["#1c0a20", "#5c2a6e", "#a84fc9"], angle: 120 }, // magenta
  { stops: ["#0a1420", "#294a6e", "#4a7fbf"], angle: 145 }, // deep blue
];

const SIZE = 400;

function svgFor(index) {
  const { stops, angle } = GRADIENTS[index % GRADIENTS.length];
  const id = `cov${index}`;
  const rad = (angle * Math.PI) / 180;
  // Project the angle onto the 0..1 gradientUnits box so gradient
  // direction genuinely varies per cover, not just its colors.
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
