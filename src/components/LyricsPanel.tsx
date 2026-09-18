"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MicOff } from "lucide-react";
import type { Track } from "@/lib/data";

interface LrcLine {
  time: number; // seconds
  text: string;
}

interface LyricsResult {
  synced: LrcLine[] | null;
  plain: string | null;
}

const cache = new Map<string, LyricsResult | null>();

function parseLrc(lrc: string): LrcLine[] {
  const lines: LrcLine[] = [];
  const timeTag = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
  for (const raw of lrc.split("\n")) {
    const matches = [...raw.matchAll(timeTag)];
    if (!matches.length) continue;
    const text = raw.replace(timeTag, "").trim();
    for (const m of matches) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const ms = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) : 0;
      lines.push({ time: min * 60 + sec + ms / 1000, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

// Strip parenthetical/bracketed remix, version, and feature tags that
// rarely appear in lrclib's own track titles (e.g. "(Epic Version)",
// "(James Carter Remix)", "[Official Video]") so the search query matches
// the underlying song instead of this specific YouTube upload's title.
function cleanTitle(title: string): string {
  return title
    .replace(/[([][^)\]]*(?:remix|version|edit|mix|video|audio|lyrics?|official|extended|feat\.?|ft\.)[^)\]]*[)\]]/gi, "")
    .replace(/\s+-\s+(?:.*\b(?:remix|version|edit)\b.*)$/i, "")
    .trim() || title;
}

function cleanArtist(artist: string): string {
  return artist.split(/[,&]| and | feat\.?| ft\.?/i)[0].trim();
}

interface SearchResult {
  syncedLyrics?: string | null;
  plainLyrics?: string | null;
  trackName?: string;
  artistName?: string;
  duration?: number;
}

async function fetchLyrics(track: Track): Promise<LyricsResult | null> {
  const key = `${track.artist}|${track.title}`;
  if (cache.has(key)) return cache.get(key)!;

  const title = cleanTitle(track.title);
  const artist = cleanArtist(track.artist);

  try {
    // lrclib's /api/get requires a near-exact title/artist/duration match and
    // 404s constantly on messy real-world metadata — /api/search is fuzzy and
    // returns ranked candidates, which fits this library's YouTube-derived titles.
    const params = new URLSearchParams({ track_name: title, artist_name: artist });
    const r = await fetch(`https://lrclib.net/api/search?${params}`);
    if (!r.ok) throw new Error("search failed");
    const results: SearchResult[] = await r.json();

    // Prefer a result with synced lyrics (as a source of TEXT — the time
    // tags aren't used for playback-position tracking any more, see this
    // component's own doc comment below), otherwise any plain lyrics.
    const best =
      results.find(x => x.syncedLyrics) ??
      results.find(x => x.plainLyrics) ??
      null;

    const result: LyricsResult = best
      ? {
          synced: best.syncedLyrics ? parseLrc(best.syncedLyrics) : null,
          plain: best.plainLyrics ?? null,
        }
      : { synced: null, plain: null };

    const found = result.synced || result.plain ? result : null;
    cache.set(key, found);
    return found;
  } catch {
    cache.set(key, null);
    return null;
  }
}

/**
 * Plain, static lyrics — deliberately NOT synced to playback position.
 * This used to auto-scroll/highlight the "current" line against
 * `currentTime`, but lrclib's line timings are matched against a
 * different (often official) recording than this library's actual
 * YouTube-derived MP3s, so the highlighted line routinely drifted out of
 * sync with what was actually playing — worse than no sync at all, since
 * it actively fought the reader trying to track their own place in the
 * song by scrolling. This renders the full lyric text (synced-source
 * lines joined plainly, or the plain-lyrics text directly) as one static
 * block with completely free scrolling and no moving highlight.
 */
export default function LyricsPanel({
  track,
  open,
  onClose,
}: {
  track: Track;
  currentTime: number;
  open: boolean;
  onClose: () => void;
}) {
  const [result, setResult] = useState<LyricsResult | null | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    setResult(undefined);
    let cancelled = false;
    fetchLyrics(track).then(r => { if (!cancelled) setResult(r); });
    return () => { cancelled = true; };
  }, [track.id, open]);

  const lyricsText = result?.plain ?? result?.synced?.map(l => l.text).join("\n") ?? null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-110 bg-black/85 backdrop-blur-2xl flex flex-col px-6 pt-10 pb-8"
          onClick={onClose}
        >
          <div className="flex items-center justify-between mb-6 shrink-0" onClick={e => e.stopPropagation()}>
            <div>
              <p className="text-[9px] uppercase tracking-[0.45em] text-white/25 font-black mb-0.5">Lyrics</p>
              <p className="text-[13px] font-bold tracking-tight truncate max-w-60">{track.title}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/14 border border-white/10 transition-colors"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto scrollbar-none touch-pan-y"
            onClick={e => e.stopPropagation()}
          >
            {result === undefined ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-end gap-1 h-6">
                  {[0, 0.15, 0.07].map((d, i) => (
                    <span key={i} className="w-1.5 bg-white/40 rounded-full"
                      style={{ animation: `eq${i + 1} 0.7s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            ) : !lyricsText ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-white/35">
                <MicOff size={32} strokeWidth={1.5} />
                <p className="text-sm font-medium">No lyrics found for this track</p>
              </div>
            ) : (
              <div className="py-6 whitespace-pre-line text-lg font-bold leading-relaxed text-white/80">
                {lyricsText}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
