"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/lib/player-context";
import BottomNav from "@/components/BottomNav";
import MiniPlayer from "@/components/MiniPlayer";
import PlayerView from "@/components/PlayerView";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { currentTrack, isPlayerOpen } = usePlayer();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Dynamic background blobs — exact from zip */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50px] right-[100px] w-[500px] h-[500px] bg-neutral-600 opacity-20 rounded-full blur-[100px]" />
      </div>

      {/* Page content */}
      <main className="relative z-10 w-full overflow-hidden">
        {children}
      </main>

      {/* Mini player — shows when track loaded, player closed */}
      <AnimatePresence>
        {currentTrack && !isPlayerOpen && <MiniPlayer />}
      </AnimatePresence>

      {/* Bottom nav */}
      <BottomNav />

      {/* Full player — slides up from bottom */}
      <AnimatePresence>
        {isPlayerOpen && <PlayerView />}
      </AnimatePresence>
    </div>
  );
}
