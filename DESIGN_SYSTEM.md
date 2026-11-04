# Design system — JoJo The Jeweler

Source of truth for tokens is `src/styles/tokens.css`; this file explains the decisions. Rules follow `docs/design-principles.md` (taste-skill wins where the three installed skills disagree).

## Idea
The black satin every JoJo piece is filmed on becomes the page. One ground, one ink, one accent; the jewellery is the only light. Type is heavy and wide like a 15mm Cuban. No eyebrows, no sparkle icons, no gradients, no glass, no cards with shadows.

## Colour (theme 1, "Original brand")
| Token | Value | Job |
|---|---|---|
| `--bg` | `oklch(16% 0.004 80)` | ground, 70–90% of every screen |
| `--surface`, `--surface-2` | +4 / +9 lightness | image stages, inputs, menu; tone steps, never lines |
| `--ink` | `oklch(94% 0.01 85)` | all text, including headlines |
| `--muted` | `oklch(70% 0.012 85)` | secondary text, ≥4.5:1 on `--bg` |
| `--accent` | `oklch(78% 0.11 85)` flat gold | the action and one recurring thing (price on PDP); <5% of any screen |
| `--field` / `--field-ink` | bone / black | the one light field per page (custom-process section) |

Metal is shown in photographs, never as a gradient. Hard cuts between fields, nothing fades.

### The five live themes
1. **Original brand** — black satin, bone, flat gold · Archivo Wide 800
2. **Dark luxury** — warm graphite, champagne · Fraunces 400 display, Archivo body
3. **Modern minimal** — paper white, one ink, no accent · Archivo Narrow 500
4. **Streetwear editorial** — stone paper, black, one red · Big Shoulders 800 caps
5. **Cinematic chrome** — cold graphite, silver, ice · Unbounded 700

Switch with `data-theme` on `<html>`; the design controller (`src/components/DesignController.tsx`, dev only or `?design=1`) also sets `data-fd` / `data-fb` and overrides `--accent`.

## Typography
Two families max per theme, one job each. Fonts self-hosted from `@fontsource-variable/*`.
| Role | Size | Notes |
|---|---|---|
| `.display` | `clamp(3rem, 9.5vw, 11rem)` | hero only, ≤2 lines at 390/768/1440, `line-height .92`, `letter-spacing -.03em`, `text-wrap: balance` |
| `.h1` | `clamp(2.75rem, 7vw, 7.5rem)` | page titles |
| `.h2` | `clamp(2rem, 4.8vw, 4.75rem)` | every section opens with one, 2–5 words, on the anchor line |
| `.h3` | `clamp(1.5rem, 2.6vw, 2.5rem)` | product titles on PDP, drawer heads |
| `.lede` | `clamp(1.125rem, 1.6vw, 1.5rem)` | one supporting sentence, ≤22 words |
| body | `1rem / 1.5` | full ink, `max-width 62ch`, never under 13px |
Display ≥4× body. Regular weight is fine on serif themes; no bold accent words, no italic accent, no text shadow. Prices use `tabular-nums`.

## Layout
- One pair of outer margins: `--pad: clamp(16px, 2.5vw, 32px)` at every width; nav sits on the same margins.
- No centred 1200px frame; large things run edge to edge, paragraphs are capped in `ch`. Page cap 1760px.
- Anchor line `--anchor: 42%` reused by editorial sections; two or three left edges per page.
- Sections `--section: clamp(72px, 10vw, 200px)` apart; no two neighbouring sections share a layout.
- Corners square (`--r: 0`); the controller can switch to 14px as a preview.
- Phone is its own composition: hero re-cropped portrait, one dominant thing per screen, 44px targets.

## Motion
Tokens: `--ease-out` (<600ms), `--ease-expo` (reveals ≥800ms), `--ease-io` (wipes/travel), `--ease-soft` (photo drift). No bounce. Durations: press 140ms, hover 180ms, menus 240ms, reveals 700–900ms, pictures 1100ms.
One signature move: the hero piece surfaces out of black (clip + scale). Section entrances staggered 60–90ms in reading order, fired once at 88% viewport. One moving picture per page (the hero video). Reduced motion = the finished page; nothing is hidden by CSS until JS runs.
Add-to-bag: the product image flies into the bag icon (Web Animations API), the bag bumps, the drawer opens.

## Components
`Nav`, `Footer`, `ProductCard` (4:5, second image on hover, metal dots, "Quick add"), `QuickView` (side/bottom sheet), `CartDrawer`, `SearchOverlay`, `OptionPicker` (swatches for metal, pills for everything else, sold-out states), `Qty`, `AddButton`, `Rail`, `RecentlyViewed`, `Media` (video with poster and reduced-motion fallback), `DesignController`.

## Copy
Sentence case, no full stop on headings, ≤32 characters. Buttons name the thing: "Shop chains", "Start a custom piece", "Add to bag". No invented proof; every claim on the page traces to `docs/research/brand.md` or is marked sample.
