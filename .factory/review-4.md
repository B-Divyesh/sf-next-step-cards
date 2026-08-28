# Adversarial first-read review 4 — Next Step Cards

Review date: 2026-08-28
Target: https://next-step-cards.sociobot.in
Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; fresh clone at e8fd7a2; live mobile demo, storage, offline, metadata, link, accessibility, and route checks; then clean-clone claim commands. No product code was changed.

## Verdict: FAIL

There is one minor finding. The strict acceptance bar is zero findings. The cold read, one-click demo, claim suite, isolation, offline behavior, metadata, design, and all earlier repairs otherwise verify. Browser Back restores the demo URL and content but not focus, so a keyboard or screen-reader visitor is not placed at the restored page heading.

## Cold first screen, before scrolling

The first screen at 390 px and desktop answers all three first-read questions.

- What it does: it saves one clear next action so a person can resume work without reopening a full project plan.
- For whom: people returning to a task after an interruption.
- What to click first: Try it with sample data. The nearby outcome is “See a filled card and history first.”

The exact hero copy is:

> “Return to work with one clear next step.”
>
> “For people resuming a task after an interruption, without reopening a full project plan.”

The 390 px page had no horizontal overflow (scrollWidth === 390) and neither viewport emitted console or page errors. The warm paper, hard ink shadows, letterpress type, and original halftone index-card art are visibly product specific rather than a generic SaaS template.

## Finding

### F-4-1 — Minor: Browser Back does not restore focus to the restored page heading

Location / exact observed text: live mobile route sequence /demo/ → Privacy → browser Back. Back returns to https://next-step-cards.sociobot.in/demo/ and the visible heading is “Welcome back to this step.”, but document.activeElement is body, not that h1. src/route.ts line 5 focuses a heading only when the static legal page loads:

> heading.focus({ preventScroll: true });

There is no corresponding persisted-history handler in src/app.ts for the app route restored by Back.

Why this matters: The URL and card return correctly, but focus does not. A keyboard or screen-reader visitor who used Privacy has no programmatic cue that the demo page is active again and must reorient from the document body.

Concrete fix: On a persisted pageshow for the app shell, move focus to #page-title and announce the restored route in a polite live region. Keep ordinary initial page-load behavior unchanged. Add a browser regression that opens /demo/, follows Privacy, calls page.goBack(), and asserts the demo heading is focused after restoration.

## Copy audit

Word counts cover the visible default landing page, its labels and controls, and README sentences. Dialog-only product promises are separately covered by their named claims. No item exceeds 22 words; no banned marketing adjective, jargon, inconsistent public term, out-of-context heading, or non-result-naming button was found. “Pass” means no copy finding.

### Landing page

| Copy | Words | Result / claim mapping |
| --- | ---: | --- |
| Skip to your card | 4 | Pass |
| Next Step Cards | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Manage data and settings | 4 | Pass |
| Manage data | 2 | Pass; compact mobile label |
| A card for your return | 5 | Pass |
| Return to work with one clear next step. | 8 | Pass |
| For people resuming a task after an interruption, without reopening a full project plan. | 14 | Pass |
| Try it with sample data | 5 | Pass; demo-ready |
| Create my card | 3 | Pass |
| See a filled card and history first. | 8 | Pass; demo-ready |
| Saved in this browser | 5 | Pass; privacy-local |
| Reload while offline after your first visit | 7 | Pass; offline-reload |
| Core tools are free | 4 | Pass; free-core |
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
| Quiet hours move a reminder to the next available time. | 10 | Pass; quiet-hours |
| Your card record | 4 | Pass |
| History | 1 | Pass |
| 0 entries | 2 | Pass; state count |
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
| Cards are stored in this browser. | 6 | Pass; privacy-local |
| The demo uses separate sample storage and makes only same-origin requests. | 11 | Pass; privacy-local |
| Read the privacy policy | 4 | Pass |
| Your card stays in this browser. | 6 | Pass; privacy-local |
| Built by Param Factory · build 1.0.5 · Original illustration generated for this product. | 12 | Pass; provenance |

### README

| Copy | Words | Result / claim mapping |
| --- | ---: | --- |
| Next Step Cards | 3 | Pass |
| Write one clear next action before you leave a task. | 10 | Pass |
| Return without reopening a full project plan. | 7 | Pass |
| It is for people resuming ordinary work after an interruption. | 10 | Pass |
| It is a task-note tool, not advice for urgent decisions. | 10 | Pass; scope |
| Live site: https://next-step-cards.sociobot.in | 3 | Pass |
| Try Next Step Cards | 4 | Pass |
| Open https://next-step-cards.sociobot.in/demo/ for a filled sample card and history. | 9 | Pass; demo-ready |
| The demo uses separate browser storage and never changes your cards. | 11 | Pass; demo-isolated |
| What Next Step Cards does | 5 | Pass |
| Lets you choose a reminder time and quiet hours. | 9 | Pass; quiet-hours |
| Quiet hours move a reminder to the next available time. | 10 | Pass; quiet-hours |
| Exports cards as JSON and history as CSV. | 8 | Pass; json-export, csv-export |
| Finishing or parking a card keeps the useful step in history. | 11 | Pass; completion-history, park-history |
| JSON restores a full backup. | 5 | Pass; json-import |
| Clearing history keeps the active card. | 6 | Pass; clear-history-preserves-active |
| Reloads the demo while offline after its first visit. | 9 | Pass; offline-reload |
| The observable product promises and their exact browser tests are in .factory/claims.json. | 12 | Pass |
| Run Next Step Cards locally | 5 | Pass |
| Requires Node.js 22 or later. | 5 | Pass; developer instruction |
| npm ci | 2 | Pass; command |
| npm run dev | 3 | Pass; command |
| Test and build Next Step Cards | 6 | Pass |
| npm test | 2 | Pass; command |
| npm run build | 3 | Pass; command |
| npm run test:e2e | 3 | Pass; command |
| Run every command in .factory/claims.json after npm ci to verify each visitor-facing promise. | 14 | Pass; developer instruction |
| npm run build writes the static deployment output to dist/, with dist/index.html at its root. | 14 | Pass; developer instruction |
| Deploy dist/ as an Azure Static Web Apps static site. | 10 | Pass; developer instruction |
| The included staticwebapp.config.json serves the designed 404.html for missing paths. | 10 | Pass; developer instruction |
| Project documents | 2 | Pass |
| Product scope | 2 | Pass |
| Visual system and image provenance | 5 | Pass |
| Demo storage and reset rules | 5 | Pass |
| Claim contract | 2 | Pass |
| Privacy policy | 2 | Pass |
| Terms | 1 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## Demo, claims, and sandbox verification

