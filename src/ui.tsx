import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { flushSync } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Handbag, List, X, Minus, Plus, SlidersHorizontal, Heart, Star, Check, ArrowRight, ArrowLeft, Truck, Storefront, Certificate, LockSimple, Eye } from '@phosphor-icons/react'
import { products, aud, cdn, minPrice, tint, pf, BRAND, rating, REVIEWS_LIVE, nice, readyToShip, CLIENT, byHandle, SIZES, SIZE_CONFIRM, SIZE_OTHER, DEFAULT_SIZE, type Product } from './data/site'
import { useCart, useDesign, THEMES, DEFAULT_DESIGN, wish, recent, useWish, type Design } from './store'
import { lastAdd } from './store'
import { getLenis } from './motion'
import { RING_ATTRS } from './data/ring-attrs'

export const Logo = ({ className = '' }) => <img src="/media/logo.png" alt="Double M & Co" className={'logo ' + className} width={452} height={302} />

const SHOP = [
  ['Engagement rings', '/collections/engagement-rings'],
  ['Wedding bands', '/collections/wedding-bands'],
  ['Chains', '/collections/chains'],
  ['Moissanite', '/collections/moissanite'],
  ['Ready to ship', '/collections/ready-to-ship'],
]
const NAV = [['Appointments', '/book-appointment'], ['Our Story', '/about']]
/** The four JewlX tools, shown beside the logo on wider screens (and in the menu). */
const HIGHLIGHT: [string, string][] = [['Ring builder', '/build-your-ring'], ['Custom enquiry', '/custom'], ['Instant quote', '/instant-quote'], ['Sell your gold', '/sell-gold']]
/** The Custom menu: the four JewlX widgets. */
const CUSTOM: [string, string, string][] = [
  ['Custom jewellery', '/custom', 'Design a piece with us'],
  ['Instant ring quote', '/instant-quote', 'Price in minutes'],
  ['Sell your gold', '/sell-gold', "Today's metal prices"],
  ['Ring builder', '/build-your-ring', 'Design your ring'],
]

/** Text that rises line by line from behind a mask (motion.ts animates `.ln > span`). */
export const Lines = ({ lines, d = 0 }: { lines: ReactNode[]; d?: number }) => <>{lines.map((l, i) => <span key={i} className="ln" data-d={d + i * 0.1}><span>{l}</span></span>)}</>
export const Arrow = () => <ArrowRight className="arr" size={16} weight="light" aria-hidden="true" />

