# Next Step Cards — build handoff

Work order: `next-step-cards-build-1`

Completed: 2026-08-27

Artifact: static offline PWA, deployed from `dist/`

## What was built

- A single-active-card workflow for task name, next two-minute action, required link/file/place, why it matters, stopping point, and optional reminder.
- Explicit completion and parking decisions. Parking rewrites the active next step; every start, park, and completion appears in a local re-entry ledger. Finished cards can be reused.
- IndexedDB persistence across reloads, browser restarts, and installation.
- Local reminders with configurable quiet hours (21:00–08:00 by default), in-app due state, and optional system notifications while the app is running.
- JSON backup/restore with import preview and CSV history export. Clear-history is confirmed and keeps the active card.
- Installable manifest, 192/512/maskable icons, service worker with versioned shell cache, offline navigation, notification click handling, and update-ready feedback.
- A privacy-first US $6 one-time supporter tier. The free experience remains complete; valid Sociobot licenses unlock only Moss Field and Night Ledger cosmetic print editions. Return-token capture, daily verification cache, offline optimistic unlock, invalid-license reconciliation, and manual restore are included.
- `/privacy/` and `/terms/` pages, MIT license, README, sitemap, and robots policy.
- Original dithered/halftone artwork generated with the factory image model, manually reviewed, and exported at 640px/33 KB and 1200px/136 KB WebP sizes. Prompt and provenance are in `.factory/design.md` and `assets/src/`.

## Visual system

The committed `.factory/design.md` records the “quiet print room” thesis, palette, type roles, 4px spacing rhythm, interaction grammar, reduced-motion treatment, illustration prompt, and asset provenance. The UI deliberately resembles one physical continuation card and a simple print ledger rather than a productivity dashboard.

## Verification

Run from a clean checkout with Node.js 22+:

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Results on 2026-08-27:

- `npm test`: 6/6 unit tests passed.
- `npm run build`: passed; `dist/index.html` is at the deploy root.
- `npm run test:e2e`: 10/10 desktop/mobile tests passed, including `context.setOffline(true)` cold navigation, 390px overflow, keyboard submission, license verification, and two Axe scans with zero serious/critical violations.
- Factory `verify-url.sh`: passed; title present, `lang="en"`, exactly one h1, main landmark present, zero missing alt attributes, zero unlabeled buttons, and zero console/page errors. Recorded load was 689 ms on localhost.
- Lighthouse 12 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.7 s, LCP 1.7 s, CLS 0, TBT 30 ms.
- Initial app payload: 26.1 KB JavaScript and 11.9 KB CSS before gzip, inlined into the cached app shell; 33 KB mobile hero. All are below product budgets.
- `npm audit`: zero known vulnerabilities at build time.

Raw local reports and screenshots were produced under `.factory/evidence/` and are intentionally gitignored because they contain machine-specific localhost data.

## Known gaps and release notes

- Browsers do not offer a reliable standards-based, local-only alarm after a PWA is fully terminated. The reminder is retained and shown on next open; a system notification fires when the installed app is running. The UI explains this instead of implying background delivery.
- The factory must register `next-step-cards` in Sociobot billing before purchase links can complete. Production defaults to `https://api.sociobot.in`; set `VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in` for staging registration/testing. No product ID or secret is embedded.
- iOS installation uses Safari’s Add to Home Screen flow because `beforeinstallprompt` is not available there; the PWA itself remains installable.

No infrastructure, DNS, billing registration, analytics, or external data service was changed.
