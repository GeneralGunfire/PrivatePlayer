// Service worker for offline install/playback.
//
// Strategy: the app shell (JS/CSS/HTML navigation, library.json, cover
// art) is precached on install so the app opens and browses fully offline
// immediately after installing. The "House" playlist (~109MB, see
// HOUSE_PLAYLIST_FILES below) is ALSO precached on install — small enough
// to be a normal app-sized download, and the one playlist meant to work
// offline out of the box with no setup.
//
// The rest of the library (214 tracks, ~1.5GB total) is NOT force-
// downloaded on install — too large/slow for an automatic install step,
// and would risk iOS Safari's PWA storage quota. Instead:
//   - cache-on-play: any track you actually listen to once online is
//     cached for offline afterward (the fetch handler below).
//   - a real opt-in "Download all for offline" action in Library (see
//     use-download-all.ts / the Library page's Offline section) lets the
//     user explicitly pull down every remaining track while online, for
//     when they genuinely want the whole thing available before going
//     offline rather than relying on having played everything once.
const SHELL_CACHE = "pp-shell-v2";
const AUDIO_CACHE = "pp-audio-v1";

const SHELL_ASSETS = [
  "/",
  "/search",
  "/library",
  "/dj",
  "/manifest.json",
  "/library.json",
];

// Filenames, not the base64url track ids — matches the real /music/ paths
// directly so this list doesn't need base64 decoding logic duplicated here.
// Keep in sync with HOUSE_PLAYLIST_TRACK_IDS in src/lib/data.ts.
const HOUSE_PLAYLIST_FILES = [
  "Better Off Alone.mp3",
  "Done tell em.mp3",
  "Free Your Mind.mp3",
  "How deep is your love.mp3",
  "Kavkaz - Starly.mp3",
  "Massive Drake.mp3",
  "My Destiny.mp3",
  "My Love Route 94.mp3",
  "Show Me Love Robin S.mp3",
  "Sugar and Brownies.mp3",
  "The color Violet Tory Lanez.mp3",
  "World, Hold on Bob Sinclair.mp3",
  "Calvin Harris, Rihanna - This Is What You Came For (Official Video).mp3",
  "Believe Me by Navos.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE).then((cache) =>
        // Best-effort — a single failed URL (e.g. a route not yet built in
        // dev) shouldn't block the whole install.
        Promise.allSettled(SHELL_ASSETS.map((url) => cache.add(url))),
      ),
      caches.open(AUDIO_CACHE).then((cache) =>
        Promise.allSettled(
          HOUSE_PLAYLIST_FILES.map((name) => cache.add(`/music/${encodeURIComponent(name)}`)),
        ),
      ),
    ]),
  );
  self.skipWaiting();
});

// "Download all for offline" — the Library page's button posts this
// message and listens for progress/done replies, rather than making a
// second parallel caching code path in the page itself. Keeps ONE real
// implementation of "fetch a track and cache.put it" (this file), so the
// install-time House precache and the on-demand full-library download
// can't drift into two different behaviors for the same operation.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "DOWNLOAD_ALL_TRACKS") return;
  const tracks = Array.isArray(event.data.tracks) ? event.data.tracks : [];
  const port = event.ports[0];

  (async () => {
    const cache = await caches.open(AUDIO_CACHE);
    let done = 0;
    for (const src of tracks) {
      try {
        const cached = await cache.match(src);
        if (!cached) {
          const response = await fetch(src);
          if (response.ok) await cache.put(src, response);
        }
      } catch {
        // One track failing (renamed/missing/network hiccup) shouldn't
        // abort the rest of the batch.
      }
      done += 1;
      port?.postMessage({ type: "PROGRESS", done, total: tracks.length });
    }
    port?.postMessage({ type: "DONE", done, total: tracks.length });
  })();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== AUDIO_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

function isAudioRequest(url) {
  return url.pathname.startsWith("/music/");
}

function isCoverRequest(url) {
  return url.pathname.startsWith("/covers/") || url.pathname.startsWith("/covers-fallback/");
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // fonts, etc. — let the browser handle those normally
  if (event.request.method !== "GET") return;

  if (isAudioRequest(url)) {
    // Cache-on-play: serve from cache if present, otherwise fetch and
    // stash a copy for next time. mp3s are immutable once uploaded, so
    // there's no staleness concern with keeping them forever.
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      }),
    );
    return;
  }

  if (isCoverRequest(url)) {
    // Covers are small and static — cache-first is fine.
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) cache.put(event.request, response.clone());
        return response;
      }),
    );
    return;
  }

  // App shell / navigation / library.json — network-first so a real
  // deploy update is picked up immediately when online, falling back to
  // the cached shell when offline.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match("/"))),
  );
});
