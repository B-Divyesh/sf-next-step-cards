# Independent verification — PASS

Work order: `next-step-cards-verify-2`
Verified: 2026-08-28
Candidate commit: `f22ede745a32a11d1acbbae1c7e420483549b23d`
Production URL: <https://next-step-cards.sociobot.in>

## Verdict

**PASS.** The production deployment is an exact byte-for-byte match for the
candidate build across the application shell, legal pages, service worker,
manifest, hero images, and PWA icons. The previous release-blocking 390px
overflow is fixed: all valid maximum-length unbroken user fields render without
horizontal page overflow. The local-first single-card workflow, error recovery,
accessibility, privacy, response policies, and offline reload all passed.

## Clean checkout checks

From a clean checkout at the candidate SHA on Node `v22.23.2` / npm `10.9.8`:

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 0 known vulnerabilities |
| `npm test` | Passed, 7/7 Vitest tests |
| `npm run build` | Passed (`tsc --noEmit` + Vite); writes `dist/` |
| `npm run test:e2e` | Passed, 12/12 Playwright desktop/mobile tests |
| `npm audit --omit=dev --audit-level=high` | Passed; 0 vulnerabilities |

No separate lint script is defined in `package.json`; the build performs the
available TypeScript type check.

The production bundle is within the static-PWA budgets: application JS 26,115
bytes (8,710 gzip), CSS 12,059 bytes (3,590 gzip), and mobile hero 33,242
bytes. There are no shipped web fonts. A fresh Lighthouse CLI attempt could not
complete because the container's manually launched Chromium tab crashed; this
is recorded as a verification-tool limitation, not a product failure. The
equivalent browser checks below, Axe scans, and size budgets passed.

## Independent end-to-end evidence

Fresh Playwright checks against the exact local production build and the live
HTTPS deployment covered desktop and 390×844 mobile:

- Blank submission announces `Add a task name and one small next action.` and
  focuses `#task-name`; a valid submission then succeeds.
- A card was created with the maximum permitted 100-character task name and
  280-character action, parked with a new action, completed, and returned to
  the empty state. The automated suite separately verifies reuse from history.
- A 390px live run used all maximum permitted unbroken fields (task 100,
  action 280, resource 500, why 240, stop condition 240). The active card was
  visible and `document.documentElement.scrollWidth > clientWidth` was
  `false`.
- Malformed JSON import displayed its parse error and retained the existing
  ledger. JSON export produced `next-step-cards.json`.
- Keyboard Tab focus visibly rendered the designed 3px vermilion outline on
  controls; keyboard-only mobile submission passes in the full test suite.
- With reduced motion emulated, transition duration measured `0.01s`.
- Live Axe scans in empty and park-dialog states found zero serious or critical
  violations. The live page has `lang="en"`, a title, one runtime `<h1>`,
  `<main>`, and descriptive hero alt text.
- Fresh free-workflow browser runs produced no console errors or page errors
  and requested only `https://next-step-cards.sociobot.in`. Source review found
  no analytics, remote fonts, or third-party scripts. Personal card data is
  stored in IndexedDB; the only intentional optional off-origin integration is
  Sociobot license verification/checkout.

## PWA, deployment, and privacy evidence

- The live service worker is active at `/sw.js`, controls the page, has cache
  `next-step-cards-shell-v1.0.2`, and `registration.update()` completed with
  no waiting worker.
- After a connected load and active-card save, `context.setOffline(true)` plus
  a fresh live navigation retained the active card and displayed `Offline and
  ready.` with no errors.
- SHA-256 matched local `dist/` and live production for `/`, `/sw.js`,
  `/manifest.webmanifest`, both hero assets, all three icons, `/privacy/`, and
  `/terms/`.
- Live headers provide HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, CSP, and a restrictive
  Permissions-Policy. The manifest is `application/manifest+json`; the worker
  is `no-cache, no-store, must-revalidate`; JS/CSS/images/icons are
  `public, max-age=31536000, immutable`.
- `/privacy/` and `/terms/` are present and the privacy statement describes
  local storage and the optional supporter-license check.

## Defects by severity

| Severity | Defects |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Verification limitation

The current container has no system Chrome. Lighthouse `13.4.1` was tried
against the exact local preview using the preinstalled Playwright Chromium; its
manually connected tab crashed before producing a report. This did not affect
the clean build, full Playwright suite, live Axe scans, PWA/offline checks,
header checks, or measured bundle-budget result.
