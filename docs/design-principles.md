# Design principles — distilled from three installed skills

Sources (all vendored in this repo):

- **[taste]** `.agents/skills/design-taste-frontend/` (tasteskill v2, symlinked at `.claude/skills/design-taste-frontend`). Rules measured from 247 gallery sites; enforced by `scripts/lint.mjs` + `scripts/inspect.mjs`. Strictest of the three.
- **[awwwards]** `.claude/skills/awwwards/` (claude-skill-awwwards). Creative-director framing, GSAP/CSS recipes, Awwwards judging weights.
- **[unslop]** `.claude/skills/unslop/` (theclaymethod/unslop). Prose de-slopping: taboo phrases, structural tells, preservation contract. Applies to every word on the site.

**Where they disagree, follow [taste].** [awwwards] still recommends gradients, glass nav, custom cursors, mono accent labels, tracked uppercase overlines, 16px-radius shadowed cards and a terracotta "Warm Editorial" palette; [taste]'s 2026 tells registry bans every one of those as the recognised generated look (`references/tells.md`). Take [awwwards] for its judging criteria, motion tokens, performance rules and art-direction questions, not its component recipes.

---

## 1. Typography

- **Two or three sizes do the visible work: one very large, one small, nothing in between.** Five sizes is the ceiling; "nine sizes that are all near each other (16, 18, 20, 24, 28, 32…) reads as mush." [taste type §2]
- Display ≥ 4× body on desktop. Study median headline÷body 4.3, top sites 4.7; largest type 8.4vw on top sites vs 5.0vw on weak. [taste type §1]
- **Display settings:** `line-height 0.85–1.05; letter-spacing -0.02 to -0.05em; text-wrap: balance; max-width in ch`. Tracking per step, "a value right for 120px will choke 32px." [taste type §3] [awwwards]: hero `clamp(3rem, 10vw, 12rem)`, tracking `-0.03em`, leading `0.9–0.95`.
- **Big type does not need to be bold:** 48% of studied heroes are regular weight. "If every line is emphasised, none is." [taste type §1, §8]
- All-caps: slightly open tracking (0 to +0.03em), leading ~0.9. No all-caps longer than three words. [taste type §3, copy §7]
- Optical alignment: pull display lines left ~0.05em (`margin-left: -0.05em`) so round letters align with text beneath. [taste type §3]
- **Body:** 16–20px, line-height 1.45–1.6, 45–75 characters per line (`max-width: 62ch`), `text-wrap: pretty`. Running text in full ink, not grey; "a page set in soft grey reads unfinished." No text under 13px. [taste type §4, SKILL]
- Secondary text = same face in `--muted`, never a lighter weight, never under 13px. Don't justify; don't centre paragraphs longer than three lines. [taste type §4]
- **Two typefaces at most, usually one** (31% of studied sites use one). Each face gets one job and never swaps; never two faces in one headline. Italic only for titles of works and real emphasis. [taste type §6]
- **No monospace** outside real `<pre>/<code>`. Tabular figures (`font-variant-numeric: tabular-nums`) for prices and aligned numbers. [taste house rules] (Overrides [awwwards] "monospace for accents/metrics".)
- **No tiny uppercase letter-spaced labels, no eyebrows/kickers, no pill badges above headlines** (16% of top sites vs 57% of weak). Put the words in the heading. [taste house rules] (Overrides [awwwards] `--text-overline` with `0.12em` tracking.)
- **No styled accent word in a headline** (italic, serif, coloured, underlined). One face, one colour. [taste house rules]
- Never text-shadow, outline stroke or gradient fill on display type. [taste type §3]
- Micro-typography: curly quotes, en dash for ranges, real ellipsis, `&nbsp;` before the last short word of a headline, `text-underline-offset: 0.18em`, `hyphens: none` on headings, `::selection` and `:focus-visible` in the accent. Don't change weight on hover (reflow). [taste type §7, copy §7]
- Fluid sizes via `clamp()`, never breakpoint font sizes; never raw `px` font sizes in production. `text-wrap: balance` on headings. [awwwards typography]
- Dark grounds: light text looks heavier, so drop one weight step or add 0.01em tracking and raise leading slightly. [taste type §4, colour §6]

