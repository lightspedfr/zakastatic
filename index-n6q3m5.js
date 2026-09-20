importScripts("./.assets/index-t6p2d8.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

addEventListener("fetch", (e) => {
  if (dGFzazR6MTMzNw.shouldRoute(e)) {
    e.respondWith(dGFzazR6MTMzNw.route(e));
  }
});
