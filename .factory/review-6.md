# Adversarial first-read review 6 — Next Step Cards

Review date: 2026-08-28

Target: <https://next-step-cards.sociobot.in>

Candidate: `f3ecbf48f1927f9e11e818f20fd7fcea65f0dba4`

Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; live demo,
storage, offline, route, link, focus, metadata, and accessibility checks; every
declared claim command from a temporary clean clone; then the complete local
test/build/browser suite. No product code was changed.

## Verdict: PASS

There are **zero findings**, no failing claim, and no untested visitor-facing
claim. The product is clear before scrolling, tryable in one click, isolated
from real data in demo mode, honest about local storage, usable offline after
the first visit, and structurally complete.

## Cold first screen, before scrolling

The fresh mobile and desktop screens answer all three required questions.

- **What it does:** records one clear next action so interrupted work is easier
  to resume without reopening a full plan.
- **For whom:** people resuming a task after an interruption.
- **What to click first:** **Try it with sample data**. The adjacent outcome
  says **“See a filled card and history first.”**

The exact explanation is:

> “Return to work with one clear next step.”
>
> “For people resuming a task after an interruption, without reopening a full
> project plan.”

At 390 px, both actions, their outcome, and the three facts are visible before
scrolling. `scrollWidth === clientWidth === 390`. Neither viewport emitted a
console or page error. The warm paper, two-ink palette, hard-edged card forms,
condensed labels, and original halftone illustration are specific to this
product rather than a generic SaaS template.

## Findings

None.

## Copy audit

Words are counted as spoken tokens; punctuation separators do not count, and
a URL or hyphenated compound counts as one word. The tables include headings, labels, controls,
placeholder examples, alt text, and state-dependent promise copy because the
plain-words check applies to all of them. No sentence exceeds 22 words. No
banned marketing term, unexplained jargon, inconsistent term, contextless
heading, or non-result-naming button requires a rewrite.

### Loaded landing page

| Copy | Words | Audit |
| --- | ---: | --- |
| Skip to your card | 4 | Pass |
| Next Step Cards | 3 | Product name |
| Demo | 1 | Destination link |
| Privacy | 1 | Destination link |
| Terms | 1 | Destination link |
| Manage data and settings | 4 | Action and result |
| Manage data | 2 | Compact mobile label; accessible name remains the full label |
| A card for your return | 5 | Pass |
| Return to work with one clear next step. | 8 | Job-first headline |
| For people resuming a task after an interruption, without reopening a full project plan. | 14 | Names the user and situation |
| Try it with sample data | 5 | Result-naming action; `demo-ready` |
| Create my card | 3 | Result-naming real-use action |
| See a filled card and history first. | 7 | States the sample action outcome; `demo-ready` |
| Saved in this browser | 4 | `privacy-local` |
| Reload while offline after your first visit | 7 | `offline-reload` |
| Core tools are free | 4 | `free-core` |
| A printed index card with a red check mark moving from scattered paper into open space. | 16 | Purposeful image alt text |
| Create your next-step card | 4 | Contextual heading |
| Only the first two fields are required. | 7 | Plain form instruction |
| Task name | 2 | Field label |
| Next two-minute action | 3 | Field label |
| Open the draft and write one heading | 7 | Example value |
| Start with a physical verb: open, call, write, find, send. | 10 | Plain field help |
| Link, file, or place (optional) | 5 | Field label |
| https://… or Drafts/outline.md | 3 | Example value |
| Why this matters (optional) | 4 | Field label |
| So tomorrow starts lighter | 4 | Example value |
| I can stop when… (optional) | 5 | Field label |
| The heading and three bullets exist | 6 | Example value |
| Quiet reminder (optional) | 3 | Field label |
| Choose a time. | 3 | Plain field help |
| Quiet hours move a reminder to the next available time. | 10 | `quiet-hours` |
| Create my next-step card | 4 | Result-naming submit action |
| Your card record | 4 | Pass |
| History | 1 | Contextual heading |
| 0 entries | 2 | State count |
| Your card history appears here after you create a card. | 10 | Useful empty-state instruction |
| A short return path | 4 | Pass |
| How to use a next-step card | 6 | Contextual heading |
| Name the task. | 3 | Step |
| Write the work you will return to. | 7 | Step explanation |
| Choose one small action. | 4 | Step |
| Make it physical enough to start. | 6 | Step explanation |
| Park or finish it. | 4 | Step |
| Keep the useful context in history. | 6 | Step explanation |
| Your words stay yours | 4 | Pass |
| What happens to your card text | 6 | Contextual heading |
| Cards are stored in this browser. | 6 | `privacy-local` |
| The demo uses separate sample storage and makes only same-origin requests. | 11 | `privacy-local` |
| Read the privacy policy | 4 | Action and destination |
| Your card stays in this browser. | 6 | `privacy-local` |
| Built by Param Factory · build 1.0.7 · Original illustration generated for this product. | 12 | Build and provenance |