## 2. Layout & composition

- **One pair of tight, equal outer margins (16–32px) at every width**, never under 16px on phone. Nav sits on the same margins as content ("header on 40px inset, page on 20px" is the commonest small fault). [taste layout §2, §5]
- Don't wrap the page in `max-width: 1200px; margin: auto` by reflex; the centred 1100–1300px container is "the usual frame of the ones the panel called stock." Large things run to the edges; constrain only paragraph measure in `ch`. Cap very wide screens at ~1760–1920px. [taste layout §2]
- **Asymmetry inside the grid, never in the frame.** Text hangs from one off-centre anchor line (a third across, 42%, midpoint) reused by every section; two or three left edges on the whole page, "six means nothing was decided." [taste layout §3, critique pass 4]
- **Use the width the page set up:** when text takes one half, the other half holds the section's picture, second column, list or figure. Never plain ground. An empty block ≥28% of the first screen is flagged. [taste layout §5]
- **Sections 120–240px apart on desktop** (study median ~240), 72–112px on phone; gap between sections clearly larger than any gap inside one; a heading has ≥2× the space above it as below. >40% of a screen of plain ground between sections is a hole. [taste layout §4]
- No stretch taller than ~half a screen holds nothing; the inspector fails two or more near-empty screens. One deliberate rest per page at most; a rest is one thing on a screen, closed by a picture, the type, or a field of colour. [taste layout §4]
- Size sections to content: `min-height: 100vh` belongs to a section that fills the screen, not a footer or lone heading. [taste layout §4]
- **No two neighbouring sections share a layout**; a layout shape used three times on a page "is the template showing." Alternate dense/empty, image/type, light/dark. Repeated modules only for archives (product index, menu). [taste layout §6]
- "Vary rhythm: alternate contained ↔ full-bleed, vary vertical spacing, alternate grid ↔ split ↔ centered ↔ scroll, use background colour changes to create visual rooms. Same padding on every section = template-y." [awwwards layouts]
- **Break the system once**, on purpose: one centred line, one inverted section, one image at a different scale. [taste layout §6]
- Centred is a decision: one axis, wide empty flanks, one element per screen — "not a centred stack of heading, paragraph and two buttons." Centre at most one moment per page; >72% centred is warned. [taste layout §3]
- **The first screen** has one `h1` at display size (≥32px desktop, mostly 50–150px on clear sites), ≤2 lines, that says what this is; if the `h1` is the name, the line under it (≥18px, 32–48px below) says what the thing is. Primary action is a real button on the first screen. Content is on the first paint. [taste layout §5, SKILL step 5]
- Hero media covers ≥50% of the first screen on 68% of top sites; "one dominant image beats six small ones." Same crop ratios, square corners unless the direction says otherwise (73% of sites). [taste SKILL laws]
- **Every section opens with a heading that names it** ("The rooms", "Prices"), set on the anchor line, 2–5 words. Caps/mono/numbered stand-ins are banned. [taste layout §5]
- Nav: wordmark, 3–5 plain text links, one action, no bar chrome, no border, no blur; ≤ a tenth of the first screen; one row on phone. Fixed nav must never cover content. [taste layout §7]
- Footer is a designed close (name at full width, hero inverted, one contact fact as headline, one quiet line), "link-column footers appear in the panel's notes only as criticism." [taste layout §8]
- Buttons: flat, one fill, square-cornered or fully round, decided once; "the 9–16px soft radius is the weak-site default." Most strong heroes have no button or one. [taste SKILL laws]
- **No cards:** no icon-topped feature cards, no rows of identical cards, no 1px outlined boxes (3+ fails), no shadows on resting elements, no glass. Surfaces differ by a 2–6 lightness-point tone step. Never nest a panel in a panel. [taste house rules, colour §4]
- **The phone is a second composition:** re-author line breaks, re-crop to portrait, keep one dominant thing on the first screen, margins 16–20px, body 16–18px, 44px touch targets; check 390px every round. "Mobile is not a smaller desktop." [taste layout §9] [awwwards principle 7]
- Pictures in a row with different heights: align bottoms or crop to one ratio. No sideways-scrolling rows on phone unless a partial card at the edge makes the cut obvious. [taste layout §4, critique 13]
- Avoid `background-attachment: fixed` parallax, auto-rotating carousels, hover effects that stick on mobile. [awwwards anti-patterns]

