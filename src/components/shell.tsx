"use client";

import { AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/player-context";
import BottomNav from "@/components/BottomNav";
import MiniPlayer from "@/components/MiniPlayer";
import PlayerView from "@/components/PlayerView";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { currentTrack, isPlayerOpen } = usePlayer();

  return (
    <>
      {/* Dynamic background blobs — fixed, behind everything */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50px] right-[100px] w-[500px] h-[500px] bg-neutral-600 opacity-20 rounded-full blur-[100px]" />
      </div>

      {/* Page background */}
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
        {/* Scrollable page content — NO overflow-hidden so fixed children escape */}
        <main className="relative" style={{ zIndex: 1 }}>
          {children}
        </main>
      </div>

      {/* Mini player — fixed, above content, below full player */}
      <AnimatePresence>
        {currentTrack && !isPlayerOpen && <MiniPlayer />}
      </AnimatePresence>

      {/* Bottom nav — fixed, always on top of content */}
      <BottomNav />

      {/* Full player — fixed, topmost */}
      <AnimatePresence>
        {isPlayerOpen && <PlayerView />}
      </AnimatePresence>
    </>
  );
}
