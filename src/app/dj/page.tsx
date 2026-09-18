"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, FolderOpen, RotateCcw } from "lucide-react";
import Link from "next/link";
import { usePlayer } from "@/lib/player-context";
import { useDeckB } from "@/lib/dj/useDeckB";
import { useMasterBus } from "@/lib/dj/hooks/useMasterBus";
import { createDeckChain, type ParamSpec } from "@/lib/dj/dsp";
import { DeckStrip, type DeckLike } from "@/components/dj/DeckStrip";
import { Crossfader } from "@/components/dj/Crossfader";
import { MasterSection } from "@/components/dj/MasterSection";
import { MixAssist } from "@/components/dj/MixAssist";
import { DeckBPicker } from "@/components/dj/DeckBPicker";
import type { Track } from "@/lib/data";

/**
 * Two-deck DJ mixer — mobile layout. Udaan's desktop version is three
 * columns side by side (Deck A | mixer | Deck B); that doesn't fit or work
 * on a phone screen, so this stacks the two decks with a tab switcher and
 * keeps the crossfader + master EQ pinned in a compact bar so blending is
 * always reachable without needing both decks visible at once.
 *
 * Deck A is the same app-wide "now playing" player every other page uses
 * (via usePlayer()) — mixing here never disturbs what's playing elsewhere.
 * Deck B is a fully independent second engine (useDeckB) that only exists
 * while this page is mounted.
 */
export default function DjBoardPage() {
  const player = usePlayer();
  const deckB = useDeckB();
  const master = useMasterBus();
  const [activeSide, setActiveSide] = useState<"A" | "B">("A");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [crossfade, setCrossfade] = useState(0); // -1..1, 0 = center (both full)

  const deckA: DeckLike = {
    track: player.currentTrack,
    isPlaying: player.isPlaying,
    currentTime: player.currentTime,
    duration: player.duration,
    analyser: player.analyser,
    djEffects: player.djEffects,
    setDjEffects: player.setDjEffects,
    togglePlay: player.togglePlay,
    seek: player.seek,
  };

  // OfflineAudioContext only exists in the browser — Next.js prerenders
  // this page's module during the build even though it's "use client",
  // so building the schema-probe chain eagerly (e.g. via useMemo, which
  // still runs its initializer during SSR/prerender on the first render
  // pass) throws server-side. Deferred into an effect instead, so it only
  // ever runs client-side after mount.
  const [specs, setSpecs] = useState<ParamSpec[]>([]);
  useEffect(() => {
    const probe = new OfflineAudioContext(2, 1, 44100) as unknown as AudioContext;
    const chain = createDeckChain(probe);
    setSpecs(chain.params);
    chain.dispose();
  }, []);

  // Crossfader math: center plays both decks at their own full volume —
  // sliding toward one side pulls the OTHER deck down to silence at the
  // extreme, matching a physical mixer crossfader. Same as Udaan's desktop
  // board. Restored automatically on unmount so Deck A's real volume is
  // never left altered by having opened the DJ board.
  useEffect(() => {
    const aMultiplier = Math.min(1, 1 - Math.max(0, crossfade));
    const bMultiplier = Math.min(1, 1 + Math.min(0, crossfade));
    player.setOutputMultiplier(aMultiplier);
    deckB.setGain(bMultiplier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossfade]);

  useEffect(() => {
    return () => {
      player.setOutputMultiplier(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePickTrack(track: Track) {
    deckB.loadTrack(track);
    setPickerOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 pt-[calc(env(safe-area-inset-top,0px)+10px)] pb-3">
        <Link href="/" aria-label="Close DJ board" className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/8">
          <ChevronLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-bold uppercase tracking-tight">DJ Board</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Two-deck mixer</p>
        </div>
        <button
          onClick={() => {
            player.resetDjEffects();
            deckB.resetDjEffects();
            master.reset();
          }}
          aria-label="Reset all effects"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/8"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Mixer bar — always visible regardless of which deck tab is open */}
      <div className="flex shrink-0 items-center gap-4 overflow-x-auto border-b border-white/8 px-4 py-3">
        <div className="min-w-0 flex-1">
          <Crossfader value={crossfade} onChange={setCrossfade} />
        </div>
        <div className="h-12 w-px shrink-0 bg-white/8" />
        <MixAssist
          trackA={player.currentTrack}
          trackB={deckB.track}
          onMatchLoudness={(db) => deckB.setDjEffects({ gain: db })}
        />
        <div className="h-12 w-px shrink-0 bg-white/8" />
        <MasterSection settings={master.settings} onChange={master.setSettings} />
      </div>

      {/* Deck tabs */}
      <div className="flex shrink-0 gap-2 px-4 pt-3">
        {(["A", "B"] as const).map((side) => (
          <button
            key={side}
            onClick={() => setActiveSide(side)}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              activeSide === side ? "bg-accent text-white" : "bg-white/6 text-white/40"
            }`}
          >
            Deck {side}
            {side === "A" && player.currentTrack ? " •" : side === "B" && deckB.track ? " •" : ""}
          </button>
        ))}
      </div>

      {/* Active deck */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]">
        {activeSide === "A" ? (
          <DeckStrip deck={deckA} specs={specs} side="A" />
        ) : (
          <DeckStrip
            deck={deckB}
            specs={specs}
            side="B"
            extra={
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white"
                >
                  <FolderOpen size={12} />
                  {deckB.track ? "Change track" : "Load track"}
                </button>
                {deckB.track && (
                  <button
                    onClick={deckB.unload}
                    className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-red-400"
                  >
                    Eject
                  </button>
                )}
              </div>
            }
          />
        )}
      </div>

      {pickerOpen && <DeckBPicker onPick={handlePickTrack} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}
