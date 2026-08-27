# Next Step Cards

Next Step Cards is a local-first utility for returning to a real task after an interruption. It keeps one deliberate continuation card—the task, one small physical action, required context, why it matters, and a stopping point—without reopening a large plan or asking an AI what to do.

It is designed for people dealing with ordinary executive-function fatigue. It is not a clinical or treatment product.

Live site: <https://next-step-cards.sociobot.in>

## What it does

- Keeps exactly one active card in IndexedDB and restores it after refresh, tab close, or PWA install.
- Records starts, parks, and completions in a local re-entry ledger.
- Saves optional gentle reminders with configurable quiet hours. In-app reminders appear when the app is open or next reopened; browser notifications work while the installed app is running.
- Exports complete JSON backups and spreadsheet-friendly CSV history; JSON imports show a count before replacing data.
- Works offline after one connected load, including cold navigation.
- Offers an optional US $6 one-time supporter license for two cosmetic print editions. Core cards, history, reminders, accessibility, and export stay free.

No account, analytics script, remote font, task-data sync, or advertising is included.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Browser notification and service-worker behavior should be tested on localhost or HTTPS.

## Test and build

```sh
npm test
npm run build
npx playwright install chromium   # first browser-test run only
npm run test:e2e
```

The exact production build command is `npm run build`. Static output is written to `dist/`, with `dist/index.html` at its root. Deploy the contents of `dist/` as a static site with clean-directory routes enabled for `/privacy/` and `/terms/`.

For a staging billing registration, set `VITE_BILLING_BASE_URL=https://pilot-api.sociobot.in` at build time. Production defaults to `https://api.sociobot.in`; no product ID or secret is stored in this repository.

## Project notes

- Product scope: [`.factory/brief.json`](.factory/brief.json)
- Visual system and generated-image provenance: [`.factory/design.md`](.factory/design.md)
- Verification and handoff: [`.factory/handoff.md`](.factory/handoff.md)
- Privacy policy: [`privacy/index.html`](privacy/index.html)
- Terms: [`terms/index.html`](terms/index.html)

## License

MIT. See [`LICENSE`](LICENSE).
