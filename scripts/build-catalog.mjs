#!/usr/bin/env node
/**
 * Builds src/data/catalog.json — the one file the storefront reads.
 *
 *  content/shopify/products.json + collections.json (from the Collect client assets Action)
 *    → mapped to the Storefront-API-shaped types in src/data/types.ts
 *  content/catalog.sample.json
 *    → sample products for sections the real catalogue can't fill yet; every one is tagged
 *      `sample: true` so the UI can label them and they are easy to remove.
 *
 * Runs before every build (see package.json). Swapping to the live Storefront API later means
 * replacing src/data/catalog.ts's loader, nothing else.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null)
const strip = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const money = (s, cur) => ({ amount: Number(s || 0), currencyCode: cur })
const CUR = process.env.CURRENCY || 'USD'

/** Shopify's /products.json shape → Product */
function fromShopify(p, collections) {
  const images = (p.images || []).map((i) => ({ src: i.local || i.src, alt: i.alt || p.title, width: i.width, height: i.height }))
  const imgById = Object.fromEntries((p.images || []).map((i) => [i.id, images[(p.images || []).indexOf(i)]]))
  const options = (p.options || []).filter((o) => !(o.values.length === 1 && o.values[0] === 'Default Title')).map((o) => ({ name: o.name, values: o.values }))
  const variants = (p.variants || []).map((v) => ({
    id: String(v.id), title: v.title,
    selectedOptions: options.map((o, i) => ({ name: o.name, value: v[`option${i + 1}`] })).filter((x) => x.value),
    price: money(v.price, CUR), compareAtPrice: v.compare_at_price ? money(v.compare_at_price, CUR) : null,
    availableForSale: v.available !== false, sku: v.sku || undefined, image: v.featured_image ? imgById[v.featured_image.id] ?? null : null,
  }))
  const specs = []
  const body = strip(p.body_html)
  return {
    id: String(p.id), handle: p.handle, title: p.title, productType: p.product_type || 'Jewelry', vendor: p.vendor || 'JoJo The Jeweler',
    tags: p.tags || [], description: body, descriptionHtml: p.body_html || '', options, images, variants,
    collections: collections.filter((c) => c.products.includes(p.handle)).map((c) => c.handle), specs, createdAt: p.created_at,
  }
}

const shop = read('content/shopify/products.json')
const cols = read('content/shopify/collections.json') || []
const sample = read('content/catalog.sample.json') || { products: [], collections: [] }

let products = [], collections = [], source = 'sample'
if (shop?.length) {
  source = 'shopify'
  collections = cols.map((c) => ({ id: String(c.id), handle: c.handle, title: c.title, description: strip(c.body_html), image: c.image ? { src: c.image.local || c.image.src, alt: c.title } : null, products: c.products || [] }))
  products = shop.map((p) => fromShopify(p, collections))
}
// Sample data fills whatever the real catalogue lacks (never overrides a real handle).
const have = new Set(products.map((p) => p.handle))
for (const p of sample.products) if (!have.has(p.handle)) products.push({ ...p, sample: true })
const haveC = new Set(collections.map((c) => c.handle))
for (const c of sample.collections) {
  if (haveC.has(c.handle)) continue
  collections.push({ ...c, products: products.filter((p) => p.collections.includes(c.handle)).map((p) => p.handle) })
}
// Products with no images can't be sold on the site — keep them out rather than show a blank card.
products = products.filter((p) => p.images.length && p.variants.length && p.variants.some((v) => v.price.amount > 0))
for (const c of collections) c.products = c.products.filter((h) => products.some((p) => p.handle === h))
collections = collections.filter((c) => c.products.length)

const out = { source, generatedAt: new Date().toISOString(), currency: CUR, products, collections }
writeFileSync('src/data/catalog.json', JSON.stringify(out) + '\n')
console.log(`catalog: ${products.length} products (${source}${products.some((p) => p.sample) ? ' + sample' : ''}), ${collections.length} collections`)
