# Adversarial first-read review 1 — Next Step Cards

Review date: 2026-08-28

Target: `https://next-step-cards.sociobot.in`
Method: fresh Chromium contexts at 390 x 844 and 1440 x 900, then a clean
dependency install and local test/build run. No product code was changed.

## Verdict: FAIL

There are **five BLOCKING findings**. The product has a distinctive, coherent
print-card visual identity and its existing automated tests pass, but a
first-time visitor cannot try a safe, realistic example in one click, cannot
find a declared-and-tested basis for the privacy/offline promises, and reaches
a dead purchase URL. The direct `/demo` entry is not a demo: it reads real
browser data. The required 404 route is also absent.

## First screen: cold read, before scrolling

The mobile and desktop first screens were materially identical. Before
scrolling, this reviewer understood the probable task as: “write a small
next action now so I can resume a task later.” The apparent first action is
**Set this next step**.

I could not identify **for whom** from that screen. “Returning self” could
mean anyone returning to any task; it does not name the interruption or the
people described in the brief. Nor does the screen offer a try-out or say what
happens after the primary action. The exact copy that leaves that gap is:

> “A NOTE TO YOUR RETURNING SELF”
>
> “One clear step. Nothing else.”
> “Leave the exact action that gets you moving again. No project plan, no coach, no streak—just the context you chose.”

At 390 px, the visible actions were **Data & settings** and **Set this next
step**. There was no “Try it with sample data” action. There were no console
or page errors, and no horizontal overflow (`scrollWidth === 390`) in this
fresh read.

## Findings, ordered by severity

### B1 — BLOCKING: no one-click, realistic sample-data demo

**Observed:** The landing screen contains no **Try it with sample data**
action. `/demo` returns the same empty application and the same title as `/`.
`?demo=1` also returns the ordinary application.

**Why this loses a first-time visitor:** A visitor must invent a real task and
enter personal context before seeing the result. That is not a safe 30-second
trial and does not show the product being useful immediately.

**Concrete fix:** Put a visible **Try it with sample data** button beside the
primary action and say “See a filled card and its re-entry history.” It must
open `/demo` (and `?demo=1`) with a realistic task, next action, context, and
history already visible. Add the persistent banner **“Demo — sample data,
nothing is saved”**, **Reset demo**, and **Start for real**.

**Test to add:** From a fresh browser context, load `/demo` and assert the
banner, reset/start controls, an active sample card, and at least one realistic
history item before any input.

### B2 — BLOCKING: the purported demo reads real storage

**Observed:** In one fresh browser context, I created a normal card named
“Prepare grant outline.” Navigating to `/?demo=1` then showed the same active
card, with URL still `?demo=1`. Its page contained no demo banner, Reset demo,
or Start for real control.

**Why this is misleading:** A verifier or visitor following a documented demo
URL can read and change the real local card while believing they are in a
sandbox. That violates the product’s local-first privacy promise and the demo
sandbox contract.

**Concrete fix:** Use a separate `demo:` IndexedDB database/key namespace.
Never read or write the real namespace while demo mode is active; discard that
namespace on Start for real or reset it on Reset demo. Document the URL,
sample data, reset behavior, and namespace in `.factory/demo.md`.

**Test to add:** Seed a real card, use `/demo` to park/complete/reset sample
data, then leave demo and assert the real card and ledger are byte-for-byte
unchanged.

### B3 — BLOCKING: claims contract is absent; published promises have no declared tests

**Observed:** `.factory/claims.json` does not exist, so there are no listed
claim commands to run from a clean clone. The existing `npm test` contains
seven unit/configuration tests and the existing Playwright suite contains 12
tests, but neither test file has an `@claim:` tag. The following live landing
claims and README claims are therefore unlisted:

| Location | Unlisted claim-like copy |
| --- | --- |
| Landing | “Saved locally.” |
| Landing | “It appears when this app is open or next reopened; system notifications work while the installed app is running.” |
| Landing | “Quiet hours are respected.” |
| Landing | “Private by design. Everything you write stays on this device.” |
| README | “Next Step Cards is a local-first utility for returning to a real task after an interruption.” |
| README | “It keeps one deliberate continuation card…without reopening a large plan or asking an AI what to do.” |
| README | “It is designed for people dealing with ordinary executive-function fatigue.” |
| README | “It is not a clinical or treatment product.” |
| README | “Keeps exactly one active card in IndexedDB and restores it after refresh, tab close, or PWA install.” |
| README | “Records starts, parks, and completions in a local re-entry ledger.” |
| README | “Saves optional gentle reminders with configurable quiet hours.” |
| README | “In-app reminders appear when the app is open or next reopened; browser notifications work while the installed app is running.” |
| README | “Exports complete JSON backups and spreadsheet-friendly CSV history; JSON imports show a count before replacing data.” |
| README | “Works offline after one connected load, including cold navigation.” |
| README | “Offers an optional US $6 one-time supporter license for two cosmetic print editions. Core cards, history, reminders, accessibility, and export stay free.” |
| README | “No account, analytics script, remote font, task-data sync, or advertising is included.” |

