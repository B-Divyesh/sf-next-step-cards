# Adversarial first-read review 5 — Next Step Cards

Review date: 2026-08-28

Target: https://next-step-cards.sociobot.in

Candidate: c5f19cead1a9d9912f9d95c3c4674b1238a75814
Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; live demo,
storage, offline, metadata, link, focus, and accessibility checks; every
declared claim command from a temporary clean clone; then the complete local
test/build/browser suite. No product code was changed.

## Verdict: FAIL

There is **one minor finding**, so the required zero-finding bar is not met.
The documented query-demo entry presents home-page Open Graph and Twitter
descriptions after otherwise changing into the demo route. The cold read,
one-click sample, demo isolation, all declared claim tests, offline behavior,
accessibility, routing, prior repairs, and visual identity otherwise verify.

## Cold first screen, before scrolling

The fresh mobile and desktop screens answer all three questions.

- **What it does:** records one clear action to make restarting interrupted
  work easier.
- **For whom:** a person resuming a task after an interruption who does not
  want to reopen a full project plan.
- **What to click first:** **Try it with sample data**. The adjacent outcome
  says **“See a filled card and history first.”**

The exact first-screen explanation is:

> “Return to work with one clear next step.”
>
> “For people resuming a task after an interruption, without reopening a full
> project plan.”

At 390 px the primary action, secondary real-use action, outcome, and all three
facts are visible before scrolling. The page has no horizontal overflow and
emits no console or page errors. The warm paper, hard ink edges, condensed
labels, and original halftone card art remain recognisably specific to this
product rather than a generic SaaS template.

## Finding

### F-5-1 — Minor: the documented query-demo URL retains the home social description

**Location and exact quote:** live
https://next-step-cards.sociobot.in/?demo=1. After the demo renders, its title
is **“Demo — Next Step Cards”**, canonical is /demo/, and standard description
is **“Try a realistic sample card and history. Nothing is saved to your
cards.”** Its og:description and twitter:description still say:

> “Write one clear next action before an interruption, then return without
> reopening a full plan.”

The direct /demo/ route has the correct demo descriptions. In
src/app.ts:430-434, query-demo setup updates the title, standard description,
canonical, Open Graph title, and Twitter title, but not either social
description. The raw query-demo HTML is also the home document, so crawlers
that do not run JavaScript receive home metadata throughout.

**Why this matters:** .factory/demo.md publishes the query URL as an equivalent
demo entry. Sharing it describes the real-use landing page instead of the
isolated sample, so route identity is inconsistent even though the demo works.

**Concrete fix:** Prefer an HTTP redirect from the query-demo URL to /demo/,
then keep /demo/ as the sole documented and canonical demo URL. If the query
URL must remain independently shareable, serve its demo title, canonical,
Open Graph description, and Twitter description in the initial response
rather than relying only on client-side changes. Add a route metadata test
that checks the standard, Open Graph, and Twitter descriptions for both demo
entry points, including the raw query response.

## Copy audit

Words are counted as space-separated spoken tokens; a hyphenated compound or
URL counts as one word. The landing table covers every visible copy item in a
fresh, loaded default state, including headings, controls, facts, labels,
placeholders, alt text, and footer copy. No item exceeds 22 words. No banned
marketing adjective, unexplained jargon, inconsistent product term,
out-of-context heading, or non-result-naming button was found. F-5-1 concerns
metadata, not visible copy.

### Landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Skip to your card | 4 | Pass |
| Next Step Cards | 3 | Pass |
| Demo | 1 | Pass; destination link |
| Privacy | 1 | Pass; destination link |
| Terms | 1 | Pass; destination link |
| Manage data and settings | 4 | Pass; verb names the result |
| Manage data | 2 | Pass; compact mobile text with the full accessible name above |
| A card for your return | 5 | Pass |
| Return to work with one clear next step. | 8 | Pass; job headline |
| For people resuming a task after an interruption, without reopening a full project plan. | 14 | Pass |
| Try it with sample data | 5 | Pass; demo-ready |
| Create my card | 3 | Pass |
| See a filled card and history first. | 7 | Pass; demo-ready |
| Saved in this browser | 4 | Pass; privacy-local |
| Reload while offline after your first visit | 7 | Pass; offline-reload |
| Core tools are free | 4 | Pass; free-core |
| A printed index card with a red check mark moving from scattered paper into open space. | 16 | Pass; image alt |
| Create your next-step card | 4 | Pass |
| Only the first two fields are required. | 7 | Pass; form instruction |
| Task name | 2 | Pass |
| Next two-minute action | 3 | Pass |
| Open the draft and write one heading | 7 | Pass; placeholder |
| Start with a physical verb: open, call, write, find, send. | 10 | Pass |
| Link, file, or place (optional) | 5 | Pass |
| https://… or Drafts/outline.md | 3 | Pass; placeholder |
| Why this matters (optional) | 4 | Pass |
| So tomorrow starts lighter | 4 | Pass; placeholder |
| I can stop when… (optional) | 5 | Pass |
| The heading and three bullets exist | 6 | Pass; placeholder |
| Quiet reminder (optional) | 3 | Pass |
| Choose a time. | 3 | Pass |
| Quiet hours move a reminder to the next available time. | 10 | Pass; quiet-hours |
| Create my next-step card | 4 | Pass |
| Your card record | 4 | Pass |
| History | 1 | Pass |
| 0 entries | 2 | Pass; state count |
| Your card history appears here after you create a card. | 10 | Pass |
| A short return path | 4 | Pass |
| How to use a next-step card | 6 | Pass; contextual heading |
| Name the task. | 3 | Pass |
| Write the work you will return to. | 7 | Pass |
| Choose one small action. | 4 | Pass |
| Make it physical enough to start. | 6 | Pass |
| Park or finish it. | 4 | Pass |
| Keep the useful context in history. | 6 | Pass |
| Your words stay yours | 4 | Pass |
| What happens to your card text | 6 | Pass; contextual heading |
| Cards are stored in this browser. | 6 | Pass; privacy-local |
| The demo uses separate sample storage and makes only same-origin requests. | 11 | Pass; privacy-local |
| Read the privacy policy | 4 | Pass |
| Your card stays in this browser. | 6 | Pass; privacy-local |
| Built by Param Factory · build 1.0.6 · Original illustration generated for this product. | 12 | Pass; build and provenance |

The visible state-dependent behavior promises are also plain and declared:
**“Finished clears this card and keeps it in history.”** (9,
completion-history), **“This change appears in your history.”** (6,
park-history), **“JSON restores the full app.”** (5, json-import), and
**“This removes history but keeps the active card.”** (8,
clear-history-preserves-active).

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Next Step Cards | 3 | Pass |
| Write one clear next action before you leave a task. | 10 | Pass |
| Return without reopening a full project plan. | 7 | Pass |
| It is for people resuming ordinary work after an interruption. | 10 | Pass |
| It is a task-note tool, not advice for urgent decisions. | 10 | Pass; scope statement |
| Live site: https://next-step-cards.sociobot.in | 3 | Pass |
| Try Next Step Cards | 4 | Pass; contextual heading |
| Open https://next-step-cards.sociobot.in/demo/ for a filled sample card and history. | 9 | Pass; demo-ready |
| The demo uses separate browser storage and never changes your cards. | 11 | Pass; demo-isolated |
| What Next Step Cards does | 5 | Pass; contextual heading |
| Lets you choose a reminder time and quiet hours. | 9 | Pass; quiet-hours |
| Quiet hours move a reminder to the next available time. | 10 | Pass; quiet-hours |
| Exports cards as JSON and history as CSV. | 8 | Pass; json-export, csv-export |
| Finishing or parking a card keeps the useful step in history. | 11 | Pass; completion-history, park-history |
| JSON restores a full backup. | 5 | Pass; json-import |
| Clearing history keeps the active card. | 6 | Pass; clear-history-preserves-active |
| Reloads the demo while offline after its first visit. | 9 | Pass; offline-reload |
| The observable product promises and their exact browser tests are in .factory/claims.json. | 12 | Pass |
| Run Next Step Cards locally | 5 | Pass; contextual heading |
| Requires Node.js 22 or later. | 5 | Pass; developer prerequisite |
| npm ci | 2 | Pass; command |
| npm run dev | 3 | Pass; command |
| Test and build Next Step Cards | 6 | Pass; contextual heading |
| npm test | 2 | Pass; command |
| npm run build | 3 | Pass; command |
| npm run test:e2e | 3 | Pass; command |
| Run every command in .factory/claims.json after npm ci to verify each visitor-facing promise. | 13 | Pass; developer instruction |
| npm run build writes the static deployment output to dist/, with dist/index.html at its root. | 15 | Pass; verified build instruction |
| Deploy dist/ as an Azure Static Web Apps static site. | 10 | Pass; developer instruction |
| The included staticwebapp.config.json serves the designed 404.html for missing paths. | 10 | Pass; verified deployment instruction |
| Project documents | 2 | Pass; contextual heading |
| Product scope | 2 | Pass; link label |
| Visual system and image provenance | 5 | Pass; link label |
| Demo storage and reset rules | 5 | Pass; link label |
| Claim contract | 2 | Pass; link label |
| Privacy policy | 2 | Pass; link label |
| Terms | 1 | Pass; link label |
| License | 1 | Pass; standard heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## Demo, claims, sandbox, and privacy

