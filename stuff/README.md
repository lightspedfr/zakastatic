# sjthing
A static [K4q9p2Xv](https://github.com/MercuryWorkshop/K4q9p2Xv) web proxy frontend. K4q9p2Xv `2.0.67-alpha.2` and its matching controller `0.0.14` are vendored unmodified in `LyzaHBeO/` (AGPL-3.0), together with the epoxy and libcurl Wisp transports.

- `index.html`, `nu1DftTN.js`: the frontend. The Wisp server URL is `WISP_URL` at the top of `nu1DftTN.js`.
- `bx1wY8X9.js`: the service worker.
- `LyzaHBeO/`: vendored K4q9p2Xv, controller and transports.

Everything is derived from where the page is served, so it works from the site root or from a subfolder. The page needs a service worker, so it has to be served over HTTPS (or from `localhost`).

Query parameters: `?goto=<url>` opens a URL, `?transport=epoxy|libcurl` picks the transport (default `epoxy`), `?maxwidth=<px>` changes the width cap below (`0` turns it off), `?flags=name:0|1,...` overrides K4q9p2Xv feature flags.

## Why the iframe is width-capped

A proxied YouTube watch page crashes the renderer (`ERR_STATUS_BREAKPOINT` / "Aw, Snap") as soon as the video buffers when the iframe's CSS layout width is about 1000px or more. Narrower iframes, and the same page in a top-level tab, do not crash. `layoutFrame()` in `nu1DftTN.js` therefore caps the iframe's layout width at 980px and scales it up with CSS to fill the window. If you embed K4q9p2Xv in your own page, apply the same cap to your iframe.