The offline reload itself did load after a connected visit when tested at
`?demo=1`, and intercepted requests in that run were same-origin only. That is
not acceptable claim evidence: the entry point is not a sandbox and the test
is not recorded in the required manifest.

**Why this is misleading:** Visitors are asked to rely on storage, offline,
notification, privacy, export, and price statements without a reproducible
test contract. The existing passing suite cannot show which promise it proves.

**Concrete fix:** Add `.factory/claims.json` with one observable test command
per retained claim. Run each test from a fresh demo context. Intercept the
whole demo flow for the privacy claim; use offline mode after the first demo
load for offline; assert exported CSV/JSON content rather than button presence.
Remove or narrow any promise that cannot be tested.

### B4 — BLOCKING: supporter purchase is a dead link

**Observed:** The Supporter edition dialog exposes **Buy supporter edition**
at `https://api.sociobot.in/api/v1/products/next-step-cards/checkout`. A safe
GET and HEAD check on 2026-08-28 both returned HTTP 404 with:
`{"error":"enabled factory product","status":404}`.

**Why this misleads:** The app advertises “US $6 · one-time purchase” and
offers a purchase action that cannot start checkout. A person cannot complete
the only paid flow.

**Concrete fix:** Register/configure the product at the Sociobot endpoint and
add an end-to-end staging test that follows the checkout start URL to its
expected non-error handoff. Until that works, remove the price and purchase
control rather than advertising an unavailable transaction.

### B5 — BLOCKING: there is no designed 404 route

**Observed:** `/no-such-route` returned HTTP 200 and rendered the normal empty
app with title **Next Step Cards — return to one clear action**. It did not
say the page was missing or provide a purpose-built way back.

**Why this loses visitors:** A mistyped or stale deep link silently becomes a
new-card screen. The visitor cannot tell whether their saved route disappeared
or whether the product intentionally sent them home.

**Concrete fix:** Add a real 404 page in the established print-card style,
with a clear “This page is not here” h1 and a **Return to your card** link.
Configure the static host so unknown paths serve that page rather than the
application fallback. Add a direct navigation/reload regression test.

### M1 — major: hero does not state the named user/situation or the result of clicking

**Quote:** “One clear step. Nothing else.” and “Set this next step”.

**Why:** The headline is short, but it is a slogan rather than a job in plain
language. The screen makes no explicit promise about who benefits, and the
button lacks nearby outcome copy. This caused the B1 first-read failure even
before testing demo behavior.

**Concrete fix:** Use a job headline of nine words or fewer, for example
**“Return to work with one clear next step.”** Follow it with **“For people
resuming a task after an interruption, without reopening a full project plan.”**
Place **“Try it with sample data”** beside **“Create my next-step card”** and
say **“See a filled card and history first.”** Include three short, tested
facts: **Stored on this device**, **Works offline after first visit**, and
**Free core tools**.

### M2 — major: required metadata and route identity are incomplete

**Observed:** `/`, `/demo`, `/privacy/`, and `/terms/` have `lang`, one h1,
title, and description. However none has a canonical link, Open Graph tags,
Twitter card tags, or Apple touch icon. `/favicon.ico` returns HTTP 404.
`/demo` keeps the home title instead of **Demo — Next Step Cards**. The sitemap
does not list `/demo`.

**Concrete fix:** Add canonical, OG, Twitter, and `apple-touch-icon` metadata
to every route, serve a root favicon, make the demo title route-specific, and
list the functional demo route in the sitemap. Use a real 1200 x 630 image
derived from the project’s original print art.

### M3 — major: focus and shared skeleton do not meet route requirements

**Observed:** Clicking **Privacy** leaves `document.activeElement` as `BODY`,
not the destination h1. The privacy and terms headers/footers differ from the
home header/footer, and legal footers omit one of Privacy/Terms, the Param
Factory attribution, and a version/build id.

**Concrete fix:** On route changes move focus to a focusable h1 and announce
the new location with an `aria-live="polite"` region. Use one shared header
and footer on every route, including Home, Demo, Privacy, Terms, **Built by
Param Factory**, and a build/version identifier.

### M4 — major: copy has avoidable jargon, vague headings, and non-result controls

