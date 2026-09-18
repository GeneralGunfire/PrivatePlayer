"use client";

import { useCallback, useState } from "react";
import { ALL_TRACKS } from "./data";

interface DownloadState {
  downloading: boolean;
  done: number;
  total: number;
  error: string | null;
}

/**
 * "Download all for offline" — hands the full track list to the service
 * worker (see sw.js's DOWNLOAD_ALL_TRACKS message handler) rather than
 * fetching/caching from the page itself, so there's one real
 * implementation of "fetch a track and cache.put it" shared with the
 * install-time House precache, not two that can drift apart.
 *
 * Requires being online — this is explicitly the "I have a connection
 * right now and want everything available later without one" action, not
 * something that could work offline by definition.
 */
export function useDownloadAll() {
  const [state, setState] = useState<DownloadState>({
    downloading: false,
    done: 0,
    total: 0,
    error: null,
  });

  const startDownload = useCallback(async () => {
    if (!("serviceWorker" in navigator)) {
      setState((s) => ({ ...s, error: "Offline downloads aren't supported in this browser." }));
      return;
    }
    const registration = await navigator.serviceWorker.ready.catch(() => null);
    const controller = registration?.active ?? navigator.serviceWorker.controller;
    if (!controller) {
      setState((s) => ({ ...s, error: "The app needs to finish installing before this works — try again in a moment." }));
      return;
    }

    const tracks = ALL_TRACKS.map((t) => t.src);
    if (tracks.length === 0) {
      setState((s) => ({ ...s, error: "Library hasn't loaded yet." }));
      return;
    }

    setState({ downloading: true, done: 0, total: tracks.length, error: null });

    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      const data = event.data as { type: string; done: number; total: number };
      if (data.type === "PROGRESS") {
        setState((s) => ({ ...s, done: data.done, total: data.total }));
      } else if (data.type === "DONE") {
        setState({ downloading: false, done: data.done, total: data.total, error: null });
        channel.port1.close();
      }
    };

    controller.postMessage({ type: "DOWNLOAD_ALL_TRACKS", tracks }, [channel.port2]);
  }, []);

  return { ...state, startDownload };
}
