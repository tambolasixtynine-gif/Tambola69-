
const CACHE_NAME = "tambola69-cache-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192-3.png",
  "./icon-512-2.png"
];

// Install the new service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        for (const file of APP_FILES) {
          try {
            const response = await fetch(file, {
              cache: "no-cache"
            });

            if (response.ok) {
              await cache.put(file, response);
            } else {
              console.warn(
                "Tambola 69 file not cached:",
                file,
                response.status
              );
            }
          } catch (error) {
            console.warn(
              "Tambola 69 cache error:",
              file,
              error
            );
          }
        }
      })
      .catch((error) => {
        console.error(
          "Tambola 69 installation error:",
          error
        );
      })
  );

  self.skipWaiting();
});

// Activate and clean up old Tambola 69 caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("tambola69-cache-") &&
                key !== CACHE_NAME
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Handle requests safely
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Do not intercept external requests, including Firebase
  if (url.origin !== self.location.origin) {
    return;
  }

  // Do not cache live API or authentication requests
  if (
    url.pathname.includes("/.well-known/") ||
    url.pathname.includes("/__/auth/") ||
    url.pathname.includes("/api/")
  ) {
    return;
  }

  // Network-first for pages and navigation
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

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, copy))
              .catch(console.error);
          }

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);

          if (cached) {
            return cached;
          }

          return (
            (await caches.match("./index.html")) ||
            Response.error()
          );
        })
    );

    return;
  }

  // Network-first for manifest and icon files.
  // This avoids serving an old icon from cache.
  if (
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".json")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, copy))
              .catch(console.error);
          }

          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request)) ||
            Response.error()
          );
        })
    );

    return;
  }

  // Network-first for other same-origin resources
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, copy))
            .catch(console.error);
        }

        return response;
      })
      .catch(async () => {
        return (
          (await caches.match(request)) ||
          Response.error()
        );
      })
  );
});
