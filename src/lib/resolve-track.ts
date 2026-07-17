/**
 * Fuzzy filename resolver — matches a track to whichever MP3 file
 * in /music/ best contains both the title and artist.
 *
 * Works server-side (Node/Next.js API) and also exports a simple
 * client-safe slug helper for static src fallback paths.
 */

/**
 * Title+artist pairs known to fuzzy-match a real but unrelated file
 * (e.g. "Home" by Passenger vs. "Lead Me Home" by Jamie N Commons).
 * These have no audio file in /music/ yet — never guess for them.
 */
const REJECT_PAIRS = new Set([
  "love me|lil tecca",
  "home|passenger",
  "hold on|ill peach",
  "home|good neighbours",
]);

/** Normalise a string for fuzzy comparison */
export function normalise(s: string) {
  return s
    .toLowerCase()
    .replace(/[''`]/g, "")          // smart quotes
    .replace(/[^a-z0-9 ]/g, " ")   // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Given a list of available filenames and a track,
 * return the best-matching filename or null.
 */
export function findBestFile(
  files: string[],
  title: string,
  artist: string
): string | null {
  const titleNorm = normalise(title);
  const titleWords = titleNorm.split(" ").filter(w => w.length > 2);
  const artistWords = normalise(artist).split(" ").filter(w => w.length > 2);
  if (!titleWords.length) return null;
  if (REJECT_PAIRS.has(`${titleNorm}|${normalise(artist)}`)) return null;

  let best: string | null = null;
  let bestScore = 0;

  for (const f of files) {
    const fnNorm = normalise(f.replace(/\.mp3$/i, ""));
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
      const artistHits = artistWords.length
        ? artistWords.filter(w => fnWords.includes(w)).length / artistWords.length
        : 0;
      const score = 0.7 + artistHits * 0.3;
      if (score > bestScore) {
        bestScore = score;
        best = f;
      }
      continue;
    }

    const titleHits = titleWords.filter(w => fnWords.includes(w)).length;
    const titleScore = titleHits / titleWords.length;
    // Title must match almost entirely — artist is only a tiebreaker bonus.
    if (titleScore < 0.8) continue;
    const artistHits = artistWords.length
      ? artistWords.filter(w => fnWords.includes(w)).length / artistWords.length
      : 0;
    const score = titleScore * 0.7 + artistHits * 0.3;
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }

  return bestScore >= 0.7 ? best : null;
}
