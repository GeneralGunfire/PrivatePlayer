"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { Track } from "@/lib/data";
import { ALL_TRACKS } from "@/lib/data";
import { findBestFile } from "@/lib/resolve-track";

interface PlayerCtx {
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;       // 0-100
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  isPlayerOpen: boolean;
  // Actions
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

// ── Cached music file list ────────────────────────────────
let _cachedFiles: string[] | null = null;
let _fetchPromise: Promise<string[]> | null = null;

async function getMusicFiles(): Promise<string[]> {
  if (_cachedFiles) return _cachedFiles;
  if (_fetchPromise) return _fetchPromise;
  _fetchPromise = fetch("/api/music-files")
    .then(r => r.json())
    .then(d => { _cachedFiles = d.files ?? []; return _cachedFiles!; })
    .catch(() => { _cachedFiles = []; return []; });
  return _fetchPromise;
}

async function resolveTrackSrc(track: Track): Promise<string> {
  const files = await getMusicFiles();
  const match = findBestFile(files, track.title, track.artist);
  return match ? `/music/${encodeURIComponent(match)}` : track.src;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [queue,         setQueue]         = useState<Track[]>(ALL_TRACKS);
  const [currentTrack,  setCurrentTrack]  = useState<Track | null>(null);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [shuffle,       setShuffle]       = useState(false);
  const [repeat,        setRepeat]        = useState(false);
  const [isPlayerOpen,  setIsPlayerOpen]  = useState(false);

  const shuffleRef = useRef(shuffle);
  shuffleRef.current = shuffle;
  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    const a = audioRef.current;

    a.ontimeupdate = () => {
      if (!a.duration) return;
      setCurrentTime(a.currentTime);
      setProgress((a.currentTime / a.duration) * 100);
    };
    a.onloadedmetadata = () => setDuration(a.duration);
    a.onplay  = () => setIsPlaying(true);
    a.onpause = () => setIsPlaying(false);
    a.onended = () => {
      if (repeatRef.current && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        return;
      }
      advanceQueue(1);
    };

    // Pre-warm the file list
    getMusicFiles();

    return () => { a.pause(); a.src = ""; };
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

    const next = q[ni];
    setCurrentTrack(next);
    resolveTrackSrc(next).then(src => {
      const a = audioRef.current;
      if (!a) return;
      a.src = src;
      a.load();
      a.play().catch(() => {});
    });
  }, []);

  const selectTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
      queueRef.current = newQueue;
    }
    setCurrentTrack(track);
    currentTrackRef.current = track;
    resolveTrackSrc(track).then(src => {
      const a = audioRef.current;
      if (!a) return;
      a.src = src;
      a.load();
      a.play().catch(() => {});
    });
  }, []);

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
  }, []);

  return (
    <Ctx.Provider value={{
      queue, currentTrack, isPlaying, progress, currentTime, duration,
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
