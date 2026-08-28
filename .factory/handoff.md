# Next Step Cards — polish 3 handoff

Work order: `next-step-cards-polish-3`
Repair commit: `fd827075fefae11dd9bf9e8ddebf13d8bc201df5`
Deployment: `c61049fe-b037-470a-bf5b-486b64d60d52`
Live: <https://next-step-cards.sociobot.in>

## Done

- Replaced the demo banner’s nested `aside` landmark with a plain `div`. The
  controls stay visible and operable, without falsely creating a complementary
  landmark inside `main`.
- Raised the browser accessibility regression from serious/critical-only to
  zero Axe violations across `/`, `/demo/`, `/privacy/`, `/terms/`, and the
  designed 404 page, on desktop and mobile.
- Advanced the PWA shell, manifest, icon, and image cache version to `1.0.5`
  so installed apps receive this repaired HTML shell. The warm paper,
  letterpress-card visual system is unchanged.
- Kept all earlier-review repairs intact: clear first-screen copy, one-click
  isolated demo at `/demo/` and `?demo=1`, separate `demo:next-step-cards`
  storage, declared claim coverage, mobile wrapping, real metadata/routing,
  legal links, and the designed HTTP 404.

## Verification

A separate clean clone at repair commit `fd827075fefae11dd9bf9e8ddebf13d8bc201df5`
ran:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

- `npm ci`: passed; 0 vulnerabilities.
- `npm test`: 7/7 passed.
- `npm run build`: passed; `dist/index.html` exists.
- `npm run test:e2e`: 30/30 passed, including desktop and mobile routes,
  keyboard/mobile, privacy, isolation, offline, 404, and the all-impact Axe
  regression.
- Each of the 12 exact commands in `.factory/claims.json` was invoked
  separately in that clean clone. All passed in desktop and mobile (24 claim
  executions). The command log ends with `CLAIM_SUITE_PASSED` at
  `/tmp/next-step-cards-polish-3.fXBluF/claim-tests.log`.
- `npm audit --omit=dev --audit-level=high`: passed; 0 vulnerabilities.

The production build is within transfer budgets: app JavaScript is 8,142 B
gzip, CSS is 3,935 B gzip, and the mobile hero is 33,242 B. There are no
shipped web fonts. Lighthouse 13.4.1 was attempted twice against the live site
with the installed Playwright Chromium; its launcher could not connect to that
browser, so it did not emit a report. The full browser, Axe, URL, offline, and
bundle-budget checks above passed independently.

## Live evidence

- `/opt/fleet/lib/verify-url.sh` passed for `/`, `/demo/`, `?demo=1`,
  `/privacy/`, `/terms/`, and `/404.html`: title, `lang`, one h1, main,
  image alt text, labelled buttons, and zero browser errors. Screenshots and
  JSON reports are under `.factory/evidence/polish-3-live-*`.
- A fresh 390 px live browser context created a real card, opened `?demo=1`,
  reset and parked sample data, chose Start for real, and found the original
  card unchanged. It observed only `https://next-step-cards.sociobot.in`
  requests. It also reloaded `/demo/` offline after service-worker control.
- The same cold 390 px pass clicked the home demo action, confirmed there is
  no checkout/supporter UI, checked Privacy h1 focus, and created a card with
  every maximum-length unbroken field without horizontal overflow. Screenshot:
  `.factory/evidence/polish-3-live-max-values-390.png`.
- Live Axe found zero violations on home, demo, both legal pages, and 404;
  the demo has zero `landmark-complementary-is-top-level` nodes. Evidence:
  `.factory/evidence/polish-3-live-demo-390.png` and
  `.factory/evidence/polish-3-live-demo/screenshot-mobile.png`.
- `/no-such-route` returns HTTP 404 with the designed “This page is not here.”
  response. Live headers retain CSP, Permissions-Policy, manifest MIME, and
  immutable image/icon caching.

## Known gaps

None. The only Lighthouse limitation is the container launcher; it is not a
product defect.
