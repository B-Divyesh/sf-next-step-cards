# Next Step Cards — review 5 handoff

Review date: 2026-08-28

Reviewed commit: c5f19cead1a9d9912f9d95c3c4674b1238a75814
Live site: https://next-step-cards.sociobot.in

## Done

- Completed the adversarial cold read at 390 × 844 and 1440 × 900.
- Audited visible landing and README copy with word counts.
- Exercised the live one-click demo, reset, real-data isolation, same-origin
  network behavior, and offline reload.
- Ran all twelve exact claim commands independently from a temporary clean
  clone.
- Rechecked every earlier review and verification finding in the live site and
  current code/configuration.
- Crawled live links; checked route metadata, designed 404, deep links,
  forward/Back focus, shared shell, mobile overflow, and security/cache
  headers.
- Ran live Axe scans and the factory URL verifier on all shipped route
  documents.
- Wrote .factory/review-5.md. No product code was changed.

## Verdict and remaining work

**FAIL** with one minor finding, F-5-1. The documented query-demo route changes
to demo content but retains the home og:description and twitter:description;
its raw response is also home metadata. Redirect that entry to /demo/ or serve
complete demo metadata in its initial response, and add a raw-response/browser
regression for all demo description tags.

## Verification

    npm ci
    npm test
    npm run build
    npm run test:e2e

- npm test: 7/7 passed.
- npm run build: passed and produced dist/.
- npm run test:e2e: 32/32 passed across desktop and mobile.
- Each command in .factory/claims.json: passed independently, 2/2 browser
  projects per claim.
- Live verify-url.sh: passed on home, demo, Privacy, Terms, and 404.
- Live Axe: zero violations on those five routes.

See .factory/review-5.md for the finding, exact copy audit, claim matrix,
earlier-finding audit, and concrete acceptance fix.