## 3. Colour

- **One ground, one ink, one accent.** Ground 70–90% of the page; accent under 5% of any screen, on the action and at most one other recurring thing: "the moment it appears in five places it stops meaning 'here'." Headlines are ink, not accent. [taste colour §2–3]
- Tokens: `--bg --surface --ink --muted --accent --accent-ink` (+ `--field-n` for section grounds). Every colour references a token; "a raw hex in a component is a second palette starting." No greys between roles. [taste colour §2]
- **Surfaces separated by tone step only** (2–6 lightness points), never by a line or shadow. Inputs are filled, `border: 0`, with a 2px accent focus outline. A thick bar (≥4px) is a graphic element; a 1px line is not. [taste colour §4]
- **Colour fields:** a section that changes the whole ground is the strongest move; fields meet edge to edge with a hard cut, "nothing fades into anything." Each field has its own assigned ink; never `--muted` on a coloured field. Neighbouring fields differ in lightness, not only hue. Top sites use a median of two section grounds. [taste colour §5]
- **No gradients** (backgrounds, buttons, text); only exception is a neutral scrim (ink at 30–55%) under text on a photo. Gradient fills: 22% of top sites vs 52% of weak; gradient text 2% vs 13%. [taste house rules, colour §1, §7]
- **No glows, no shadows at rest.** Shadows only on things that truly float (menu, dialog). Depth on dark comes from a lighter surface step. [taste house rules, colour §6]
- **Banned families:** yellow-cream ground + terracotta/rust/clay accent (together banned, terracotta alone banned, cream warned); violet/indigo. "Warmth is not beige": get it from a low-chroma stone/bone/putty ground (<15% saturation), a deep green/brown/oxblood ink, photographs, or one full warm field used flat. [taste colour §9]
- **Dark pages:** `color-scheme: dark`; ground is a deep tone with slight tint, ink a soft light, not `#fff` on `#000`; check `--muted` at 4.5:1; lighter weights; reduce chroma on accents ("vivid on dark = harsh"); elevations get lighter. [taste colour §6] [awwwards color]
- Never pure `#000`/`#fff` backgrounds; max 1–2 accents; use `oklch()` for perceptually even steps (`oklch(L C H)`: vary L for light/dark, keep C). [awwwards color]
- Contrast: body ≥4.5:1, display/large numerals ≥3:1; inspector fails under 2.6:1. Don't lower text opacity for "softness" without checking the ratio. Hover/focus increase contrast, never reduce. [taste colour §8]
- Photographs: either leave all untouched or treat all the same (all greyscale); never wash with brand colour. Text over a photo needs a calm region or moves off. Sample a flat field from a photo (its sky, its shadow) to make a section sit with it. [taste colour §7]
- Buttons are neutral (black/white/grey) on 52% of sites: "a coloured button is a choice, not a requirement." [taste colour §1]
- If the brand owns a banned colour, keep it, say so, and `--allow` that one inspector rule. [taste SKILL special cases]

## 4. Motion