export function Nav() {
  const { count, setOpen } = useCart()
  const wl = useWish()
  const [menu, setMenu] = useState(false)
  const [shopM, setShopM] = useState(false)
  const [customM, setCustomM] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMenu(false); setSearch(false) }, [pathname])
  useEffect(() => { const f = () => setScrolled(scrollY > 30); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  // Lock the page behind the menu (and pause smooth scroll) so the menu itself scrolls.
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const l = getLenis(); if (l) { if (menu) l.stop(); else l.start() }
  }, [menu])
  return (
    <>
      <div className="annc"><span>Designed in Perth, WA · Showroom by appointment</span></div>
      <header className={'nav nav6' + (scrolled ? ' nav--scrolled' : '')}>
        <div className="nav__ml">
          <button className="icon" aria-label="Menu" onClick={() => setMenu(true)}><List size={22} weight="light" /></button>
          <button className="icon" aria-label="Search" onClick={() => setSearch(true)}><MagnifyingGlass size={20} weight="light" /></button>
          <nav className="nav__hl" aria-label="Design and quotes">{HIGHLIGHT.slice(0, 2).map(([t, h]) => <NavLink key={h} to={h} className="nav__a">{t}</NavLink>)}</nav>
        </div>
        <Link to="/" className="nav__logo" aria-label="Double M & Co home"><Logo /></Link>
        <div className="nav__r">
          <nav className="nav__hl" aria-label="Quotes and selling">{HIGHLIGHT.slice(2).map(([t, h]) => <NavLink key={h} to={h} className="nav__a">{t}</NavLink>)}</nav>
          <Link className="icon bag-ish" to="/wishlist" aria-label={`Wishlist, ${wl.length} saved`}><Heart size={19} weight="light" />{wl.length > 0 && <i>{wl.length}</i>}</Link>
          <button className="icon bag" aria-label={`Bag, ${count} items`} onClick={() => setOpen(true)}><Handbag size={19} weight="light" />{count > 0 && <i key={count}>{count}</i>}</button>
        </div>
      </header>
      <div className={'mmenu' + (menu ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!menu} inert={!menu} data-lenis-prevent>
        <div className="mmenu__top"><Logo /><button className="icon" aria-label="Close menu" onClick={() => setMenu(false)}><X size={22} weight="light" /></button></div>
        <nav>
          <button className="mmenu__a" aria-expanded={shopM} onClick={() => setShopM(!shopM)}>Shop {shopM ? <Minus size={18} weight="light" /> : <Plus size={18} weight="light" />}</button>
          <div className={'acc' + (shopM ? ' open' : '')} inert={!shopM}><div>{[...SHOP, ['All jewellery', '/collections/all']].map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}</div></div>
          <button className="mmenu__a" aria-expanded={customM} onClick={() => setCustomM(!customM)}>Custom {customM ? <Minus size={18} weight="light" /> : <Plus size={18} weight="light" />}</button>
          <div className={'acc' + (customM ? ' open' : '')} inert={!customM}><div>{CUSTOM.map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}</div></div>
          {[...NAV, ['Wishlist', '/wishlist'], ['Contact', '/contact']].map(([t, h]) => <Link key={h} to={h} className="mmenu__a">{t}</Link>)}
        </nav>
        <p className="meta mmenu__foot">{BRAND.address.join(', ')}<br />{BRAND.email}</p>
      </div>
      {search && <SearchOverlay close={() => setSearch(false)} />}
      <CartDrawer />
    </>
  )
}

/** Centred coverflow: active card in the middle, two symmetric neighbours each side. */
export function Carousel3D({ items }: { items: Product[] }) {
  return <Cover items={items} />
}
function Cover({ items }: { items: Product[] }) {
  const N = items.length
  const [idx, setIdx] = useState(0)
  const [qv, setQv] = useState(false)
  const x0 = useRef<number | null>(null)
  const go = (d: number) => setIdx((i) => (i + d + N) % N)
  const p = items[idx]
  return (
    <div className="cf">
      {qv && <QuickView p={p} close={() => setQv(false)} />}
      <div className="cf__stage" onPointerDown={(e) => (x0.current = e.clientX)} onPointerUp={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1) }}>
        {items.map((it, i) => { let o = i - idx; if (o > N / 2) o -= N; if (o < -N / 2) o += N; const a = Math.abs(o); return (
          <button key={it.handle} className={'cf__card' + (o === 0 ? ' cur' : '')} style={{ ['--o' as string]: o, ['--a' as string]: a, zIndex: 10 - a, opacity: a > 2 ? 0 : 1, pointerEvents: a > 2 ? 'none' : 'auto' }} tabIndex={a > 2 ? -1 : 0} aria-label={it.title} onClick={() => (o === 0 ? setQv(true) : go(o))}>
            <div className="stage"><img src={cdn(it.images[0], 600)} alt="" draggable={false} /></div>
          </button>) })}
      </div>
      <div className="cf__info" aria-live="polite"><span className="meta">{String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span><b>{p.title}</b><span>from {aud(minPrice(p))}</span></div>
      <div className="cf__ui">
        <button className="icon line" aria-label="Previous ring" onClick={() => go(-1)}><ArrowLeft size={18} weight="light" /></button>
        <button className="btn" onClick={() => setQv(true)}>Add to bag <Arrow /></button>
        <Link className="btn btn--line" to={'/products/' + p.handle}>View details</Link>
        <button className="icon line" aria-label="Next ring" onClick={() => go(1)}><ArrowRight size={18} weight="light" /></button>
      </div>
    </div>
  )
}

export const Marquee = ({ items }: { items: string[] }) => (
  <div className="marquee" aria-hidden="true"><div>{[...items, ...items, ...items, ...items].map((t, i) => <span key={i}>{t}<i /></span>)}</div></div>
)

