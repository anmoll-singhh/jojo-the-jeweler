# JoJo The Jeweler — task tracker

Legend: `[ ]` pending · `[~]` in progress · `[x]` completed · `[!]` blocked · QA column notes browser-tested state.

## Phase 1 — Setup
- [x] Vite + React 19 + TS + Tailwind v4 project (bootstrapped from the Waves storefront boilerplate)
- [x] Git initialised, `main` branch, GitHub remote `anmoll-singhh/jojo-the-jeweler`
- [x] `.env` gitignored, `.env.example` written, Bright Data key kept out of the repo
- [x] TASKS.md / README.md / CHANGELOG.md / DESIGN_SYSTEM.md scaffolded
- [~] Design skills installed (taste-skill, claude-skill-awwwards, unslop) → `docs/design-principles.md`

## Phase 2 — Research & assets
- [~] Reference research (Mavani & Co, Miami Cuban Link, hip-hop/luxury sites, Awwwards) → `docs/research/references.md`
- [!] Google Drive assets → `public/media/drive/` — collected by the **Collect client assets** GitHub Action (Drive/Shopify hosts are not reachable from the build sandbox)
- [!] Existing Shopify store catalogue → `content/shopify/` — same Action (uses storefront password)
- [!] Instagram archive via Bright Data → `content/instagram/` — **Fetch Instagram content** Action; needs `BRIGHTDATA_API_KEY` repo secret
- [ ] Brand study notes → `docs/research/brand.md`

## Phase 3 — Creative direction
- [ ] Creative direction + DESIGN_SYSTEM.md (tokens, type, 5 themes)
- [ ] Centralised product data layer (`src/data/catalog.ts`, Shopify-shaped types, mock adapter)

## Phase 4 — Homepage V1 `/`
- [ ] Animated navigation + announcement bar
- [ ] Cinematic hero (video)
- [ ] Category grid · Best sellers · Editorial showcase · Brand story · Collections · Social proof · Footer

## Phase 5 — Homepage V2 `/v2`
- [ ] Full-screen cinematic intro · 3D showcase · horizontal scroll · experimental typography

## Phase 6 — Storefront
- [ ] Shop / all products with filters + sort
- [ ] Collection pages
- [ ] PDP: gallery, variants, qty, add to cart, buy now, shipping/returns, related, recently viewed
- [ ] About · Contact · Search · Cart · Wishlist

## Phase 7 — Commerce & motion
- [ ] Cart drawer + fly-to-bag · Wishlist persistence · Page transitions · Scroll animations · Reduced motion

## Phase 8 — Design controller
- [ ] Floating controller, 5 themes, font pairs, accent, live switching across V1/V2

## Phase 9 — QA
- [ ] Playwright: routes, variants, search, cart, wishlist, console errors, 5 viewports, a11y, SEO
- [ ] Human-eye visual QA on every viewport before each push

## Phase 10 — Delivery
- [ ] Docs final, CHANGELOG, stable push
