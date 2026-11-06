#!/usr/bin/env node
/**
 * After `vite build`: writes dist/<route>/index.html for every indexable route with its own <title>,
 * description, canonical, Open Graph/Twitter tags and JSON-LD, plus a plain-HTML summary inside #root
 * (heading, intro, links) for crawlers and link previews that don't run JavaScript. The app replaces
 * #root on load, and src/lib/seo.ts keeps the head in sync as people navigate.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { metaFor, ldJson } from '../src/lib/seo-core.js'

const J = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const seo = J('../src/data/seo.json'), catalog = J('../src/data/catalog.json'), faq = J('../src/data/faq.json')
const shell = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
// neutral shell for every other route (vercel.json rewrites there), so /cart etc. never carry the home page's head
writeFileSync(new URL('../dist/app.html', import.meta.url), shell)
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const routes = ['/', '/custom', '/engagement-rings', '/clients', '/about', '/contact', '/collections/all',
  ...catalog.collections.map((c) => '/collections/' + c.handle), ...catalog.products.map((p) => '/products/' + p.handle)]
const nav = [['Shop all', '/collections/all'], ...catalog.collections.map((c) => [c.title, '/collections/' + c.handle]), ['Custom pieces', '/custom'], ['Engagement rings', '/engagement-rings'], ['Clients', '/clients'], ['About JoJo', '/about'], ['Contact', '/contact']]

function head(m) {
  const t = esc(m.title)
  return [
    `<title>${t}</title>`,
    m.description && `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    !m.noindex && `<link rel="canonical" href="${m.url}" />`,
    `<meta property="og:title" content="${t}" />`, m.description && `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${m.url}" />`, `<meta property="og:type" content="${m.type === 'product' ? 'product' : 'website'}" />`,
    m.image && `<meta property="og:image" content="${m.image}" />`,
    `<meta name="twitter:title" content="${t}" />`, m.description && `<meta name="twitter:description" content="${esc(m.description)}" />`, m.image && `<meta name="twitter:image" content="${m.image}" />`,
    ldJson(m) && `<script type="application/ld+json" id="ld-page">${ldJson(m)}</script>`,
  ].filter(Boolean).join('\n')
}
function body(path, m) {
  const p = path.startsWith('/products/') && catalog.products.find((x) => '/products/' + x.handle === path)
  const c = path.startsWith('/collections/') && catalog.collections.find((x) => '/collections/' + x.handle === path)
  const list = p ? [] : (c ? catalog.products.filter((x) => (x.collections || []).includes(c.handle)) : path === '/collections/all' ? catalog.products : []).map((x) => [x.title, '/products/' + x.handle])
  return `<div class="seo-static"><h1>${esc(m.h1 || m.title)}</h1>${m.description ? `<p>${esc(m.description)}</p>` : ''}` +
    (p ? `<p>${esc(p.description)}</p>` : '') +
    (list.length ? `<ul>${list.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul>` : '') +
    `<nav aria-label="Site"><ul>${nav.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></nav>` +
    `<p>JoJo The Jeweler · 3 W 47th Street, New York, NY 10036 · <a href="tel:+19177150337">917-715-0337</a></p></div>`
}

const strip = (html) => html
  .replace(/<title>[\s\S]*?<\/title>\n?/, '')
  .replace(/<meta name="description"[^>]*>\n?/, '')
  .replace(/<meta property="og:(title|description|image|type|url)"[^>]*>\n?/g, '')
  .replace(/<meta name="twitter:(title|description|image)"[^>]*>\n?/g, '')
  .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\n?/, '')
let n = 0
for (const path of routes) {
  const m = metaFor(seo, path, { catalog, faq })
  const html = strip(shell).replace('</head>', head(m) + '\n</head>').replace('<div id="root"></div>', `<div id="root">${body(path, m)}</div>`)
  const dir = new URL('../dist' + (path === '/' ? '/' : path + '/'), import.meta.url)
  mkdirSync(dir, { recursive: true }); writeFileSync(new URL('index.html', dir), html); n++
}
console.log(`seo: wrote ${n} static heads`)