function SearchOverlay({ close }: { close: () => void }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus(); const k = (e: KeyboardEvent) => e.key === 'Escape' && close(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [close])
  // Every word must match somewhere: name, description, collection, metal and carat options,
  // diamond shape and setting. Plurals and a few everyday words ("wedding ring") are understood.
  const res = useMemo(() => {
    const words = q.toLowerCase().split(/[^a-z0-9.]+/).filter((w) => w.length > 1).map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
    if (!words.length) return []
    const scored = products.map((p) => {
      const a = RING_ATTRS[p.handle]
      const hay = [p.title, p.desc, p.collections.join(' ').replace(/-/g, ' '), ...p.options.flatMap((o) => o.values), a?.shape ?? '', ...(a?.settings ?? []),
        p.collections.includes('wedding-bands') ? 'wedding ring band' : '', p.collections.includes('engagement-rings') ? 'engagement ring diamond' : '', p.collections.includes('chains') ? 'necklace chain' : ''].join(' ').toLowerCase()
      if (!words.every((w) => hay.includes(w))) return null
      return { p, score: words.filter((w) => p.title.toLowerCase().includes(w)).length }
    }).filter(Boolean) as { p: Product; score: number }[]
    return scored.sort((x, y) => y.score - x.score).map((x) => x.p).slice(0, 8)
  }, [q])
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search__bar">
        <MagnifyingGlass size={22} />
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jewellery" aria-label="Search" onKeyDown={(e) => e.key === 'Enter' && res[0] && nav('/products/' + res[0].handle)} />
        <button className="icon" aria-label="Close search" onClick={close}><X size={22} /></button>
      </div>
      <div className="search__res">
        {!q && <p className="muted">Try “oval”, “cuban”, “halo” or “band”.</p>}
        {q && !res.length && <p className="muted">Nothing matches “{q}”. <Link className="link" to="/custom">We can make it.</Link></p>}
        {res.map((p) => <Link key={p.handle} to={'/products/' + p.handle} className="sres"><img src={cdn(p.images[0], 160)} alt="" loading="lazy" /><span>{p.title}</span><span className="muted">from {aud(minPrice(p))}</span></Link>)}
      </div>
    </div>
  )
}

