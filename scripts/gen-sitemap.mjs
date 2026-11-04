#!/usr/bin/env node
/**
 * Writes public/sitemap.xml and public/robots.txt for Double M & Co.
 * Runs before every build (see "build" in package.json), so new products, collections and
 * pages are listed automatically.
 *
 * SITE_ORIGIN is the one place the site's address lives. It is the Vercel address until the
 * real domain is pointed at this build; then set SITE_ORIGIN in Vercel (Settings →
 * Environment Variables), or change the default below, and redeploy.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const ORIGIN = (process.env.SITE_ORIGIN || 'https://doublemco.vercel.app').replace(/\/$/, '')
const cat = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url), 'utf8'))
const site = readFileSync(new URL('../src/data/site.ts', import.meta.url), 'utf8')

// Info pages (/pages/:slug) are the keys of DOCS in src/data/site.ts.
const docs = site.slice(site.indexOf('export const DOCS')).split('\n')
  .map((l) => l.match(/^\s+'?([a-z-]+)'?:\s*\{\s*title:/)?.[1]).filter(Boolean)

const pages = [
  ['/', '1.0'],
  ['/collections/all', '0.9'],
  ...cat.collections.map((c) => [`/collections/${c.handle}`, '0.9']),
  ['/custom', '0.8'], ['/instant-quote', '0.8'], ['/sell-gold', '0.8'], ['/build-your-ring', '0.8'],
  ['/book-appointment', '0.8'], ['/about', '0.6'], ['/faq', '0.6'], ['/contact', '0.6'],
  ...cat.products.map((p) => [`/products/${p.handle}`, '0.7']),
  ...docs.map((d) => [`/pages/${d}`, '0.3']),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, pr]) => `  <url><loc>${ORIGIN}${p}</loc><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`
const robots = `# Double M & Co — ${ORIGIN}
# Written by scripts/gen-sitemap.mjs on every build; edit that script, not this file.
#
# The Disallow lines are the per-visitor screens (bag, wish list, checkout) and the previous
# homepage kept only for comparison. None of them should appear in search results.

User-agent: *
Allow: /
Disallow: /checkout
Disallow: /wishlist
Disallow: /homepage-v1
Disallow: /homepage-v2

Sitemap: ${ORIGIN}/sitemap.xml
`
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
writeFileSync(new URL('../public/robots.txt', import.meta.url), robots)
console.log(`sitemap: ${pages.length} URLs for ${ORIGIN}`)
