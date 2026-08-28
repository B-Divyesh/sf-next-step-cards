# Next Step Cards

Write one clear next action before you leave a task. Return without reopening a full project plan.

It is for people resuming ordinary work after an interruption. It is a task-note tool, not advice for urgent decisions.

Live site: <https://next-step-cards.sociobot.in>

## Try Next Step Cards

Open <https://next-step-cards.sociobot.in/demo/> for a filled sample card and history. The demo uses separate browser storage and never changes your cards.

## What Next Step Cards does

- Lets you choose a reminder time and quiet hours. Quiet hours move a reminder to the next available time.
- Exports cards as JSON and history as CSV.
- Finishing or parking a card keeps the useful step in history.
- JSON restores a full backup. Clearing history keeps the active card.
- Reloads the demo while offline after its first visit.

The observable product promises and their exact browser tests are in [`.factory/claims.json`](.factory/claims.json).

## Run Next Step Cards locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

## Test and build Next Step Cards

```sh
npm test
npm run build
npm run test:e2e
```

Run every command in `.factory/claims.json` after `npm ci` to verify each visitor-facing promise. `npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root.

Deploy `dist/` as an Azure Static Web Apps static site. The included `staticwebapp.config.json` serves the designed `404.html` for missing paths.

## Project documents

- Product scope: [`.factory/brief.json`](.factory/brief.json)
- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Demo storage and reset rules: [`.factory/demo.md`](.factory/demo.md)
- Claim contract: [`.factory/claims.json`](.factory/claims.json)
- Privacy policy: [`privacy/index.html`](privacy/index.html)
- Terms: [`terms/index.html`](terms/index.html)

## License

MIT. See [`LICENSE`](LICENSE).