function CartDrawer() {
  const { lines, open, setOpen, setQty, total } = useCart()
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [open, setOpen])
  return (
    <div className={'drawer' + (open ? ' is-open' : '')} aria-hidden={!open}>
      <div className="drawer__scrim" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="drawer__head"><h2>Your bag</h2><button className="icon" aria-label="Close bag" onClick={() => setOpen(false)}><X size={22} /></button></div>
        {!lines.length ? (
          <div className="drawer__empty"><p>Your bag is empty.</p><Link className="btn" to="/build-your-ring" onClick={() => setOpen(false)}>Build your ring</Link></div>
        ) : (
          <>
            <p className="ship ship--note">{CLIENT.shipping}</p>
            <ul className="lines">{lines.map((l) => (
              <li key={l.key}>
                <img src={cdn(l.image, 200)} alt="" style={{ filter: pf(l.options.Metal || l.options.Color || l.options.Plating) }} />
                <div><Link to={'/products/' + l.handle} onClick={() => setOpen(false)}>{l.title}</Link>
                  <dl>{Object.entries(l.options).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{nice(v)}</dd></div>)}</dl>
                  <div className="qty"><button aria-label="Decrease" onClick={() => setQty(l.key, l.qty - 1)}><Minus size={14} /></button><span>{l.qty}</span><button aria-label="Increase" onClick={() => setQty(l.key, l.qty + 1)}><Plus size={14} /></button><button className="link" onClick={() => setQty(l.key, 0)}>Remove</button></div>
                </div>
                <b>{aud(l.price * l.qty)}</b>
              </li>))}
            </ul>
            <div className="drawer__foot">
              <div className="row"><span>Subtotal</span><b>{aud(total)}</b></div>
              <Trust compact />
              <Link className="btn btn--full" to="/checkout" onClick={() => setOpen(false)}>Checkout</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="foot foot6">
      <div className="foot__top">
        {/* The real Double M & Co logo from doublemco.au, white for the dark footer. */}
        <Link to="/" className="foot__logolink" aria-label="Double M & Co home" onClick={() => { if (location.pathname === '/') { const l = getLenis(); if (l) l.scrollTo(0); else scrollTo({ top: 0, behavior: 'smooth' }) } }}>
          <picture className="foot__logo foot__logo--real">
            <source srcSet="/media/brand/logo-white.webp" type="image/webp" />
            <img src="/media/brand/logo-white.png" alt="" width={900} height={613} loading="lazy" />
          </picture>
        </Link>
        <div><h3>Showroom</h3><p>{BRAND.address[0]}<br />{BRAND.address[1]}</p><p className="muted">{BRAND.hours}</p></div>
        <div><h3>Shop</h3>{[['Engagement rings', '/collections/engagement-rings'], ['Wedding bands', '/collections/wedding-bands'], ['Chains', '/collections/chains'], ['Moissanite', '/collections/moissanite'], ['Ready to ship', '/collections/ready-to-ship']].map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}</div>
        <div><h3>Services</h3>{[['Custom jewellery', '/custom'], ['Instant ring quote', '/instant-quote'], ['Sell your gold', '/sell-gold'], ['Ring builder', '/build-your-ring'], ['Book an appointment', '/book-appointment']].map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}</div>
        <div><h3>Help</h3>{[['About', '/about'], ['FAQ', '/faq'], ['Ring size guide', '/pages/size-guide'], ['Care', '/pages/care'], ['Production & delivery', '/pages/shipping'], ['Warranty & resizing', '/pages/returns'], ['Contact', '/contact']].map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}</div>
      </div>
      {/* The same payment marks as the doublemco.au footer (copied from its page source). */}
      <ul className="foot__pay" aria-label="Payment options">{[['visa', 'Visa'], ['mastercard', 'Mastercard'], ['amex', 'American Express'], ['apple-pay', 'Apple Pay'], ['google-pay', 'Google Pay'], ['paypal', 'PayPal'], ['shop-pay', 'Shop Pay'], ['unionpay', 'Union Pay']].map(([f, n]) => <li key={f}><img src={`/media/payments/${f}.svg`} alt={n} width={38} height={24} loading="lazy" /></li>)}</ul>
      <div className="foot__base"><span>© 2026 Double M and Co</span><a href={'mailto:' + BRAND.email}>{BRAND.email}</a><a href={BRAND.instagram} target="_blank" rel="noreferrer">Instagram</a><Link to="/pages/privacy">Privacy policy</Link></div>
      <a className="foot__waves" href="https://wavesmvmnt.com" target="_blank" rel="noopener noreferrer">Built by WAVES</a>
    </footer>
  )
}

/** Shared-element glide: the card image morphs into the PDP image (View Transitions API, fallback: normal nav). */
function glide(e: React.MouseEvent, to: string, nav: (to: string) => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  if (!d.startViewTransition || e.metaKey || e.ctrlKey || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  e.preventDefault()
  const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLElement
  img.style.viewTransitionName = 'pimg'
  document.documentElement.classList.add('vt')
  const t = d.startViewTransition(() => { flushSync(() => nav(to)); window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) })
  t.finished.finally(() => document.documentElement.classList.remove('vt'))
}

