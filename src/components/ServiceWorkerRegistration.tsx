"use client";

import { useEffect } from "react";

/** Registers sw.js on mount — client-only, since navigator.serviceWorker
 * doesn't exist during SSR. Renders nothing; this is pure side-effect
 * wiring for offline install/playback (see sw.js's own doc comment). */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  }, []);

  return null;
}
