/**
 * SEO core, shared by the app (live head updates) and scripts/seo-pages.mjs (static head per route at
 * build time, so crawlers and link previews see the right title, description and structured data
 * without running JavaScript). Plain JS so Node can run it; types in seo-core.d.ts.
 */
const abs = (origin, u) => (!u ? undefined : /^https?:/.test(u) ? u : origin + u)
const jpg = (u) => (u ? u.replace(/\.webp$/, '.jpg') : u) // link previews (some apps) don't read WebP
const clip = (s, n = 158) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)) + '…' }

export function orgLd(seo) {
  const o = seo.org
  return {
    '@type': 'JewelryStore', '@id': seo.origin + '/#store', name: o.name, url: seo.origin + '/', telephone: o.telephone,
    image: abs(seo.origin, seo.image), logo: abs(seo.origin, o.logo), priceRange: o.priceRange, openingHours: o.hours,
    address: { '@type': 'PostalAddress', streetAddress: o.street, addressLocality: o.locality, addressRegion: o.region, postalCode: o.postal, addressCountry: o.country },
    sameAs: o.sameAs,
  }
}
const crumbs = (seo, list) => ({ '@type': 'BreadcrumbList', itemListElement: list.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: seo.origin + path })) })

/** Everything the head needs for one route. */
export function metaFor(seo, path, { catalog, faq } = {}) {
  const page = seo.pages[path]
  const base = { url: seo.origin + (path === '/' ? '/' : path), image: abs(seo.origin, seo.image), type: 'website', ld: [] }
  if (path === '/') {
    return { ...base, ...page, ld: [orgLd(seo), { '@type': 'WebSite', '@id': seo.origin + '/#site', name: seo.siteName, url: seo.origin + '/', potentialAction: { '@type': 'SearchAction', target: seo.origin + '/search?q={query}', 'query-input': 'required name=query' } }] }
  }
  const pm = path.match(/^\/products\/([^/]+)$/)
  if (pm && catalog) {
    const p = catalog.products.find((x) => x.handle === pm[1]); if (!p) return { ...base, title: 'Not found | ' + seo.siteName, noindex: true }
    const prices = p.variants.map((v) => v.price.amount)
    const col = catalog.collections.find((c) => (p.collections || []).includes(c.handle) && !['best-sellers', 'iced'].includes(c.handle))
    const img = abs(seo.origin, jpg(p.images[0]?.src))
    return {
      ...base, type: 'product', image: img, h1: p.title,
      title: `${p.title} | ${p.productType ? p.productType + ' · ' : ''}JoJo The Jeweler`,
      description: clip(p.description + ' From JoJo The Jeweler, 3 W 47th Street, New York.'),
      ld: [
        { '@type': 'Product', name: p.title, description: clip(p.description, 500), image: p.images.map((i) => abs(seo.origin, jpg(i.src))), sku: p.handle, category: p.productType, brand: { '@type': 'Brand', name: seo.siteName },
          offers: { '@type': 'AggregateOffer', priceCurrency: catalog.currency || 'USD', lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: p.variants.length, availability: p.variants.some((v) => v.availableForSale) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: base.url, seller: { '@id': seo.origin + '/#store' } } },
        crumbs(seo, [['Shop', '/collections/all'], ...(col ? [[col.title, '/collections/' + col.handle]] : []), [p.title, path]]),
      ],
    }
  }
  const cm = path.match(/^\/collections\/([^/]+)$/)
  if (cm && catalog && cm[1] !== 'all') {
    const c = catalog.collections.find((x) => x.handle === cm[1]); if (!c) return { ...base, title: 'Not found | ' + seo.siteName, noindex: true }
    const fill = (t) => t.replaceAll('{title}', c.title).replaceAll('{lower}', c.title.toLowerCase()).replaceAll('{description}', c.description || '')
    const items = catalog.products.filter((x) => (x.collections || []).includes(c.handle))
    return { ...base, h1: c.title, title: fill(seo.collection.title), description: clip(fill(seo.collection.description)),
      ld: [{ '@type': 'CollectionPage', name: c.title, url: base.url, mainEntity: { '@type': 'ItemList', itemListElement: items.slice(0, 30).map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: seo.origin + '/products/' + x.handle, name: x.title })) } }, crumbs(seo, [['Shop', '/collections/all'], [c.title, path]])] }
  }
  if (path === '/collections/all' && catalog) {
    return { ...base, ...page, ld: [{ '@type': 'CollectionPage', name: 'All pieces', url: base.url, mainEntity: { '@type': 'ItemList', itemListElement: catalog.products.slice(0, 30).map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: seo.origin + '/products/' + x.handle, name: x.title })) } }] }
  }
  if (path === '/about' && faq) return { ...base, ...page, ld: [orgLd(seo), { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] }
  if (path === '/contact') return { ...base, ...page, ld: [orgLd(seo)] }
  if (path === '/engagement-rings') return { ...base, ...page, image: seo.origin + '/media/engagement/hero.jpg', ld: [{ '@type': 'Service', name: 'Custom engagement rings', serviceType: 'Custom engagement ring design', areaServed: 'Worldwide', provider: { '@id': seo.origin + '/#store' }, url: base.url }, orgLd(seo)] }
  if (path === '/custom') return { ...base, ...page, ld: [{ '@type': 'Service', name: 'Custom jewelry design', serviceType: 'Custom jewelry', areaServed: 'Worldwide', provider: { '@id': seo.origin + '/#store' }, url: base.url }, orgLd(seo)] }
  return { ...base, ...(page || { title: seo.siteName }) }
}

/** The JSON-LD graph for a route as one string. */
export const ldJson = (m) => (m.ld && m.ld.length ? JSON.stringify({ '@context': 'https://schema.org', '@graph': m.ld }).replace(/</g, '\\u003c') : '')