- One cold home-page click on Try it with sample data opened /demo/. Its first usable screen had the filled “Draft the community grant outline” card, two realistic workshop-brief history rows, and the persistent “Demo — sample data, nothing is saved.” banner with Reset demo and Start for real.
- Direct ?demo=1 also loaded that sample, with title “Demo — Next Step Cards” and canonical /demo/.
- In a fresh direct-demo context, the only IndexedDB database was demo:next-step-cards; observed requests remained on https://next-step-cards.sociobot.in; Axe reported zero violations.
- A separate live context created a real card, parked and reset the demo, then chose Start for real. The original real task and next action remained.
- After a connected demo visit and service-worker control, network interception was set offline and /demo/ reloaded with the sample card and “Offline and ready.” No console or page error occurred.
- A fresh clone ran npm ci (0 vulnerabilities), npm test (7/7), and npm run build successfully. Each exact claim command below passed in both configured desktop and mobile projects.

| Claim id | Exact command | Result |
| --- | --- | --- |
| demo-ready | npm run test:e2e -- --grep @claim:demo-ready | Pass |
| demo-isolated | npm run test:e2e -- --grep @claim:demo-isolated | Pass |
| offline-reload | npm run test:e2e -- --grep @claim:offline-reload | Pass |
| privacy-local | npm run test:e2e -- --grep @claim:privacy-local | Pass |
| csv-export | npm run test:e2e -- --grep @claim:csv-export | Pass |
| json-export | npm run test:e2e -- --grep @claim:json-export | Pass |
| quiet-hours | npm run test:e2e -- --grep @claim:quiet-hours | Pass |
| free-core | npm run test:e2e -- --grep @claim:free-core | Pass |
| completion-history | npm run test:e2e -- --grep @claim:completion-history | Pass |
| park-history | npm run test:e2e -- --grep @claim:park-history | Pass |
| json-import | npm run test:e2e -- --grep @claim:json-import | Pass |
| clear-history-preserves-active | npm run test:e2e -- --grep @claim:clear-history-preserves-active | Pass |

All functional landing and README promises map to the claim contract; no unlisted claim finding was found. The product does not need AI for this self-authored, offline-first task; JSON import/export and CSV export already cover the expected portability leverage. No runtime provider key or Azure endpoint was found.

## Earlier findings and structure checks

Every prior review-*, polish-*, and handoff document was read. The earlier findings were verified on the live site and in source, not accepted merely from their status labels.

| Earlier finding(s) | Current verification |
| --- | --- |
| Review 1 B1, B2 | One-click seeded demo, banner, Reset, Start for real, ?demo=1, and the demo:next-step-cards namespace work; real-card isolation was exercised live. |
| Review 1 B3; Review 2 F-2-1–F-2-4 | All twelve declared, tagged claim tests exist and passed individually from the fresh clone. |
| Review 1 B4 | No price, checkout, purchase, or supporter control appears in the live DOM. |
| Review 1 B5 | /no-such-route returned HTTP 404 with the designed “This page is not here.” screen and a return link. |
| Review 1 M1, M4 | The hero names task resumption, interruption, first click, and outcome; public terms remain card, history, demo, and browser. |
| Review 1 M2, M3 | Home, demo, legal, and 404 pages have route-specific titles, description, canonical, OG/Twitter metadata, favicon/apple icon, shared shell, announcements, and legal-page h1 focus. F-4-1 is the remaining Back-focus gap. |
| Verify 1 high | Cold 390 px home had no horizontal overflow; the long-value regression remains in the browser suite. |
| Verify 1 medium/low; Review 3 F-3-1 | Cache/version headers, manifest MIME, CSP, permissions policy, and the non-landmark demo banner are present. Live Axe reported zero violations on /, /demo/, /privacy/, /terms/, and /404.html. |

All crawled internal links returned HTTP 200, and https://sociobot.in/ returned HTTP 200. The intentional missing route returned HTTP 404. Every checked shipped route has one h1, one main landmark, lang=en, route title, description, canonical, OG/Twitter data, favicon, and shared Privacy/Terms footer. Deep links load the correct state. Forward navigation to Privacy focuses and announces its h1; Back is the exception described in F-4-1.

## What would make this perfect

Implement and test persisted Back/Forward focus restoration for the app route. Then rerun the fresh-context route check and the claim suite. With that one focus regression removed, this review has no remaining finding.
