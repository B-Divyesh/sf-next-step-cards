# Next Step Cards — polish 2 handoff

Work order: `next-step-cards-polish-2`  
Repair commit: `bb32cc7053ac1b9eec430c76ee8b9624669bfe09`  
Live: <https://next-step-cards.sociobot.in>

## Done

- Closed every finding from review 1, verification 1, polish 1, and review 2.
  The final four claim gaps now have isolated demo-backed tests:
  completion history, parking history, JSON import restoration, and clearing
  history while retaining the active card.
- Kept the existing print-card visual system. Improved phone navigation so
  data controls remain available as **Manage data**, while assistive technology
  receives the full **Manage data and settings** name.
- Bumped the PWA cache/build identifier to `1.0.4` and deployed `dist/` using
  `/opt/fleet/lib/deploy-static.sh next-step-cards dist`.
- Updated the catalog sentence: “Return to interrupted tasks with one clear
  next action.”

## Verify

From a fresh clone of `bb32cc7`:

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Results: 7/7 unit/configuration tests, 30/30 Playwright desktop/mobile tests,
and zero production dependency vulnerabilities. Run every command listed in
`.factory/claims.json`; all twelve passed in the fresh clone.

`verify-url.sh` passed locally and on the live `/demo/` route. The live cold
browser re-check covered sample readiness, reset/exit isolation, all four
newly claimed behaviors, focus routing, mobile settings/no overflow, offline
reload, and HTTP 404. See `.factory/polish-2.md` for the finding-by-finding
mapping and screenshot paths.

## Known gaps

None in product behavior or acceptance findings. Lighthouse and the standalone
`@axe-core/cli` could not start this container's non-system Chrome; the
Playwright Axe checks passed with zero serious/critical violations and the
compressed bundle stays well below budget.
