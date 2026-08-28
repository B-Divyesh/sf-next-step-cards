# Polish round 2 — zero-finding closure

Repair commit: `bb32cc7053ac1b9eec430c76ee8b9624669bfe09`  
Live: <https://next-step-cards.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| B1 | Retained the first-screen **Try it with sample data** route, sample card, history, banner, Reset demo, and Start for real flow. | `@claim:demo-ready`; live cold `/demo/` check; `.factory/evidence/polish-2-live/screenshot-mobile.png`. |
| B2 | Retained the separate `demo:next-step-cards` IndexedDB store and exit/reset rules; live-tested that real data survives demo use. | `@claim:demo-isolated`; live `?demo=1` isolation check. |
| B3 | Expanded the claim contract from eight to twelve entries and gave every remaining behavior promise an observable demo test. | Every command in `.factory/claims.json`; clean-clone test record; live completion/park/import/clear checks. |
| B4 | Kept unavailable purchase copy and checkout controls removed. | `@claim:free-core`; live demo completion has no payment or account step. |
| B5 | Retained the designed HTTP 404 response and direct return link. | Live `/no-such-route` returned HTTP 404 and displayed the purpose-built h1. |
| M1 | Retained the plain-language job headline, named interruption situation, demo outcome text, and three tested facts. | `.factory/copy-audit.md`; live cold first-screen check. |
| M2 | Retained canonical, OG, Twitter, favicon, apple-touch, demo title/sitemap, and social preview metadata. | `tests/deployment-config.test.ts`; live `verify-url.sh` report. |
| M3 | Retained shared shell, legal links, build identifier, heading focus, and route announcement. | Playwright route-focus/Axe test; live Privacy focus check. |
| M4 | Retained consistent **card**, **history**, **demo**, and browser-storage language. Added a responsive **Manage data** label that preserves the full accessible name. | `.factory/copy-audit.md`; mobile layout regression and live 390px check. |
| Verify-1 High | Retained safe wrapping for maximum-length unbroken fields. | Mobile max-value no-overflow Playwright regression. |
| Verify-1 Medium / Low | Retained versioned PWA cache, immutable-asset headers, manifest MIME, CSP, and Permissions-Policy configuration. Advanced the shell to `v1.0.4`. | `tests/deployment-config.test.ts`; live headers and deployed build marker. |
| F-2-1 | Added `completion-history` and a demo test that finishes the sample card and asserts the persisted **Finished** history row. | `@claim:completion-history`; live cold finish/reload check. |
| F-2-2 | Added `park-history` and a demo test that parks with a revised action and asserts the persisted **Parked** history row. | `@claim:park-history`; live cold park/reload check. |
| F-2-3 | Added `json-import` and a demo round-trip test that restores the active card, two history rows, and quiet-hour values. | `@claim:json-import`; live cold export/change/import check. |
| F-2-4 | Added `clear-history-preserves-active` and a demo test that confirms clearing history leaves the sample card after reload. | `@claim:clear-history-preserves-active`; live cold clear/reload check. |

## Evidence

- Fresh clone at `cd1a160abfdfba4a01f3de9358b2e5ba0087fc8a`: `npm ci`, `npm test` (7/7), `npm run build`,
  `npm run test:e2e` (30/30), and production dependency audit (0
  vulnerabilities) passed.
- The twelve exact claim commands in `.factory/claims.json` passed in desktop
  and mobile projects. They cover demo readiness/isolation, offline reload,
  same-origin demo privacy, both exports, quiet hours, free core, completion,
  parking, import, and clearing history.
- `/opt/fleet/lib/verify-url.sh` passed locally and live for `/demo/`: title,
  `lang`, one h1, main landmark, image alt, labeled controls, and no console
  errors. Its live screenshots are
  `.factory/evidence/polish-2-live/screenshot-desktop.png` and
  `.factory/evidence/polish-2-live/screenshot-mobile.png`; the dedicated
  live 390px demo screenshot is `.factory/evidence/polish-2-live/demo-390.png`.
- The included Playwright Axe scan found zero serious or critical violations
  on desktop and mobile. `@axe-core/cli` was also attempted, but this image has
  no system Chrome; it could not connect to the preinstalled Playwright binary.
  This is a CLI-environment limitation, not a site failure.
- Lighthouse was attempted with the preinstalled Playwright Chromium and could
  not connect; measured production output remains 8.15 KB gzip JS and 3.95 KB
  gzip CSS, with no shipped web fonts.
- The work-order static deploy script published `dist/`. A fresh live browser
  check passed demo, completion, parking, import, clear-history preservation,
  focus, `?demo=1` isolation, 390px settings/no-overflow, offline reload, and
  the 404 response. The live home page reports build `1.0.4`.