### State-dependent and dialog copy

| Copy | Words | Audit |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 7 | Required demo label; `demo-ready` and `demo-isolated` |
| Reset demo | 2 | Result-naming action |
| Start for real | 3 | Result-naming action |
| Offline and ready. | 3 | `offline-reload` |
| Your card is saved on this device. | 7 | `privacy-local` |
| Your active card | 3 | Pass |
| Welcome back to this step. | 5 | Contextual app heading |
| You already made the decision. | 5 | Pass |
| Begin with the action on the card. | 7 | Direct instruction |
| Do this next | 3 | Contextual card label |
| Bring along | 2 | Contextual card label |
| Nothing extra needed | 3 | Empty value |
| Open link | 2 | Result-naming action |
| Why it matters | 3 | Contextual card label |
| No reason needed—this step is enough. | 6 | Neutral empty value |
| A good stopping point | 4 | Contextual card label |
| After this small action is complete. | 6 | Plain fallback |
| Reminder | 1 | Contextual card label |
| No reminder set | 3 | Empty value |
| I finished this step | 4 | Result-naming action |
| Park with a new next step | 6 | Result-naming action |
| Print card | 2 | Result-naming action |
| Park when you are stopping but the task continues. | 9 | Plain instruction |
| Finished clears this card and keeps it in history. | 9 | `completion-history` |
| Use again | 2 | Result-naming history action |
| Leave a clean edge | 5 | Pass |
| What comes next? | 3 | Contextual dialog heading |
| Update the card before you step away. | 7 | Direct instruction |
| This change appears in your history. | 6 | `park-history` |
| Park this task | 3 | Result-naming action |
| Keep current card | 3 | Result-naming action |
| Your device, your data | 4 | Pass |
| Manage data and settings | 4 | Contextual dialog heading |
| Quiet hours | 2 | Contextual heading |
| Reminder times inside this window move to the end of quiet hours. | 11 | `quiet-hours` |
| Save quiet hours | 3 | Result-naming action |
| Local reminder permission | 3 | Contextual heading |
| Choose this button to ask this browser for notification permission. | 10 | Plain instruction |
| Allow system notifications | 3 | Result-naming action |
| Own your data | 3 | Contextual heading |
| JSON restores the full app. | 5 | `json-import` |
| CSV opens your card history in a spreadsheet. | 8 | `csv-export` |
| Export JSON | 2 | Result-naming action; `json-export` |
| Export CSV | 2 | Result-naming action; `csv-export` |
| Import JSON | 2 | Result-naming action; `json-import` |
| Install the app | 3 | Contextual heading |
| Install app | 2 | Result-naming action |
| Clear history | 2 | Contextual heading and result-naming action |
| This removes history but keeps the active card. | 8 | `clear-history-preserves-active` |

### README

