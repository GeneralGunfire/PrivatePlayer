// Service worker for offline install/playback.
//
// Strategy: the app shell (JS/CSS/HTML navigation, library.json, cover
// art) is precached on install so the app opens and browses fully
// offline immediately after installing. Audio files are NOT precached —
// 202 tracks is several hundred MB, too much to force-download on
// install — instead each track is cached the first time it's actually
// played (cache-on-play), so anything already listened to once works
// offline afterward, and the initial install stays small.
const SHELL_CACHE = "pp-shell-v1";
const AUDIO_CACHE = "pp-audio-v1";

const SHELL_ASSETS = [
  "/",
  "/search",
  "/library",
  "/dj",
  "/manifest.json",
  "/library.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      // Best-effort — a single failed URL (e.g. a route not yet built in
      // dev) shouldn't block the whole install.
      Promise.allSettled(SHELL_ASSETS.map((url) => cache.add(url))),
    ),
  );
  self.skipWaiting();
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
