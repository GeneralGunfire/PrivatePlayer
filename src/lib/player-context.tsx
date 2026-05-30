"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { Track } from "@/lib/data";
import { ALL_TRACKS } from "@/lib/data";
import { TRACK_SRC_MAP } from "@/lib/track-src-map";

interface PlayerCtx {
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  isPlayerOpen: boolean;
  selectTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (pct: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  openPlayer: () => void;
  closePlayer: () => void;
}

const Ctx = createContext<PlayerCtx | null>(null);

/** Resolve the best playable URL for a track — static map first, then fallback to data.ts src */
function resolveUrl(track: Track): string {
  const mapped = TRACK_SRC_MAP[track.id];
  if (mapped) return mapped;
  // Fallback: use the src from data.ts directly (already URL-encoded paths)
  return track.src;
}

/** Preload the next track into a hidden audio element so it's buffered */
let _preloadAudio: HTMLAudioElement | null = null;
function preloadTrack(track: Track) {
  if (typeof window === "undefined") return;
  if (!_preloadAudio) _preloadAudio = new Audio();
  _preloadAudio.preload = "auto";
  _preloadAudio.src = resolveUrl(track);
  _preloadAudio.load();
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

  // Refs so event callbacks always have fresh values
  const shuffleRef      = useRef(shuffle);     shuffleRef.current = shuffle;
  const repeatRef       = useRef(repeat);      repeatRef.current  = repeat;
  const queueRef        = useRef(queue);        queueRef.current   = queue;
  const currentTrackRef = useRef(currentTrack); currentTrackRef.current = currentTrack;

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;

    a.ontimeupdate = () => {
      if (!a.duration) return;
      setCurrentTime(a.currentTime);
      setProgress((a.currentTime / a.duration) * 100);
    };
    a.onloadedmetadata = () => {
      setDuration(a.duration);
      setIsLoading(false);
    };
    a.onwaiting  = () => setIsLoading(true);
    a.oncanplay  = () => setIsLoading(false);
    a.onplay     = () => { setIsPlaying(true);  setIsLoading(false); };
    a.onpause    = () => setIsPlaying(false);
    a.onerror    = () => setIsLoading(false);
    a.onended    = () => {
      if (repeatRef.current) {
        a.currentTime = 0;
        a.play().catch(() => {});
        return;
      }
      advanceQueue(1);
    };

    return () => { a.pause(); a.src = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = useCallback((track: Track) => {
    const a = audioRef.current;
    if (!a) return;
    setCurrentTrack(track);
    currentTrackRef.current = track;
    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);

    const url = resolveUrl(track);
    // If the preload audio already buffered this track, swap buffers instantly
    a.src = url;
    a.load();
    a.play().catch(() => {});
  }, []);

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

    // Preload track after next
    const preloadIdx = (ni + 1) % q.length;
    if (q[preloadIdx]) preloadTrack(q[preloadIdx]);
  }, [playTrack]);

  const selectTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
      queueRef.current = newQueue;
    }
    playTrack(track);

    // Preload next in queue
    const q = newQueue ?? queueRef.current;
    const idx = q.findIndex(t => t.id === track.id);
    const nextIdx = (idx + 1) % q.length;
    if (q[nextIdx] && q[nextIdx].id !== track.id) preloadTrack(q[nextIdx]);
  }, [playTrack]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !currentTrackRef.current) return;
    a.paused ? a.play().catch(() => {}) : a.pause();
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