- **Build the page still first.** "A page that needs animation to look finished is not finished." Motion is the last pass; it cannot rescue a weak layout. [taste SKILL step 6, motion intro] [awwwards workflow 5]
- Yet a page that barely moves reads as a mock-up: the inspector fails under 8 moving elements, warns under 16. [taste motion §1]
- **The layer has five parts:** 2–3 scroll scenes (or none), one signature move, choreographed section entrances, feedback on every control, one moving picture. [taste motion §1]
- **Section entrances:** parts arrive in reading order (heading → text → picture), staggered 60–90ms, rising 16–32px with opacity, fired once when the top is 85–90% down the viewport. Vary the manner with the content: list row by row, picture from a mask or slight scale, figure counts up once. "The same fade-and-slide-up with the same timing on every block is the most cited motion tell." [taste motion §1, §10]
- Nothing above the fold waits for scroll; nothing in view stays hidden >900ms; no content hidden if script fails. Hidden states live inside `@media (prefers-reduced-motion: no-preference)` so the reduced page is the finished page. [taste motion §10]
- **Easing tokens** [taste motion §4] (quint/expo-out agree with [awwwards] `power4.out`):
  `--ease-out: cubic-bezier(.22,1,.36,1)` under 600ms · `--ease-expo: cubic-bezier(.16,1,.3,1)` reveals ≥800ms · `--ease-in-out: cubic-bezier(.76,0,.24,1)` wipes/travel · `--ease-soft: cubic-bezier(.33,1,.68,1)` slow photo drift · `--ease-exit: cubic-bezier(.55,.055,.675,.19)` leaving only · `linear` for scroll-linked and loops · plain `ease` for colour. **No overshoot, bounce or elastic on interface elements.** ([awwwards] lists `back.out`/spring curves; [taste] bans them.)
- **Durations:** press 140ms; hover colour 180–200ms; hover that moves 300–400ms; menus 240ms; reveals 700–900ms; picture openings 1100–1300ms; exits 60–70% of the matching entrance. "The larger the element moving, the longer the duration." [taste motion §10] [awwwards duration scale]
- **Staggers:** lines 80–110ms; list items 50–90ms; characters 20–40ms and only in a heading of 1–3 words; four steps max in one sequence. Hero load sequence settled by 1.2s with ≤4 elements. [taste motion §10]
- **Scroll-linked travel stays quiet:** linear, locked to the scrollbar; parallax under 8% of the element; scale 0.94–1.15; pictures held at 106–110% in their frames; built with scroll timelines inside `@supports`, static without. [taste motion §5, §10]
- **One of each:** one signature move, one moving picture, one marquee max (pausable), one ink-fill statement starting at 45% ink. Pick the signature move by subject ("a product wants the shutter on its hero object"); if it says nothing about the subject, cut it. [taste motion §7, §10]
- Held/pinned stages: ≤2, ~one screen per step, three screens max, a line of text on every held screen. Colour by chapter as hard cuts; fixed header ink follows in 300ms. [taste motion §10]
- **Banned:** preloaders and counters, gates (enter/sound/age), scroll hijacking and wheel capture, custom cursors, scramble/typewriter text, endless loops with no off switch (pulsing dots, floating shapes, shimmering text, spinning badges), hover lift/zoom on every card, a dozen staggered hero entrances, motion crossing text being read, blur >8px or left on text. [taste motion §9] (Overrides [awwwards] "sweat the custom cursor, loading sequences".)
- Smooth scroll only optionally (Lenis lerp 0.1–0.14), off for touch and reduced motion. View transitions ≤480ms. [taste motion §10]
- **Performance:** animate only `transform`, `opacity`, `clip-path` (never width/height/top/left/margin); `will-change` only just before animating, removed after; ≤30 elements animating simultaneously; pause loops off-screen and when tab hidden; kill ScrollTriggers on unmount; pick ONE animation library. Target <3s load, 60fps. [taste motion §8] [awwwards performance rules, principle 4]
- Every move answers "What happened? What's important? Where should I look?"; if none, remove it. Four questions first: how often seen, what for, which easing, how long. [awwwards principle 3] [taste motion §3]
- Feedback on every control: press, hover and focus on buttons, links, cards and the live thing; a menu opens from where it was clicked. [taste motion §1]

## 5. Copywriting

