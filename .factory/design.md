# Next Step Cards — visual thesis

## Direction: a pocket card from a quiet print room

Next Step Cards should feel like finding one deliberate index card on a desk, not opening another productivity dashboard. The visual language is a two-ink, dithered/halftone print system: warm paper, near-black letterpress type, and vermilion marks. Slightly imperfect dots give the card a physical memory and distinguish “the thing I wrote for myself” from software-generated advice. The image and texture explain the product’s purpose; decoration otherwise stays restrained.

The product is intentionally single-mode. A warm, explicit paper background reduces visual switching and preserves the physical-card metaphor. High-contrast ink and vermilion states meet accessibility requirements on that surface.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| `paper` | `#F3EAD7` | page background, like uncoated index stock |
| `paper-deep` | `#E7D9BE` | secondary sheets and recessed controls |
| `card` | `#FFF9EA` | active card surface |
| `ink` | `#1D2524` | primary text and borders |
| `ink-muted` | `#5D5E55` | supporting text (7:1+ on paper) |
| `vermillion` | `#B83B25` | action, active marks, focus accents |
| `vermillion-deep` | `#842817` | pressed state and small linked text |
| `moss` | `#2F6650` | completion and online/ready state |
| `ochre` | `#8A5B12` | reminder and caution state |
| `danger` | `#9C2D2D` | destructive action and errors |

Halftone dots use `ink` at 10–18% opacity; they never sit behind body copy.

## Type

- Display and labels: `Arial Narrow`, `Aptos Narrow`, or a condensed system sans fallback. Uppercase is reserved for tiny print labels and metadata.
- Body and form text: `Georgia`, `Charter`, serif. It makes user-authored actions read like a considered note rather than application chrome.
- No remote font requests. Body text is 17px minimum on mobile, line-height 1.55. The scale is 14 / 17 / 21 / 30 / clamp(38–64) px.
- Numbers and timestamps use tabular figures.

## Spacing and layout

- Base unit: 4px. Main rhythm: 8, 12, 16, 24, 32, 48, 64px.
- Working column: 720px; supporting content can expand to a 1120px editorial grid.
- The active card is a single independent object with a 2px ink edge and a small hard shadow, like paper laid over paper.
- On phones, supporting illustration and explanatory copy collapse; the active action and decision controls remain above history. Safe-area padding protects installed-app controls.
- Targets are at least 44px, adjacent controls are at least 8px apart, and form labels never rely on placeholders.

## Interaction grammar

- Vermilion means “move this task forward.” Moss means a completed decision. Plain ink actions manage context without implying urgency.
- Creating a card places it onto the desk. Completing it moves it to the re-entry ledger. Parking is an intentional rewrite: the user records the next small action, optional context, and when they would like a quiet reminder.
- Destructive history clearing requires explicit confirmation. Imports preview counts before replacing local data.
- Status language is neutral: “Parked,” “Ready when you are,” and “No reminder set.” No streaks, scores, guilt, or clinical claims.

## Motion

- 180–240ms transitions use only opacity and transform. A new card settles downward by 8px; a completed card moves toward the ledger by 10px. No looping animation.
- With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and transitions become effectively instant. State remains clear through labels, borders, and live-region text.

## Original asset plan and prompt sheet

One editorial hero illustration appears only in the empty state / welcome region: a single blank index card crossing a field of dense halftone noise into a calm open paper area. It visualizes re-entry without showing a fake UI. Hand-authored SVG icons cover interface actions; they use simple original line forms and no icon library.

**Generation prompt**

- Use case: `stylized-concept`
- Asset type: responsive PWA empty-state hero illustration
- Subject: one cream index card with a single vermilion check mark emerging from a dense field of scattered office-paper fragments into an open calm area
- World/materials: analog letterpress print, coarse 1960s newspaper halftone dots, uncoated warm paper fibers, two-ink screen print
- Composition: landscape, object left of center, generous quiet negative space on the right, no interface mockup
- Light/lens: flat editorial print lighting, no photographic depth of field
- Palette words: warm oat paper, charcoal ink, vermilion red, tiny moss accent
- Negative list: no text, no letters, no watermark, no logos, no people, no hands, no branded objects, no gradients, no glossy 3D, no purple, no blue, no fake app UI

**Provenance:** generated specifically for Next Step Cards using the factory Azure image deployment (`factory-image`) on 2026-08-27. The exact prompt is stored beside the source image in `assets/src/hero-card.json`. Generated imagery is disclosed in the footer. The selected source and optimized WebP are original project assets.

The 1200×630 social preview (`public/assets/social-card.webp`) is a center crop
of that same original hero asset, made locally on 2026-08-28; it introduces no
new generated subject or third-party material.

## Why this fits

The interface acts like an external memory cue without pretending to think for the user. A single physical-looking card makes the current next action unmistakable; the ledger shows continuity after interruptions. Print texture gives emotional warmth, while strict hierarchy keeps the experience quiet enough for executive-function fatigue.
