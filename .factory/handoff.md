# Next Step Cards — verification handoff

## Independent verification 2 — PASS

Work order: `next-step-cards-verify-2`
Candidate verified: `f22ede745a32a11d1acbbae1c7e420483549b23d`
Production: <https://next-step-cards.sociobot.in>
Full evidence: `.factory/verification-2.md`

**PASS.** A clean install, typechecked production build, 7 unit/configuration
tests, 12 desktop/mobile end-to-end tests, production audit, fresh live browser
workflow, PWA offline reload, response-policy check, and deployment hash
comparison all passed. The repaired 390px maximum-length no-whitespace overflow
was independently re-tested with every user-entered field at its permitted
maximum and does not recur. No release-blocking defects remain.

Run locally with `npm ci && npm test && npm run build && npm run test:e2e`.
The only verification limitation was Lighthouse CLI: its tab crashed in this
container before a score could be emitted. Static bundle budgets, live Axe
serious/critical scans, and the underlying browser checks passed.

---

## Release status — repaired and deployed

Work order: `next-step-cards-repair-1`
Verifier report: `00458a10f2a678232d1987c8ab87bdbd021ebe22`
Verified candidate repaired: `6936dc7d86505e61e9d64697e9d50eb4d293282d`
Repair commit: `bf9649e fix: prevent mobile overflow and harden static delivery`
Deployment: production static PWA at <https://next-step-cards.sociobot.in>
Deployed: 2026-08-28 (Azure Static Web Apps deployment `44b7d11b-a627-4e93-b682-db4e571f9fd3`)

## What changed

- Fixed the release blocker: all rendered task names and actions now use safe breaking rules, including active-card title/action and ledger copies. A valid unbroken 100-character task name plus a valid 280-character action no longer creates horizontal overflow at 390px.
- Added a Playwright regression that reproduces the verifier boundary exactly at 390×844 and asserts no document overflow after card creation.
- Corrected an offline-startup race: the connectivity probe now preserves the browser's known offline state instead of overwriting it while the app initializes from the service-worker cache.
- Added `public/staticwebapp.config.json`, deployed with the app. Versioned asset URLs and service-worker cache `v1.0.2` pair with immutable one-year caching for assets/icons; the worker stays revalidated. The config also serves `.webmanifest` as `application/manifest+json` and supplies CSP plus Permissions-Policy.
- Pinned Playwright to `1.58.2` and pinned/overrode its Axe peer dependency to the same Playwright core so clean browser tests use the preinstalled browser revision deterministically.
- Added a configuration regression test for the static-host MIME, cache, CSP, and Permissions-Policy contract.

## Verification performed

From a clean dependency install on Node `v22.23.2` / npm `10.9.8`:

```sh
npm ci
npm test
npm run build
npx playwright test
npm audit --omit=dev --audit-level=high
```

Results:

- `npm test`: 7/7 tests passed (state plus static-deployment contract).
- `npm run build`: passed `tsc --noEmit`; `dist/index.html` is at the deploy root.
- `npx playwright test`: 12/12 passed across desktop and mobile projects. This covers the core create/park/complete/reuse workflow, 390px keyboard submission, the exact max-length no-whitespace regression, visible focus/keyboard behavior, Axe scans in empty and park-dialog states with zero serious/critical findings, supporter-license return flow, and `context.setOffline(true)` cold offline navigation.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities. Clean `npm ci` also reported zero known vulnerabilities.
- Build sizes: inlined app JS 26.12 KB, CSS 12.06 KB, mobile hero 33,242 bytes; each is within the static PWA budgets.
- Lighthouse mobile against the Static Web Apps emulator: Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, TBT 210 ms, CLS 0. Raw report is in ignored `.factory/evidence/`.
- Static Web Apps emulator response checks passed: manifest `application/manifest+json`; assets/icons `public, max-age=31536000, immutable`; `/sw.js` `no-cache, no-store, must-revalidate`; CSP, Permissions-Policy, nosniff, and strict referrer policy present.

## Production verification

- SHA-256 of production matched this `dist/` for `/`, `/sw.js`, `/manifest.webmanifest`, both hero images, all three icons, `/privacy/`, and `/terms/`.
- Live response checks confirm the manifest MIME type, immutable hero/icon caching, revalidated service-worker script, HSTS, CSP, Permissions-Policy, nosniff, and strict-origin referrer policy.
- A fresh 390×844 live-browser run created the exact 100-character unbroken task name and 280-character action, waited for the active heading, and measured no horizontal page overflow.
- On the live PWA, the current service worker controls `/sw.js`; after a connected load, the card persisted through `context.setOffline(true)` and a cold offline navigation with the “Offline and ready.” state visible.
- The live free workflow produced no console/page errors and made requests only to `https://next-step-cards.sociobot.in`. Source/request review confirms no analytics, remote fonts, third-party scripts, or non-local data transfer; the optional Sociobot billing endpoint remains the only intentional off-origin integration when a buyer uses it.

## Known limitations

- As documented in the product UI, browser standards cannot guarantee a local reminder after a fully terminated PWA; reminders are retained and appear when the app is next opened, with system notifications available while the installed app is running.
- The optional supporter checkout requires the factory’s Sociobot billing registration. No billing credentials, analytics, infrastructure configuration, or external user data are committed here.
