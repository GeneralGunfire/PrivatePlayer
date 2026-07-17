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
  sleepTimerEndsAt: number | null;
  analyser:      AnalyserNode | null;
  selectTrack:   (track: Track, queue?: Track[]) => void;
  togglePlay:    () => void;
  next:          () => void;
  prev:          () => void;
  seek:          (pct: number) => void;
  toggleShuffle: () => void;
  toggleRepeat:  () => void;
  openPlayer:    () => void;
  closePlayer:   () => void;
  playAt:        (index: number) => void;
  reorderQueue:  (fromIndex: number, toIndex: number) => void;
  removeFromQueue: (index: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  downloadCurrent: () => void;
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
  const [sleepTimerEndsAt, setSleepTimerEndsAt] = useState<number | null>(null);
  const [analyser,     setAnalyser]     = useState<AnalyserNode | null>(null);

  const shuffleRef      = useRef(shuffle);     shuffleRef.current      = shuffle;
  const repeatRef       = useRef(repeat);      repeatRef.current       = repeat;
  const queueRef        = useRef(queue);        queueRef.current        = queue;
  const currentTrackRef = useRef(currentTrack); currentTrackRef.current = currentTrack;
  const sleepTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef      = useRef<AudioContext | null>(null);

  // Throttle timeupdate to avoid excessive React re-renders
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    a.crossOrigin = "anonymous";
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

  // Lazily wire up a Web Audio analyser the first time playback starts.
  // AudioContext must be created/resumed from a user gesture, so this
  // can't happen at mount — it happens on first tryPlay() below.
  const ensureAnalyser = useCallback(() => {
    const a = audioRef.current;
    if (!a || audioCtxRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(a);
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.75;
      source.connect(node);
      node.connect(ctx.destination);
      audioCtxRef.current = ctx;
      setAnalyser(node);
    } catch {
      // Web Audio unavailable (e.g. very old browser) — visualizer just won't render.
    }
  }, []);

  const loadAndPlay = useCallback((url: string) => {
    const a = audioRef.current;
    if (!a) return;

    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    lastUpdateRef.current = 0;

    // Always reset src + load on the real playback element. If the
    // preloader already fetched this URL, the browser's HTTP cache
    // (mp3s are served immutable) serves it back instantly — no need
    // to hand-swap buffered state between two separate <audio> nodes,
    // which was leaving the element with stale metadata/duration.
    a.src = url;
    a.load();

    const tryPlay = () => {
      ensureAnalyser();
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume().catch(() => {});
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
  }, [ensureAnalyser]);

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

  // ── Media Session — lock-screen / notification transport controls ──
  // Without this, mobile browsers treat the tab as a plain background
  // page once the screen locks and are far more aggressive about
  // suspending it, which is what caused playback to stop or stutter.
  // Registering action handlers tells the OS this is an active media
  // session it should keep alive and route hardware/lock-screen
  // play-pause-skip controls into.
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler("play",  () => audioRef.current?.play().catch(() => {}));
    ms.setActionHandler("pause", () => audioRef.current?.pause());
    ms.setActionHandler("previoustrack", () => prev());
    ms.setActionHandler("nexttrack",     () => next());
    ms.setActionHandler("seekto", (details) => {
      const a = audioRef.current;
      if (a && details.seekTime != null) a.currentTime = details.seekTime;
    });
    return () => {
      ms.setActionHandler("play", null);
      ms.setActionHandler("pause", null);
      ms.setActionHandler("previoustrack", null);
      ms.setActionHandler("nexttrack", null);
      ms.setActionHandler("seekto", null);
    };
  }, [next, prev]);

  // Keep lock-screen metadata (title/artist/artwork) in sync with the track.
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator) || !currentTrack) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album,
      artwork: [
        { src: currentTrack.coverUrl, sizes: "400x400", type: "image/jpeg" },
      ],
    });
  }, [currentTrack]);

  // Keep the lock-screen playback-state indicator (play vs. pause icon) in sync.
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const seek = useCallback((pct: number) => {
    const a = audioRef.current;
    if (!a?.duration) return;
    a.currentTime = (pct / 100) * a.duration;
    setProgress(pct);
    setCurrentTime(a.currentTime);
  }, []);

  // ── Queue management ──────────────────────────────────────
  const playAt = useCallback((index: number) => {
    const q = queueRef.current;
    if (!q[index]) return;
    playTrack(q[index]);
    const pi = (index + 1) % q.length;
    if (q[pi] && q[pi].id !== q[index].id) preload(q[pi]);
  }, [playTrack]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    const q = [...queueRef.current];
    if (fromIndex < 0 || fromIndex >= q.length || toIndex < 0 || toIndex >= q.length) return;
    const [moved] = q.splice(fromIndex, 1);
    q.splice(toIndex, 0, moved);
    queueRef.current = q;
    setQueue(q);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    const q = [...queueRef.current];
    if (index < 0 || index >= q.length) return;
    q.splice(index, 1);
    queueRef.current = q;
    setQueue(q);
  }, []);

  // ── Sleep timer ────────────────────────────────────────────
  const setSleepTimer = useCallback((minutes: number | null) => {
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
      sleepTimeoutRef.current = null;
    }
    if (minutes == null) {
      setSleepTimerEndsAt(null);
      return;
    }
    const endsAt = Date.now() + minutes * 60_000;
    setSleepTimerEndsAt(endsAt);
    sleepTimeoutRef.current = setTimeout(() => {
      audioRef.current?.pause();
      setSleepTimerEndsAt(null);
      sleepTimeoutRef.current = null;
    }, minutes * 60_000);
  }, []);

  useEffect(() => () => { if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current); }, []);

  // ── Download ───────────────────────────────────────────────
  const downloadCurrent = useCallback(() => {
    const track = currentTrackRef.current;
    if (!track) return;
    const url = resolveUrl(track);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // ── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;

      switch (e.code) {
        case "Space":
          if (!currentTrackRef.current) return;
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          if (e.shiftKey) { next(); }
          else { const a = audioRef.current; if (a?.duration) a.currentTime = Math.min(a.duration, a.currentTime + 5); }
          break;
        case "ArrowLeft":
          if (e.shiftKey) { prev(); }
          else { const a = audioRef.current; if (a) a.currentTime = Math.max(0, a.currentTime - 5); }
          break;
        case "ArrowUp":
          e.preventDefault();
          { const a = audioRef.current; if (a) a.volume = Math.min(1, a.volume + 0.1); }
          break;
        case "ArrowDown":
          e.preventDefault();
          { const a = audioRef.current; if (a) a.volume = Math.max(0, a.volume - 0.1); }
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePlay, next, prev]);

  return (
    <Ctx.Provider value={{
      queue, currentTrack, isPlaying, isLoading, progress, currentTime, duration,
      shuffle, repeat, isPlayerOpen, sleepTimerEndsAt, analyser,
      selectTrack, togglePlay, next, prev, seek,
      toggleShuffle: () => { const v = !shuffleRef.current; shuffleRef.current = v; setShuffle(v); },
      toggleRepeat:  () => { const v = !repeatRef.current;  repeatRef.current  = v; setRepeat(v);  },
      openPlayer:    () => setIsPlayerOpen(true),
      closePlayer:   () => setIsPlayerOpen(false),
      playAt, reorderQueue, removeFromQueue, setSleepTimer, downloadCurrent,
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
