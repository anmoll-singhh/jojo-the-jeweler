#!/usr/bin/env node
/**
 * Writes public/sitemap.xml and public/robots.txt. Runs before every build (package.json "build"),
 * so new products and collections are listed automatically. SITE_ORIGIN is the public address.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const ORIGIN = (process.env.SITE_ORIGIN || 'https://jojo-the-jeweler-two.vercel.app').replace(/\/$/, '')
const cat = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url), 'utf8'))

const pages = [
  ['/', '1.0'],
  ['/collections/all', '0.9'],
  ...cat.collections.map((c) => [`/collections/${c.handle}`, '0.9']),
  ['/custom', '0.8'], ['/about', '0.6'], ['/contact', '0.6'],
  ...cat.products.map((p) => [`/products/${p.handle}`, '0.7']),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, pr]) => `  <url><loc>${ORIGIN}${p}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`
const robots = `# JoJo The Jeweler — ${ORIGIN}
# Written by scripts/gen-sitemap.mjs on every build; edit that script, not this file.
User-agent: *
Allow: /
Disallow: /cart
Disallow: /wishlist
Disallow: /search
Disallow: /checkout
Disallow: /lab
Disallow: /v2
Sitemap: ${ORIGIN}/sitemap.xml
`
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
writeFileSync(new URL('../public/robots.txt', import.meta.url), robots)
console.log(`sitemap: ${pages.length} urls for ${ORIGIN}`)
