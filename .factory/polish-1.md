# Polish round 1 — finding closure

Repair commits: `a09b1bf33f787549e95107a08b508d3965e1701c` and `693ba021968723968087f960c21f26242c9393a6`  
Live: <https://next-step-cards.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| B1 | Added first-screen **Try it with sample data** action, `/demo/`, `?demo=1`, filled grant card, history, banner, Reset demo, and Start for real. | `@claim:demo-ready`; `.factory/evidence/polish-1-demo-390.png`; live cold `?demo=1` check. |
| B2 | Added the `demo:next-step-cards` IndexedDB namespace, a fixed sample seed, reset-only-demo behavior, and real-data preservation on exit. | `@claim:demo-isolated`; `.factory/demo.md`; live demo check. |
| B3 | Added `.factory/claims.json` and eight observable, tagged Playwright claims run from clean `npm ci`. Unprovable copy was removed or narrowed. | All eight commands in `claims.json` passed; privacy, offline, export, quiet-hours, and free-core tests. |
| B4 | Removed the unavailable supporter price, checkout link, and license UI rather than advertising an unregistered transaction. | `@claim:free-core`; live free demo completion; no checkout link in production DOM. |
| B5 | Added designed `404.html` and Azure Static Web Apps `responseOverrides` with HTTP 404 status. | 404 Playwright test; live `/no-such-route` returned 404 with “This page is not here.” |
| M1 | Rewrote first screen with job headline, named interruption situation, adjacent demo outcome, and three tested facts. | `.factory/copy-audit.md`; `.factory/evidence/polish-1-home-390.png`; mobile regression. |
| M2 | Added per-route canonical, Open Graph, Twitter, apple-touch, root favicon, demo sitemap entry, route title, and original 1200×630 social crop. | Live route metadata checks; `tests/deployment-config.test.ts`. |
| M3 | Gave every route the same wordmark/header/footer, legal links, Param Factory/build note, live route announcement, and h1 focus on legal navigation. | Playwright Axe/focus test; live Privacy focus check returned `true`. |
| M4 | Standardized public language on **card**, **history**, **demo**, and **saved in this browser**; renamed the settings action and corrected optional link wording. | `.factory/copy-audit.md`; full browser suite. |
| Verify-1 High | Preserved the prior 390px long-unbroken-value wrapping fix and retained its regression. | Mobile max-value regression; live query-demo overflow `false`. |
| Verify-1 Medium/Low | Preserved immutable assets, manifest MIME, CSP, permissions policy, and service-worker cache policy; added current PWA shell routes. | Deployment configuration test; live manifest reports `application/manifest+json`. |

## Evidence summary

- Clean install: `npm ci` completed with zero vulnerabilities.
- Unit/configuration: `npm test` — 7/7 passed.
- Production build: `npm run build` passed; `dist/index.html` is at the root.
- Browser suite: `npm run test:e2e` — 22/22 desktop/mobile tests passed, including Axe serious/critical checks.
- Claim commands: each of the eight exact commands in `.factory/claims.json` passed separately after the clean install.
- Local URL audit: `verify-url.sh` reported title/lang/one h1/main/alt/buttons and no console errors.
- Live URL audit: `verify-url.sh` reported the same and no console errors.
- Live cold checks: `?demo=1` had demo title/banner/sample/canonical/OG metadata and no 390px overflow; offline reload after first demo visit passed; `/no-such-route` returned HTTP 404 with the designed page.

Screenshots are intentionally ignored build evidence: `.factory/evidence/polish-1-home-390.png`, `.factory/evidence/polish-1-demo-390.png`, and `.factory/evidence/polish-1-404-390.png`.
