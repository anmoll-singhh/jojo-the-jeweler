import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Handbag, Heart, X, Plus } from '@phosphor-icons/react'
import type { Product } from '../data/types'
import { chosenMetal, defaultSelection, findVariant, fromPrice, isMetalOption, metalFilter, metalSwatch, money, onSale, valueAvailable, byHandle, rs } from '../data/catalog'
import { SAMPLE_REVIEWS, rating } from '../data/reviews'
import { Stars } from './Stars'
import { lastAdd, useCart, useRecent, useWish, wish } from '../lib/store'

/* ── Product card ─────────────────────────────────────────── */
export function ProductCard({ p, eager = false, variant = 'grid' }: { p: Product; eager?: boolean; variant?: 'grid' | 'rail' | 'wide' }) {
  const nav = useNavigate()
  const w = useWish()
  const on = w.includes(p.handle)
  const [qv, setQv] = useState(false)
  const metal = p.options.find((o) => isMetalOption(o.name))
  const v0 = p.variants[0]
  // metal dots preview the colour on the card photo (hover on desktop, tap on touch)
  const [m, setM] = useState<string>()
  const tint = metalFilter(p.photoMetal, m)
  return (
    <article className={'card card--' + variant}>
      <div className="card__media stage">
        <Link to={'/products/' + p.handle} aria-label={p.title} className="card__frame" onClick={(e) => glide(e, '/products/' + p.handle, nav)}>
          <img {...rs(p.images[0].src)} style={{ filter: tint }} alt={p.images[0].alt} loading={eager ? 'eager' : 'lazy'} />
          {p.images[1] && <img className="card__alt" {...rs(p.images[1].src)} style={{ filter: tint }} alt="" loading="lazy" />}
        </Link>
        {onSale(p) && <span className="card__tag">Sale</span>}
        <button className={'heart' + (on ? ' on' : '')} aria-pressed={on} aria-label={(on ? 'Remove from wishlist: ' : 'Save to wishlist: ') + p.title} onClick={() => wish.toggle(p.handle)}><Heart size={18} weight={on ? 'fill' : 'regular'} /></button>
        <button className="card__quick" onClick={() => setQv(true)} aria-label={'Quick add ' + p.title}><Plus size={16} /> Quick add</button>
      </div>
      <div className="card__meta">
        <Link to={'/products/' + p.handle}><h3>{p.title}</h3></Link>
        <p className="num">{fromPrice(p)}{v0.compareAtPrice && v0.compareAtPrice.amount > v0.price.amount && <s className="muted"> {money(v0.compareAtPrice.amount)}</s>}</p>
        {SAMPLE_REVIEWS && <span className="card__stars"><Stars value={rating(p).stars} size={12} /><span className="num">{rating(p).stars.toFixed(1)}</span></span>}
        {metal && metal.values.length > 1 && <span className="dots" role="group" aria-label={'Preview ' + p.title + ' in'} onPointerLeave={(e) => e.pointerType === 'mouse' && setM(undefined)}>{metal.values.slice(0, 4).map((v) => <button key={v} className={'dot' + (m === v ? ' on' : '')} style={{ ['--c' as string]: metalSwatch(v) }} aria-label={v} aria-pressed={m === v} onPointerEnter={(e) => e.pointerType === 'mouse' && setM(v)} onFocus={() => setM(v)} onClick={() => setM(v)} />)}</span>}
      </div>
      {qv && <QuickView p={p} close={() => setQv(false)} />}
    </article>
  )
}

/** Shared-element glide: the card image morphs into the PDP image (View Transitions API; otherwise a normal navigation). */
function glide(e: React.MouseEvent, to: string, nav: (to: string) => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  if (!d.startViewTransition || e.metaKey || e.ctrlKey || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  e.preventDefault()
  const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement
  img.style.viewTransitionName = 'pimg'
  const t = d.startViewTransition(() => { flushSync(() => nav(to)); window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) })
  t.finished.finally(() => { img.style.viewTransitionName = '' })
}

/* ── Add-to-bag button: bag icon, "Added" state ───────────── */
export function AddButton({ onAdd, label = 'Add to bag', full, lg, className = '', disabled }: { onAdd: () => void | false; label?: string; full?: boolean; lg?: boolean; className?: string; disabled?: boolean }) {
  const [done, setDone] = useState(false)
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 2200); return () => clearTimeout(t) }, [done])
  return (
    <button className={'btn addbtn' + (full ? ' btn--full' : '') + (lg ? ' btn--lg' : '') + (done ? ' is-added' : '') + ' ' + className} disabled={disabled} onClick={(e) => { if (done) return; lastAdd.el = e.currentTarget; if (onAdd() !== false) setDone(true) }} aria-live="polite">
      <span className="addbtn__ic" aria-hidden="true">{done ? <Check size={18} weight="bold" /> : <Handbag size={18} />}</span>
      <span>{done ? 'Added to bag' : label}</span>
    </button>
  )
}

