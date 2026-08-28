# Polish round 4 — cumulative zero-finding closure

Repair commit: `ad043dc602389384a8b6307bc8b453c1ab47451b`
Deployment: `d0ce6b10-1e5a-4e5b-b8c4-334d230dee25`
Live URL: <https://next-step-cards.sociobot.in>

Every finding in `review-1.md` through `review-4.md`, the earlier polish
records, and both verification records was rechecked. The present repair fixes
the one remaining issue, F-4-1. Earlier repairs remain functional rather than
being accepted only from their prior status.

| Finding id | Change made or retained behaviour | Evidence |
| --- | --- | --- |
| B1 | Kept the first-screen **Try it with sample data** link, realistic seeded grant card, two history rows, banner, Reset demo, and Start for real controls on both `/demo/` and `?demo=1`. | `@claim:demo-ready`; [live demo screenshot](evidence/polish-4-live/demo-390.png); live `https://next-step-cards.sociobot.in/?demo=1` cold check passed. |
| B2 | Kept separate `demo:next-step-cards` IndexedDB storage. Reset changes only that store; Start for real clears only it. | `@claim:demo-isolated`; live real-card → demo → Start for real preservation check passed; [live demo report](evidence/polish-4-live/query-demo/verify.json). |
| B3 | Kept the 12-entry claim contract and one observable tagged browser test per visitor-facing claim. | Every command in `claims.json` passed independently from a clean clone; [claim log](evidence/polish-4-clean-clone-claims.log) ends `CLAIM_SUITE_PASSED`. |
| B4 | Kept unavailable price, checkout, and supporter controls removed. | `@claim:free-core`; live DOM scan on `/`, `/demo/`, legal pages, and 404 found no checkout, supporter, or buy controls. |
| B5 | Kept the purpose-built `404.html` and Static Web Apps 404 rewrite/status policy. | Browser test `serves the designed static 404 document`; live `/no-such-route` returned HTTP 404 and displayed the designed heading. |
| M1 | Kept the job headline, named interruption situation, nearby demo outcome, and three short facts on the first screen. | 390 px browser regression; [live home screenshot](evidence/polish-4-live/home/screenshot-mobile.png); cold live home check passed. |
| M2 | Kept per-route titles, descriptions, canonical, Open Graph, Twitter, favicon, Apple icon, sitemap, and social art. | Live route metadata scan passed for `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`; [route reports](evidence/polish-4-live). |
| M3 | Kept the shared shell, legal links, build id, forward route announcement, and added robust Back/Forward restoration focus plus a polite announcement for the app shell. | `restores demo heading focus and announces the page after browser Back`; live `/demo/ → /privacy/ → Back` focused `#page-title` and announced the restored demo. |
| M4 | Kept public language consistent on **card**, **history**, **demo**, and browser storage. Updated catalog copy to the verb-first `Resume interrupted work with one clear next step.` | [copy audit](copy-audit.md); [catalog description](catalog-description.txt). |
| Verify-1 High | Kept long valid values safely wrapped at 390 px. | `keeps the first screen and maximum values within a 390px viewport` passed in desktop and mobile projects. |
| Verify-1 Medium | Advanced the service-worker shell and asset queries to `1.0.6`, retaining immutable asset caching. | `ships versioned immutable assets and required static-host response policies`; live hero header is `Cache-Control: public, max-age=31536000, immutable`. |
| Verify-1 Low | Kept manifest MIME and security headers. | Live `/manifest.webmanifest` reports `application/manifest+json`; CSP, Permissions-Policy, Referrer-Policy, and `nosniff` headers were present. |
| F-2-1 | Kept the completion-history promise and test. | `@claim:completion-history`; clean-clone claim log and live demo finish flow passed. |
| F-2-2 | Kept the park-history promise and test. | `@claim:park-history`; clean-clone claim log and live demo park flow passed. |
| F-2-3 | Kept JSON export/import restore coverage. | `@claim:json-import`; clean-clone claim log passed. |
| F-2-4 | Kept clear-history preservation coverage. | `@claim:clear-history-preserves-active`; clean-clone claim log passed. |
| F-3-1 | Kept the demo strip as a non-landmark `<div>`, avoiding a nested complementary landmark. | `has no accessibility violations on every shipped route and supports route focus`; live Axe scan found zero violations. |
| F-4-1 | Added focusable app headings, the app-shell polite route announcer, persisted `pageshow` focus restoration, and a `back_forward` reload fallback. | New regression `restores demo heading focus and announces the page after browser Back` passed in desktop and mobile; the same cold live sequence passed. |

## Exact verification

- Fresh clone at the repair commit: `npm ci` (0 vulnerabilities), `npm test`
  (7/7), `npm run build`, and `npm run test:e2e` (32/32) passed. The full
  browser log is [here](evidence/polish-4-clean-clone-browser.log).
- Each exact command declared in `.factory/claims.json` passed separately in
  that fresh clone, across desktop and mobile: `demo-ready`, `demo-isolated`,
  `offline-reload`, `privacy-local`, `csv-export`, `json-export`,
  `quiet-hours`, `free-core`, `completion-history`, `park-history`,
  `json-import`, and `clear-history-preserves-active`.
- `npm audit --omit=dev --audit-level=high` passed with 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh` passed on live home, demo, `?demo=1`, Privacy,
  Terms, and 404 routes. Every report has a title, `lang=en`, exactly one h1,
  a main landmark, no missing image alt text, no unlabeled buttons, and no
  console errors.
- Live cold checks confirmed direct demo isolation, same-origin requests,
  real-card preservation, offline demo reload, Back focus/announcement,
  route metadata, zero Axe violations, and designed HTTP 404.
- Local mobile Lighthouse 13.4.1 against the production build scored
  Performance **100** and Accessibility **100**; LCP was **0.8 s** and CLS
  **0**. The shipped app JavaScript is 8,308 B gzip, CSS is 3,946 B gzip, and
  the mobile hero is 33,242 B.
