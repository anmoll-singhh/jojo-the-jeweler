import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { byHandle } from './data/site'

export type Line = { key: string; handle: string; variantId: number; title: string; options: Record<string, string>; price: number; image: string; qty: number }
type Cart = { lines: Line[]; add: (l: Omit<Line, 'key' | 'qty'>, from?: HTMLElement | null) => void; setQty: (k: string, q: number) => void; clear: () => void; open: boolean; setOpen: (b: boolean) => void; total: number; count: number }
const Ctx = createContext<Cart>(null!)
export const useCart = () => useContext(Ctx)
export const load = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || '') ?? d } catch { return d } }

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(() => load('dmc-cart', []))
  const [open, setOpen] = useState(false)
  useEffect(() => localStorage.setItem('dmc-cart', JSON.stringify(lines)), [lines])
  const add: Cart['add'] = (l, from) => {
    const key = l.variantId + '|' + JSON.stringify(l.options)
    const put = () => setLines((ls) => (ls.some((x) => x.key === key) ? ls.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)) : [...ls, { ...l, key, qty: 1 }]))
    flyToBag(from, put, () => { if (innerWidth > 900) setOpen(true) })
  }
  const setQty = (k: string, q: number) => setLines((ls) => (q < 1 ? ls.filter((x) => x.key !== k) : ls.map((x) => (x.key === k ? { ...x, qty: q } : x))))
  const valid = lines.filter((l) => byHandle(l.handle))
  return <Ctx.Provider value={{ lines: valid, add, setQty, clear: () => setLines([]), open, setOpen, total: valid.reduce((s, l) => s + l.price * l.qty, 0), count: valid.reduce((s, l) => s + l.qty, 0) }}>{children}</Ctx.Provider>
}

/* ── Design controller state ───────────────────────────── */
export const THEMES = [
  { id: 'ivory', name: 'Editorial Ivory', note: 'Warm ivory, thin serif, golden light', sw: ['#f4efe6', '#1b1813', '#b08a52'] },
  { id: 'mono', name: 'Monochrome', note: 'Black and white, like the logo', sw: ['#ffffff', '#000000', '#8a8a8a'] },
  { id: 'noir', name: 'Noir', note: 'Cinematic dark, champagne gold', sw: ['#0e0d0c', '#c9a96a', '#efe9df'] },
  { id: 'sand', name: 'Sand', note: 'Deeper sand, bronze accent', sw: ['#e9dfcf', '#7d5f33', '#1d1a16'] },
  { id: 'oxblood', name: 'Oxblood', note: 'Ivory with deep wine', sw: ['#f3ece4', '#4a1219', '#2a0f12'] },
  { id: 'green', name: 'Atelier Green', note: 'Forest green and cream, light serif', sw: ['#f4efe9', '#236339', '#253e2b'], font: 'theme' },
  { id: 'charcoal', name: 'Gallery Charcoal', note: 'Charcoal and stone, tracked serif caps', sw: ['#f5f3ee', '#212121', '#e9e6df'], font: 'theme' },
  { id: 'house', name: 'Oxblood House', note: 'Deep oxblood, cream and sand', sw: ['#f1ede5', '#280501', '#d0cabe'], font: 'theme' },
] as const
export type Design = { theme: string; grid: '3' | '4'; hero: 'full' | 'split'; card: 'framed' | 'bare'; motion: 'on' | 'off'; caps: 'on' | 'off'; font: string; carousel: 'cover' | 'rail' }
const DEF: Design = { theme: 'mono', grid: '4', hero: 'full', card: 'framed', motion: 'on', caps: 'on', font: 'cormorant', carousel: 'rail' }
const DCtx = createContext<[Design, (d: Partial<Design>) => void]>(null!)
export const useDesign = () => useContext(DCtx)
export function DesignProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Design>(() => ({ ...DEF, ...load('dmc-design6', {}) }))
  useEffect(() => {
    localStorage.setItem('dmc-design6', JSON.stringify(d))
    const r = document.documentElement
    r.classList.add('theming')
    Object.entries(d).forEach(([k, v]) => r.setAttribute('data-' + k, v))
    const t = setTimeout(() => r.classList.remove('theming'), 700)
    return () => clearTimeout(t)
  }, [d])
  return <DCtx.Provider value={[d, (p) => setD((x) => ({ ...x, ...p }))]}>{children}</DCtx.Provider>
}
export const DEFAULT_DESIGN = DEF

/** Image flies to the bag icon, bag bumps, then the drawer opens. Skipped for reduced motion. */
export const lastAdd: { el: HTMLElement | null } = { el: null }
function flyToBag(from: HTMLElement | null | undefined, land: () => void, done: () => void) {
  const bag = document.querySelector('.nav .bag') as HTMLElement | null
  const img = (from?.tagName === 'IMG' ? from : from?.querySelector('img')) as HTMLImageElement | null
  if (!bag || !img || document.documentElement.dataset.motion === 'off') { land(); return done() }
  const vis = (r: DOMRect) => r.bottom > 60 && r.top < innerHeight - 40 && r.width > 0
  let a = img.getBoundingClientRect()
  const btn = lastAdd.el
  if (btn && document.contains(btn) && (!vis(a) || innerWidth <= 900)) { const r = btn.getBoundingClientRect(); a = new DOMRect(r.left + r.width / 2 - 32, r.top + r.height / 2 - 32, 64, 64) }
  const b = bag.getBoundingClientRect()
  const c = document.createElement('img'); c.src = img.currentSrc || img.src; c.className = 'flyimg'
  Object.assign(c.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' })
  document.body.appendChild(c)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const s = 22 / a.width
  setTimeout(() => {
    c.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.35}px,${dy * 0.35 - 90}px) scale(${(1 + s) / 1.6})`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0.5 },
    ], { duration: 800, easing: 'cubic-bezier(.45,0,.25,1)' }).onfinish = () => {
      c.remove(); land(); bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump'); setTimeout(done, 500)
    }
  }, 380)
}

/* wishlist + recently viewed (localStorage) */
const listStore = (key: string, max = 50) => {
  const get = (): string[] => load(key, [])
  return { get, toggle: (h: string) => { const l = get(); const n = l.includes(h) ? l.filter((x) => x !== h) : [h, ...l]; localStorage.setItem(key, JSON.stringify(n.slice(0, max))); dispatchEvent(new Event('dmc-list')); return n },
    push: (h: string) => localStorage.setItem(key, JSON.stringify([h, ...get().filter((x) => x !== h)].slice(0, max))) }
}
export const wish = listStore('dmc-wish'), recent = listStore('dmc-recent', 8)
export function useWish() {
  const [l, setL] = useState(wish.get)
  useEffect(() => { const f = () => setL(wish.get()); addEventListener('dmc-list', f); return () => removeEventListener('dmc-list', f) }, [])
  return l
}