**Observed:** “Local ledger,” “re-entry history,” “local-first,” “continuation
card,” “IndexedDB,” “PWA,” and “cold navigation” require prior knowledge or
use more than one term for the same history. **Data & settings** and
**Supporter edition** name places, not results, while the product’s other
buttons are clearer.

**Concrete fix:** Use one term such as **history** everywhere. In public copy,
say **saved in this browser** instead of IndexedDB/PWA and **reload while
offline** instead of cold navigation. Rename the buttons **Manage data and
settings** and **View supporter editions**, or use compact action labels such
as **Export or import data** where the immediate result is known.

## Copy audit

Word counts count visible words; headings, labels, buttons, and alt text are
included because the requested audit also checks headings and controls. `—`
means no plain-words issue found in that item. `Unlisted claim` refers to B3.

### Landing page, fresh empty state

| Copy | Words | Audit / proposed rewrite |
| --- | ---: | --- |
| Skip to your card | 4 | — |
| Next Step Cards | 3 | Product name; — |
| Data & settings | 3 | Non-result control; use **Manage data and settings**. |
| Supporter edition (desktop) | 2 | Non-result control; use **View supporter editions**. |
| A note to your returning self | 6 | Vague audience heading; use the situation in M1. |
| One clear step. Nothing else. | 5 | Headline does not state the job; use the M1 headline. |
| Leave the exact action that gets you moving again. | 9 | Vague “gets you moving”; use **Write the first action for when you return.** |
| No project plan, no coach, no streak—just the context you chose. | 11 | Negative list obscures user/result; replace with the M1 audience sentence. |
| Leave your card | 3 | Metaphorical heading; use **Create your next-step card**. |
| Only the first two fields are required. | 7 | — |
| Task name | 2 | — |
| Next two-minute action | 3 | — |
| Start with a physical verb: open, call, write, find, send. | 10 | — |
| Required link, file, or place (optional) | 6 | “Required” conflicts with “optional”; use **Link, file, or place (optional)**. |
| Why this matters (optional) | 4 | — |
| I can stop when… (optional) | 5 | — |
| Quiet reminder (optional) | 3 | — |
| Saved locally. | 2 | Unlisted claim; after test, use **Saved in this browser.** |
| It appears when this app is open or next reopened. | 10 | Unlisted claim; retain only with a reminder test. |
| System notifications work while the installed app is running. | 9 | Unlisted claim; retain only with permission/runtime test. |
| Quiet hours are respected. | 4 | Unlisted claim; retain only with a scheduling test. |
| Set this next step | 4 | Result-naming verb; add nearby result copy from M1. |
| Local ledger | 2 | Jargon/inconsistent term; use **History**. |
| Re-entry history | 2 | Prefer the same **History** term. |
| 0 decisions | 2 | “Decisions” is abstract; use **No history yet**. |
| Your decisions will appear here after you set the first card. | 11 | Use the consistent term: **Your card history appears here after you create a card.** |
| Private by design. | 3 | Marketing-like privacy claim; use the testable **Stored in this browser.** |
| Everything you write stays on this device. | 7 | Unlisted privacy claim; retain only with the B3 network/storage test. |
| Privacy | 1 | — |
| Terms | 1 | — |
| Original illustration generated for this product; no stock imagery. | 9 | Provenance is clear; — |
| A printed index card with a red check mark moving from scattered paper into open space. (image alt) | 16 | Purposeful alt; — |

The initial hero has no demo action, no adjacent “what happens” copy, and no
three tested plain facts. Those omissions are recorded in B1 and M1.

### README