- **Write the page as a copy deck before markup.** List it as claims, one per section, each with its proof; "a section with no claim is filler; delete it." This is how to escape hero → logos → features → testimonial → pricing → CTA. [taste copy §1]
- **Every headline ≤2 lines at every width.** Budget: `chars/line ≈ width ÷ (font-size × k)`, k≈0.5 for grotesks/serifs, 0.4 condensed, 0.58 wide/caps. ~32 characters (4–6 words) survives everywhere; gallery median is 5 words. Author the break with `<br>`; no orphan word on line two; never fix a long headline by shrinking it. [taste copy §2]
- A statement is not a headline: intro sentences and quotes are `<p>/<blockquote>`, ≤36px desktop / 24px phone, ~25 words, ≤3 lines. Larger than that it is a headline. [taste copy §2]
- Headline shapes that work: the name; what it is ("Furniture for small rooms"); the claim a competitor couldn't sign; the instruction (verb first); the place or moment. [taste copy §3]
- **Avoid:** mad-libs ("The AI-powered platform for modern teams"), tricolons ("Fast. Simple. Secure."), the correction ("not just X, it's Y", "more than a…"), "X, reimagined/redefined/made simple", "Welcome to", "Meet …", a question nobody asked, the colon headline ("Brand: tagline"). Sentence case, no full stop. [taste copy §3] [unslop negative parallelism, contrastive definitions]
- Supporting line: one sentence ≤22 words, concrete, says what and for whom; never restates the headline. Body: specific noun and real number ("ships in a week", "38 seats"); if a competitor could print the sentence unchanged, cut it. [taste copy §4]
- Buttons name the action or thing (1–3 words: "Book a table", "See the plans"); one primary per screen, kept to one name everywhere; second action is a text link; at most one arrow glyph on the page. Never "Get started" / "Learn more". Nav labels are single nouns. [taste copy §4, §6]
- **Never invent proof:** no customers, named quotes, press logos, user counts, ratings, "10,000+ teams". Sample content for density (product names, prices) is fine and must be listed for the client to confirm. [taste copy §5]
- Genre words banned by lint: unlock, unleash, supercharge, elevate, empower, streamline, seamless, effortless, robust, cutting-edge, next-generation, world-class, all-in-one, blazing fast. Performative labels banned: "Field notes", "Quietly trusted by", "Our philosophy", "On our desks". Furniture text banned: local time, coordinates, "Est. 2024", "(Scroll to explore)", "Available for work" + dot, middle-dot strings, "Step 1 / Phase 02", captions narrating the design. [taste copy §6, tells §4]
- Use the number the content has: "three features, three stats, three steps" everywhere is a tell. [taste copy §6] [unslop rhythm: "Three-item lists: use two or one"]
- **Em dashes: default zero.** "One or two on a page read as writing; ten read as a model" [taste]; "the single most reliable AI punctuation tell… two or more in any paragraph is always wrong" [unslop punctuation]. Also: no "setup: reveal" colons, no exclamation stacks.
- [unslop] phrase families to strip from any site copy: throat-clearing ("Here's the thing", "Let's dive in"), emphasis crutches ("Full stop.", "Let that sink in"), significance inflation ("a testament to", "pivotal", "rich tapestry"), promotional clichés ("nestled", "boasts", "breathtaking", "in the heart of", "state-of-the-art", "a hidden gem", "renowned for", "at the forefront of"), business jargon ("leverage", "elevate", "showcase", "enhance", "robust", "comprehensive", "cutting-edge" → plain verbs), filler ("At its core", "In today's…", "In a world where", "It's worth noting"), false agency ("the numbers speak for themselves"), vague attribution ("experts say"), dramatic fragments ("[Noun]. That's it."), wh-opener self-Q&A ("Why does this matter? Because…"), staccato one-line runs, every paragraph ending punchily, moralising codas ("Ultimately, this reminds us…").
- [unslop] preservation contract when editing existing client copy: fix only the sentence with a confirmed defect, smallest repair, keep every fact, price, name, quote, unit and hedge byte-exact; add no claims, promises or personality; "prefer a no-op to an uncertain edit." Replace an inflated abstraction with the source's concrete fact; never swap it for a different abstraction. Headings name the actor, mechanism or result, not a vague transformation.
- Few words: study median 575 per page; some of the best carry under 200. [taste layout §1]

