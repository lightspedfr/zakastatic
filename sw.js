importScripts("/x7Qm2V9k/R2nJ7Qa.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

addEventListener("fetch", (_71426) => {
  if (_58317.shouldRoute(_71426)) {
    _71426.respondWith(_58317.route(_71426));
  }
});
