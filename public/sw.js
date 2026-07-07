/*
 * Lightweight offline service worker for the Grade 9 Science app.
 *
 * No build-time PWA plugin is used (AGENTS.md asks to avoid heavy dependencies).
 * Strategy:
 *   - Navigations: network-first, falling back to the cached app shell when offline.
 *   - Same-origin GET assets (Vite's hashed JS/CSS): cache-first, then network, and
 *     cache whatever we fetch so the next offline visit is served from the cache.
 * Because assets are cached as they are fetched, the first online load populates the
 * cache and later loads work with no network.
 */
const CACHE = "g9-science-v1";
const APP_SHELL = "./index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(APP_SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // App navigations: try the network, fall back to the cached shell offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(APP_SHELL, copy));
          return response;
        })
        .catch(() => caches.match(APP_SHELL))
    );
    return;
  }

  // Static assets: serve from cache first, otherwise fetch and cache.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
    )
  );
});
