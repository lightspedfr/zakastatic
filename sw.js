importScripts("/bG9scmF0aW9u/emFrYQ.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

addEventListener("fetch", (e) => {
  if (dGFzazR6MTMzNw.shouldRoute(e)) {
    e.respondWith(dGFzazR6MTMzNw.route(e));
  }
});
