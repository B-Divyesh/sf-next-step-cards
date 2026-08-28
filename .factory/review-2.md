# Adversarial first-read review 2 — Next Step Cards

Review date: 2026-08-28  
Target: <https://next-step-cards.sociobot.in>  
Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; clean `npm ci`;
live route, link, PWA, claim, and source checks. No product code was changed.

## Verdict: FAIL

There are **four minor findings** and therefore the strict zero-finding bar is
not met. They are all unlisted, testable behaviour claims in the product UI.
No declared claim test failed. The first-screen, demo, privacy/offline,
metadata, routing, visual-identity, and earlier-finding checks passed.

## Cold first screen, before scrolling

At both 390 px and 1440 px, the first screen answers all three questions.

- **What it does:** lets a person leave one clear next action and return to it
  without reopening a full project plan.
- **For whom:** people returning to a task after an interruption.
- **What to click first:** **Try it with sample data**; the adjacent text says
  **“See a filled card and history first.”**

The exact visible hero copy is:

> “Return to work with one clear next step.”
>
> “For people resuming a task after an interruption, without reopening a full
> project plan.”

There was no horizontal overflow at 390 px and no console or page errors.
The warm-paper, vermilion, letterpress-card treatment and original halftone
hero are visibly distinct from a generic SaaS template.

## Findings, ordered by severity

### F-2-1 — Minor: completion-history promise has no claim entry or test

**Location / exact quote:** active-card help, `src/app.ts:172`:
“Finished clears this card and keeps it in history.”

**Why this matters:** A visitor can rely on this when deciding whether to mark
a task complete, but `.factory/claims.json` has no entry for it. The existing
`free-core` test clicks completion but only asserts the empty-state headline;
it does not assert that a completed history record exists.

**Concrete fix:** Add a `completion-history` claim and an
`@claim:completion-history` demo test that completes the sample card and
asserts no active card plus a `Finished` history item for the sample task.

### F-2-2 — Minor: park-history promise has no claim entry or test

**Location / exact quote:** park dialog, `src/app.ts:205`: “This change
appears in your history.”

**Why this matters:** The statement promises an observable saved outcome. The
isolation test parks a card but resets it before asserting a history entry, so
the claim contract does not prove the promised result.

**Concrete fix:** Add a `park-history` claim and test that parks the demo card,
then asserts the revised action appears in a `Parked` history row after reload.

### F-2-3 — Minor: import promise has no claim entry or test

**Location / exact quote:** Manage data and settings → Own your data,
`src/app.ts:212`: “JSON restores the full app.”

**Why this matters:** The visible Import JSON control asks a visitor to trust
that a backup will restore cards, history, and settings. `json-export` proves
only the downloaded JSON content; no declared test imports it into the isolated
demo store and observes the restored state.

**Concrete fix:** Add an `json-import` claim and test: export sample JSON,
change the demo state, import the export, confirm replacement, and assert the
active card, both history rows, and quiet-hour settings are restored.

### F-2-4 — Minor: clear-history promise has no claim entry or test

**Location / exact quote:** Manage data and settings → Clear history,
`src/app.ts:214`: “This removes history but keeps the active card.”

**Why this matters:** The destructive action makes a precise preservation
promise without an observable claim test. A regression could clear the active
card together with history.

**Concrete fix:** Add a `clear-history-preserves-active` claim and test the
confirmed clear in demo mode, asserting zero history entries and the same
active sample card after reload.

## Copy audit

Words are counted as visible tokens; headings, labels, controls, alt text, and
footer copy are included. “Pass” means no >22-word sentence, plain language,
consistent terms, contextual heading problem, or non-result-naming control was
found. The four claim gaps above are separately recorded.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to your card | 4 | Pass |
| Next Step Cards | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Manage data and settings | 4 | Pass |
| A card for your return | 5 | Pass |
| Return to work with one clear next step. | 8 | Pass |
| For people resuming a task after an interruption, without reopening a full project plan. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| Create my card | 3 | Pass |
| See a filled card and history first. | 8 | Pass |
| Saved in this browser | 5 | Pass; `privacy-local` |
| Reload while offline after your first visit | 7 | Pass; `offline-reload` |
| Core tools are free | 4 | Pass; `free-core` |
| A printed index card with a red check mark moving from scattered paper into open space. (alt) | 16 | Pass |
| Create your next-step card | 4 | Pass |
| Only the first two fields are required. | 7 | Pass |
| Task name | 2 | Pass |
| Next two-minute action | 3 | Pass |
| Start with a physical verb: open, call, write, find, send. | 10 | Pass |
| Link, file, or place (optional) | 5 | Pass |
| Why this matters (optional) | 4 | Pass |
| I can stop when… (optional) | 5 | Pass |
| Quiet reminder (optional) | 3 | Pass |
| Choose a time. | 3 | Pass |
| Quiet hours move a reminder to the next available time. | 10 | Pass; `quiet-hours` |
| Your card record | 4 | Pass |
| History | 1 | Pass |
| 0 entries | 2 | Pass |
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
| Cards are stored in this browser. | 6 | Pass; `privacy-local` |
| The demo uses separate sample storage and makes only same-origin requests. | 11 | Pass; `privacy-local` |
| Read the privacy policy | 4 | Pass |
| Your card stays in this browser. | 6 | Pass; `privacy-local` |
| Built by Param Factory · build 1.0.3 · Original illustration generated for this product. | 11 | Pass |

