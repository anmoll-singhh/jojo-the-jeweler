import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import seo from '../data/seo.json'
import faq from '../data/faq.json'
import catalog from '../data/catalog.json'
import { ldJson, metaFor, type SeoConfig } from './seo-core.js'

const set = (sel: string, make: () => HTMLElement, attr: string, val?: string) => {
  let el = document.head.querySelector<HTMLElement>(sel)
  if (!val) { el?.remove(); return }
  if (!el) { el = make(); document.head.appendChild(el) }
  el.setAttribute(attr, val)
}
const meta = (name: string, val?: string) => set(`meta[name="${name}"]`, () => { const e = document.createElement('meta'); e.setAttribute('name', name); return e }, 'content', val)

/**
 * Head for the current route: title, description, canonical, robots, Open Graph, Twitter and JSON-LD.
 * The same data writes static <head>s per route at build time (scripts/seo-pages.mjs).
 * `t` is a fallback title for routes without their own entry (e.g. search results).
 */
export function useTitle(t: string) {
  const { pathname } = useLocation()
  useEffect(() => {
    const m = metaFor(seo as SeoConfig, pathname.replace(/\/$/, '') || '/', { catalog, faq: faq as [string, string][] })
    const title = m.title && !(t && /Not found/.test(t)) ? m.title : t ? `${t} | JoJo The Jeweler` : seo.siteName
    document.title = title
    meta('description', m.description)
    meta('robots', m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    set('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', m.noindex ? undefined : m.url)
    const og: [string, string | undefined][] = [['og:title', title], ['og:description', m.description], ['og:url', m.url], ['og:image', m.image], ['og:type', m.type === 'product' ? 'product' : 'website']]
    og.forEach(([k, v]) => set(`meta[property="${k}"]`, () => { const e = document.createElement('meta'); e.setAttribute('property', k); return e }, 'content', v))
    meta('twitter:title', title); meta('twitter:description', m.description); meta('twitter:image', m.image)
    let ld = document.getElementById('ld-page') as HTMLScriptElement | null
    const json = ldJson(m)
    if (!json) ld?.remove()
    else { if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-page'; document.head.appendChild(ld) } ld.textContent = json }
  }, [t, pathname])
}
