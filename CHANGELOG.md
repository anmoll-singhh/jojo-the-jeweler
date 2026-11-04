# Changelog

## 2026-11-04 (review round 1)

### Changed
- Nav: desktop is now Shop · Custom · About on the left, the wordmark, and search / wishlist / bag. Shop opens a category panel on hover (or click/keyboard) with counts and three category pictures. Contact lives in the footer and the phone menu.
- Homepage order: hero → shop by piece → the pieces → price your Cuban → custom work → who wears it → showroom.
- Shop by piece is a 3D ring carousel (`src/components/Carousel3D.tsx`): drag, swipe, arrows or arrow keys; side cards come to the front on click; the front card opens the collection.
- "Started at fifteen" moved from the homepage to About, after the hero ("Meet JoJo", the store's own label).
- Custom page: the inquiry form is the first thing on the page, beside the Sp5der film; process and the other three pieces follow.
- Copy on and beside pictures checked against what each one shows: hero caption names the piece, photo alt text no longer guesses who is pictured, no unverified claims ("filmed on 47th Street", "this year", "the block the industry buys from" removed).

## 2026-11-04

### Added
- Project bootstrapped from the Waves storefront boilerplate (Vite, React 19, TypeScript, Tailwind v4, GSAP + Lenis, react-router).
- Asset pipeline: `scripts/collect-assets.mjs` (password-protected Shopify store export + Google Drive folder → WebP/MP4/WebM), `scripts/fetch-instagram.mjs` (Bright Data), both runnable locally or in GitHub Actions.
- Client assets archived in the repo: traced monogram, 10 lifestyle photos, 4 custom-piece films (4K → 1080p 14s loops with posters and stills), store reel and 22 Crew photos, 12 Instagram posts and 5 highlight covers from the profile record.
- Centralised catalogue layer (`src/data/types.ts`, `catalog.ts`, `shopify.ts`, `scripts/build-catalog.mjs`) with Storefront-API-shaped types and a cart permalink checkout.
- Sample catalogue of 21 products / 1,231 variants (`scripts/sample-products.mjs`), every one tagged `sample`.
- Homepage V1 (`/`): film hero, shop tiles, tabbed best sellers, pinned horizontal custom-work chapter, live Cuban price builder, Instagram proof with verified captions, story, showroom.
- Homepage V2 (`/v2`): monogram shutter opening, width wall, drag-to-rotate procedural 3D Cuban (three.js), full-screen piece films, typographic client index, shop rail, close.
- Shop/collection with URL-backed filters and sort, PDP (gallery, variants with sold-out states, quantity, add to bag with fly-to-bag, buy now, sticky bar, specs, related, recently viewed), custom inquiry, about (facts, gallery, watches, policies, FAQ), contact, search, cart, wishlist, 404.
- Five live themes and a design controller (dev builds, or `?design=1`).
- Playwright suite (`tests/storefront.spec.ts`) and a QA GitHub Action.

### Credits spent (accountability)
- Magnific `images_generate`, auto mode, 4:5: **23 images × 65 = 1,495 credits** for the sample product photography in `public/media/products/`. No video, upscales or other paid calls. Balance before: 45,413.
- Bright Data: 26 records returned on the Instagram run (profile OK with 12 embedded posts; reels/posts discovery came back as crawler errors). Re-run the Action to retry.