The four dialog sentences quoted in F-2-1 through F-2-4 were also audited;
they are under 22 words and plain, but are unlisted functional claims.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Next Step Cards | 3 | Pass |
| Write one clear next action before you leave a task. | 10 | Pass |
| Return without reopening a full project plan. | 7 | Pass |
| It is for people resuming ordinary work after an interruption. | 10 | Pass |
| It is a task-note tool, not advice for urgent decisions. | 10 | Pass |
| Live site: https://next-step-cards.sociobot.in | 3 | Pass |
| Try Next Step Cards | 4 | Pass |
| Open https://next-step-cards.sociobot.in/demo/ for a filled sample card and history. | 9 | Pass; `demo-ready` |
| The demo uses separate browser storage and never changes your cards. | 11 | Pass; `demo-isolated` |
| What Next Step Cards does | 5 | Pass |
| Lets you choose a reminder time and quiet hours. | 9 | Pass; `quiet-hours` |
| Quiet hours move a reminder to the next available time. | 10 | Pass; `quiet-hours` |
| Exports cards as JSON and history as CSV. | 8 | Pass; `json-export`, `csv-export` |
| Reloads the demo while offline after its first visit. | 9 | Pass; `offline-reload` |
| The observable product promises and their exact browser tests are in `.factory/claims.json`. | 12 | Pass |
| Run Next Step Cards locally | 5 | Pass |
| Requires Node.js 22 or later. | 5 | Pass (developer instruction) |
| Test and build Next Step Cards | 6 | Pass |
| Run every command in `.factory/claims.json` after `npm ci` to verify each visitor-facing promise. | 14 | Pass (developer instruction) |
| `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. | 14 | Pass (developer instruction) |
| Deploy `dist/` as an Azure Static Web Apps static site. | 10 | Pass (developer instruction) |
| The included `staticwebapp.config.json` serves the designed `404.html` for missing paths. | 10 | Pass (developer instruction) |
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

No audited landing or README sentence exceeds 22 words. No banned marketing
adjective, inconsistent public term, or button that lacks an action/result was
found.

## Demo, claims, privacy, and offline checks

- One click from `/` opened `/demo/` with the persistent **“Demo — sample
  data, nothing is saved.”** banner, Reset demo, Start for real, the filled
  “Draft the community grant outline” card, and two realistic history rows.
- Reset restored the seed. Completing and resetting the demo did not change a
  pre-existing real “Prepare real tax notes” card; Start for real returned to
  `/` with that exact real card intact. Demo and real stores were respectively
  `demo:next-step-cards` and `next-step-cards`.
- Network interception throughout the demo observed only
  `https://next-step-cards.sociobot.in`. After a connected demo visit and
  service-worker control, offline reload retained the sample card and showed
  “Offline and ready.”
- Read `.factory/claims.json`; all eight listed commands passed after the
  clean install: `demo-ready`, `demo-isolated`, `offline-reload`,
  `privacy-local`, `csv-export`, `json-export`, `quiet-hours`, and `free-core`.
  The complete suite passed as 22 Playwright checks.

## Earlier findings and structural checks

Every earlier review/polish/handoff document was read. The previous B1–B5,
M1–M4, and Verify-1 High/Medium/Low findings were independently confirmed
fixed in both live behaviour and source/configuration: sample demo and
namespaced storage; declared tests; removed checkout; designed HTTP 404;
first-screen copy; per-route metadata; focused route headings/shared shell;
term cleanup; mobile wrapping; immutable assets; manifest MIME; CSP and
Permissions-Policy.

`/`, `/demo/`, `/privacy/`, `/terms/`, and the missing-route response were
checked live. Each has one h1, `<main>`, `lang="en"`, a route title,
description, canonical, OG/Twitter metadata, favicon, apple-touch icon, and
the shared header/footer. The missing route returned HTTP 404 with “This page
is not here.” Direct deep links loaded correctly; Privacy navigation focused
its h1 and browser Back returned home. The crawl found HTTP 200 for every
internal link and `https://sociobot.in/`.

There is no brief-implied missing AI, import/export, or sync feature: AI would
be decorative for this local, self-authored task card; JSON/CSV export and JSON
import are present. The import's promised restoration is F-2-3.

## What would make this perfect

Keep the current first-read experience and add four small demo-backed claim
tests for completion history, parking history, JSON import, and clearing
history while retaining the active card. Then list those claims in
`.factory/claims.json` (or remove the four promises). A fresh review can pass
only after there are no unlisted claims left.