export function ProductCard({ p, badge }: { p: Product; badge?: string }) {
  const nav = useNavigate()
  const metals = p.options[0]?.values ?? []
  const [m, setM] = useState<string>()
  const [qv, setQv] = useState(false)
  const w = useWish()
  const on = w.includes(p.handle)
  return (
    <article className="card">
      <div className="card__media">
      <div className="card__img">
        <Link to={'/products/' + p.handle} aria-label={p.title} className="card__frame" onClick={(e) => glide(e, '/products/' + p.handle, nav)}>
          <img src={cdn(p.images[0], 700)} alt={p.title} loading="lazy" style={{ filter: pf(m) }} />
          {p.images[1] && <img className="card__alt" src={cdn(p.images[1], 700)} alt="" loading="lazy" style={{ filter: pf(m) }} />}
        </Link>
        {(badge || readyToShip(p)) && <span className="tag">{badge || 'Ready to ship'}</span>}
        <button className={'heart' + (on ? ' on' : '')} aria-pressed={on} aria-label={(on ? 'Remove ' : 'Save ') + p.title} onClick={() => wish.toggle(p.handle)}><Heart size={18} weight={on ? 'fill' : 'regular'} /></button>
      </div>
        <div className="card__acts"><button className="qv" onClick={() => setQv(true)} aria-label={'Quick view ' + p.title}><Eye size={16} weight="light" /></button><QuickAdd p={p} onNeedOptions={() => setQv(true)} /></div>
      </div>
      <div className="card__meta">
        <Link to={'/products/' + p.handle}><h3>{p.title}</h3></Link>
        <span>from {aud(minPrice(p))}</span>
      </div>
      <Stars h={p.handle} small />
      {metals.length > 1 && <div className="dots" role="group" aria-label="Preview metal">{metals.map((v) => <button key={v} className={'dot' + (m === v ? ' on' : '')} style={{ ['--c' as string]: swatchOf(v) }} aria-label={nice(v)} onMouseEnter={() => setM(v)} onFocus={() => setM(v)} onClick={() => setM(v)} />)}</div>}
      {qv && <QuickView p={p} close={() => setQv(false)} />}
    </article>
  )
}

/** Add-to-bag with bag icon: icon drops into the bag, label reads "Added to bag", resets after 2.5s. */
export function AddBtn({ onAdd, label = 'Add to bag', full, className = '', thumb }: { onAdd: () => void | false; label?: string; full?: boolean; className?: string; thumb?: string }) {
  const [done, setDone] = useState(false)
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 2500); return () => clearTimeout(t) }, [done])
  return (
    <button className={'btn addbtn' + (full ? ' btn--full' : '') + (done ? ' is-added' : '') + ' ' + className} onClick={(e) => { if (done) return; lastAdd.el = e.currentTarget; if (onAdd() !== false) setDone(true) }} aria-live="polite">
      <span className="addbtn__ic" aria-hidden="true"><Handbag size={17} weight="light" />{thumb ? <img className="addbtn__thumb" src={thumb} alt="" /> : <i className="addbtn__drop" />}</span>
      <span>{done ? 'Added to bag' : label}</span>{done && <Check className="addbtn__ok" size={15} weight="bold" aria-hidden="true" />}
    </button>
  )
}

export function Stars({ h, small }: { h: string; small?: boolean }) {
  if (!REVIEWS_LIVE) return null
  const r = rating(h)
  return <span className={'stars' + (small ? ' small' : '')}><span aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={small ? 12 : 14} weight="fill" />)}</span><span>{r.stars.toFixed(1)} · {r.count} reviews</span></span>
}

/** Stone line uses the wording on doublemco.au: ring pages say "Lab-grown diamond · D–F colour ·
 *  VS1 clarity or better"; the chains are "925 sterling silver with moissanite". The bag (compact)
 *  can hold either, so it leaves the stone line out. */
export function Trust({ compact, moissanite }: { compact?: boolean; moissanite?: boolean }) {
  const stone = moissanite ? '925 sterling silver with moissanite' : 'Lab-grown diamond · D–F colour · VS1 clarity or better'
  const t = ([[Storefront, 'Showroom collection is available by arrangement'], ...(compact ? [] : [[Certificate, stone]]), [LockSimple, 'Secure Shopify checkout']] as const) as readonly (readonly [typeof Storefront, string])[]
  return <ul className={'trust' + (compact ? ' compact' : '')}>{t.map(([I, l]) => <li key={l}><I size={18} />{l}</li>)}</ul>
}

