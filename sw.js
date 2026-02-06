const CACHE_NAME = "afit-dgm-offline-v1";
const OFFLINE_URL = "offline.html";

// 1. INSTALL: Cache the offline page immediately
self.addEventListener("install", (event) => {
  console.log('[Service Worker] Installing & Caching Offline Page');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Clean up old caches (Good for updates)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
  self.clients.claim();
});

// 3. FETCH: The Logic -> Try Network first, if fails -> Show Offline Page
self.addEventListener("fetch", (event) => {
  // We only want to handle page navigations (not images/css for now)
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // A. Try the Internet first
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // B. If Internet fails, show the custom "No Wahala" page
          console.log('[Service Worker] Network failed. Serving offline page.');
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});