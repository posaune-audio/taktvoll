const CACHE_VERSION = "taktvoll-v0.26.44";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async cache => {
      for (const url of APP_SHELL) {
        try {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) await cache.put(url, response.clone());
        } catch (_) {}
      }
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter(name => name !== CACHE_VERSION)
        .map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Do not intercept cross-origin API/CDN/Supabase requests.
  if (url.origin !== self.location.origin) return;

  const isNavigation =
    request.mode === "navigate" ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith("/index.html");

  if (isNavigation) {
    event.respondWith((async () => {
      try {
        // HTML must always prefer the newest GitHub Pages version.
        const fresh = await fetch(request, { cache: "no-store" });
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_VERSION);
          await cache.put("./index.html", fresh.clone());
          return fresh;
        }
      } catch (_) {}

      const cached =
        await caches.match(request) ||
        await caches.match("./index.html") ||
        await caches.match("./");

      return cached || new Response("Taktvoll ist momentan offline.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    })());
    return;
  }

  // Static same-origin assets: use cache, but refresh in the background.
  event.respondWith((async () => {
    const cached = await caches.match(request);

    const networkPromise = fetch(request, { cache: "no-cache" })
      .then(async response => {
        if (response && response.ok) {
          const cache = await caches.open(CACHE_VERSION);
          await cache.put(request, response.clone());
        }
        return response;
      })
      .catch(() => null);

    if (cached) {
      event.waitUntil(networkPromise);
      return cached;
    }

    const fresh = await networkPromise;
    return fresh || new Response("", { status: 504 });
  })());
});
