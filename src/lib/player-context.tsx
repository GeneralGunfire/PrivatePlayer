"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { Track } from "@/lib/data";
import { ALL_TRACKS } from "@/lib/data";

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

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [queue,       setQueue]       = useState<Track[]>(ALL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [shuffle,     setShuffle]     = useState(false);
  const [repeat,      setRepeat]      = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

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
      if (repeat) { a.currentTime = 0; a.play(); return; }
      nextTrack();
    };

    return () => { a.pause(); a.src = ""; };
  }, []);

  // Keep repeat ref fresh for onended closure
  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;

  const nextTrack = useCallback(() => {
    setQueue(q => {
      setCurrentTrack(cur => {
        if (!cur || !q.length) return cur;
        const idx = q.findIndex(t => t.id === cur.id);
        const ni  = shuffle
          ? Math.floor(Math.random() * q.length)
          : (idx + 1) % q.length;
        const next = q[ni];
        if (audioRef.current) {
          audioRef.current.src = next.src;
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
      return q;
    });
  }, [shuffle]);

  const selectTrack = useCallback((track: Track, newQueue?: Track[]) => {
    if (newQueue) setQueue(newQueue);
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
  }, [isPlaying, currentTrack]);

  const next = useCallback(() => nextTrack(), [nextTrack]);

  const prev = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.currentTime > 3) { a.currentTime = 0; return; }
    setQueue(q => {
      setCurrentTrack(cur => {
        if (!cur || !q.length) return cur;
        const idx = q.findIndex(t => t.id === cur.id);
        const pi  = (idx - 1 + q.length) % q.length;
        const prev = q[pi];
        a.src = prev.src; a.load(); a.play().catch(() => {});
        return prev;
      });
      return q;
    });
  }, []);

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
      toggleShuffle: () => setShuffle(s => !s),
      toggleRepeat:  () => setRepeat(r => !r),
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