| Copy | Words | Audit |
| --- | ---: | --- |
| Next Step Cards | 3 | Product heading |
| Write one clear next action before you leave a task. | 10 | Plain product purpose |
| Return without reopening a full project plan. | 7 | Plain result |
| It is for people resuming ordinary work after an interruption. | 10 | Names the user and situation |
| It is a task-note tool, not advice for urgent decisions. | 10 | Honest scope statement |
| Live site: https://next-step-cards.sociobot.in | 3 | Pass |
| Try Next Step Cards | 4 | Contextual heading |
| Open https://next-step-cards.sociobot.in/demo/ for a filled sample card and history. | 9 | `demo-ready` |
| The demo uses separate browser storage and never changes your cards. | 11 | `demo-isolated` |
| What Next Step Cards does | 5 | Contextual heading |
| Lets you choose a reminder time and quiet hours. | 9 | `quiet-hours` |
| Quiet hours move a reminder to the next available time. | 10 | `quiet-hours` |
| Exports cards as JSON and history as CSV. | 8 | `json-export`, `csv-export` |
| Finishing or parking a card keeps the useful step in history. | 11 | `completion-history`, `park-history` |
| JSON restores a full backup. | 5 | `json-import` |
| Clearing history keeps the active card. | 6 | `clear-history-preserves-active` |
| Reloads the demo while offline after its first visit. | 9 | `offline-reload` |
| The observable product promises and their exact browser tests are in .factory/claims.json. | 12 | Accurate documentation |
| Run Next Step Cards locally | 5 | Contextual heading |
| Requires Node.js 22 or later. | 5 | Developer prerequisite |
| npm ci | 2 | Command |
| npm run dev | 3 | Command |
| Test and build Next Step Cards | 6 | Contextual heading |
| npm test | 2 | Command |
| npm run build | 3 | Command |
| npm run test:e2e | 3 | Command |
| Run every command in .factory/claims.json after npm ci to verify each visitor-facing promise. | 13 | Developer instruction |
| npm run build writes the static deployment output to dist/, with dist/index.html at its root. | 15 | Verified developer instruction |
| Deploy dist/ as an Azure Static Web Apps static site. | 10 | Developer instruction |
| The included staticwebapp.config.json serves the designed 404.html for missing paths. | 10 | Verified developer instruction |
| Project documents | 2 | Contextual heading |
| Product scope | 2 | Link label |
| Visual system and image provenance | 5 | Link label |
| Demo storage and reset rules | 5 | Link label |
| Claim contract | 2 | Link label |
| Privacy policy | 2 | Link label |
| Terms | 1 | Link label |
| License | 1 | Standard heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

Terminology remains consistent: **card** means the current task note,
**history** means prior card records, **demo** means the isolated sample, and
**saved in this browser** describes local persistence. No rewrite is proposed
because there is no copy flag.

## Demo, sandbox, privacy, and offline verification

- One click from the cold home page opened `/demo/`. Its first screen already
  showed the active **Draft the community grant outline** card, its next action,
  context, stopping point, and two realistic workshop-brief history entries.
- The banner **“Demo — sample data, nothing is saved.”** remained present with
  working **Reset demo** and **Start for real** controls. After changing the
  sample action, Reset restored **“Open the outline and write three section
  headings.”** and the two seed history rows.
- A real card named **Review six real card** was created first. The demo was
  changed, reset, and exited. The real card returned with its exact action,
  **“Open the review notes”**.
- A fresh direct-demo context created only `demo:next-step-cards`; it did not
  create `next-step-cards`. Network interception observed only
  `https://next-step-cards.sociobot.in`.
- After one connected demo visit and service-worker control, Chromium was put
  offline. A direct `/demo/` reload returned the filled sample and **“Offline
  and ready.”** without a console or page error.

## Claims

Every exact command in `.factory/claims.json` was run independently from the
clean clone `/tmp/nsc-review6.PBXjep`. Each tagged test ran in both configured
browser projects.

| Claim id | Exact command | Result |
| --- | --- | --- |
| demo-ready | `npm run test:e2e -- --grep @claim:demo-ready` | Pass, 2/2 |
| demo-isolated | `npm run test:e2e -- --grep @claim:demo-isolated` | Pass, 2/2 |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | Pass, 2/2 |
| privacy-local | `npm run test:e2e -- --grep @claim:privacy-local` | Pass, 2/2 |
| csv-export | `npm run test:e2e -- --grep @claim:csv-export` | Pass, 2/2 |
| json-export | `npm run test:e2e -- --grep @claim:json-export` | Pass, 2/2 |
| quiet-hours | `npm run test:e2e -- --grep @claim:quiet-hours` | Pass, 2/2 |
| free-core | `npm run test:e2e -- --grep @claim:free-core` | Pass, 2/2 |
| completion-history | `npm run test:e2e -- --grep @claim:completion-history` | Pass, 2/2 |
| park-history | `npm run test:e2e -- --grep @claim:park-history` | Pass, 2/2 |
| json-import | `npm run test:e2e -- --grep @claim:json-import` | Pass, 2/2 |
| clear-history-preserves-active | `npm run test:e2e -- --grep @claim:clear-history-preserves-active` | Pass, 2/2 |

Cross-checking the live landing copy, state-dependent product copy, and README
found no unlisted visitor-facing claim. Demo, privacy, offline, quiet-hours,
free access, export, import, history retention, and destructive-action scope
all map to an observable claim test.

## Earlier finding audit

Every `review-1.md` through `review-5.md`, every `polish-1.md` through
`polish-5.md`, and the prior handoff were read. Each earlier finding was
rechecked on the live site and in current source/configuration rather than
accepted from its recorded status.

