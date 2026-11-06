import { useEffect } from 'react'

/**
 * Image format fallback. Every photo ships as WebP plus a JPG (PNG when it has transparency) made by
 * scripts/fallback-images.py. Browsers without WebP (Safari 13 and older) get the JPG/PNG instead:
 * a one-off decode test runs at start-up, and if it fails every img src/srcset and video poster is
 * rewritten, now and for anything added later. Modern browsers never request the fallbacks.
 * Videos already ship WebM with an MP4 fallback in <source> order.
 */
const PNG = new Set(['/media/shopify/richard-mille-1.webp', '/media/gate/wide.webp', '/media/gate/tall.webp'])
export const fallbackOf = (u: string) => u.replace(/(\/media\/[^\s,?"']+?)\.webp/g, (_, p: string) => p + (PNG.has(p + '.webp') ? '.png' : '.jpg'))
let noWebp = false
const swap = (root: ParentNode) => {
  root.querySelectorAll<HTMLImageElement | HTMLVideoElement | HTMLSourceElement>('img[src*=".webp"], img[srcset*=".webp"], video[poster*=".webp"], source[srcset*=".webp"]').forEach((el) => {
    for (const a of ['src', 'srcset', 'poster']) { const v = el.getAttribute(a); if (v && v.includes('.webp')) el.setAttribute(a, fallbackOf(v)) }
  })
}
export function useFormatFallback() {
  useEffect(() => {
    let mo: MutationObserver | undefined
    const t = new Image()
    t.onerror = () => {
      noWebp = true; document.documentElement.classList.add('no-webp'); swap(document)
      mo = new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n instanceof Element) { swap(n); if (n.matches('img, video, source')) swap(n.parentElement ?? n) } })))
      mo.observe(document.body, { childList: true, subtree: true })
    }
    t.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
    return () => mo?.disconnect()
  }, [])
}
export const webpUnsupported = () => noWebp
