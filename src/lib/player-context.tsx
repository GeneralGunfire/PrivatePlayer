"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { Track } from "@/lib/data";
import { ALL_TRACKS } from "@/lib/data";
import { TRACK_SRC_MAP } from "@/lib/track-src-map";

interface PlayerCtx {
  queue:         Track[];
  currentTrack:  Track | null;
  isPlaying:     boolean;
  isLoading:     boolean;
  progress:      number;
  currentTime:   number;
  duration:      number;
  shuffle:       boolean;
  repeat:        boolean;
  isPlayerOpen:  boolean;
  selectTrack:   (track: Track, queue?: Track[]) => void;
  togglePlay:    () => void;
  next:          () => void;
  prev:          () => void;
  seek:          (pct: number) => void;
  toggleShuffle: () => void;
  toggleRepeat:  () => void;
  openPlayer:    () => void;
  closePlayer:   () => void;
}

const Ctx = createContext<PlayerCtx | null>(null);

function resolveUrl(track: Track): string {
  return TRACK_SRC_MAP[track.id] ?? track.src;
}

// Silent background preloader
const preloadEl = typeof window !== "undefined" ? (() => {
  const a = new Audio();
  a.preload = "auto";
  return a;
})() : null;

let preloadedUrl = "";

function preload(track: Track) {
  if (!preloadEl || typeof window === "undefined") return;
  const url = resolveUrl(track);
  if (url === preloadedUrl) return;
  preloadedUrl = url;
  preloadEl.src = url;
  preloadEl.load();
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [queue,        setQueue]        = useState<Track[]>(ALL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [shuffle,      setShuffle]      = useState(false);
  const [repeat,       setRepeat]       = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const shuffleRef      = useRef(shuffle);     shuffleRef.current      = shuffle;
  const repeatRef       = useRef(repeat);      repeatRef.current       = repeat;
  const queueRef        = useRef(queue);        queueRef.current        = queue;
  const currentTrackRef = useRef(currentTrack); currentTrackRef.current = currentTrack;

  // Throttle timeupdate to avoid excessive React re-renders
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;

    a.addEventListener("timeupdate", () => {
      if (!a.duration) return;
      const now = performance.now();
      // Only update state ~10x per second (every 100ms) — enough for smooth scrubber
      if (now - lastUpdateRef.current < 100) return;
      lastUpdateRef.current = now;
      setCurrentTime(a.currentTime);
      setProgress((a.currentTime / a.duration) * 100);
    });

    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    a.addEventListener("canplay",        () => setIsLoading(false));
    a.addEventListener("waiting",        () => setIsLoading(true));
    a.addEventListener("playing",        () => { setIsPlaying(true); setIsLoading(false); });
    a.addEventListener("pause",          () => setIsPlaying(false));
    a.addEventListener("stalled",        () => setIsLoading(true));
    a.addEventListener("error",          () => { setIsLoading(false); setIsPlaying(false); });
    a.addEventListener("ended",          () => {
      if (repeatRef.current) { a.currentTime = 0; a.play().catch(() => {}); return; }
      advanceQueue(1);
    });

    return () => { a.pause(); a.src = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndPlay = useCallback((url: string) => {
    const a = audioRef.current;
    if (!a) return;

    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);
    lastUpdateRef.current = 0;

    // If the preloader already buffered this URL, swap its source node
    // directly into the main element — instant start, no re-download.
    if (preloadEl && preloadedUrl === url && preloadEl.readyState >= 3) {
      a.src = url;
      // Browser already has it cached/buffered — skip load(), go straight to play
    } else {
      a.src = url;
      a.load(); // explicit load so browser starts buffering immediately
    }

    const tryPlay = () => {
      const playPromise = a.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === "NotAllowedError") {
            const onCan = () => {
              a.removeEventListener("canplay", onCan);
              a.play().catch(() => {});
            };
            a.addEventListener("canplay", onCan);
          }
          // AbortError = skipped quickly — ignore
        });
      }
    };

    // If enough data is ready, play immediately; otherwise wait for canplay
    if (a.readyState >= 3) {
      tryPlay();
    } else {
      const onReady = () => {
        a.removeEventListener("canplay", onReady);
        tryPlay();
      };
      a.addEventListener("canplay", onReady);
    }
  }, []);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    currentTrackRef.current = track;
    loadAndPlay(resolveUrl(track));
  }, [loadAndPlay]);

  const advanceQueue = useCallback((dir: 1 | -1) => {
    const q   = queueRef.current;
    const cur = currentTrackRef.current;
    if (!cur || !q.length) return;

    let idx = q.findIndex(t => t.id === cur.id);
    if (idx === -1) idx = 0;

    const ni = shuffleRef.current
      ? Math.floor(Math.random() * q.length)
      : (idx + dir + q.length) % q.length;

    playTrack(q[ni]);

    // Preload the one after
    const pi = (ni + 1) % q.length;
    if (q[pi] && q[pi].id !== q[ni].id) preload(q[pi]);
  }, [playTrack]);

  const selectTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
      queueRef.current = newQueue;
    }
    playTrack(track);

    // Preload next
    const q   = newQueue ?? queueRef.current;
    const idx = q.findIndex(t => t.id === track.id);
    const ni  = (idx + 1) % q.length;
    if (q[ni] && q[ni].id !== track.id) preload(q[ni]);
  }, [playTrack]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !currentTrackRef.current) return;
    if (a.paused) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, []);

  const next = useCallback(() => advanceQueue(1),  [advanceQueue]);
  const prev = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.currentTime > 3) { a.currentTime = 0; return; }
    advanceQueue(-1);
  }, [advanceQueue]);

  const seek = useCallback((pct: number) => {
    const a = audioRef.current;
    if (!a?.duration) return;
    a.currentTime = (pct / 100) * a.duration;
    setProgress(pct);
    setCurrentTime(a.currentTime);
  }, []);

  return (
    <Ctx.Provider value={{
      queue, currentTrack, isPlaying, isLoading, progress, currentTime, duration,
      shuffle, repeat, isPlayerOpen,
      selectTrack, togglePlay, next, prev, seek,
      toggleShuffle: () => { const v = !shuffleRef.current; shuffleRef.current = v; setShuffle(v); },
      toggleRepeat:  () => { const v = !repeatRef.current;  repeatRef.current  = v; setRepeat(v);  },
      openPlayer:    () => setIsPlayerOpen(true),
      closePlayer:   () => setIsPlayerOpen(false),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