## 6. Anti-slop checklist (what makes a site look AI-generated)

Run `node .agents/skills/design-taste-frontend/scripts/lint.mjs src` and `node .agents/skills/design-taste-frontend/scripts/inspect.mjs <url>` (1440/768/390). Fix every FAIL; defend every WARN in one sentence or fix it. [taste SKILL step 7]

**Tells registry, all banned/warned by [taste tells.md]:**
- [ ] Violet/indigo anywhere; gradient hero, button, glow or text; mesh backgrounds
- [ ] Yellow-cream ground + terracotta/rust/clay accent; beige "warm editorial" shortcut
- [ ] Glass: backdrop-blur panels, translucent cards, floating pill nav
- [ ] Soft shadow under every card; hover lift on every card; 12–16px radius on everything
- [ ] Three identical feature cards with an icon in a rounded square; bento tiles as the feature section; rows of identical cards
- [ ] Eyebrow / kicker / tracked-caps micro-label above headings; pill badge ("New", "Introducing") above the hero
- [ ] One accent word in the headline in italic serif / colour / underline
- [ ] Monospace labels, captions or "technical voice"; index numbering 01/02/03, (001), "Step 02"
- [ ] Hairline dividers, 1px outlined boxes, ruled grids, crosshairs, crop marks, dashed guides
- [ ] Agency micro-meta: local time, coordinates, weather, "©2026 — Scroll", middle-dot strings, "Available for work" pulsing dot
- [ ] Emoji as icons/bullets; decorative blobs; fake dashboards of grey bars; placeholder boxes, lorem, "Image here"
- [ ] Headline as a 3–4 line sentence; everything centred; nine near-identical font sizes
- [ ] Stock order hero → logos → features → testimonial → pricing → CTA; every section the same layout
- [ ] Centred headline + subtitle + two buttons + screenshot below
- [ ] Invented social proof (logos, quotes, star rows, "10,000+ teams")
- [ ] Same fade-up on every block; dozen staggered hero entrances; bounce easing; meaningless infinite loops; reveal that never fires and leaves a blank band
- [ ] Preloader/counter, gate, scroll hijack, custom cursor, scramble/typewriter headline
- [ ] Copy tells: genre verbs, tricolons, "not just X", "Get started", em-dash habit, lorem (lint)
- [ ] Default typeface with no character; default Tailwind colours and radii; stock photography ("diverse team laughing at laptop") [awwwards anti-patterns]

**Frame and substance, measured by the inspector [taste SKILL house rules]:**
- [ ] Every h1–h6 ≤2 lines at 1440/768/390
- [ ] One `h1` on the first screen saying what this is; a heading on every section
- [ ] Equal left/right margins (16–32px); no section with text in one half and nothing in the other
- [ ] No blank stretch taller than half a screen; ≤1 near-empty screen; sections 120–240px apart
- [ ] Statements marked as `<p>`, ≤36px desktop, ≤25 words
- [ ] ≥4 real pictures (6–12 usual); one moving picture; SVG drawings don't count
- [ ] Running text ≥16px in full ink; contrast ≥4.5:1 body, ≥3:1 display
- [ ] ≥8 elements really move on load/scroll (16+ to avoid the warning); every move has a reduced-motion fallback
- [ ] Nothing ever covers a headline or statement at any scroll position; nothing clipped on phone
- [ ] Real links/buttons, visible focus, alt text, keyboard-reachable controls with accessible names
- [ ] Gate the production build (`vite build && vite preview`), not only the dev server

**"Removal is not enough."** A page with every tell removed and nothing in its place "is an empty page with good manners, and that is a tell too" (the avoidance aesthetic). Fill the space with scale (make the main thing larger), full content, a picture of this subject's world, or a field of flat colour. Never another ornament. [taste tells §8, SKILL]

## 7. Awwwards-level criteria

