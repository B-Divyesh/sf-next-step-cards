# Next Step Cards — polish round 1 handoff

Product repair commits: `a09b1bf33f787549e95107a08b508d3965e1701c` and `693ba021968723968087f960c21f26242c9393a6`  
Work order: `next-step-cards-polish-1`  
Deployment: <https://next-step-cards.sociobot.in> via `/opt/fleet/lib/deploy-static.sh next-step-cards /work/repo/dist` on 2026-08-28 (Azure deployment `58c19d1c-2b12-4417-b256-46864f00624f`).

## Completed

- Shipped a real one-click sample path at `/demo/` and `?demo=1`, with realistic sample data, a persistent isolated-demo banner, Reset demo, and Start for real.
- Kept demo data in `demo:next-step-cards`, separate from real `next-step-cards` browser storage. The exit path clears only the demo store.
- Added the complete claim contract, demo documentation, plain-words audit, catalog sentence, route metadata, social image, favicon, shared legal skeleton, focused route headings, and designed host-level 404.
- Rewrote the first screen for the actual interruption/resumption job. The print-card visual system, original art, local-first PWA class, and export/reminder workflow remain intact.
- Removed the unregistered supporter checkout and its price instead of leaving a dead paid action.

## Verification

Clean install on Node 22 / npm 10:

```sh
npm ci
npm test                 # 7/7 passed
npm run build            # passed; dist/index.html at deploy root
npm run test:e2e         # 22/22 passed (desktop + mobile, including Axe)
npm audit --omit=dev --audit-level=high  # zero vulnerabilities
```

Every command in `.factory/claims.json` was run separately after that clean
install and passed. The tests use fresh `/demo/` contexts and cover the sample,
demo isolation, privacy/network origin, offline reload, CSV/JSON contents,
quiet-hour adjustment, and no-payment core completion.

The built initial inline application is 8.15 KB gzip, CSS is 3.92 KB gzip,
and the mobile hero is below the 300 KB budget. `verify-url.sh` passed locally
and live with no page or console errors on the home route, title/lang/one h1/main,
and no images missing alt text. The Playwright Axe scan found zero serious or
critical violations.

Live cold re-check passed on 2026-08-28:

- `https://next-step-cards.sociobot.in/?demo=1` has the demo title, banner,
  sample card, demo canonical/OG title, and no 390px horizontal overflow.
- Demo reloaded offline after one connected visit with the active sample card.
- Privacy navigation focused the destination h1.
- `/no-such-route` returned HTTP 404 and the designed “This page is not here.”
  page; `/`, `/demo/`, `/privacy/`, `/terms/`, favicon, social image, manifest,
  sitemap, and robots all returned 200.

See `.factory/polish-1.md` for one-to-one finding closure and evidence paths.

## Known gaps

None. The supporter purchase was deliberately removed because its product was
not registered; a future paid tier must be registered and tested end to end
before it is advertised.