/* ── Option pickers (shared by PDP + quick view) ──────────── */
export function OptionPicker({ p, sel, setSel }: { p: Product; sel: Record<string, string>; setSel: (s: Record<string, string>) => void }) {
  return (
    <>{p.options.map((o) => (
      <fieldset key={o.name} className="opt">
        <legend><span>{o.name}</span><span className="muted">{sel[o.name]}</span></legend>
        <div className={isMetalOption(o.name) ? 'swatches' : 'pills'} role="radiogroup" aria-label={o.name}>
          {o.values.map((val) => {
            const ok = valueAvailable(p, sel, o.name, val)
            return <button key={val} role="radio" aria-checked={sel[o.name] === val} className={(isMetalOption(o.name) ? 'sw' : 'pill') + (sel[o.name] === val ? ' on' : '') + (ok ? '' : ' off')} onClick={() => setSel({ ...sel, [o.name]: val })} title={ok ? val : val + ' (sold out)'}>
              {isMetalOption(o.name) && <i style={{ background: metalSwatch(val) }} />}{val}
            </button>
          })}
        </div>
      </fieldset>))}</>
  )
}

export function Qty({ v, set }: { v: number; set: (n: number) => void }) {
  return <div className="qty qty--big" role="group" aria-label="Quantity"><button type="button" aria-label="Decrease" onClick={() => set(Math.max(1, v - 1))}>−</button><span className="num" aria-live="polite">{v}</span><button type="button" aria-label="Increase" onClick={() => set(Math.min(10, v + 1))}>+</button></div>
}

/* ── Quick view: side sheet (desktop) / bottom sheet (phone) ── */
export function QuickView({ p, close }: { p: Product; close: () => void }) {
  const { add } = useCart()
  const [sel, setSel] = useState(() => defaultSelection(p))
  const [qty, setQty] = useState(1)
  const v = findVariant(p, sel)
  const ref = useRef<HTMLDivElement>(null)
  const [shut, setShut] = useState(false)
  const bye = () => { setShut(true); setTimeout(close, 300) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && bye(); addEventListener('keydown', k); document.body.style.overflow = 'hidden'; return () => { removeEventListener('keydown', k); document.body.style.overflow = '' } }, [])
  const img = v.image?.src || p.images[0].src
  const tint = metalFilter(p.photoMetal, chosenMetal(p, sel))
  return createPortal(
    <div className={'qv' + (shut ? ' out' : '')} role="dialog" aria-modal="true" aria-label={'Options for ' + p.title}>
      <div className="qv__scrim" onClick={bye} />
      <aside className="qv__panel" data-lenis-prevent>
        <button className="icon qv__x" aria-label="Close" onClick={bye}><X size={22} /></button>
        <div className="qv__img stage" ref={ref}><img {...rs(img, '(min-width: 56.25em) 30rem, 100vw')} style={{ filter: tint }} alt={p.title} /></div>
        <div className="qv__body">
          <h2 className="h3">{p.title}</h2>
          <p className="qv__price num">{money(v.price.amount)}{v.compareAtPrice && <s className="muted"> {money(v.compareAtPrice.amount)}</s>}</p>
          <OptionPicker p={p} sel={sel} setSel={setSel} />
          <Qty v={qty} set={setQty} />
        </div>
        <div className="qv__foot">
          <AddButton full lg disabled={!v.availableForSale} label={v.availableForSale ? `Add to bag · ${money(v.price.amount * qty)}` : 'Sold out'} onAdd={() => { add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: img }, ref.current, qty); setTimeout(bye, 900) }} />
          <Link className="link small" to={'/products/' + p.handle} onClick={close}>Full details</Link>
        </div>
      </aside>
    </div>, document.body)
}

/* ── Rails ─────────────────────────────────────────────────── */
export function Rail({ title, items, action, children }: { title: ReactNode; items: Product[]; action?: ReactNode; children?: ReactNode }) {
  if (!items.length) return null
  return (
    <section className="rail wrap">
      <div className="rail__head"><h2 className="h2">{title}</h2>{action}</div>
      {children}
      <div className="rail__track">{items.map((p) => <ProductCard key={p.handle} p={p} variant="rail" />)}</div>
    </section>
  )
}
export function RecentlyViewed({ skip }: { skip?: string }) {
  const r = useRecent()
  const items = r.filter((h) => h !== skip).map(byHandle).filter((x): x is Product => !!x).slice(0, 8)
  return <Rail title="Recently viewed" items={items} />
}
