# JoJo The Jeweler

Premium hip-hop jewellery storefront for JoJo The Jeweler (3 W 47th Street, New York). React 19 + TypeScript + Vite + Tailwind v4, GSAP + Lenis motion, three.js for the V2 chain, deployed on Vercel from `main`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # catalogue → sitemap → type-check → dist/
npm run preview    # serve dist/ on :4173
npm run qa         # Playwright suite (first: npx playwright install chromium)
npm run lint
```

## Where things are

| What | Where |
|---|---|
| Homepage V1 (`/`) and V2 (`/v2`) | `src/pages/HomeV1.tsx`, `src/pages/HomeV2.tsx` + `src/styles/home-v1.css`, `home-v2.css` |
| Shop, PDP, custom, about, contact, search, cart, wishlist, 404 | `src/pages/Collection.tsx`, `Product.tsx`, `Pages.tsx` + `src/styles/pages.css` |
| Nav, footer, cards, quick view, cart drawer, search, design controller, video, 3D chain | `src/components/` |
| Cart, wishlist, recently viewed | `src/lib/store.tsx` (localStorage) |
| Themes and the controller state | `src/lib/design.tsx`, `src/styles/tokens.css` |
| Motion (reveals, pinned scroll, smooth scroll, magnetic buttons) | `src/lib/motion.ts` |
| Product data layer | `src/data/types.ts` (Storefront-shaped), `catalog.ts` (queries), `shopify.ts` (live adapter stub + checkout permalink) |
| Generated catalogue | `src/data/catalog.json` ← `scripts/build-catalog.mjs` ← `content/shopify/*.json` + `content/catalog.sample.json` (`scripts/sample-products.mjs`) |
| Brand facts and copy | `src/data/site.ts` (verified facts, FAQ, process, sample policy copy), `src/data/content.ts` (films, photos, Instagram) |
| Client media | `public/media/{brand,drive,stills,store,ig,products}` — see `docs/research/brand.md` |
| Research | `docs/research/brand.md`, `docs/research/references.md`, `docs/design-principles.md` |
| Tests | `tests/storefront.spec.ts`, `playwright.config.ts` |

## Connecting Shopify

1. Build the real catalogue in Shopify (the current products are labelled samples).
2. Set `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` (see `.env.example`).
3. Swap `loadCatalog()` in `src/data/catalog.ts` for `fetchCatalog()` from `src/data/shopify.ts` (same `Catalog` shape). Nothing in the components changes.
4. Checkout already uses the cart permalink (`/cart/<variantId>:<qty>`), so real variant ids make "Buy now" and "Checkout" land in Shopify checkout.

## Asset pipeline (GitHub Actions or local)

- **Collect client assets** (`.github/workflows/collect-assets.yml`, `scripts/collect-assets.mjs`): password-protected store export + Drive folder → `content/`, `public/media/`. Local: `NODE_USE_ENV_PROXY=1 STORE_PASSWORD=… DRIVE_FOLDER=… node scripts/collect-assets.mjs` (needs ffmpeg and `pip install gdown`).
- **Fetch Instagram content** (`.github/workflows/fetch-instagram.yml`, `scripts/fetch-instagram.mjs`): Bright Data archive of @jojothejeweler_. Needs the `BRIGHTDATA_API_KEY` secret; bills per record (see `content/instagram/fetch-log.json`).

## Design controller

Dev builds show a floating "Design" button; production shows it with `?design=1` or `VITE_DESIGN_CONTROLLER=1`. It switches the five themes, display/body faces, accent, corners and motion live through `data-*` attributes on `<html>`.

## Sample content to replace

Everything tagged `sample` in the catalogue, and the policy wording in `SAMPLE` (`src/data/site.ts`). The site marks them. Verified facts come from the client's store and Instagram and are listed in `docs/research/brand.md`.

## Releases

Every stable milestone is a commit on `main`; roll back by redeploying an earlier commit in Vercel. Media is committed on purpose so any commit is a complete, restorable site.