- One click from the cold home page opens /demo/. Its first screen already
  shows **“Draft the community grant outline”**, its next physical action,
  context, stopping point, and two realistic workshop history entries.
- The persistent banner says **“Demo — sample data, nothing is saved.”** and
  includes working **Reset demo** and **Start for real** controls.
- In a fresh live context, a real card was created first. The demo card was
  changed, reset, and exited. The real task and action remained unchanged.
  IndexedDB inspection showed separate next-step-cards and
  demo:next-step-cards stores.
- A direct fresh demo created only demo:next-step-cards. Network interception
  observed only https://next-step-cards.sociobot.in during the demo flow.
- After service-worker control, a live /demo/ navigation succeeded with the
  browser context offline and showed **“Offline and ready.”** with the sample
  card intact.

Every exact command in .factory/claims.json was run independently in the
clean clone /tmp/next-step-cards-review5.uq6F81. Each command ran its tagged
test in both configured browser projects.

| Claim id | Exact command | Result |
| --- | --- | --- |
| demo-ready | npm run test:e2e -- --grep @claim:demo-ready | Pass, 2/2 |
| demo-isolated | npm run test:e2e -- --grep @claim:demo-isolated | Pass, 2/2 |
| offline-reload | npm run test:e2e -- --grep @claim:offline-reload | Pass, 2/2 |
| privacy-local | npm run test:e2e -- --grep @claim:privacy-local | Pass, 2/2 |
| csv-export | npm run test:e2e -- --grep @claim:csv-export | Pass, 2/2 |
| json-export | npm run test:e2e -- --grep @claim:json-export | Pass, 2/2 |
| quiet-hours | npm run test:e2e -- --grep @claim:quiet-hours | Pass, 2/2 |
| free-core | npm run test:e2e -- --grep @claim:free-core | Pass, 2/2 |
| completion-history | npm run test:e2e -- --grep @claim:completion-history | Pass, 2/2 |
| park-history | npm run test:e2e -- --grep @claim:park-history | Pass, 2/2 |
| json-import | npm run test:e2e -- --grep @claim:json-import | Pass, 2/2 |
| clear-history-preserves-active | npm run test:e2e -- --grep @claim:clear-history-preserves-active | Pass, 2/2 |

No declared claim is untested or failing. Cross-checking the live landing copy
and README found no unlisted visitor-facing behavior claim.

## Earlier finding audit

Every earlier review, polish, both verification reports, and the prior handoff
were read. Each earlier finding was rechecked in the live site and current
source/configuration.

