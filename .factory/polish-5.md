# Polish round 5 — cumulative zero-finding closure

Implementation commit: `10aa056f9cbf50898e846312a67d8fb3439c515a`

Deployment: `e4903d25-197b-4dfc-bc5d-066b0d6c0b05`

Live URL: <https://next-step-cards.sociobot.in>

Round 5 fixes F-5-1 while retaining and rechecking every repair from reviews
1–4 and both independent verification reports. Azure Static Web Apps cannot
match a static route on a query value. The class-preserving solution places a
synchronous `?demo=1` route bootstrap before all home metadata and replaces
the URL with `/demo/`. The direct demo document is now the sole documented and
canonical demo route, and its raw HTML carries the complete demo metadata.

| Finding id | Change made or retained behavior | Evidence: test · screenshot · live check |
| --- | --- | --- |
| B1 | Kept the first-screen **Try it with sample data** action, realistic filled card, two history entries, persistent banner, Reset demo, and Start for real. The legacy query entry now lands on `/demo/`. | `@claim:demo-ready` · `.factory/evidence/polish-5-live/query-demo/screenshot-mobile.png` · cold `/?demo=1` ended at live `/demo/` with all sample UI present. |
| B2 | Kept real and demo data in `next-step-cards` and `demo:next-step-cards`; reset and exit touch only the sample store. | `@claim:demo-isolated` · `.factory/evidence/polish-5-live/query-demo/screenshot-mobile.png` · live real-card → query demo → park/reset → Start for real preserved the real card byte-for-byte. |
| B3 | Retained twelve claims with one exact tagged browser command each; expanded `demo-ready` to require the query redirect. | Every command in `.factory/claims.json` · `.factory/evidence/polish-5-live/demo/screenshot-mobile.png` · all twelve live behaviors were cold-rechecked after deployment. |
| B4 | Kept the unavailable supporter price, checkout, and license UI absent; all core card actions remain usable without payment or an account. | `@claim:free-core` · `.factory/evidence/polish-5-live/demo/screenshot-mobile.png` · live sample completion required no purchase step and no checkout control was present. |
| B5 | Kept the designed print-style 404 document and Azure response override. | `serves the designed static 404 document` · `.factory/evidence/polish-5-live/not-found/screenshot-mobile.png` · live `/no-such-route-polish-5` returned HTTP 404 with **This page is not here.** |
| M1 | Kept the job-first headline, interruption situation, sample outcome, real-use action, and three tested facts above the mobile fold. | `keeps the first screen and maximum values within a 390px viewport` · `.factory/evidence/polish-5-live/home/screenshot-mobile.png` · cold live 390 px home had no horizontal overflow. |
| M2 | Kept route-specific titles, descriptions, canonicals, OG/Twitter metadata, favicon, Apple icon, sitemap, and original social art. Unified every direct-demo description and fixed the query entry. | `gives both demo entry points complete demo route metadata`; `redirects the legacy query demo before home metadata and ships complete raw demo metadata` · `.factory/evidence/polish-5-live/query-demo/screenshot-desktop.png` · live query and direct demo reported the demo title, three demo descriptions, and `/demo/` canonical. |
| M3 | Kept one shared shell, legal links, build id, h1 focus, polite announcements, and Back/Forward restoration. | `has no accessibility violations on every shipped route and supports route focus`; `restores demo heading focus and announces the page after browser Back` · `.factory/evidence/polish-5-live/privacy/screenshot-mobile.png` · live `/demo/ → /privacy/ → Back` restored and announced the demo h1. |
| M4 | Kept public terms consistent on **card**, **history**, **demo**, and browser storage. Re-audited all first-screen, form, state, and README sentences; updated the verb-first catalog line. | `.factory/copy-audit.md`; `@claim:privacy-local` · `.factory/evidence/polish-5-live/home/screenshot-desktop.png` · live copy scan found no banned term, unclear action, or sentence over 22 words. |
| Verify-1 High | Expanded the regression to all maximum valid fields: task, action, resource, reason, and stopping point. | `keeps the first screen and maximum values within a 390px viewport` · `.factory/evidence/polish-5-live/max-values-390.png` · live `scrollWidth === clientWidth === 390`. |
| Verify-1 Medium | Advanced the cache and asset queries to build `1.0.7`; retained one-year immutable asset caching and a no-cache worker. | `ships versioned immutable assets and required static-host response policies` · `.factory/evidence/polish-5-live/home/screenshot-mobile.png` · live hero returned `max-age=31536000, immutable`; `/sw.js` returned `no-cache, no-store, must-revalidate`. |
| Verify-1 Low | Kept web-manifest MIME and CSP, Permissions-Policy, Referrer-Policy, and `nosniff` response headers. | Deployment configuration test · `.factory/evidence/polish-5-live/home/screenshot-desktop.png` · live manifest returned `application/manifest+json` with all policies. |
| F-2-1 | Kept the declared finish-to-history outcome and persisted reload check. | `@claim:completion-history` · `.factory/evidence/polish-5-live/demo/screenshot-mobile.png` · live cold demo completion retained a **Finished** history row. |
| F-2-2 | Kept the declared park-to-history outcome and revised-action reload check. | `@claim:park-history` · `.factory/evidence/polish-5-live/demo/screenshot-mobile.png` · live park flow stored the revised sample action. |
| F-2-3 | Kept complete JSON export/import restoration of the card, history, and settings. | `@claim:json-import` · `.factory/evidence/polish-5-live/demo/screenshot-desktop.png` · clean-clone round trip restored the sample state and quiet hours. |
| F-2-4 | Kept clear-history behavior scoped to history, preserving the active card through reload. | `@claim:clear-history-preserves-active` · `.factory/evidence/polish-5-live/demo/screenshot-desktop.png` · clean-clone demo retained the active card with zero history entries. |
| F-3-1 | Kept the demo strip as a non-landmark `div`; Axe now fails on any impact. | `has no accessibility violations on every shipped route and supports route focus` · `.factory/evidence/polish-5-live/query-demo/screenshot-mobile.png` · fresh live Axe found zero violations on all five route documents. |
| F-4-1 | Kept persisted-history focus restoration and the polite route announcement. | `restores demo heading focus and announces the page after browser Back` · `.factory/evidence/polish-5-live/demo/screenshot-mobile.png` · live Back focused `#page-title` and announced **Demo — Next Step Cards restored**. |
| F-5-1 | Added the pre-metadata query redirect, made `/demo/` the sole documented/canonical demo URL, unified raw demo descriptions, updated OG/Twitter fallbacks, and added source-response plus browser regressions. | `redirects the legacy query demo before home metadata and ships complete raw demo metadata`; `gives both demo entry points complete demo route metadata` · `.factory/evidence/polish-5-live/query-demo/screenshot-mobile.png` · cold live `/?demo=1` replaced to `/demo/`; title, standard/OG/Twitter descriptions, and canonical all matched the direct demo. |

## Exact verification

- Clean clone at the implementation commit: `npm ci`, `npm test` (8/8),
  `npm run build`, `npm run test:e2e` (34/34), and
  `npm audit --omit=dev --audit-level=high` all passed.
- Every exact command in `.factory/claims.json` passed independently in both
  desktop and mobile projects. The log ends `CLAIM_SUITE_PASSED`.
- The route verifier passed locally and live on home, direct demo, query demo,
  Privacy, Terms, and 404: no console errors, one h1, one main, `lang=en`,
  complete image alt text, and labelled controls.
- Fresh live Axe scans found zero violations on `/`, `/demo/`, `/privacy/`,
  `/terms/`, and `/404.html`.
- Mobile Lighthouse scored 98 Performance and 100 Accessibility, Best
  Practices, and SEO. LCP was 2.0 s, TBT 120 ms, and CLS 0.
- Local and live SHA-256 values matched for root, demo, Privacy, Terms, 404,
  service worker, and manifest files.
