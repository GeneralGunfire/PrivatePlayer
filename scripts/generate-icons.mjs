// Generates the PWA icon set as plain SVGs rendered inline — a simple
// mark (three gradient sound bars on black, echoing the app's own
// visualizer) rather than a photographic icon.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

const SIZES = [192, 512];

// Three bars, not five — five same-width bars at close spacing read as
// generic "equalizer clipart" at small sizes (the 192px icon especially).
// Three narrower, more deliberately-spaced bars with a symmetric short-
// tall-short rhythm reads as a clean mark rather than a literal waveform
// copy. Bar width/height both pulled in from the first pass (0.12/0.68 of
// the frame) — that read as too heavy/large against the rounded-square
// backing, leaving barely any breathing room at the edges.
function iconSvg(size) {
  const bars = [
    { x: 0.31, h: 0.32, gradient: "bar-a" },
    { x: 0.50, h: 0.52, gradient: "bar-b" },
    { x: 0.69, h: 0.40, gradient: "bar-c" },
  ];
  const barWidth = size * 0.085;
  const baseline = size * 0.66;
  const suffix = size;
  const rects = bars
    .map(({ x, h, gradient }) => {
      const barHeight = size * h;
      return `<rect x="${(x * size - barWidth / 2).toFixed(1)}" y="${(baseline - barHeight).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="${(barWidth / 2).toFixed(1)}" fill="url(#${gradient}-${suffix})" />`;
    })
    .join("");
  // Each bar gets its own gradient stop-set — a real per-bar highlight/
  // shadow rather than one identical gradient stretched across all three,
  // which is what "flat" actually meant: same light direction, same tone,
  // no sense of individual rounded-bar form. The center (tallest) bar
  // reads brightest, matching where a real light source overhead would
  // land strongest; the two shorter flanking bars sit a shade cooler/
  // darker, giving the mark actual dimension instead of silhouette flatness.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bar-a-${suffix}" x1="0" y1="1" x2="0.35" y2="0">
      <stop offset="0%" stop-color="#5c5c5c" />
      <stop offset="55%" stop-color="#b8b8b8" />
      <stop offset="100%" stop-color="#e8e8e8" />
    </linearGradient>
    <linearGradient id="bar-b-${suffix}" x1="0" y1="1" x2="0.35" y2="0">
      <stop offset="0%" stop-color="#6e6e6e" />
      <stop offset="50%" stop-color="#d6d6d6" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="bar-c-${suffix}" x1="0" y1="1" x2="0.35" y2="0">
      <stop offset="0%" stop-color="#525252" />
      <stop offset="55%" stop-color="#a8a8a8" />
      <stop offset="100%" stop-color="#dcdcdc" />
    </linearGradient>
    <radialGradient id="backdrop-${suffix}" cx="0.5" cy="0.38" r="0.75">
      <stop offset="0%" stop-color="#111111" />
      <stop offset="100%" stop-color="#040404" />
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#backdrop-${suffix})" />
  ${rects}
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const size of SIZES) {
    await writeFile(path.join(OUT_DIR, `icon-${size}.svg`), iconSvg(size));
  }
  // Maskable variant — same mark, but with the safe-zone padding maskable
  // icons need (content confined to the inner ~80% circle so OS icon
  // masks don't clip the bars).
  await writeFile(path.join(OUT_DIR, "icon-maskable.svg"), iconSvg(512));
  console.log(`[generate-icons] wrote icon-192.svg, icon-512.svg, icon-maskable.svg to public/icons/`);
}

main();