| Earlier id | Current verification | Status |
| --- | --- | --- |
| B1 | First-screen sample action opens a filled card and two history rows with banner, Reset, and Start for real. | Fixed |
| B2 | Live real-card → demo edit/reset → Start for real preserved real data; `src/db.ts` selects `demo:next-step-cards`. | Fixed |
| B3 | Twelve manifest entries and twelve matching tagged tests exist; every exact command passed independently. | Fixed |
| B4 | No price, supporter, checkout, purchase, or buy control appears in live routes; `src/license.ts` is not imported or built. | Fixed |
| B5 | An unknown live path returned HTTP 404 with the designed heading and **Return to your card** link. | Fixed |
| M1 | The first screen names the job, interruption situation, sample action, outcome, and three short facts at 390 px. | Fixed |
| M2 | Every shipped route has the expected title, description, canonical, OG/Twitter data, favicon, Apple icon, and social art. | Fixed |
| M3 | Routes share the header/footer; forward navigation and browser Back focus and announce the destination h1. | Fixed |
| M4 | Public language consistently uses card, history, demo, and browser storage; controls name actions or results. | Fixed |
| Verify-1 High | Maximum allowed unbroken values remain covered by the 390 px no-overflow regression. | Fixed |
| Verify-1 Medium | Versioned assets retain immutable caching; the service worker remains no-cache and uses shell `v1.0.7`. | Fixed |
| Verify-1 Low | Manifest MIME, CSP, Permissions-Policy, Referrer-Policy, and `nosniff` are present live. | Fixed |
| F-2-1 | `completion-history` verifies the persisted **Finished** history row. | Fixed |
| F-2-2 | `park-history` verifies the revised action in a persisted **Parked** row. | Fixed |
| F-2-3 | `json-import` restores the active card, history, and quiet-hour settings. | Fixed |
| F-2-4 | `clear-history-preserves-active` verifies empty history and the unchanged active card after reload. | Fixed |
| F-3-1 | The demo banner is a non-landmark `div`; live Axe reports zero violations on the demo. | Fixed |
| F-4-1 | Live `/demo/` → Privacy → Back focused `#page-title` and announced **Demo — Next Step Cards restored**. | Fixed |
| F-5-1 | `/?demo=1` replaces to `/demo/`; title, canonical, and standard/OG/Twitter descriptions match the direct demo. | Fixed |

## Structure, links, accessibility, and build

- Home, Demo, Privacy, Terms, and 404 titles follow the route-specific product
  pattern and remain under 60 characters. Every route has `lang="en"`, one h1,
  one main landmark, ordered headings, a description, canonical, OG/Twitter
  card, favicon, Apple icon, and the shared header/footer.
- Direct `/demo/`, `/privacy/`, and `/terms/` links load correctly. The missing
  path probe returned HTTP 404 with the designed print-style page. Forward and
  Back navigation restored the route, heading focus, and polite announcement.
- Every crawled internal link and `https://sociobot.in/` returned HTTP 200.
  `robots.txt`, `sitemap.xml`, favicon, Apple icon, and the 1200 × 630 social
  image also returned HTTP 200.
- The live factory URL verifier passed Home, Demo, Privacy, Terms, and the
  designed 404 document with no console errors, one h1, one main, `lang`, image
  alt text, and labelled buttons. Fresh Playwright Axe scans found zero
  violations on those five documents.
- Keyboard focus, Back restoration, reduced-motion CSS, 44 px targets, form
  labels/errors, and 390 px overflow are covered in source and the browser
  suite. The page remained usable with no layout overflow at the checked phone
  width.
- From the clean clone, `npm test` passed 8/8, `npm run build` produced
  `dist/`, and `npm run test:e2e` passed 34/34. The application JavaScript is
  8.31 kB gzip and CSS is 3.95 kB gzip, below the static-product limit.
- The two-ink print-card palette, paper texture, hard shadows, original
  halftone art, and restrained motion match `.factory/design.md` and are
  recognisable from a thumbnail.

## Missed leverage

No brief-implied feature is missing. JSON export/import and CSV history export
cover expected portability. Automatic sync would conflict with the explicit
local-first model. An AI drafting step would be decorative and contrary to the
brief’s goal of recording a person’s own decision without relying on a chat
assistant. No provider key or runtime AI endpoint is embedded in the shipped
application.

## What would make this perfect

Nothing is left to change based on this review. Preserve the current claim,
demo-isolation, offline, accessibility, route, and copy regressions in future
releases.
