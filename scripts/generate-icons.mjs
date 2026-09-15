// Generates the PWA icon set as plain SVGs rendered inline — a simple
// monochrome mark (white bars on black, echoing the app's own visualizer)
// rather than a photographic icon, consistent with "black/white, no other
// colors" everywhere else in this rebuild.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

const SIZES = [192, 512];

function iconSvg(size) {
  const bars = [
    { x: 0.28, h: 0.34 },
    { x: 0.40, h: 0.58 },
    { x: 0.52, h: 0.42 },
    { x: 0.64, h: 0.66 },
    { x: 0.76, h: 0.50 },
  ];
  const barWidth = size * 0.07;
  const baseline = size * 0.72;
  const rects = bars
    .map(({ x, h }) => {
      const barHeight = size * h;
      return `<rect x="${(x * size - barWidth / 2).toFixed(1)}" y="${(baseline - barHeight).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="${(barWidth / 2).toFixed(1)}" fill="#ffffff" />`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#060606" />
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