function QuickAdd({ p, onNeedOptions }: { p: Product; onNeedOptions: () => void }) {
  const { add } = useCart()
  const ref = useRef<HTMLSpanElement>(null)
  const needs = p.options.some((o) => o.name === 'Carat Size') || p.collections.includes('wedding-bands') || p.variants.length > 1
  if (needs) return <button className="btn qadd" onClick={onNeedOptions}><Handbag size={16} weight="light" /> Choose options</button>
  return <span ref={ref} className="qadd-wrap"><AddBtn className="qadd" onAdd={() => { const v = p.variants[0]; add({ handle: p.handle, variantId: v.id, title: p.title, options: Object.fromEntries(p.options.map((o, i) => [o.name === 'Color' ? 'Metal' : o.name, v.options[i]])), price: v.price, image: p.images[0] }, ref.current?.closest('.card')?.querySelector('.card__frame') as HTMLElement) }} /></span>
}

export function QuickView({ p, close }: { p: Product; close: () => void }) {
  const { add } = useCart()
  const [sel, setSel] = useState(p.variants[0].options)
  const v = p.variants.find((x) => x.options.every((o, i) => o === sel[i])) ?? p.variants[0]
  const ref = useRef<HTMLDivElement>(null)
  const isRing = p.options.some((o) => o.name === 'Carat Size') || p.collections.includes('wedding-bands')
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [shut, setShut] = useState(false)
  const bye = () => { setShut(true); setTimeout(close, 320) }
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && bye(); addEventListener('keydown', k); document.body.style.overflow = 'hidden'; return () => { removeEventListener('keydown', k); document.body.style.overflow = '' } }, [])
  const lab = (n: string) => (n === 'Color' ? 'Metal' : n === 'Carat Size' ? 'Carat' : n)
  return createPortal(
    <div className={'qvx' + (shut ? ' out' : '')} role="dialog" aria-modal="true" aria-label={'Options for ' + p.title}>
      <div className="qvx__scrim" onClick={bye} />
      <aside className="qvx__panel">
        <div className="qvx__grab" aria-hidden="true" />
        <button className="icon qvx__x" aria-label="Close" onClick={bye}><X size={20} weight="light" /></button>
        <div className="qvx__img stage" ref={ref}><img src={cdn(p.images[0], 900)} alt={p.title} style={{ filter: pf(sel[0]) }} /></div>
        <div className="qvx__body">
          <div className="qvx__head"><h2>{p.title}</h2><Stars h={p.handle} small /></div>
          <p className="qvx__price">{aud(v.price)}</p>
          {p.options.map((o, i) => (
            <fieldset key={o.name} className="qvx__opt"><legend>{lab(o.name)} <span>{nice(sel[i])}</span></legend>
              <div className="chips">{o.values.map((val) => <button key={val} className={'chip' + (sel[i] === val ? ' on' : '')} aria-pressed={sel[i] === val} onClick={() => setSel(sel.map((s, j) => (j === i ? val : s)))}>{i === 0 && /gold|plat/i.test(val) && <i style={{ background: swatchOf(val) }} />}{val.replace(' Plated', '').replace('gold', 'Gold')}</button>)}</div>
            </fieldset>))}
          {isRing && <label className="qvx__opt"><span className="qvx__lab">Ring size <Link className="link" to="/pages/size-guide" onClick={close}>Size guide</Link></span><select value={size} onChange={(e) => setSize(e.target.value)}><option value="">Select your ring size</option><option>{SIZE_CONFIRM}</option>{SIZES.map((x) => <option key={x}>{x}</option>)}<option>{SIZE_OTHER}</option></select></label>}
        </div>
        <div className="qvx__foot">
          <AddBtn full label={isRing && !size ? 'Select a size' : 'Add to bag · ' + aud(v.price)} onAdd={() => { if (isRing && !size) return false; add({ handle: p.handle, variantId: v.id, title: p.title, options: { ...Object.fromEntries(p.options.map((o, i) => [lab(o.name), sel[i]])), ...(isRing ? { Size: size } : {}) }, price: v.price, image: p.images[0] }, ref.current); setTimeout(bye, 1400) }} />
          <Link className="btn btn--text" to={'/products/' + p.handle} onClick={close}>Full details <Arrow /></Link>
        </div>
      </aside>
    </div>, document.body)
}

