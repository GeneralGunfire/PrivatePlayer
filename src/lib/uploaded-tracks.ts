"use client";

import type { Track } from "./data";

/**
 * Uploaded MP3s, stored in the browser's IndexedDB — the only viable
 * "store it in the app" option for a static site with no writable server
 * disk (see the session decision this followed: browser storage,
 * explicitly required to also work fully offline once installed as a
 * PWA). Genuinely persists across sessions on this device, survives
 * offline use, and needs no network round trip to play back.
 *
 * Not synced across devices — that would need a real backend this site
 * doesn't have. Clearing site data / uninstalling the PWA removes it,
 * same as any other browser storage.
 */

const DB_NAME = "pp-uploads";
const DB_VERSION = 1;
const STORE = "tracks";

export interface UploadedTrackRecord {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  addedAt: number;
  file: Blob;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return "--:--";
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Reads an mp3's duration by loading it into a throwaway <audio> element
 * — the only way to get real duration from a File/Blob without a full
 * decode, same approach the build-time scanner's server-side equivalent
 * (music-metadata) exists to avoid needing here. */
function readDuration(file: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = url;
    const done = (seconds: number) => {
      URL.revokeObjectURL(url);
      resolve(seconds);
    };
    audio.addEventListener("loadedmetadata", () => done(audio.duration), { once: true });
    audio.addEventListener("error", () => done(NaN), { once: true });
  });
}

/** Best-effort "Artist - Title" split from the filename, same heuristic
 * as build-library.mjs's parseFromFilename — kept independent since this
 * runs in the browser, not the build script. */
function parseFilename(fileName: string): { title: string; artist: string } {
  let name = fileName.replace(/\.mp3$/i, "");
  const dashMatch = name.match(/^(.+?)\s[-–]\s(.+)$/);
  if (dashMatch) {
    return { artist: dashMatch[1].trim(), title: dashMatch[2].trim() };
  }
  return { artist: "Unknown Artist", title: name.trim() || fileName };
}

let coverIndex = 0;
const FALLBACK_COVER_COUNT = 12;

export async function addUploadedTrack(file: File): Promise<UploadedTrackRecord> {
  const duration = await readDuration(file);
  const { title, artist } = parseFilename(file.name);
  const id = `up_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const record: UploadedTrackRecord = {
    id,
    title,
    artist,
    album: "",
    duration: formatDuration(duration),
    coverUrl: `/covers-fallback/${coverIndex++ % FALLBACK_COVER_COUNT}.svg`,
    addedAt: Date.now(),
    file,
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const req = tx(db, "readwrite").put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  return record;
}

export async function listUploadedTracks(): Promise<UploadedTrackRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = tx(db, "readonly").getAll();
    req.onsuccess = () => resolve(req.result as UploadedTrackRecord[]);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteUploadedTrack(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const req = tx(db, "readwrite").delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/** Converts a stored record into the app's normal Track shape. Does NOT
 * mint a blob: URL itself — callers that need one (use-uploaded-tracks.ts)
 * own creating and caching it per record id, since a fresh
 * createObjectURL() call on every invocation was the source of a real
 * playback bug (see that hook's own comment). `src` is left empty here;
 * callers overwrite it with their cached URL. */
export function uploadedRecordToTrack(record: UploadedTrackRecord): Track {
  return {
    id: record.id,
    title: record.title,
    artist: record.artist,
    album: record.album,
    coverUrl: record.coverUrl,
    duration: record.duration,
    src: "",
  };
}
