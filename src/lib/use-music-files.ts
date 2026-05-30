"use client";

import { useEffect, useState } from "react";
import { findBestFile } from "./resolve-track";
import type { Track } from "./data";

let cachedFiles: string[] | null = null;
let fetchPromise: Promise<string[]> | null = null;

async function getMusicFiles(): Promise<string[]> {
  if (cachedFiles) return cachedFiles;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/music-files")
    .then(r => r.json())
    .then(d => {
      cachedFiles = d.files ?? [];
      return cachedFiles!;
    })
    .catch(() => {
      cachedFiles = [];
      return [];
    });

  return fetchPromise;
}

/**
 * Given a track, returns the resolved /music/filename.mp3 src
 * by fuzzy-matching against files actually present in public/music/.
 * Falls back to track.src if no match found.
 */
export function useResolvedSrc(track: Track | null): string {
  const [src, setSrc] = useState(track?.src ?? "");

  useEffect(() => {
    if (!track) return;
    getMusicFiles().then(files => {
      const match = findBestFile(files, track.title, track.artist);
      setSrc(match ? `/music/${match}` : track.src);
    });
  }, [track?.id]);

  return src;
}

/**
 * Returns a map of trackId → resolved src for all tracks in a list.
 */
export function useResolvedSrcMap(tracks: Track[]): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tracks.length) return;
    getMusicFiles().then(files => {
      const result: Record<string, string> = {};
      for (const t of tracks) {
        const match = findBestFile(files, t.title, t.artist);
        result[t.id] = match ? `/music/${match}` : t.src;
      }
      setMap(result);
    });
  }, [tracks.map(t => t.id).join(",")]);

  return map;
}

/** Pre-warm the file list cache */
export function prewarmMusicFiles() {
  getMusicFiles();
}
