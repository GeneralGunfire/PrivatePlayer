"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createDeckChain, getDeckDefaults, type EffectChain, type ParamValues } from "./dsp";
import { ensureMasterBus } from "./audioGraph";
import type { Track } from "@/lib/data";

export interface DeckBEngine {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  analyser: AnalyserNode | null;
  djEffects: ParamValues;
  setDjEffects: (patch: Partial<ParamValues>) => void;
  resetDjEffects: () => void;
  gain: number;
  setGain: (v: number) => void;
  loadTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (fractionalPercent: number) => void;
  unload: () => void;
}

/**
 * A second playback engine for the DJ board's Deck B — ported from
 * Udaan's desktop useDeckB.ts. The only real change: Udaan resolves a
 * local file path via Tauri's `convertFileSrc`; here `track.src` is
 * already a playable `/music/...` URL straight from the library scan, so
 * that translation layer just isn't needed.
 *
 * Deck B is intentionally simpler than Deck A (the main player): no
 * queue/shuffle/repeat/favorites — a single loaded track for mixing
 * against Deck A, not a second instance of the whole player.
 */
export function useDeckB(): DeckBEngine {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
  }

  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [djEffects, setDjEffectsState] = useState<ParamValues>(getDeckDefaults());
  const [gain, setGainState] = useState(1);
  const gainRef = useRef(1);

  const audioContextRef = useRef<AudioContext | null>(null);
  const djChainRef = useRef<EffectChain | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const djEffectsRef = useRef<ParamValues>(getDeckDefaults());
  djEffectsRef.current = djEffects;
  gainRef.current = gain;

  const ensureGraph = useCallback(() => {
    if (audioContextRef.current) return;
    const a = audioRef.current;
    if (!a) return;
    try {
      const bus = ensureMasterBus();
      if (!bus) return;
      const ctx = bus.ctx;
      const source = ctx.createMediaElementSource(a);
      const djChain = createDeckChain(ctx);
      djChain.apply(djEffectsRef.current, ctx.currentTime);
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.55;
      const deckGain = ctx.createGain();
      deckGain.gain.value = gainRef.current;
      source.connect(djChain.input);
      djChain.output.connect(node);
      node.connect(deckGain);
      deckGain.connect(bus.input);
      audioContextRef.current = ctx;
      djChainRef.current = djChain;
      gainNodeRef.current = deckGain;
      setAnalyser(node);
    } catch (err) {
      console.error("Deck B: failed to set up audio graph:", err);
    }
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTimeUpdate = () => setCurrentTime(a.currentTime);
    const onDurationChange = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onCanPlay = () => setIsLoading(false);
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("durationchange", onDurationChange);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("canplay", onCanPlay);
    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("durationchange", onDurationChange);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      try {
        gainNodeRef.current?.disconnect();
      } catch {
        // Already disconnected.
      }
    };
  }, []);

  const loadTrack = useCallback(
    (t: Track) => {
      const a = audioRef.current;
      if (!a) return;
      setTrack(t);
      setIsLoading(true);
      a.src = t.src;
      a.load();
      const tryPlay = () => {
        ensureGraph();
        if (audioContextRef.current?.state === "suspended") void audioContextRef.current.resume();
        a.play().catch((err) => {
          if (err?.name !== "NotAllowedError" && err?.name !== "AbortError") {
            console.error("Deck B playback failed:", err);
          }
        });
      };
      if (a.readyState >= 3) tryPlay();
      else a.addEventListener("canplay", tryPlay, { once: true });
    },
    [ensureGraph],
  );

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !track) return;
    if (a.paused) {
      ensureGraph();
      if (audioContextRef.current?.state === "suspended") void audioContextRef.current.resume();
      a.play().catch((err) => {
        if (err?.name !== "NotAllowedError" && err?.name !== "AbortError") console.error("Deck B playback failed:", err);
      });
    } else {
      a.pause();
    }
  }, [track, ensureGraph]);

  const seek = useCallback((fractionalPercent: number) => {
    const a = audioRef.current;
    if (!a || !Number.isFinite(a.duration)) return;
    a.currentTime = (fractionalPercent / 100) * a.duration;
  }, []);

  const unload = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    setTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const setDjEffects = useCallback((patch: Partial<ParamValues>) => {
    setDjEffectsState((prev) => {
      const next: ParamValues = { ...prev };
      for (const [key, value] of Object.entries(patch)) {
        if (value !== undefined) next[key] = value;
      }
      const chain = djChainRef.current;
      const ctx = audioContextRef.current;
      if (chain && ctx) chain.apply(next, ctx.currentTime);
      return next;
    });
  }, []);

  const resetDjEffects = useCallback(() => {
    setDjEffectsState(getDeckDefaults());
    const chain = djChainRef.current;
    const ctx = audioContextRef.current;
    if (chain && ctx) chain.apply(getDeckDefaults(), ctx.currentTime);
  }, []);

  const setGain = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setGainState(clamped);
    gainRef.current = clamped;
    const node = gainNodeRef.current;
    const ctx = audioContextRef.current;
    if (node && ctx) node.gain.setTargetAtTime(clamped, ctx.currentTime, 0.02);
  }, []);

  return {
    track,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    analyser,
    djEffects,
    setDjEffects,
    resetDjEffects,
    gain,
    setGain,
    loadTrack,
    togglePlay,
    seek,
    unload,
  };
}
