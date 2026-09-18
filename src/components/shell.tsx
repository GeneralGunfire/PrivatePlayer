"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/lib/player-context";
import { useSwipeNav } from "@/lib/use-swipe-nav";
import TopNav from "@/components/TopNav";
import MiniPlayer from "@/components/MiniPlayer";
import PlayerView from "@/components/PlayerView";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { currentTrack, isPlayerOpen } = usePlayer();
  const pathname = usePathname();
  // The DJ board is its own full-screen fixed overlay (own header, own
  // transport per deck) — showing the mini-player/nav underneath it would
  // just be a second, conflicting transport bar stacked on top of the
  // mixer's own.
  const isDjBoard = pathname === "/dj";
  // Swipe left/right between top-level pages — disabled internally while
  // on /dj (see the hook's own comment); still active while the expanded
  // PlayerView is open since that view has no competing horizontal drag
  // gesture of its own to fight.
  useSwipeNav();

  return (
    <>
      {/* Flat ground — no background blobs. The old fixed blurred-blob
          pair (a white one top-left, a grey one bottom-right) sat behind
          every page including the expanded player, which is exactly the
          "grey bars in the background" that was reported — a rebuild is
          the right time to drop the whole pattern rather than recolor it. */}
      <div className="min-h-screen bg-ink text-white selection:bg-white selection:text-black">
        {!isDjBoard && <TopNav />}
        <main className={isDjBoard ? "relative" : "relative pt-14 md:pt-16"}>
          {children}
        </main>
      </div>

      {!isDjBoard && (
        <>
          <AnimatePresence>
            {currentTrack && !isPlayerOpen && <MiniPlayer />}
          </AnimatePresence>

          <AnimatePresence>
            {isPlayerOpen && <PlayerView />}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
