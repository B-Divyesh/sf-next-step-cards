# Independent verification — FAIL

Work order: `next-step-cards-verify-1`

Verified: 2026-08-27

Candidate commit: `6936dc7d86505e61e9d64697e9d50eb4d293282d`

Production URL: <https://next-step-cards.sociobot.in>

## Verdict

**FAIL.** The normal workflow is solid, but the candidate does not meet the
mobile boundary-value acceptance criterion: a valid maximum-length task name
without whitespace produces horizontal page overflow at a 390px viewport.

The live deployment is otherwise the exact production build of the candidate:
SHA-256 matched for `/`, `/sw.js`, the manifest, legal pages, icons, and both
hero images.

## Release-blocking defect

### High — valid task name breaks 390px layout

`Task name` accepts 100 characters. On the built app at 390×844, entering
`'T'.repeat(100)` with a valid 280-character next action, then creating the
card, produced:

```
document.documentElement.scrollWidth > document.documentElement.clientWidth
// true
```

The active-card task heading has no wrapping/breaking rule, so one permitted
unbroken value pushes the document horizontally. This defeats the stated
mobile/no-overflow requirement and makes the continuation card harder to use
for a legitimate pasted identifier or title. Normal-spaced input did not
overflow.

## Other defects and risks

### Medium — deployment caching does not meet the static/PWA cache policy

All checked production resources, including the 33 KB mobile hero and icons,
are served as non-hashed paths with:

```
Cache-Control: public, must-revalidate, max-age=30
```

They are not immutable or long-lived. The service worker provides offline
availability after first load, but ordinary online repeat visits revalidate
the shell/assets every 30 seconds. This does not meet the supplied
long-lived-immutable caching requirement for hashed static assets.

### Low — manifest response type

`/manifest.webmanifest` is served as `application/octet-stream` with
`X-Content-Type-Options: nosniff`, rather than a web-manifest JSON type. Chrome
loaded the manifest/service worker in this test, but this is an avoidable
cross-browser installability risk.

### Low — missing browser hardening policies

Production returns HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
and `X-Content-Type-Options: nosniff`, but no Content-Security-Policy or
Permissions-Policy. This was not the cause of the functional failure, but it
is a response-policy gap worth addressing before release.

## Passing verification evidence

### Clean install, tests, and build

On Node `v22.23.2` / npm `10.9.8` from a clean candidate checkout:

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 0 known vulnerabilities |
| `npm test` | Passed, 6/6 Vitest tests |
| `npm run build` | Passed; includes `tsc --noEmit`; writes `dist/` |
| `npm run test:e2e` | Passed, 10/10 desktop and mobile Playwright tests |
| Lighthouse mobile local production build | Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.9 s, TBT 190 ms, CLS 0 |

The first test attempt correctly exposed that the loose Playwright range
resolved to 1.62.1 while this runner initially had no matching browser. After
the documented `npx playwright install chromium`, the unmodified suite passed
in 29.2 seconds.

Production build sizes are within the stated transfer budgets: `app.js`
26,048 bytes, CSS 11,829 bytes (both inlined into the app HTML), mobile hero
33,242 bytes, and the complete `index.html` 39,858 bytes before compression.
No third-party font or script is shipped.

### Independent workflow and recovery checks

Against the built production app at `http://127.0.0.1:4174` and, where noted,
the live HTTPS app:

- Blank required submission announced “Add a task name and one small next
  action.” and moved focus to `#task-name`; valid input then recovered.
- Maximum permitted values (100-character task name and 280-character action)
  persisted; this check exposed the mobile overflow above.
- JSON export downloaded `next-step-cards.json`; malformed JSON displayed an
  error without replacing the current state; a valid confirmed import restored
  its active card; confirmed ledger clear retained that active card.
- Keyboard Tab focus on the 390px view visibly rendered a `3px` vermilion
  outline on the wordmark and Data & settings control. The repository e2e
  suite also completed form submission with keyboard only.
- Reduced-motion emulation made the active-card animation duration `0.01s`.
- Fresh live-site browser run had no console/page errors before intentional
  offline simulation and no outbound requests off
  `https://next-step-cards.sociobot.in` in the free workflow.
- The live site registered and controlled the versioned service worker
  `next-step-cards-shell-v1.0.1`; `registration.update()` completed with the
  current worker active and no pending update. After a connected load, a
  saved active card survived `context.setOffline(true)` and a cold offline
  navigation, with the “Offline and ready.” state visible.
- The candidate Playwright suite performed Axe scans in empty and park-dialog
  states on desktop and mobile; zero serious or critical violations passed.

### Privacy, response, and deployment checks

- Source and browser request inspection found local IndexedDB/localStorage
  data, no analytics, advertising, remote fonts, or third-party scripts. The
  only designed off-origin endpoint is the Sociobot license verification and
  checkout endpoint, used only for the optional supporter purchase.
- `/privacy/` and `/terms/` exist in both `dist/` and production; the privacy
  policy accurately describes local storage and optional license verification.
- Production response headers were checked for `/`, `/sw.js`, manifest,
  offline page, legal pages, heroes, and all icons. HTTPS/HSTS, nosniff, and
  strict-origin referrer policy are present; the gaps are recorded above.
- SHA-256 was identical between freshly built `dist/` and production for all
  of those files, including root HTML (`30c5d9…c264ef2f`), so the production
  deployment matches this candidate exactly.

## Required next steps

1. Make task titles safely wrap/break at all widths and add a 390px
   max-length no-whitespace regression test.
2. Deploy versioned/hashed static assets with long-lived immutable caching
   (while leaving the service-worker script revalidated appropriately).
3. Serve the manifest with a web-manifest JSON content type and add CSP /
   Permissions-Policy at the hosting layer.
4. Re-run this verification on the replacement commit and update the live
   hash comparison.
