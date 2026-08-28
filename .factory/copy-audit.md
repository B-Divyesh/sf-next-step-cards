# Copy audit — polish round 5

Word counts use visible, space-separated words. A hyphenated term counts as
one word. No audited sentence exceeds 22 words or contains a banned marketing
term.

## Loaded landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to your card | 4 | Pass |
| Next Step Cards | 3 | Product name |
| Demo | 1 | Destination link |
| Privacy | 1 | Destination link |
| Terms | 1 | Destination link |
| Manage data and settings | 4 | Action and result |
| Manage data | 2 | Compact mobile label; full accessible name remains above |
| A card for your return | 5 | Pass |
| Return to work with one clear next step. | 8 | Job headline |
| For people resuming a task after an interruption, without reopening a full project plan. | 14 | Names the user and situation |
| Try it with sample data | 5 | `demo-ready` |
| Create my card | 3 | Real-use action |
| See a filled card and history first. | 7 | `demo-ready` outcome |
| Saved in this browser | 4 | `privacy-local` |
| Reload while offline after your first visit | 7 | `offline-reload` |
| Core tools are free | 4 | `free-core` |
| A printed index card with a red check mark moving from scattered paper into open space. | 16 | Image alt text |
| Create your next-step card | 4 | Contextual heading |
| Only the first two fields are required. | 7 | Form instruction |
| Task name | 2 | Field label |
| Next two-minute action | 3 | Field label |
| Open the draft and write one heading | 7 | Example value |
| Start with a physical verb: open, call, write, find, send. | 10 | Field help |
| Link, file, or place (optional) | 5 | Field label |
| https://… or Drafts/outline.md | 3 | Example value |
| Why this matters (optional) | 4 | Field label |
| So tomorrow starts lighter | 4 | Example value |
| I can stop when… (optional) | 5 | Field label |
| The heading and three bullets exist | 6 | Example value |
| Quiet reminder (optional) | 3 | Field label |
| Choose a time. | 3 | Field help |
| Quiet hours move a reminder to the next available time. | 10 | `quiet-hours` |
| Create my next-step card | 4 | Submit action |
| Your card record | 4 | Pass |
| History | 1 | Heading |
| 0 entries | 2 | State count |
| Your card history appears here after you create a card. | 10 | Empty-state next step |
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

## State-dependent promises

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved. | 7 | `demo-ready`; persistent mode label |
| Reset demo | 2 | Action and result |
| Start for real | 3 | Action and result |
| Finished clears this card and keeps it in history. | 9 | `completion-history` |
| This change appears in your history. | 6 | `park-history` |
| JSON restores the full app. | 5 | `json-import` |
| CSV opens your card history in a spreadsheet. | 8 | `csv-export` |
| This removes history but keeps the active card. | 8 | `clear-history-preserves-active` |

## README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Write one clear next action before you leave a task. | 10 | Pass |
| Return without reopening a full project plan. | 7 | Pass |
| It is for people resuming ordinary work after an interruption. | 10 | Pass |
| It is a task-note tool, not advice for urgent decisions. | 10 | Scope statement |
| Open the demo for a filled sample card and history. | 9 | `demo-ready`; URL omitted from count |
| The demo uses separate browser storage and never changes your cards. | 11 | `demo-isolated` |
| Lets you choose a reminder time and quiet hours. | 9 | `quiet-hours` |
| Quiet hours move a reminder to the next available time. | 10 | `quiet-hours` |
| Exports cards as JSON and history as CSV. | 8 | `json-export`, `csv-export` |
| Finishing or parking a card keeps the useful step in history. | 11 | `completion-history`, `park-history` |
| JSON restores a full backup. | 5 | `json-import` |
| Clearing history keeps the active card. | 6 | `clear-history-preserves-active` |
| Reloads the demo while offline after its first visit. | 9 | `offline-reload` |

## Terminology

| Concept | One term |
| --- | --- |
| Current task note | card |
| Prior card record | history |
| Local browser persistence | saved in this browser |
| Isolated sample | demo |
| Small physical task movement | next action |
