#!/usr/bin/env node
/**
 * Generates src/lib/track-src-map.ts from actual files in public/music/
 * Run: node scripts/gen-src-map.js
 */
const fs   = require("fs");
const path = require("path");

const musicDir  = path.join(__dirname, "..", "public", "music");
const dataFile  = path.join(__dirname, "..", "src", "lib", "data.ts");
const outFile   = path.join(__dirname, "..", "src", "lib", "track-src-map.ts");

// ── Read all mp3 filenames ────────────────────────────────
const files = fs.readdirSync(musicDir).filter(f => f.endsWith(".mp3"));

// ── Parse tracks from data.ts ─────────────────────────────
const src  = fs.readFileSync(dataFile, "utf8");
const rows = [];

// Match each track object: id, title, artist
const lineRe = /id:\s*"(\d+)"[^}]+?title:\s*"([^"]+)"[^}]+?artist:\s*"([^"]+)"/g;
let m;
while ((m = lineRe.exec(src)) !== null) {
  rows.push({ id: m[1], title: m[2], artist: m[3] });
}

// ── Fuzzy scorer ──────────────────────────────────────────
function norm(s) {
  return s.toLowerCase()
    .replace(/[&＂'"''""\u{FF02}\u{2019}\u{2018}]/gu, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bestMatch(title, artist) {
  const titleNorm = norm(title);
  const titleWords = titleNorm.split(" ").filter(w => w.length > 2);
  const artistWords = norm(artist).split(" ").filter(w => w.length > 2);
  if (!titleWords.length) return { file: null, score: 0 };

  let best = null, hi = 0;
  for (const f of files) {
    const fnNorm = norm(f.replace(/\.mp3$/i, ""));
    const fnWords = fnNorm.split(" ").filter(Boolean);

    if (titleWords.length <= 2) {
      // Short titles are ambiguous by single word (e.g. "Home", "Bad") —
      // require the exact title words to appear as a contiguous run of whole
      // words in the filename (not a substring like "bad" inside "badu").
      const titleAllWords = titleNorm.split(" ").filter(Boolean);
      let matchesHere = false;
      for (let i = 0; i + titleAllWords.length <= fnWords.length; i++) {
        if (titleAllWords.every((w, j) => fnWords[i + j] === w)) { matchesHere = true; break; }
      }
      if (!matchesHere) continue;
      const artistHits = artistWords.length ? artistWords.filter(w => fnWords.includes(w)).length / artistWords.length : 0;
      const s = 1 * 0.7 + artistHits * 0.3;
      if (s > hi) { hi = s; best = f; }
      continue;
    }

    const titleHits = titleWords.filter(w => fnWords.includes(w)).length;
    const titleScore = titleHits / titleWords.length;
    // Title must match almost entirely — artist match is only a tiebreaker bonus.
    if (titleScore < 0.8) continue;
    const artistHits = artistWords.length ? artistWords.filter(w => fnWords.includes(w)).length / artistWords.length : 0;
    const s = titleScore * 0.7 + artistHits * 0.3;
    if (s > hi) { hi = s; best = f; }
  }
  return { file: best, score: hi };
}

// ── Known-bad fuzzy matches ─────────────────────────────────
// These track IDs share a short/common title with an unrelated real file
// and must never auto-resolve to it. (Now that real files exist for the
// actual songs, they're wired up explicitly via MANUAL_MATCH below instead.)
const REJECT_MATCH = new Set([]);

// ── Manual overrides ─────────────────────────────────────────
// Verified-correct matches the strict word-boundary scorer can't reach
// because of small spelling/spacing differences between title and filename,
// or because the title is too short/common for the scorer to trust safely.
const MANUAL_MATCH = {
  "51": "The Three Tenors in Concert 1994： ＂Nessun Dorma＂ from Turandot (encore).mp3",
  "55": "O Meri Laila - Lyrical ｜ Laila Majnu ｜ Jyotica Tangri ｜ Avinash Tiwary & Tripti Dimri.mp3",
  "102": "The Verve - Bitter Sweet Symphony.mp3",
  "232": "Lil Tecca - Love Me (Official Music Video).mp3",
  "242": "Passenger ｜ Home (Official Album Audio).mp3",
  "262": "ill peach - HOLD ON.mp3",
  "270": "Good Neighbours - Home (Lyric Video).mp3",
  "217": "Hold On, I'm Coming.mp3",
  "37": "Old Man Canyon - Phantoms & Friends [Official Video].mp3",
};

// ── Build map ─────────────────────────────────────────────
const entries = [];
const issues  = [];

for (const row of rows) {
  const { file, score } = MANUAL_MATCH[row.id]
    ? { file: MANUAL_MATCH[row.id], score: 1 }
    : REJECT_MATCH.has(row.id)
      ? { file: null, score: 0 }
      : bestMatch(row.title, row.artist);
  if (!file || score < 0.7) {
    issues.push(`  // MISSING (score=${score.toFixed(2)}): ${row.id} — ${row.artist} - ${row.title}`);
    entries.push(`  // "id":"${row.id}" — NO FILE FOUND for: ${row.artist} - ${row.title}`);
  } else {
    const enc = "/music/" + encodeURIComponent(file);
    entries.push(`  "${row.id}": "${enc}", // ${file}`);
    if (score < 0.85) {
      issues.push(`  // LOW CONFIDENCE (score=${score.toFixed(2)}): ${row.id} "${row.title}" by ${row.artist} => ${file}`);
    }
  }
}

// ── Write output ──────────────────────────────────────────
const ts = `/**
 * AUTO-GENERATED by scripts/gen-src-map.js — do not edit by hand.
 * Run "node scripts/gen-src-map.js" to regenerate after adding music files.
 *
 * Maps track ID -> exact URL-encoded /music/ path, resolved from real filenames.
 * Player uses this for instant zero-latency audio resolution.
 */
export const TRACK_SRC_MAP: Record<string, string> = {
${entries.join("\n")}
};
`;

fs.writeFileSync(outFile, ts, "utf8");

console.log(`\nGenerated ${outFile}`);
console.log(`  ${rows.length} tracks processed`);
console.log(`  ${issues.filter(l => l.includes("MISSING")).length} missing files`);
console.log(`  ${issues.filter(l => l.includes("LOW")).length} low-confidence matches`);

if (issues.length) {
  console.log("\nIssues to review:");
  issues.forEach(l => console.log(l));
}
