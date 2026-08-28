# Next Step Cards — review 3 handoff

Work order: `next-step-cards-review-3`
Review commit: this documentation commit
Live: <https://next-step-cards.sociobot.in>

## Done

- Performed a fresh, no-code-change adversarial review of the live product at
  390 px and desktop, plus a clean-clone verification at
  `e35f69e3f9d824ab7b728156f643b33af676e240`.
- Wrote `.factory/review-3.md` with the cold-read result, complete landing and
  README copy audit, declared-claim evidence, demo/storage/offline checks,
  history reconciliation, route/link/metadata evidence, and the final verdict.
- Confirmed all prior functional findings remain fixed. The review found one
  remaining minor accessibility issue: the demo banner is an `aside` nested in
  `main`, producing Axe’s moderate `landmark-complementary-is-top-level`
  violation.

## Verify

From a fresh clone:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Observed results: `npm test` 7/7 passed, build produced `dist/`, and the full
Playwright suite passed 30/30. Every one of the 12 commands declared in
`.factory/claims.json` was also run and passed.

Live checks confirmed the one-click seeded `/demo/` flow, reset behavior,
real-data isolation, same-origin demo requests, offline demo reload, deep
links/back/focus, HTTP 404, metadata, and link crawl. Live Axe scans found no
serious or critical violations, but found the moderate demo-landmark issue
recorded in review 3.

## Known gap

Review 3 is **FAIL** until `src/app.ts` changes the demo banner from the nested
`aside` landmark to a non-landmark container and the Axe regression test covers
this rule. No product source was changed by this review.
