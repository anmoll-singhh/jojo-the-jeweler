# JoJo The Jeweler — task tracker

Legend: `[ ]` pending · `[~]` in progress · `[x]` completed · `[!]` blocked. QA column: how it was verified.

## Phase 1 — Setup
- [x] Vite + React 19 + TS + Tailwind v4 project (bootstrapped from the Waves storefront boilerplate)
- [x] Git initialised, `main` branch, GitHub remote `anmoll-singhh/jojo-the-jeweler`, every milestone pushed
- [x] `.env` gitignored, `.env.example` written, Bright Data key kept out of the repo
- [x] TASKS.md / README.md / CHANGELOG.md / DESIGN_SYSTEM.md
- [x] Design skills installed and distilled (taste-skill, claude-skill-awwwards, unslop) → `docs/design-principles.md`

## Phase 2 — Research & assets
- [x] Reference research → `docs/research/references.md` (18 sites, section library, V1/V2 compositions)
- [x] Brand inventory from the client's own sources → `docs/research/brand.md`
- [x] Drive assets collected and converted (photos, 4 films) — `public/media/drive`, `public/media/stills`
- [x] Existing store scraped (catalogue, pages, reel, photos, logo) — `content/shopify`, `public/media/store`
- [x] Instagram profile + 12 posts via Bright Data — `content/instagram` · QA: reels/posts discovery returned crawler errors; re-run the Action
- [x] Sample product photography (23 images, 1,495 Magnific credits) — `public/media/products`

## Phase 3 — Creative direction
- [x] Creative direction, tokens, five themes → `DESIGN_SYSTEM.md`, `src/styles/tokens.css`
- [x] Centralised product data layer with Shopify-shaped types and a Storefront adapter stub

## Phase 4 — Homepage V1 `/`
- [x] Nav (transparent over hero, full-screen menu), search overlay, cart drawer
- [x] Film hero · shop tiles · tabbed picks · pinned custom-work rail · Cuban builder · proof · story · showroom · footer
- QA: screenshots at 390 and 1440 reviewed; Playwright routes/responsive/commerce

## Phase 5 — Homepage V2 `/v2`
- [x] Monogram shutter opening (scroll-scrubbed mask) · width wall · 3D chain (three.js, lazy) · full-screen films · client index · shop rail · close
- QA: screenshots at 390 and 1440 reviewed; reduced-motion fallback tested

## Phase 6 — Storefront
- [x] Shop / collections with URL filters (piece, metal, price, iced) and sort; phone filter sheet
- [x] PDP: gallery (swipe on phone, sticky on desktop), variants with sold-out states, quantity, add to bag, buy now, save, specs, shipping, related, recently viewed, sticky bar
- [x] Custom (process, four films, inquiry form) · About (facts, gallery, watches, policies, FAQ) · Contact · Search · Cart · Wishlist · 404

## Phase 7 — Commerce & motion
- [x] Cart (localStorage), fly-to-bag, drawer, wishlist, recently viewed, Shopify cart permalink checkout
- [x] Line-mask headings, staggered entrances, clip reveals, scroll drift, pinned horizontal, magnetic buttons, view-transition card → PDP; reduced motion = finished page

## Phase 8 — Design controller
- [x] Five themes, display/body face, accent, corners, motion — live via data-attributes; dev only or `?design=1`

## Phase 9 — QA
- [~] Playwright: routes, broken media, console errors, five viewports overflow, headings ≤2 lines, variants, cart, quick add, wishlist, search, filters, builder, menu, controller, axe, SEO, reduced motion
- [~] Human-eye visual pass per page at 390 / 1440 (done for home, V2, PDP, collection, custom, about; contact/cart/search pending a second look)
- [ ] Lighthouse / performance pass on the production build

## Phase 10 — Delivery
- [x] Docs (README, DESIGN_SYSTEM, CHANGELOG, research)
- [ ] Final stable push after QA green

## Blocked / needs the client
- [!] Real catalogue in Shopify (prices, SKUs, photography) — every current product is a labelled sample
- [!] Storefront API token (`VITE_SHOPIFY_STOREFRONT_TOKEN`) to replace the static catalogue
- [!] Contact inbox (`VITE_CONTACT_EMAIL`); until set, forms hand off to SMS at 917-715-0337
- [!] Confirm shipping / returns / warranty wording (marked sample on the site)
