# Next Step Cards — polish round 5 handoff

Work order: `next-step-cards-polish-5`

Implementation commit: `10aa056f9cbf50898e846312a67d8fb3439c515a`

Deployment: `e4903d25-197b-4dfc-bc5d-066b0d6c0b05`

Live site: <https://next-step-cards.sociobot.in>

## What changed

- Fixed F-5-1. The compatibility entry `/?demo=1` now replaces itself with
  `/demo/` from a synchronous head bootstrap before home metadata is parsed.
- Kept `/demo/` as the sole documented and canonical demo route. Its raw HTML
  now uses the same standard, Open Graph, and Twitter description.
- Added browser coverage for both demo entry points and source-response
  coverage for redirect ordering and direct-demo raw metadata.
- Added OG and Twitter description updates to the app fallback route logic.
- Advanced the manifest, asset queries, footer marker, and service-worker
  cache to build `1.0.7`.
- Expanded the mobile boundary regression to all maximum-length user fields.
- Updated `.factory/claims.json`, demo documentation, the full copy audit, and
  the 53-character verb-first catalog description.
- Rechecked every earlier B1–B5, M1–M4, Verify-1, F-2, F-3, and F-4 repair.
  `.factory/polish-5.md` maps each finding to its change and evidence.

## Exact verification

From a temporary clean clone of the committed repair:

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

- `npm ci`: passed; 0 vulnerabilities.
- `npm test`: 8/8 unit and deployment-configuration tests passed.
- `npm run build`: passed and produced `dist/index.html`.
- `npm run test:e2e`: 34/34 desktop/mobile checks passed.
- Production dependency audit: 0 vulnerabilities.
- All twelve exact commands in `.factory/claims.json` passed independently in
  desktop and mobile. The clean-clone log ends `CLAIM_SUITE_PASSED`.
- The production bundle is 8.31 kB gzip JavaScript and 3.95 kB gzip CSS. The
  mobile hero is 33,242 bytes. No web font is shipped.

## Browser, accessibility, privacy, and offline evidence

- The factory URL verifier passed locally and live for `/`, `/demo/`,
  `/?demo=1`, `/privacy/`, `/terms/`, and `/404.html`. Every route had the
  correct title, `lang=en`, one h1, a main landmark, image alt text, labelled
  buttons, and zero console errors.
- Playwright Axe found zero violations on home, demo, Privacy, Terms, and 404
  in desktop and mobile projects. Keyboard route focus and Back restoration
  passed.
- A fresh live real card survived query-demo park, reset, and Start for real.
  A clean query-demo context contained only `demo:next-step-cards` and made
  only same-origin requests.
- After one connected demo visit, a fresh offline navigation retained the
  sample and displayed **Offline and ready.**
- Maximum 100/280/500/240/240-character unbroken field values produced no
  horizontal overflow at 390 px.
- Mobile Lighthouse: Performance 98, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.7 s, LCP 2.0 s, TBT 120 ms, CLS 0.

## Live release evidence

- Deployment id: `e4903d25-197b-4dfc-bc5d-066b0d6c0b05`.
- Cold `/?demo=1` ended at `/demo/` with the demo title, canonical, standard
  description, Open Graph description, and Twitter description.
- Live `/no-such-route-polish-5` returned HTTP 404 with the designed page.
- Manifest MIME, CSP, Permissions-Policy, Referrer-Policy, and `nosniff`
  headers passed. The hero is immutable for one year; the worker is no-cache.
- SHA-256 matched the local release for root, demo, both legal pages, 404,
  service worker, and manifest.
- Live screenshots and machine-readable reports are under
  `.factory/evidence/polish-5-live/` in the worker workspace.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
/opt/fleet/lib/deploy-static.sh next-step-cards dist
```

## Known gaps and next steps

None. No finding from review rounds 1–5 or the independent verification
reports remains unresolved.