- **Scoring:** Design 40% · Usability 30% · Creativity 20% · Content 10% [taste critique §2] ([awwwards] cites 40/20/20/20). `overall = 0.4·design + 0.3·usability + 0.2·creativity + 0.1·content`. Real Sites of the Day land 7.5–8.0; "an honest 8.5 is rare. If your first score for your own work is 9, score it again as the juror who did not build it."
- **Caps that override arithmetic** [taste critique §3]: any inspector FAIL → ≤6.0; a 3-line headline, eyebrow, mono label, 01/02 numbering, gradient, resting shadow or hairline visible → ≤6.5; page could belong to a competitor → creativity ≤6; <4 real pictures → design ≤6.5; still page or one identical fade → design ≤7; no live thing → creativity ≤7.5; placeholder → content ≤5; no real primary button on first screen → usability ≤7; five-second test fails → usability ≤6; unequal margins / huddled section / blank half-screen → design ≤6.5.
- **Concept first, technology second.** "The idea must be strong enough to sketch on paper." [awwwards principle 1] Write the sentence *"On this page, [something that belongs to the subject] becomes [the device the direction calls for]"* and run the competitor test: if the nearest competitor's name fits the sentence, the idea belongs to the category. "Clean and modern is not an idea." [taste SKILL step 4]
- **Inventory the subject** (8–12 things only this client has: name and its meaning, street, materials, numbers, constraint, rituals, printed artefacts); the idea comes from an item on this list, and the list is the picture search. [taste SKILL step 1]
- **One live thing:** something the visitor can do, built from the subject's real content (pick a metal and see the piece in it; set the size and see it against the hand), works with a thumb, plain fallback, never blocks reading, one not a playground. "In blind tests every winning page had one and the jurors named it first." [taste SKILL step 4]
- **Carry the idea to the last pixel:** "the commonest failure, even among good sites, is a distinctive first screen followed by stock blocks." Pricing, FAQ and footer included. [taste SKILL step 6, layout §6]
- **The fourteen critique passes** on screenshots, never on code [taste critique §1]: one second then five (one answer, not "a website"); squint (2–3 masses); cover the logo (could a competitor own it?); count left edges (2–3); space and frame; type jump ≥3×; name colour proportions; count real pictures; one layout word per section (no repeats adjacent, none 3×); phone as its own composition; fullness (each screen a poster, not a wireframe); substance (full menu, every price); collisions; competitor + live thing.
- **Fix order** (later cannot rescue earlier): idea → hierarchy (one dominant element per screen) → composition → typography → imagery → colour → detail → motion. Three rounds max; write the critique in the `ROUND n` format; "could be more polished is not a finding." [taste critique §4–6]
- **Imagery preference order:** project's own → generated → real pictures of the subject's world from open collections (credited) → drawn in code from the subject → honestly generic photos → type and colour alone. "No image is better than a placeholder." Never a sentence on the page about where pictures come from. [taste SKILL step 6]
- **Usability is where winners score lowest** (median 6.0 on hijacked pages vs 6.5): native scroll, no gate, readable first frame, honest phone, keyboard works. Accessibility "enables creativity; `prefers-reduced-motion` is a first-class experience." [taste motion §9] [awwwards principle 8]
- **Studio instincts** [awwwards studios]: Basic/Dept restraint ("do less, better"); Locomotive "motion is meaning"; Aristide Benoist "typography is 90% of web design: massive type, monochrome palettes". Luxury/e-commerce language: desire, texture, large imagery, asymmetric editorial grids, slow zoom on hover, dark + gold/cream (apply with [taste]'s no-gradient/no-glow rule: gold as flat accent <5%, metal shown in photographs).
- **Final [awwwards] checklist:** 3-second emotional reaction; intentional type hierarchy with a custom font; restrained palette, no framework defaults; generous intentional negative space; purposeful motion; consistent radius/spacing; custom 404, loading state, favicon, OG image; <3s load, Core Web Vitals green; mobile thoughtfully adapted; keyboard/screen reader/contrast; "would someone screenshot this and share it?"
- **Report honestly:** direction and redraws, the idea sentence and live thing, last critique scores and what still falls short, every found picture with credit, sample content to swap. "Do not claim a check you did not run." [taste SKILL step 10]
