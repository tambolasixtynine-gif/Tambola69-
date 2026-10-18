
const CACHE_NAME = "tambola69-cache-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install: cache the main app files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    }).catch((error) => {
      console.error("Tambola 69 cache install failed:", error);
    })
  );

  self.skipWaiting();
});

// Activate: remove old Tambola 69 caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) =>
            key.startsWith("tambola69-cache-") &&
            key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: use network first for pages and Firebase/live requests.
// Use cache as a fallback for eligible local app files.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests from this website.
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Never cache Firebase or other live API requests.
  if (
    url.hostname.includes("firebase") ||
    url.pathname.includes("/.well-known/")
  ) {
    return;
  }

  // Network-first strategy for HTML pages.
  if (
    request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith("/")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          return (
            await caches.match("./index.html")
          ) || Response.error();
        })
    );

    return;
  }

  // Cache-first for other same-origin static files.
  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });
        }

        return response;
      } catch (error) {
        return Response.error();
      }
    })
  );
});
                  
