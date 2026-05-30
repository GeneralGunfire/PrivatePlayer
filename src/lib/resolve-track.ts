/**
 * Fuzzy filename resolver — matches a track to whichever MP3 file
 * in /music/ best contains both the title and artist.
 *
 * Works server-side (Node/Next.js API) and also exports a simple
 * client-safe slug helper for static src fallback paths.
 */

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
  const t = normalise(title);
  const a = normalise(artist);

  // Score each file: count how many words from title+artist appear
  let best: string | null = null;
  let bestScore = 0;

  for (const f of files) {
    const fn = normalise(f.replace(/\.mp3$/i, ""));
    const words = [...t.split(" "), ...a.split(" ")].filter(w => w.length > 2);
    const score = words.filter(w => fn.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }

  // Require at least 1 meaningful word match
  return bestScore >= 1 ? best : null;
}
