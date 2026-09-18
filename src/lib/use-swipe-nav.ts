"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

// Same order as TopNav's tab list, with Home prepended — Home has no tab
// of its own (the brand mark is its way back) but is still a real page in
// the swipe sequence, matching how a paged mobile app treats its start
// screen as page zero rather than an outlier.
const PAGES = ["/", "/search", "/library", "/dj"];

const SWIPE_MIN_DISTANCE_PX = 60;
// A swipe mostly-horizontal-but-not-perfectly-so is still a swipe; one
// that's more vertical than horizontal is a scroll and must not navigate.
const SWIPE_MAX_VERTICAL_RATIO = 0.5;

/**
 * Left/right swipe = switch between the app's top-level pages (Home ->
 * Search -> Library -> DJ, and back), the mobile-app gesture that request
 * asked for by name. Deliberately page-level, not per-scroll-container: a
 * single `touchstart`/`touchend` pair on the whole document, so it works
 * the same whether the swipe starts over a track list, empty space, or
 * anywhere else on the page.
 *
 * Does NOT run on /dj — the DJ board's own crossfader/knob drag gestures
 * are real horizontal pointer interactions that a page-swipe would
 * constantly misfire against.
 */
export function useSwipeNav() {
  const router = useRouter();
  const pathname = usePathname();
  const startRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (pathname === "/dj") return;

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      startRef.current = { x: t.clientX, y: t.clientY };
    }

    function onTouchEnd(e: TouchEvent) {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < SWIPE_MIN_DISTANCE_PX) return;
      if (Math.abs(dy) > Math.abs(dx) * SWIPE_MAX_VERTICAL_RATIO) return;

      const currentIndex = PAGES.indexOf(pathname);
      if (currentIndex === -1) return;
      // Swipe left (dx < 0) = go forward, same left-to-right reading-order
      // convention as swiping through photos/pages.
      const nextIndex = dx < 0 ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= PAGES.length) return;
      router.push(PAGES[nextIndex]);
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, router]);
}
