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

/** Get the exact /music/ URL for a track — map first, then track.src */
function resolveUrl(track: Track): string {
  return TRACK_SRC_MAP[track.id] ?? track.src;
}

/** Silent background preload into a shared Audio element */
const preloadEl = typeof window !== "undefined" ? new Audio() : null;
function preload(track: Track) {
  if (!preloadEl) return;
  const url = resolveUrl(track);
  if (preloadEl.src === window.location.origin + url) return; // already loaded
  preloadEl.src = url;
  preloadEl.preload = "auto";
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

  // Stable refs so closures always see current values
  const shuffleRef      = useRef(shuffle);     shuffleRef.current      = shuffle;
  const repeatRef       = useRef(repeat);      repeatRef.current       = repeat;
  const queueRef        = useRef(queue);        queueRef.current        = queue;
  const currentTrackRef = useRef(currentTrack); currentTrackRef.current = currentTrack;

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;

    a.addEventListener("timeupdate",     () => {
      if (!a.duration) return;
      setCurrentTime(a.currentTime);
      setProgress((a.currentTime / a.duration) * 100);
    });
    a.addEventListener("loadedmetadata", () => { setDuration(a.duration); });
    a.addEventListener("canplay",        () => { setIsLoading(false); });
    a.addEventListener("waiting",        () => { setIsLoading(true);  });
    a.addEventListener("playing",        () => { setIsPlaying(true);  setIsLoading(false); });
    a.addEventListener("pause",          () => { setIsPlaying(false); });
    a.addEventListener("ended",          () => {
      if (repeatRef.current) { a.currentTime = 0; a.play().catch(() => {}); return; }
      advanceQueue(1);
    });
    a.addEventListener("error",          () => { setIsLoading(false); setIsPlaying(false); });

    return () => { a.pause(); a.src = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndPlay = useCallback((url: string) => {
    const a = audioRef.current;
    if (!a) return;
    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);

    // If preloader already buffered this exact URL, grab its buffer by swapping
    const absUrl = window.location.origin + url;
    if (preloadEl && preloadEl.readyState >= 3 &&
        preloadEl.src === absUrl) {
      // Same URL, already buffered — just set src and play immediately
      a.src = url;
      a.play().catch(() => {});
      return;
    }

    // Otherwise load fresh
    a.src = url;
    // Don't call a.load() — setting src already triggers load in most browsers.
    // Calling load() resets buffering and causes delays.
    a.play().catch(() => {
      // Autoplay blocked — wait for canplay then play
      const onCan = () => {
        a.removeEventListener("canplay", onCan);
        a.play().catch(() => {});
      };
      a.addEventListener("canplay", onCan);
    });
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

    // Preload two tracks ahead
    const pi = (ni + 1) % q.length;
    if (q[pi]) preload(q[pi]);
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
