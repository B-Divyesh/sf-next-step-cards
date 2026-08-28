# Adversarial first-read review 3 — Next Step Cards

Review date: 2026-08-28  
Target: <https://next-step-cards.sociobot.in>  
Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; a fresh clone at
`e35f69e3f9d824ab7b728156f643b33af676e240`; live storage, offline, route,
metadata, link, copy, and accessibility checks. No product code was changed.

## Verdict: FAIL

There is **one minor finding**. The strict acceptance bar requires zero
findings. The first read, one-click demo, isolated storage, all declared claim
tests, offline flow, structure, earlier repairs, and visual identity otherwise
verify successfully.

## Cold first screen, before scrolling

The 390 px and desktop screens answered all three questions before scrolling.

- **What it does:** leave one clear next action for returning to work.
- **For whom:** people resuming a task after an interruption.
- **What to click first:** **Try it with sample data**; the nearby outcome says
  **“See a filled card and history first.”**

The exact first-screen copy was:

> “Return to work with one clear next step.”
>
> “For people resuming a task after an interruption, without reopening a full
> project plan.”

The mobile page had no horizontal overflow, and neither viewport reported a
console or page error. The print-card, warm-paper, vermilion, and halftone
identity is distinct from a generic SaaS template.

## Findings

### F-3-1 — Minor: the demo banner creates an invalid nested landmark

**Location / exact quote:** `/demo/`, `src/app.ts:190` renders
`<aside class="demo-banner" aria-label="Demo controls">` inside `<main>`.

**Evidence:** a live Axe scan at 390 px reports
`landmark-complementary-is-top-level` with moderate impact on `/demo/`. The
same scan has no violations on `/`, `/privacy/`, `/terms/`, or the designed
404, and no serious or critical violations on any checked route.

**Why this matters:** the banner is a control/status strip, not complementary
content. Nesting its `complementary` landmark in `main` gives screen-reader
users an invalid landmark structure, even though its controls otherwise work.

**Concrete fix:** change this wrapper from `aside` to `div` (retain the
`aria-label` only if a non-landmark grouping name is needed), then extend the
existing Axe test to fail on all violation impacts for `/demo/` or explicitly
assert that this rule has no nodes.

## Copy audit

Word counts include visible labels, headings, controls, and the hero alt text.
Every item is at or below 22 words. No banned marketing word, unexplained
jargon, inconsistent public term, or non-result-naming button was found. The
functional promises below map to the named claim entries; labels and static
instructions are not additional visitor promises.

### Landing page

| Copy | Words | Result / claim mapping |
| --- | ---: | --- |
| Skip to your card | 4 | Pass |
| Next Step Cards | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Manage data | 2 | Pass; full accessible name is “Manage data and settings” (4). |
| A card for your return | 5 | Pass |
| Return to work with one clear next step. | 8 | Pass; plain job headline. |
| For people resuming a task after an interruption, without reopening a full project plan. | 14 | Pass |
| Try it with sample data | 5 | Pass; `demo-ready`. |
| Create my card | 3 | Pass |
| See a filled card and history first. | 8 | Pass; `demo-ready`. |
| Saved in this browser | 5 | Pass; `privacy-local`. |
| Reload while offline after your first visit | 7 | Pass; `offline-reload`. |
| Core tools are free | 4 | Pass; `free-core`. |
| A printed index card with a red check mark moving from scattered paper into open space. (alt) | 16 | Pass |
| Create your next-step card | 4 | Pass |
| Only the first two fields are required. | 7 | Pass; static form instruction. |
| Task name | 2 | Pass |
| Next two-minute action | 3 | Pass |
| Start with a physical verb: open, call, write, find, send. | 10 | Pass |
| Link, file, or place (optional) | 5 | Pass |
| Why this matters (optional) | 4 | Pass |
| I can stop when… (optional) | 5 | Pass |
| Quiet reminder (optional) | 3 | Pass |
| Choose a time. | 3 | Pass |
| Quiet hours move a reminder to the next available time. | 10 | Pass; `quiet-hours`. |
| Create my next-step card | 4 | Pass |
| Your card record | 4 | Pass |
| History | 1 | Pass |
| 0 entries | 2 | Pass; state-dependent count. |
| Your card history appears here after you create a card. | 10 | Pass |
| A short return path | 4 | Pass |
| How to use a next-step card | 7 | Pass |
| Name the task. | 3 | Pass |
| Write the work you will return to. | 7 | Pass |
| Choose one small action. | 4 | Pass |
| Make it physical enough to start. | 7 | Pass |
| Park or finish it. | 4 | Pass |
| Keep the useful context in history. | 6 | Pass |
| Your words stay yours | 4 | Pass |
| What happens to your card text | 6 | Pass |
| Cards are stored in this browser. | 6 | Pass; `privacy-local`. |
| The demo uses separate sample storage and makes only same-origin requests. | 11 | Pass; `privacy-local`. |
| Read the privacy policy | 4 | Pass |
| Your card stays in this browser. | 6 | Pass; `privacy-local`. |
| Built by Param Factory · build 1.0.4 · Original illustration generated for this product. | 12 | Pass; provenance/build footer. |

