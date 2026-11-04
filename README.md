# JoJo The Jeweler

Premium hip-hop jewellery storefront. React 19 + TypeScript + Vite + Tailwind v4, GSAP/Lenis motion, deployed on Vercel from `main`.

```bash
npm install
npm run dev       # local preview
npm run build     # sitemap + type-check + build to dist/
npm run qa        # Playwright suite (after `npx playwright install chromium`)
```

See `TASKS.md` (progress), `DESIGN_SYSTEM.md` (tokens/typography/themes), `CHANGELOG.md`, `docs/` (research and design principles).

## Asset pipeline (GitHub Actions)
- **Collect client assets** — Shopify catalogue + Google Drive media → `content/`, `public/media/`. Trigger: edit `content/COLLECT` or run from Actions.
- **Fetch Instagram content** — Bright Data archive of @jojothejeweler_. Needs the `BRIGHTDATA_API_KEY` repository secret. Trigger: edit `content/instagram/REFETCH` or run from Actions.
