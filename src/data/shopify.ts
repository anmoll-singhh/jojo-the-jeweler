/**
 * Shopify Storefront API adapter (not wired yet).
 *
 * When the store is connected: set VITE_SHOPIFY_DOMAIN / VITE_SHOPIFY_STOREFRONT_TOKEN, implement
 * `fetchCatalog()` with the GraphQL below and return the same `Catalog` shape. `checkoutUrl()` already
 * builds the permalink the cart hands over to Shopify checkout, so "Buy now" and "Checkout" need no
 * other change than real variant ids (numeric part of gid://shopify/ProductVariant/…).
 */
import type { Catalog } from './types'

export const SHOP = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined
export const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined
export const API_VERSION = (import.meta.env.VITE_SHOPIFY_API_VERSION as string) || '2025-07'
export const isLive = () => Boolean(SHOP && TOKEN)

/** Cart permalink: /cart/<variantId>:<qty>,<variantId>:<qty> → Shopify checkout. */
export const checkoutUrl = (lines: { variantId: string; qty: number }[]) => {
  const shop = SHOP || 'jojoxwaves.myshopify.com'
  const ids = lines.map((l) => `${l.variantId.replace(/\D/g, '') || l.variantId}:${l.qty}`).join(',')
  return `https://${shop}/cart/${ids}`
}

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) { pageInfo { hasNextPage endCursor } nodes {
      id handle title productType vendor tags description descriptionHtml createdAt
      options { name values } images(first: 12) { nodes { url altText width height } }
      variants(first: 100) { nodes { id title availableForSale sku selectedOptions { name value } price { amount currencyCode } compareAtPrice { amount currencyCode } image { url } } }
      collections(first: 10) { nodes { handle } }
    } }
  }`

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchCatalog(): Promise<Catalog> {
  if (!isLive()) throw new Error('Storefront API not configured')
  const r = await fetch(`https://${SHOP}/api/${API_VERSION}/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN! }, body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: 100 } }) })
  if (!r.ok) throw new Error('Storefront API ' + r.status)
  const { data } = await r.json()
  const products = data.products.nodes.map((p: Record<string, any>) => ({
    id: p.id, handle: p.handle, title: p.title, productType: p.productType, vendor: p.vendor, tags: p.tags, description: p.description, descriptionHtml: p.descriptionHtml, createdAt: p.createdAt,
    options: p.options, images: p.images.nodes.map((i: Record<string, any>) => ({ src: i.url, alt: i.altText || p.title, width: i.width, height: i.height })),
    variants: p.variants.nodes.map((v: Record<string, any>) => ({ ...v, price: { amount: Number(v.price.amount), currencyCode: v.price.currencyCode }, compareAtPrice: v.compareAtPrice ? { amount: Number(v.compareAtPrice.amount), currencyCode: v.compareAtPrice.currencyCode } : null, image: v.image ? { src: v.image.url, alt: p.title } : null })),
    collections: p.collections.nodes.map((c: Record<string, any>) => c.handle), specs: [],
  }))
  return { source: 'shopify', generatedAt: new Date().toISOString(), currency: products[0]?.variants[0]?.price.currencyCode || 'USD', products, collections: [] }
}
