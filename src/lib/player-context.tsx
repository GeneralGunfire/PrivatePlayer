"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Track } from "@/lib/tracks";
import { ALL_TRACKS } from "@/lib/playlists";

interface PlayerState {
  queue: Track[];
  index: number;
  playing: boolean;
  shuffle: boolean;
  repeat: boolean;
}

interface PlayerCtx extends PlayerState {
  activeTrack: Track | null;
  play:      (track: Track, queue?: Track[]) => void;
  pause:     () => void;
  toggle:    () => void;
  next:      () => void;
  prev:      () => void;
  seekTo:    (pct: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  toggleRepeat:  () => void;
  audioRef:  React.RefObject<HTMLAudioElement | null>;
  progress:  number;
  currentTime: number;
  duration:  number;
  volume:    number;
  muted:     boolean;
  toggleMute: () => void;
}

const Ctx = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [queue,   setQueue]   = useState<Track[]>(ALL_TRACKS);
  const [index,   setIndex]   = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat,  setRepeat]  = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [volume,      setVolumeState] = useState(1);
  const [muted,       setMuted]       = useState(false);

  const play = useCallback((track: Track, newQueue?: Track[]) => {
    const q = newQueue ?? queue;
    const i = q.findIndex(t => t.id === track.id);
    if (i < 0) return;
    setQueue(q);
    setIndex(i);
    setPlaying(true);
    setProgress(0); setCurrentTime(0);
    // src swap handled via effect in the audio element
    if (audioRef.current) {
      audioRef.current.src  = track.src;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [queue]);

  const pause  = useCallback(() => { audioRef.current?.pause(); setPlaying(false); }, []);
  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setPlaying(p => !p);
  }, [playing]);

  const next = useCallback(() => {
    if (!queue.length) return;
    let ni: number;
    if (shuffle) {
      const others = queue.map((_, i) => i).filter(i => i !== index);
      ni = others[Math.floor(Math.random() * others.length)] ?? 0;
    } else {
      ni = (index + 1) % queue.length;
    }
    const t = queue[ni];
    setIndex(ni); setPlaying(true); setProgress(0); setCurrentTime(0);
    if (audioRef.current) { audioRef.current.src = t.src; audioRef.current.load(); audioRef.current.play().catch(() => {}); }
  }, [queue, index, shuffle]);

  const prev = useCallback(() => {
    if (!queue.length) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0; return;
    }
    const ni = (index - 1 + queue.length) % queue.length;
    const t  = queue[ni];
    setIndex(ni); setPlaying(true); setProgress(0); setCurrentTime(0);
    if (audioRef.current) { audioRef.current.src = t.src; audioRef.current.load(); audioRef.current.play().catch(() => {}); }
  }, [queue, index]);

  const seekTo = useCallback((pct: number) => {
    if (!audioRef.current?.duration) return;
    const t = (pct / 100) * audioRef.current.duration;
    audioRef.current.currentTime = t;
    setProgress(pct);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v); setMuted(v === 0);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const next = !muted;
    setMuted(next);
    audioRef.current.volume = next ? 0 : volume;
  }, [muted, volume]);

  // Audio event handlers
  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    const pct = (a.currentTime / a.duration) * 100;
    setProgress(isFinite(pct) ? pct : 0);
    setCurrentTime(a.currentTime);
  };
  const onMeta = () => { setDuration(audioRef.current?.duration || 0); };
  const onPlay  = () => setPlaying(true);
  const onPause = () => setPlaying(false);
  const onEnded = () => { repeat ? (audioRef.current!.currentTime = 0, audioRef.current!.play().catch(() => {})) : next(); };

  const activeTrack = index >= 0 ? queue[index] ?? null : null;

  return (
    <Ctx.Provider value={{
      queue, index, playing, shuffle, repeat,
      activeTrack, play, pause, toggle, next, prev, seekTo, setVolume,
      toggleShuffle: () => setShuffle(s => !s),
      toggleRepeat:  () => setRepeat(r => !r),
      audioRef, progress, currentTime, duration, volume, muted, toggleMute,
    }}>
      {/* Single audio element for the whole app */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onMeta}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