| Copy | Words | Audit / proposed rewrite |
| --- | ---: | --- |
| Next Step Cards | 3 | Name heading; — |
| Next Step Cards is a local-first utility for returning to a real task after an interruption. | 16 | Jargon and unlisted claim; use **Write one next action before you leave a task.** |
| It keeps one deliberate continuation card—the task, one small physical action, required context, why it matters, and a stopping point—without reopening a large plan or asking an AI what to do. | 31 | **Over 22 words**, jargon, and unlisted claim; split: **Keep one card for the task you will return to. Write the next small action, needed context, and a stopping point.** |
| It is designed for people dealing with ordinary executive-function fatigue. | 10 | “Executive-function fatigue” is clinical-sounding jargon; use **It is for people returning to a task after an interruption.** |
| It is not a clinical or treatment product. | 8 | Unlisted scope claim; retain with a short scope test/documentation reference. |
| Live site: https://next-step-cards.sociobot.in | 3 | — |
| What it does | 4 | Heading lacks context in a heading list; use **What Next Step Cards does**. |
| Keeps exactly one active card in IndexedDB and restores it after refresh, tab close, or PWA install. | 17 | Jargon and unlisted claim; use **Keeps one current card in this browser after you reopen it.** |
| Records starts, parks, and completions in a local re-entry ledger. | 10 | Jargon/inconsistent “ledger”; use **Adds started, parked, and finished cards to history.** |
| Saves optional gentle reminders with configurable quiet hours. | 8 | Unlisted claim and “configurable”; use **Lets you choose a reminder time and quiet hours.** |
| In-app reminders appear when the app is open or next reopened; browser notifications work while the installed app is running. | 18 | Two ideas and unlisted claims; split after testing. |
| Exports complete JSON backups and spreadsheet-friendly CSV history; JSON imports show a count before replacing data. | 16 | Two ideas and unlisted claims; split into export and import sentences. |
| Works offline after one connected load, including cold navigation. | 9 | Jargon and unlisted claim; use **Reload your card while offline after your first visit.** |
| Offers an optional US $6 one-time supporter license for two cosmetic print editions. | 12 | Unlisted price/feature claim; also contradicted by B4 until checkout works. |
| Core cards, history, reminders, accessibility, and export stay free. | 9 | Unlisted claim; use only after a feature-access test. |
| No account, analytics script, remote font, task-data sync, or advertising is included. | 12 | Unlisted privacy claim; split and test each retained promise. |
| Run locally | 2 | Heading lacks product context; use **Run Next Step Cards locally**. |
| Requires Node.js 22 or later. | 5 | — |
| Vite prints the local URL. | 5 | Tool jargon but appropriate in a developer instruction; — |
| Browser notification and service-worker behavior should be tested on localhost or HTTPS. | 12 | Developer terminology is appropriate; — |
| Test and build | 3 | Heading lacks product context; use **Test and build Next Step Cards**. |
| The exact production build command is `npm run build`. | 9 | — |
| Static output is written to `dist/`, with `dist/index.html` at its root. | 10 | — |
| Deploy the contents of `dist/` as a static site with clean-directory routes enabled for `/privacy/` and `/terms/`. | 16 | — |
| For a staging billing registration, set `VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in` at build time. | 10 | — |
| Production defaults to `https://api.sociobot.in`; no product ID or secret is stored in this repository. | 12 | — |
| Project notes | 2 | Heading lacks context; use **Project documents**. |
| Product scope | 2 | Link label; — |
| Visual system and generated-image provenance | 5 | Link label; — |
| Verification and handoff | 3 | Link label; — |
| Privacy policy | 2 | Link label; — |
| Terms | 1 | Link label; — |
| License | 1 | Heading lacks context; use **License** is acceptable here. |
| MIT. | 1 | — |
| See `LICENSE`. | 2 | — |

## Demo, storage, offline, and privacy checks

- No demo action was visible on either fresh first screen. `/demo` was a 200
  fallback to the ordinary app, not a seeded route.
- Direct `?demo=1` did not isolate storage: it displayed the card created in
  the ordinary mode in the same browser context. No demo namespace evidence
  or `.factory/demo.md` exists.
- After an initial `?demo=1` load, an offline reload rendered the app. The
  intercepted request origins before the offline transition were only
  `https://next-step-cards.sociobot.in`. This is an observation, not a passing
  demo/privacy claim test, because no isolated demo was available.
- The required “Demo — sample data, nothing is saved,” Reset demo, and Start
  for real controls were absent, so reset and non-persistence could not be
  verified.

## Structure and accessibility checks

| Check | Result |
| --- | --- |
| Home title, lang, one h1, main, visible focus styling | Present. |
| Per-route titles | Privacy and Terms are correctly named; `/demo` incorrectly retains the home title. |
| Meta description | Present on checked routes. |
| Canonical, OG, Twitter, Apple touch metadata | Missing on all checked routes. |
| Root favicon | `/favicon.ico` returns 404; a PNG icon is linked directly. |
| Privacy/Terms links | Home, privacy, and terms internal links returned 200. `https://sociobot.in/` returned 200. |
| Purchase link | Fails: checkout endpoint returns 404 (B4). |
| 404 | Fails (B5). |
| Route focus | Fails: after Privacy navigation, focus remained on `BODY`, not the h1. |
| Header/footer | Present but not consistent across home/legal pages; required attribution/version are absent. |
| Visual identity | Pass: warm paper, hard ink shadows, and halftone illustration are product-specific, not a generic SaaS template. |
| Keyboard/mobile/axe regression suite | Existing local browser suite passed (12/12); it includes key-state Axe scans and 390 px keyboard/overflow checks. |

## Commands run

```sh
npm ci
npm test
# 7/7 passed

npm run build
# passed; dist/ produced

npm run test:e2e
# 12/12 passed
```

There was no `.factory/claims.json`, so there were no declared per-claim test
commands to execute. The passing general suite does not remove B1–B5.