| Earlier id | Current verification | Status |
| --- | --- | --- |
| B1 | First-screen sample link opens a seeded active card and two history rows with banner/reset/exit controls. | Fixed |
| B2 | Live real-card → demo change/reset → Start for real preserved real IndexedDB data; source selects demo:next-step-cards. | Fixed |
| B3 | Twelve claim entries and twelve matching tagged tests exist; every exact command passed independently. | Fixed |
| B4 | No price, supporter, checkout, purchase, or buy control appears in any live route; the legacy license module is not imported or bundled. | Fixed |
| B5 | An unknown live path returns HTTP 404 with the designed heading and Return to your card link. | Fixed |
| M1 | The first screen names the job, interruption situation, sample action, outcome, and three short facts at 390 px. | Fixed |
| M2 | Canonical routes have route-specific title/description, canonical, OG/Twitter data, favicon, Apple icon, and social art. F-5-1 is a new query-entry inconsistency. | Fixed; new issue separate |
| M3 | Every route uses the shared header/footer; forward navigation focuses/announces Privacy and Back focuses/announces the restored demo heading. | Fixed |
| M4 | Public language consistently uses card, history, demo, and browser storage; actions name their results. | Fixed |
| Verify-1 High | Maximum allowed unbroken values at 390 px kept scrollWidth === clientWidth === 390. | Fixed |
| Verify-1 Medium | Live versioned hero/icon assets return one-year immutable caching; the service worker is no-cache and build 1.0.6. | Fixed |
| Verify-1 Low | Live manifest MIME is application/manifest+json; CSP, Permissions-Policy, Referrer-Policy, and nosniff are present. | Fixed |
| F-2-1 | completion-history finishes the sample and verifies the persisted Finished row. | Fixed |
| F-2-2 | park-history verifies the revised action in a persisted Parked row. | Fixed |
| F-2-3 | json-import restores active card, history, and quiet-hour settings. | Fixed |
| F-2-4 | clear-history-preserves-active verifies empty history and the unchanged active card after reload. | Fixed |
| F-3-1 | Demo banner is a non-landmark div; live Axe reports zero violations on the demo. | Fixed |
| F-4-1 | Live /demo/ → Privacy → Back focuses the page title and announces “Demo — Next Step Cards restored”. | Fixed |

## Structure, links, and accessibility

| Check | Result |
| --- | --- |
| Titles | Home, Demo, Privacy, Terms, and 404 follow the route-specific product pattern and remain under 60 characters. |
| Landmarks and headings | Every checked route has lang=en, one h1, one main, a header, and a footer. Heading outlines are ordered. |
| Metadata | Canonical routes have descriptions, canonical links, OG/Twitter cards, favicon, Apple icon, and 1200 × 630 original social art. F-5-1 is the query-demo exception. |
| 404 and deep links | /demo/, /privacy/, and /terms/ load directly. An unknown path returns the designed HTTP 404. |
| History and focus | Forward and browser Back navigation restore the correct URL, content, h1 focus, and polite announcement. |
| Link crawl | Every intentional internal link and https://sociobot.in/ returned 200. The deliberate missing-path probe returned 404. |
| Header/footer | All routes contain the wordmark, Demo/Privacy/Terms navigation, privacy statement, legal links, Param Factory credit, and build 1.0.6. |
| Accessibility | Playwright Axe found zero violations on /, /demo/, /privacy/, /terms/, and /404.html; verify-url.sh also passed all five routes with no console errors. |
| Mobile and motion | No 390 px overflow; controls meet the established touch layout; the automated suite retains reduced-motion and keyboard coverage. |
| Visual identity | The two-ink print-card system, warm paper, vermilion marks, hard shadows, and product-specific halftone art match .factory/design.md and are not a generic template. |

## Build and test evidence

- npm test: passed, 7/7.
- npm run build: passed; dist/ was produced. App JavaScript is 8.30 kB gzip
  and CSS is 3.95 kB gzip.
- npm run test:e2e: passed, 32/32 across desktop and mobile.
- The five live verify-url.sh runs passed title, language, one-h1, main,
  image-alt, labelled-button, and console checks.
- Live Axe scans reported zero violations on all five shipped route documents.

## Missed leverage

No brief-implied AI, sync, or portability feature is missing. The brief calls
for a self-authored, offline card without reliance on a chat assistant, so an
AI drafting step would be decorative and would weaken the local-only mental
model. JSON export/import and CSV history export already provide the expected
data portability. Automatic sync would conflict with the stated local-first
privacy model unless introduced as a separate, explicit product decision.

## What would make this perfect

Resolve F-5-1 by redirecting the published query-demo entry to /demo/ or by
serving complete demo metadata in its initial response, and add the metadata
regression described above. Then repeat the raw-response/browser route scan
and all claim commands. No other product, copy, demo, claim, accessibility,
routing, privacy, or leverage change is indicated by this review.
