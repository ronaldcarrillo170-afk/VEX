const CACHE_NAME = "vex-store-v1";
const APP_SHELL = [
  "./", "./index.html", "./login.html", "./registro.html", "./admin.html",
  "./style.css", "./login.css", "./registro.css", "./admin.css", "./admin-enhancements.css",
  "./java.js", "./login.js", "./registro.js", "./admin.js", "./manifest.webmanifest", "./img/logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    if (new URL(event.request.url).origin === self.location.origin) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match("./index.html"))));
});
