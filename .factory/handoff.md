# Next Step Cards — polish 4 handoff

Repair commit: `ad043dc602389384a8b6307bc8b453c1ab47451b`
Deployment: `d0ce6b10-1e5a-4e5b-b8c4-334d230dee25`
Live site: <https://next-step-cards.sociobot.in>

## Done

- Fixed F-4-1: Back/Forward restoration now moves focus to the restored app
  heading and announces `Demo — Next Step Cards restored` in a polite live
  region. It covers both back-forward-cache restores and browsers that reload
  the app shell on history navigation.
- Made dynamic app headings programmatically focusable without altering normal
  initial-load focus. Added desktop and mobile browser regression coverage.
- Bumped the PWA shell, manifest, icons, image URLs, and visible build marker
  to `1.0.6` so installed clients receive the repaired app shell.
- Rechecked every earlier review finding: one-click isolated demo, sample
  banner/reset/exit, local privacy, claims, exports/imports, offline reload,
  first-screen copy, mobile wrapping, metadata, shared legal shell, 404,
  headers, and non-generic print-card visual identity all remain working.
- Updated `.factory/catalog-description.txt` with the verb-first description:
  `Resume interrupted work with one clear next step.`

## How verified

From a separate clean clone of `ad043dc602389384a8b6307bc8b453c1ab47451b`:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

- `npm ci`: passed, 0 vulnerabilities.
- `npm test`: 7/7 passed.
- `npm run build`: passed; `dist/index.html` exists.
- `npm run test:e2e`: 32/32 passed across desktop and mobile, including the
  zero-Axe route scan, keyboard/history focus, demo isolation, privacy,
  offline, 404, and 390 px layout checks.
- All twelve exact claim commands in `.factory/claims.json` were run
  separately from that same clean clone and passed in both browser projects.
  Evidence: `.factory/evidence/polish-4-clean-clone-claims.log`.
- `npm audit --omit=dev --audit-level=high`: passed, 0 vulnerabilities.
- Local mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, LCP
  0.8 s, CLS 0. Shipped app JS is 8,308 B gzip, CSS 3,946 B gzip, and mobile
  hero art 33,242 B.

## Live recheck after deployment

- `/opt/fleet/lib/verify-url.sh` passed on `/`, `/demo/`, `?demo=1`,
  `/privacy/`, `/terms/`, and `/404.html`; reports and screenshots are under
  `.factory/evidence/polish-4-live/`.
- A fresh live mobile context directly opened `?demo=1`, confirmed realistic
  sample data, demo banner, Reset demo, Start for real, the isolated
  `demo:next-step-cards` store, and same-origin requests.
- A separate live context created a real card, used and exited demo, and
  confirmed that real card remained unchanged. After service-worker control,
  live `/demo/` reloaded while offline with the sample card present.
- Live `/demo/ → /privacy/ → Back` focused `#page-title` and announced the
  restored demo. Live Axe found zero violations on all shipped routes.
- Every live route has the expected title, description, canonical, Open Graph,
  Twitter, favicon, Apple touch icon, one h1, main landmark, and shared legal
  footer. `/no-such-route` returns HTTP 404 with the designed return path.
- Live manifest MIME, CSP, Permissions-Policy, Referrer-Policy, `nosniff`,
  and immutable asset cache headers were checked after deployment.

## Run and deploy

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

Deploy the generated `dist/` folder as the configured static site.

## Known gaps

None.
