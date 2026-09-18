"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { Track } from "@/lib/data";
import { onLibraryLoaded, ALL_TRACKS } from "@/lib/data";
import { ensureMasterBus } from "@/lib/dj/audioGraph";
import { createDeckChain, getDeckDefaults, type EffectChain, type ParamValues } from "@/lib/dj/dsp";

/** Where the currently-playing track/position is checkpointed — see the
 *  backgrounding-resilience effects below for why. */
const PLAYBACK_STATE_KEY = "pp.playback-state";

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
  /** DJ board (Deck A side) — the deck's own effect chain (EQ, filter
   *  sweep, color/time effects), applied on the shared master bus so it
   *  sums correctly with Deck B. Genuinely inert at getDeckDefaults(), so
   *  normal playback outside the DJ board is untouched by this existing. */
  djEffects: ParamValues;
  setDjEffects: (patch: Partial<ParamValues>) => void;
  resetDjEffects: () => void;
  /** Crossfader multiplier for Deck A's own output, 0-1 — see
   *  DjEffectsPanel's own crossfader math. Always 1 outside the DJ board. */
  setOutputMultiplier: (factor: number) => void;
}

const Ctx = createContext<PlayerCtx | null>(null);

function resolveUrl(track: Track): string {
  // library.json already returns the exact, correctly URL-encoded src for
  // every track it lists (see data.ts's doc comment) — the fuzzy
  // filename-matching TRACK_SRC_MAP/resolve-track.ts layer this used to go
  // through existed only to bridge hand-typed metadata to real files,
  // which a live tag scan no longer needs.
  return track.src;
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

  const [queue,        setQueue]        = useState<Track[]>([]);
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
  const [djEffects,    setDjEffectsState] = useState<ParamValues>(getDeckDefaults());

  const shuffleRef      = useRef(shuffle);     shuffleRef.current      = shuffle;
  const repeatRef       = useRef(repeat);      repeatRef.current       = repeat;
  const queueRef        = useRef(queue);        queueRef.current        = queue;
  const currentTrackRef = useRef(currentTrack); currentTrackRef.current = currentTrack;
  const sleepTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const djChainRef       = useRef<EffectChain | null>(null);
  const deckGainRef      = useRef<GainNode | null>(null);
  const djEffectsRef     = useRef<ParamValues>(getDeckDefaults());
  djEffectsRef.current = djEffects;

  // Throttle timeupdate to avoid excessive React re-renders
  const lastUpdateRef = useRef(0);

  // Seed the default queue with the full library once the live scan
  // resolves — the queue starts empty now (no more static ALL_TRACKS
  // array to initialize state with), and only if nothing has already
  // picked a specific queue (e.g. selecting a track from Search before
  // this fires) does this default apply.
  useEffect(() => {
    return onLibraryLoaded((tracks) => {
      if (queueRef.current.length === 0) {
        queueRef.current = tracks;
        setQueue(tracks);
      }
    });
  }, []);

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

  // Lazily wires the playback element into the SHARED master bus (see
  // lib/dj/audioGraph.ts) the first time playback starts — AudioContext
  // must be created/resumed from a user gesture, so this can't happen at
  // mount. This used to build its own private AudioContext straight to
  // `ctx.destination`, which worked for the visualizer alone but gave
  // the DJ board nowhere to route Deck A's effect chain or crossfader
  // multiplier through. Joining the shared bus instead means: this is
  // still the ONLY place `createMediaElementSource` is ever called on
  // this element (that call can only happen once per element, ever), the
  // analyser this exposes is unchanged in shape, and normal playback
  // outside the DJ board sounds identical — the chain is constructed at
  // getDeckDefaults(), which is genuinely inert (verified the same way
  // Udaan's own desktop deck chain is).
  const ensureAnalyser = useCallback(() => {
    const a = audioRef.current;
    if (!a || audioCtxRef.current) return;
    try {
      const bus = ensureMasterBus();
      if (!bus) return;
      const ctx = bus.ctx;
      const source = ctx.createMediaElementSource(a);
      const djChain = createDeckChain(ctx);
      djChain.apply(djEffectsRef.current, ctx.currentTime);
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.75;
      const deckGain = ctx.createGain();
      deckGain.gain.value = 1;
      source.connect(djChain.input);
      djChain.output.connect(node);
      node.connect(deckGain);
      deckGain.connect(bus.input);
      audioCtxRef.current = ctx;
      djChainRef.current = djChain;
      deckGainRef.current = deckGain;
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

  // Restores whatever was checkpointed by the saveState effect above,
  // loaded-but-paused rather than auto-played — both because mobile
  // browsers block unprompted autoplay outside a real user gesture (an
  // auto play() call here would just silently fail) and because "the app
  // reloaded and immediately started blasting audio" would be its own bad
  // surprise. This is what turns "iOS discarded the page and playback is
  // just gone" into "reopen the app, the right track and position are
  // already loaded, tap play" — the state itself survives even when the
  // page process doesn't.
  useEffect(() => {
    return onLibraryLoaded(() => {
      if (currentTrackRef.current) return; // something already selected first
      try {
        const raw = localStorage.getItem(PLAYBACK_STATE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw) as { trackId: string; positionSeconds: number; savedAt: number };
        // Ignore anything older than a day — a stale checkpoint from days
        // ago resuming mid-song on next launch would be more confusing
        // than just starting fresh.
        if (!saved.trackId || Date.now() - saved.savedAt > 24 * 60 * 60 * 1000) return;
        const track = ALL_TRACKS.find((t) => t.id === saved.trackId);
        if (!track) return;

        const a = audioRef.current;
        if (!a) return;
        setCurrentTrack(track);
        currentTrackRef.current = track;
        a.src = resolveUrl(track);
        a.load();
        const onLoaded = () => {
          a.removeEventListener("loadedmetadata", onLoaded);
          if (Number.isFinite(saved.positionSeconds) && saved.positionSeconds > 0) {
            a.currentTime = saved.positionSeconds;
            setCurrentTime(saved.positionSeconds);
            if (a.duration) setProgress((saved.positionSeconds / a.duration) * 100);
          }
        };
        a.addEventListener("loadedmetadata", onLoaded);
      } catch {
        // Corrupt/unreadable checkpoint — just don't restore anything.
      }
    });
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

  // ── Backgrounding resilience ──────────────────────────────────
  // Two distinct, real mobile problems, both from the same root cause:
  // playback here runs through a full Web Audio graph (createMediaElementSource
  // -> DJ effect chain -> analyser -> shared master bus), and browsers —
  // iOS Safari especially — throttle or fully suspend that processing once
  // the tab is backgrounded/screen-locked, then resume it lazily, which is
  // exactly "staticky and takes a while to stabilize, stuttery" on wake.
  // Under real memory pressure with no signal that this tab is doing
  // something worth keeping alive, iOS can go further and discard the
  // whole page, which reloads-from-scratch on return and drops playback
  // entirely — the second reported bug.
  //
  // Screen Wake Lock keeps the screen (and by extension the page) alive
  // while actively playing — it's not a guarantee against iOS's own tab
  // eviction under severe memory pressure (no web API can fully prevent
  // that), but it is a real, standard signal that measurably reduces how
  // aggressively mobile browsers background/kill an active-media tab, and
  // costs nothing when unsupported — it silently no-ops rather than throwing.
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  useEffect(() => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

    async function acquire() {
      try {
        wakeLockRef.current = await (navigator as Navigator & { wakeLock: WakeLock }).wakeLock.request("screen");
      } catch {
        // Not available right now (e.g. tab not visible, battery saver) —
        // playback itself is unaffected either way.
      }
    }

    if (isPlaying) {
      void acquire();
    } else {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    }

    return () => {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [isPlaying]);

  // Re-request the wake lock on return to the tab — the OS/browser
  // releases it automatically the moment a tab is backgrounded (that's by
  // design, not a bug to work around), so coming back needs to re-acquire
  // it rather than assuming the original request is still held.
  //
  // Proactively resuming a suspended AudioContext the instant the tab
  // becomes visible again (rather than waiting for the next play()/state
  // change to trigger it) is what actually fixes "takes a while to
  // stabilize" — the context was very likely suspended by the browser
  // while backgrounded regardless of isPlaying, and resuming it eagerly on
  // return means real audio processing has already recovered before the
  // user's ear would otherwise catch it still settling.
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState !== "visible") return;
      const ctx = audioCtxRef.current;
      if (ctx?.state === "suspended") void ctx.resume().catch(() => {});
      if (isPlaying && "wakeLock" in navigator && !wakeLockRef.current) {
        void (navigator as Navigator & { wakeLock: WakeLock }).wakeLock
          .request("screen")
          .then((sentinel) => { wakeLockRef.current = sentinel; })
          .catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [isPlaying]);

  // Playback position is checkpointed to localStorage continuously (light
  // 250ms throttle piggybacking on the timeupdate listener already firing
  // every ~100ms above — see PLAYBACK_STATE_KEY below) so that even in the
  // worst case — iOS genuinely discards the page despite the wake lock —
  // reopening the (reloaded-from-scratch) app restores the same track and
  // roughly the same position instead of the user perceiving total
  // playback loss. This is a real, accepted fallback for a failure mode no
  // web API can fully prevent, not a substitute for actually staying alive.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    let lastSave = 0;
    function saveState() {
      if (!currentTrackRef.current) return;
      const now = performance.now();
      if (now - lastSave < 3000) return;
      lastSave = now;
      try {
        localStorage.setItem(PLAYBACK_STATE_KEY, JSON.stringify({
          trackId: currentTrackRef.current.id,
          positionSeconds: a!.currentTime,
          savedAt: Date.now(),
        }));
      } catch {
        // Storage unavailable/full — resuming exactly where the user left
        // off just won't work this time; playback itself is unaffected.
      }
    }
    a.addEventListener("timeupdate", saveState);
    return () => a.removeEventListener("timeupdate", saveState);
  }, []);

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

  // ── DJ board (Deck A side) ──────────────────────────────────
  const setDjEffects = useCallback((patch: Partial<ParamValues>) => {
    setDjEffectsState((prev) => {
      const next: ParamValues = { ...prev };
      for (const [key, value] of Object.entries(patch)) {
        if (value !== undefined) next[key] = value;
      }
      const chain = djChainRef.current;
      const ctx = audioCtxRef.current;
      if (chain && ctx) chain.apply(next, ctx.currentTime);
      return next;
    });
  }, []);

  const resetDjEffects = useCallback(() => {
    setDjEffectsState(getDeckDefaults());
    const chain = djChainRef.current;
    const ctx = audioCtxRef.current;
    if (chain && ctx) chain.apply(getDeckDefaults(), ctx.currentTime);
  }, []);

  const setOutputMultiplier = useCallback((factor: number) => {
    const node = deckGainRef.current;
    const ctx = audioCtxRef.current;
    if (node && ctx) node.gain.setTargetAtTime(Math.min(1, Math.max(0, factor)), ctx.currentTime, 0.02);
  }, []);

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
      djEffects, setDjEffects, resetDjEffects, setOutputMultiplier,
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