export function Recent({ skip }: { skip?: string }) {
  const l = recent.get().filter((h) => h !== skip).map(byHandle).filter(Boolean) as Product[]
  if (!l.length) return null
  return <section className="rail wrap"><div className="head"><h2 className="h2">Recently viewed</h2></div><div className="rail__track">{l.slice(0, 6).map((p) => <ProductCard key={p.handle} p={p} />)}</div></section>
}
import { swatch as swatchOf } from './data/site'

export const Page = ({ children, className = '' }: { children: ReactNode; className?: string }) => <main id="main" className={'page ' + className}>{children}</main>

/** Modular embed slot: pass `src` (iframe) or `script` later; until then shows a designed placeholder. */
export function EmbedSlot({ id, title, body, src, height = 640 }: { id: string; title: string; body: string; src?: string; height?: number }) {
  return (
    <section className="slot" id={id} data-embed={id} style={{ minHeight: height }}>
      {src ? <iframe src={src} title={title} loading="lazy" style={{ height }} /> : (
        <div className="slot__ph"><span className="slot__tag">Integration slot · {id}</span><h3>{title}</h3><p>{body}</p></div>
      )}
    </section>
  )
}

const FONTS = [['theme', 'Theme pairing', 'var(--fd)'], ['cormorant', 'Cormorant Garamond', "'Cormorant Garamond'"], ['bodoni', 'Bodoni Moda', "'Bodoni Moda'"], ['playfair', 'Playfair Display', "'Playfair Display'"], ['gilda', 'Gilda Display', "'Gilda Display'"], ['italiana', 'Italiana', "'Italiana'"]] as const
/* ── Design controller (preview only) ───────────────────── */
export function DesignController() {
  const [d, set] = useDesign()
  const [open, setOpen] = useState(false)
  const T = <K extends keyof Design>(k: K, label: string, opts: [Design[K], string][]) => (
    <fieldset><legend>{label}</legend><div className="seg">{opts.map(([v, t]) => <button key={v} className={d[k] === v ? 'on' : ''} onClick={() => set({ [k]: v } as Partial<Design>)}>{t}</button>)}</div></fieldset>
  )
  return (
    <div className={'dc' + (open ? ' open' : '')}>
      <button className="dc__fab" onClick={() => setOpen(!open)} aria-expanded={open}><SlidersHorizontal size={18} /> Design</button>
      {open && (
        // data-lenis-prevent: the smooth-scroll library otherwise swallows wheel and trackpad
        // scrolling over the panel and scrolls the page behind it instead (Safari, Firefox, Chrome).
        <div className="dc__panel" role="dialog" aria-label="Design controller" data-lenis-prevent>
          <fieldset><legend>Theme</legend>{THEMES.map((t) => (
            <button key={t.id} className={'dc__theme' + (d.theme === t.id ? ' on' : '')} onClick={() => set({ theme: t.id, font: 'font' in t ? (t as { font: string }).font : d.font === 'theme' ? 'cormorant' : d.font })}>
              <span className="dc__sw">{t.sw.map((c) => <i key={c} style={{ background: c }} />)}</span><span><b>{t.name}</b><small>{t.note}</small></span>
            </button>))}
          </fieldset>
          <fieldset><legend>Typeface</legend>{FONTS.map(([id, n, f]) => <button key={id} className={'dc__font' + (d.font === id ? ' on' : '')} onClick={() => set({ font: id })} style={{ fontFamily: f }}>{n}<small>Aa — Real luxury</small></button>)}</fieldset>
          <button className="link" onClick={() => set(DEFAULT_DESIGN)}>Reset</button>
        </div>
      )}
    </div>
  )
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return
    const el = ref.current!
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0
    const mv = (e: PointerEvent) => { x = e.clientX; y = e.clientY; el.classList.add('on'); el.classList.toggle('big', !!(e.target as HTMLElement).closest?.('a,button,.c3d__stage,select,input')) }
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; el.style.transform = `translate(${cx}px,${cy}px)`; raf = requestAnimationFrame(loop) }
    addEventListener('pointermove', mv); loop()
    return () => { removeEventListener('pointermove', mv); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="cursor" aria-hidden="true" />
}
