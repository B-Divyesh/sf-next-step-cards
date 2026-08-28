# Next Step Cards — adversarial review 2 handoff

Work order: `next-step-cards-review-2`
Review target: <https://next-step-cards.sociobot.in>
Product code changed: none.

## Done

- Wrote the independent first-read review in `.factory/review-2.md`.
- Reviewed the brief, visual thesis, claims contract, demo documentation, every
  earlier review/polish/handoff document, and the relevant implementation.
- Checked live mobile (390 × 844) and desktop (1440 × 900) first screens,
  demo entry/reset/exit/isolation, offline reload, network origins, routing,
  metadata, 404, focus/back behaviour, links, and visual identity.
- Performed a clean `npm ci`, then ran `npm test`, `npm run build`,
  `npm run test:e2e`, and every exact command listed in `.factory/claims.json`.

## Result

FAIL: four minor unlisted functional claims remain in dialog copy. None of the
eight declared claim tests failed. See F-2-1 through F-2-4 in
`.factory/review-2.md` for exact quotes and required tests.

## Verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Then run each command in `.factory/claims.json`. The reviewer ran all eight
against the clean dependency installation.

## Known gaps / next steps

Add claim entries and observable demo tests for completion history, parking
history, JSON import restore, and clearing history while retaining the active
card, or remove those promises. No product or deployment changes were made by
this review.
