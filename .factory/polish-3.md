# Polish round 3 — cumulative zero-finding closure

Repair commit: `fd827075fefae11dd9bf9e8ddebf13d8bc201df5`
Live: <https://next-step-cards.sociobot.in>
Deployment: `c61049fe-b037-470a-bf5b-486b64d60d52`

The round-3 source change replaces the nested demo `aside` with a non-landmark
`div` and upgrades the Axe regression to fail on every violation impact across
all shipped routes. The PWA shell moved to build `1.0.5`. Every prior finding
was also rechecked on the deployed site; no copy, demo, routing, PWA, privacy,
or mobile repair regressed.

| Finding id | Change present in the release | Evidence |
| --- | --- | --- |
| B1 | Retained the first-screen **Try it with sample data** action, filled grant card, two history entries, banner, reset, and exit controls on `/demo/` and `?demo=1`. | `@claim:demo-ready`; `.factory/evidence/polish-3-live-demo/screenshot-mobile.png`; cold live `/demo/` and `?demo=1` checks passed. |
| B2 | Retained separate `demo:next-step-cards` IndexedDB storage; reset changes only the seed and Start for real discards the sample store. | `@claim:demo-isolated`; `.factory/evidence/polish-3-live-demo-390.png`; a live real-card → demo park → Start for real round trip preserved the real card. |
| B3 | Retained the 12-entry `.factory/claims.json` contract and one tagged demo test per visitor promise. | All 12 manifest commands passed independently from clean clone (`CLAIM_SUITE_PASSED`); live demo screenshot and same-origin check above. |
| B4 | Kept the unavailable price, checkout, and supporter UI removed. | `@claim:free-core`; `.factory/evidence/polish-3-live-home/screenshot-mobile.png`; fresh live DOM check found no checkout link or supporter UI. |
| B5 | Retained the designed 404 document and Static Web Apps response override. | `serves the designed static 404 document`; `.factory/evidence/polish-3-live-404/screenshot-mobile.png`; live `/no-such-route` returned HTTP 404. |
| M1 | Retained the plain job headline, named interruption situation, nearby demo outcome, and three tested facts. | `keeps the first screen and maximum values within a 390px viewport`; `.factory/evidence/polish-3-live-home-390.png`; cold live home check passed. |
| M2 | Retained route-specific titles, descriptions, canonical/OG/Twitter tags, favicon, Apple icon, sitemap, and original social art. | `ships versioned immutable assets and required static-host response policies`; live `verify-url.sh` reports for home, demo, Privacy, Terms, and 404. |
| M3 | Retained the shared header/footer, legal links, build id, route announcement, and h1 focus behavior. | `has no accessibility violations on every shipped route and supports route focus`; `.factory/evidence/polish-3-live-privacy/screenshot-mobile.png`; a cold live Privacy navigation focused its h1. |
| M4 | Retained card/history/demo/browser wording and action-result controls. | `.factory/copy-audit.md`; `.factory/evidence/polish-3-live-home/screenshot-desktop.png`; live copy check passed. |
| Verify-1 High | Retained safe wrapping for maximum valid unbroken fields at 390 px. | `keeps the first screen and maximum values within a 390px viewport`; `.factory/evidence/polish-3-live-max-values-390.png`; live task/action/resource/why/stop values at their maxima kept `scrollWidth === clientWidth`. |
| Verify-1 Medium | Retained cache-versioned PWA shell and immutable image/icon policies. | `ships versioned immutable assets and required static-host response policies`; live `Cache-Control: public, max-age=31536000, immutable` on hero and icons. |
| Verify-1 Low | Retained manifest MIME, CSP, Permissions-Policy, and Referrer-Policy. | Deployment configuration test; live `HEAD /manifest.webmanifest` reports `application/manifest+json` and the security headers. |
| F-2-1 | Retained the declared completion-history promise and observation. | `@claim:completion-history`; `.factory/evidence/polish-3-live-demo-390.png`; live demo finish flow rechecked. |
| F-2-2 | Retained the declared park-history promise and observation. | `@claim:park-history`; `.factory/evidence/polish-3-live-demo-390.png`; live demo park flow rechecked. |
| F-2-3 | Retained the declared JSON restore round-trip. | `@claim:json-import`; `.factory/evidence/polish-3-live-demo/screenshot-desktop.png`; clean-clone import round trip passed. |
| F-2-4 | Retained the declared clear-history preservation behavior. | `@claim:clear-history-preserves-active`; `.factory/evidence/polish-3-live-demo/screenshot-desktop.png`; clean-clone clear/reload passed. |
| F-3-1 | Replaced `<aside class="demo-banner">` with `<div class="demo-banner">`; the strip remains labelled by its visible text and its buttons. Axe now rejects every impact on all shipped routes. | `has no accessibility violations on every shipped route and supports route focus`; `.factory/evidence/polish-3-live-demo-390.png`; live `/demo/` Axe result: 0 violations, including no nested complementary landmark. |

## Exact verification record

- Clean clone: `npm ci`, `npm test` (7/7), `npm run build`, and `npm run
  test:e2e` (30/30) passed.
- Each exact test command declared in `.factory/claims.json` passed separately:
  `demo-ready`, `demo-isolated`, `offline-reload`, `privacy-local`,
  `csv-export`, `json-export`, `quiet-hours`, `free-core`,
  `completion-history`, `park-history`, `json-import`, and
  `clear-history-preserves-active`.
- Local and live `verify-url.sh` reports are in `.factory/evidence/`; all
  recorded title/lang/h1/main/alt/button/error checks passed.
- A fresh live 390 px browser check confirmed `?demo=1` isolation, reset,
  Start for real, same-origin requests, offline reload, zero Axe violations,
  route titles, and HTTP 404. No console/page errors occurred on standard
  routes.