### README

| Copy | Words | Result / claim mapping |
| --- | ---: | --- |
| Next Step Cards | 3 | Pass |
| Write one clear next action before you leave a task. | 10 | Pass |
| Return without reopening a full project plan. | 7 | Pass |
| It is for people resuming ordinary work after an interruption. | 10 | Pass |
| It is a task-note tool, not advice for urgent decisions. | 10 | Pass; scope statement. |
| Live site: https://next-step-cards.sociobot.in | 3 | Pass |
| Try Next Step Cards | 4 | Pass |
| Open https://next-step-cards.sociobot.in/demo/ for a filled sample card and history. | 9 | Pass; `demo-ready`. |
| The demo uses separate browser storage and never changes your cards. | 11 | Pass; `demo-isolated`. |
| What Next Step Cards does | 5 | Pass |
| Lets you choose a reminder time and quiet hours. | 9 | Pass; `quiet-hours`. |
| Quiet hours move a reminder to the next available time. | 10 | Pass; `quiet-hours`. |
| Exports cards as JSON and history as CSV. | 8 | Pass; `json-export`, `csv-export`. |
| Finishing or parking a card keeps the useful step in history. | 11 | Pass; `completion-history`, `park-history`. |
| JSON restores a full backup. | 5 | Pass; `json-import`. |
| Clearing history keeps the active card. | 6 | Pass; `clear-history-preserves-active`. |
| Reloads the demo while offline after its first visit. | 9 | Pass; `offline-reload`. |
| The observable product promises and their exact browser tests are in `.factory/claims.json`. | 12 | Pass |
| Run Next Step Cards locally | 5 | Pass |
| Requires Node.js 22 or later. | 5 | Pass; developer instruction. |
| npm ci | 2 | Pass; command. |
| npm run dev | 3 | Pass; command. |
| Test and build Next Step Cards | 6 | Pass |
| npm test | 2 | Pass; command. |
| npm run build | 3 | Pass; command. |
| npm run test:e2e | 3 | Pass; command. |
| Run every command in `.factory/claims.json` after `npm ci` to verify each visitor-facing promise. | 14 | Pass; developer instruction. |
| `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. | 14 | Pass; developer instruction. |
| Deploy `dist/` as an Azure Static Web Apps static site. | 10 | Pass; developer instruction. |
| The included `staticwebapp.config.json` serves the designed `404.html` for missing paths. | 10 | Pass; developer instruction. |
| Project documents | 2 | Pass |
| Product scope | 2 | Pass |
| Visual system and image provenance | 5 | Pass |
| Demo storage and reset rules | 5 | Pass |
| Claim contract | 2 | Pass |
| Privacy policy | 2 | Pass |
| Terms | 1 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

## Demo, claims, sandbox, and privacy checks

- From a fresh home page, one click on **Try it with sample data** opened
  `/demo/`. Its first usable screen showed the “Draft the community grant
  outline” card and two realistic workshop-brief history entries, alongside
  the persistent **“Demo — sample data, nothing is saved.”** banner, Reset
  demo, and Start for real.
- Completing the sample and then Reset demo restored the active sample and two
  history entries. In a separate live check, creating a real “Prepare real
  tax notes” card, parking the demo card, and choosing Start for real left the
  real card intact.
- The code uses `demo:next-step-cards` for demo storage and
  `next-step-cards` for real storage. Demo flow requests observed by network
  interception were only same-origin.
- After a connected demo visit and active service-worker control,
  `context.setOffline(true)` plus a demo navigation retained the filled card
  and displayed **“Offline and ready.”** with no errors.
- In the fresh clone, `npm ci`, `npm test` (7/7), `npm run build`, and
  `npm run test:e2e` (30/30) passed. Each of the 12 exact commands listed in
  `.factory/claims.json` also passed: `demo-ready`, `demo-isolated`,
  `offline-reload`, `privacy-local`, `csv-export`, `json-export`,
  `quiet-hours`, `free-core`, `completion-history`, `park-history`,
  `json-import`, and `clear-history-preserves-active`.
- Re-reading the live landing page and README found no unlisted functional
  claim. Privacy, demo isolation, offline, reminders, exports, imports,
  history retention, clearing behavior, and free access each have a declared
  observable test.

## Earlier findings and structure checks

All earlier review, polish, handoff, and verification documents were read.
The following prior findings were confirmed fixed in both live behavior and
source/configuration; the new Axe finding above is separate.

| Earlier finding(s) | Current verification |
| --- | --- |
| Review 1 B1, B2 | One-click seeded demo, persistent banner, reset/exit controls, direct `?demo=1`, and separate IndexedDB namespace work; real-card isolation was exercised live. |
| Review 1 B3; Review 2 F-2-1 through F-2-4 | Twelve declared, tagged demo tests exist and pass; all listed functional copy maps to them. |
| Review 1 B4 | No purchase price, checkout link, or supporter purchase control is present. |
| Review 1 B5 | `/no-such-route` returns HTTP 404 with the designed “This page is not here.” screen and return link. |
| Review 1 M1, M4 | The hero identifies the task, interruption situation, first click, and outcome; public terminology is consistently card/history/demo/browser. |
| Review 1 M2, M3 | Home, demo, legal, and 404 routes have appropriate titles, descriptions, canonicals, OG/Twitter metadata, favicon/apple icon, shared shell, focused legal h1, and live announcement. Back from Privacy restored the demo route. |
| Verify 1 high | Maximum-length values retain the 390 px no-horizontal-overflow regression; the live cold home had no overflow. |
| Verify 1 medium/low | The checked live deployment retains immutable asset policy, manifest MIME, CSP, and Permissions-Policy. |

All crawled internal links and `https://sociobot.in/` returned HTTP 200; the
intentional missing route returned HTTP 404. Each checked route has one h1,
one main landmark, `lang="en"`, description, canonical, OG/Twitter metadata,
favicon, and the shared Privacy/Terms footer. The title pattern is correct:
home is **Next Step Cards — one clear next action**, demo is **Demo — Next
Step Cards**, and legal/404 pages are route-first titles.

There is no missed brief-implied AI, sync, or data feature. The job is to keep
a self-authored next step offline; adding AI would be decorative. JSON import,
JSON export, and CSV history export are already present and verified.

## What would make this perfect

Replace the nested demo `aside` with a non-landmark grouping and make the demo
Axe assertion cover moderate violations. Then repeat the live demo scan and
the clean-clone claim suite. With that one issue removed, this review would
have zero findings.
