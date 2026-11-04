import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { byHandle } from '../data/catalog'

export type Line = { key: string; handle: string; variantId: string; title: string; options: Record<string, string>; price: number; image: string; qty: number }
type Cart = { lines: Line[]; add: (l: Omit<Line, 'key' | 'qty'>, from?: HTMLElement | null, qty?: number) => void; setQty: (k: string, q: number) => void; clear: () => void; open: boolean; setOpen: (b: boolean) => void; total: number; count: number }
const Ctx = createContext<Cart>(null!)
export const useCart = () => useContext(Ctx)
export const load = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || '') ?? d } catch { return d } }
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(() => load('jojo-cart', []))
  const [open, setOpen] = useState(false)
  useEffect(() => save('jojo-cart', lines), [lines])
  const add: Cart['add'] = (l, from, qty = 1) => {
    const key = l.variantId + '|' + JSON.stringify(l.options)
    const put = () => setLines((ls) => (ls.some((x) => x.key === key) ? ls.map((x) => (x.key === key ? { ...x, qty: x.qty + qty } : x)) : [...ls, { ...l, key, qty }]))
    flyToBag(from, put, () => setOpen(true))
  }
  const setQty = (k: string, q: number) => setLines((ls) => (q < 1 ? ls.filter((x) => x.key !== k) : ls.map((x) => (x.key === k ? { ...x, qty: q } : x))))
  const valid = lines.filter((l) => byHandle(l.handle))
  return <Ctx.Provider value={{ lines: valid, add, setQty, clear: () => setLines([]), open, setOpen, total: valid.reduce((s, l) => s + l.price * l.qty, 0), count: valid.reduce((s, l) => s + l.qty, 0) }}>{children}</Ctx.Provider>
}

/** Add-to-cart: the product image travels into the bag icon, the bag bumps, then the drawer opens.
 *  Reduced motion: the drawer just opens. */
export const lastAdd: { el: HTMLElement | null } = { el: null }
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off'
function flyToBag(from: HTMLElement | null | undefined, land: () => void, done: () => void) {
  const bag = document.querySelector('.nav .bag') as HTMLElement | null
  const img = (from?.tagName === 'IMG' ? from : from?.querySelector('img')) as HTMLImageElement | null
  if (!bag || !img || reduced()) { land(); return done() }
  const vis = (r: DOMRect) => r.bottom > 60 && r.top < innerHeight - 40 && r.width > 0
  let a = img.getBoundingClientRect()
  const btn = lastAdd.el
  if (btn && document.contains(btn) && !vis(a)) { const r = btn.getBoundingClientRect(); a = new DOMRect(r.left + r.width / 2 - 32, r.top + r.height / 2 - 32, 64, 64) }
  const b = bag.getBoundingClientRect()
  const c = document.createElement('img'); c.src = img.currentSrc || img.src; c.className = 'flyimg'
  Object.assign(c.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' })
  document.body.appendChild(c)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const s = 24 / a.width
  c.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.4}px,${dy * 0.4 - 80}px) scale(${(1 + s) / 1.7})`, opacity: 1, offset: 0.45 },
    { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0.4 },
  ], { duration: 760, easing: 'cubic-bezier(.76,0,.24,1)' }).onfinish = () => {
    c.remove(); land(); bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump'); setTimeout(done, 420)
  }
}

/* wishlist + recently viewed (localStorage, cross-component via a window event) */
const listStore = (key: string, max = 60) => {
  const get = (): string[] => load(key, [])
  const set = (n: string[]) => { save(key, n.slice(0, max)); dispatchEvent(new Event('jojo-list')) }
  return { get, set, toggle: (h: string) => { const l = get(); const n = l.includes(h) ? l.filter((x) => x !== h) : [h, ...l]; set(n); return n }, push: (h: string) => set([h, ...get().filter((x) => x !== h)]), remove: (h: string) => set(get().filter((x) => x !== h)) }
}
export const wish = listStore('jojo-wish'), recent = listStore('jojo-recent', 10)
function useList(store: ReturnType<typeof listStore>) {
  const [l, setL] = useState(store.get)
  useEffect(() => { const f = () => setL(store.get()); addEventListener('jojo-list', f); addEventListener('storage', f); return () => { removeEventListener('jojo-list', f); removeEventListener('storage', f) } }, [store])
  return l
}
export const useWish = () => useList(wish)
export const useRecent = () => useList(recent)
