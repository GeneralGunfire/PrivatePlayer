"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "./data";
import {
  addUploadedTrack,
  deleteUploadedTrack,
  listUploadedTracks,
  uploadedRecordToTrack,
  type UploadedTrackRecord,
} from "./uploaded-tracks";

/** Reactive view of uploaded (IndexedDB-backed) tracks — mirrors the same
 * "always start empty, only ever populate via a post-mount effect" rule
 * use-library.ts follows, for the same reason: IndexedDB access is async
 * and browser-only, so seeding state from it during the first render
 * would either be impossible (SSR) or racy (client). */
export function useUploadedTracks(): {
  tracks: Track[];
  loading: boolean;
  uploading: boolean;
  upload: (files: FileList | File[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
} {
  const [records, setRecords] = useState<UploadedTrackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const reload = useCallback(async () => {
    const list = await listUploadedTracks();
    list.sort((a, b) => b.addedAt - a.addedAt);
    setRecords(list);
  }, []);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const mp3s = Array.from(files).filter((f) => f.type === "audio/mpeg" || /\.mp3$/i.test(f.name));
      if (mp3s.length === 0) return;
      setUploading(true);
      try {
        for (const file of mp3s) {
          await addUploadedTrack(file);
        }
        await reload();
      } finally {
        setUploading(false);
      }
    },
    [reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteUploadedTrack(id);
      await reload();
    },
    [reload],
  );

  // Blob URLs are minted once per record id and cached here — calling
  // uploadedRecordToTrack() directly inside the tracks memo (as this
  // used to) called URL.createObjectURL() on every render this hook
  // participates in, not just when `records` actually changed. Each
  // call produces a genuinely different blob: URL for the same file, so
  // a re-render mid-playback (typing elsewhere, any unrelated state
  // change) could swap the <audio> element's src out from under itself
  // to a different-but-equivalent URL, which is what an intermittent
  // net::ERR_ABORTED on a blob: request during playback traced back to.
  const urlCacheRef = useRef<Map<string, string>>(new Map());

  const tracks = useMemo(() => {
    const cache = urlCacheRef.current;
    const liveIds = new Set(records.map((r) => r.id));
    // Revoke URLs for records that no longer exist (deleted uploads) —
    // otherwise every deletion leaks a blob: URL for the life of the tab.
    for (const [id, url] of cache) {
      if (!liveIds.has(id)) {
        URL.revokeObjectURL(url);
        cache.delete(id);
      }
    }
    return records.map((record) => {
      let url = cache.get(record.id);
      if (!url) {
        url = URL.createObjectURL(record.file);
        cache.set(record.id, url);
      }
      return { ...uploadedRecordToTrack(record), src: url };
    });
  }, [records]);

  return { tracks, loading, uploading, upload, remove };
}
