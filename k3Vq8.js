importScripts('https://cdn.jsdelivr.net/gh/zaka13alt/history@main/stuff/LyzaHBeO/WBv0kYC0.js');
importScripts("https://cdn.jsdelivr.net/gh/zaka13alt/history@main/h.js");
 
const blockedKeywords = _c.theBadKeywords;
 

const passthroughPatterns = [/education\/\/g(?:@|%40)mez/i];
 
function h7568(str) {
	if (!str) return false;
	let decoded = str;
	try {
		decoded = decodeURIComponent(str);
	} catch (e) {}
	return passthroughPatterns.some((re) => re.test(str) || re.test(decoded));
}
 
function h7561(url) {
	const match = new URL(url).pathname.match(
		/^\/nZ970vr4\/[a-z0-9]+\/[a-z0-9]+\/(.*)$/i
	);
	if (!match) return null;
	try {
		return decodeURIComponent(match[1]);
	} catch (e) {
		return match[1];
	}
}
 
self.addEventListener("install", () => self.skipWaiting());
 
self.addEventListener("activate", (event) => {
	event.waitUntil(clients.claim());
});
 
function isBlocked(host, fullUrl) {
	return blockedKeywords.some(
		(keyword) =>
			host.includes(keyword) ||
			fullUrl.includes(keyword)
	);
}
 
async function handleRequest(event) {
	const url = event.request.url;
 
	// format
	// /bootstrap/{controllerId}/{frameId}/encodeuricompentedurl
	//
	// Example:
	// /bootstrap/assetswcptnsl0/25ei521o/https%3A%2F%2Fexample.com
 
	const match = new URL(url).pathname.match(
		/^\/nZ970vr4\/[a-z0-9]+\/[a-z0-9]+\/(.*)$/i
	);
 
	if (match) {
		try {
			const decoded = decodeURIComponent(match[1]);
			const parsedUrl = new URL(decoded);
 
			const href = parsedUrl.href;
			const host = parsedUrl.hostname;
 
			if (isBlocked(host, href)) {
				return new Response(
					`<!doctype html><html lang="en"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1" name="viewport"><title>bro...</title><style>body{background-color:#000;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:sans-serif}h1{color:#fff;margin:0;font-size:2rem}</style><h1>gooner detected bro get a life and touch some grass and if you go to my school deadass i might tell the teacher but idk...</h1>`,
					{
						status: 403,
						headers: {
							"Content-Type": "text/html; charset=utf-8",
							"Cross-Origin-Embedder-Policy": "require-corp"
						}
					}
				);
			}
		} catch (e) {
			// URL parsing failed; let the request through.
		}
	}
 
	return $K4q9p2XvController.route(event);
}
 
self.addEventListener("fetch", (event) => {
	const url = event.request.url;
 
	// 
	if (h7568(url) || h7568(h7561(url))) return;
 
	if ($K4q9p2XvController.shouldRoute(event)) {
		event.respondWith(handleRequest(event));
	}
});
 
