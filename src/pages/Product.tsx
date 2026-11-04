import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/types'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CaretDown, Heart, Ruler } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { AddButton, OptionPicker, Qty, Rail, RecentlyViewed } from '../components/Product'
import { byHandle, collectionByHandle, defaultSelection, findVariant, money, related } from '../data/catalog'
import { BRAND, SAMPLE } from '../data/site'
import { checkoutUrl } from '../data/shopify'
import { recent, useCart, useWish, wish } from '../lib/store'
import { NotFound } from './Pages'

/** Remounts per handle so every piece of state starts fresh on the next product. */
export function ProductPage() {
  const { handle } = useParams()
  const p = byHandle(handle)
  useTitle(p?.title ?? 'Not found')
  if (!p) return <NotFound />
  return <ProductView key={p.handle} p={p} />
}

function ProductView({ p }: { p: Product }) {
  const { add } = useCart()
  const w = useWish()
  const [sel, setSel] = useState<Record<string, string>>(() => defaultSelection(p))
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(0)
  const [sticky, setSticky] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  useEffect(() => { recent.push(p.handle) }, [p.handle])
  // Sticky buy bar appears once the main button has scrolled off the top.
  useEffect(() => {
    const el = document.querySelector('.buy .addbtn'); if (!el) return
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el); return () => io.disconnect()
  }, [p.handle])
  // Phone gallery: swipe-scroll with snap; keep the index in sync for the dots.
  useEffect(() => {
    const g = galleryRef.current; if (!g) return
    const f = () => setImg(Math.round(g.scrollLeft / g.clientWidth))
    g.addEventListener('scroll', f, { passive: true }); return () => g.removeEventListener('scroll', f)
  }, [p.handle])
  const v = findVariant(p, sel)
  const images = v.image ? [v.image, ...p.images.filter((i) => i.src !== v.image!.src)] : p.images
  const on = w.includes(p.handle)
  const col = collectionByHandle(p.collections[0])
  const madeToOrder = p.specs.some((s) => /lead time/i.test(s.label)) || p.tags.includes('custom')
  const toBag = () => add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: images[0].src }, stage.current, qty)
  const label = v.availableForSale ? `Add to bag · ${money(v.price.amount * qty)}` : 'Sold out'
  const show = (i: number) => { setImg(i); galleryRef.current?.scrollTo({ left: i * galleryRef.current.clientWidth, behavior: 'smooth' }) }
  return (
    <main id="main" className="page pdp">
      <div className="pdp__main">
        <div className="gallery">
          <div className="gallery__track" ref={galleryRef} tabIndex={0} aria-label="Product images">
            {images.map((im, i) => <div key={im.src} className="stage gallery__slide" ref={i === 0 ? stage : undefined} style={i === 0 ? { viewTransitionName: 'pimg' } : undefined}><img src={im.src} alt={im.alt || p.title} loading={i ? 'lazy' : 'eager'} fetchPriority={i ? 'auto' : 'high'} /></div>)}
          </div>
          {images.length > 1 && <>
            <div className="gallery__dots only-m" aria-hidden="true">{images.map((_, i) => <i key={i} className={i === img ? 'on' : ''} />)}</div>
            <div className="gallery__ui only-d"><button className="icon" aria-label="Previous image" onClick={() => show((img - 1 + images.length) % images.length)}><ArrowLeft size={20} /></button><span className="num">{img + 1} / {images.length}</span><button className="icon" aria-label="Next image" onClick={() => show((img + 1) % images.length)}><ArrowRight size={20} /></button></div>
          </>}
        </div>
        <div className="buy">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/collections/all">Shop</Link>{col && <><span>/</span><Link to={'/collections/' + col.handle}>{col.title}</Link></>}</nav>
          <h1 className="h2">{p.title}</h1>
          <p className="buy__price"><span className="num">{money(v.price.amount)}</span>{v.compareAtPrice && v.compareAtPrice.amount > v.price.amount && <s className="muted num">{money(v.compareAtPrice.amount)}</s>}<span className="muted small">{madeToOrder ? 'Made to order' : 'Ready to ship'}</span></p>
          <p className="buy__desc">{p.description}</p>
          <div className="buy__opts"><OptionPicker p={p} sel={sel} setSel={setSel} /></div>
          {p.options.some((o) => /size|length/i.test(o.name)) && <Link className="link small buy__guide" to="/about#sizing"><Ruler size={16} /> Size and length guide</Link>}
          <div className="buy__row"><Qty v={qty} set={setQty} /><AddButton lg className="buy__add" disabled={!v.availableForSale} label={label} onAdd={() => { if (!v.availableForSale) return false; toBag() }} /></div>
          <div className="buy__alt">
            <a className="btn btn--ghost" href={checkoutUrl([{ variantId: v.id, qty }])} aria-disabled={!v.availableForSale}>Buy now</a>
            <button className={'btn btn--ghost' + (on ? ' on' : '')} aria-pressed={on} onClick={() => wish.toggle(p.handle)}><Heart size={18} weight={on ? 'fill' : 'regular'} /> {on ? 'Saved' : 'Save'}</button>
          </div>
          {madeToOrder && <p className="small muted">A 50% deposit starts production. JoJo confirms the timeline once the design is approved.</p>}
          <div className="accs">
            <Acc title="Details" open><dl className="specs">{p.specs.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}{Object.entries(sel).map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl></Acc>
            <Acc title="Shipping and returns"><p>{SAMPLE.shipping}</p><p>{SAMPLE.returns}</p><p>{SAMPLE.warranty}</p></Acc>
            <Acc title="Pay and pick up"><p>Cash, card and bank transfer in store; every card and wallet at checkout online. Custom deposits by wire, Zelle or Cash App.</p><p>Pick up at {BRAND.address.join(', ')}, {BRAND.hours.toLowerCase()}. Text <a className="link" href={BRAND.smsHref}>{BRAND.phone}</a> first.</p></Acc>
          </div>
          {p.sample && <p className="sample">Sample listing. Prices, specs and photography are placeholders for the client to confirm.</p>}
        </div>
      </div>
      <Rail title="Goes with it" items={related(p, 4)} />
      <RecentlyViewed skip={p.handle} />
      <div className={'sticky' + (sticky ? ' show' : '')} aria-hidden={!sticky} inert={!sticky}>
        <img src={images[0].src} alt="" />
        <span><b>{p.title}</b><small className="muted">{Object.values(sel).join(' · ')}</small></span>
        <AddButton label={`Add · ${money(v.price.amount * qty)}`} disabled={!v.availableForSale} onAdd={() => { if (!v.availableForSale) return false; toBag() }} />
      </div>
    </main>
  )
}

function Acc({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return <details className="acc" open={open}><summary>{title}<CaretDown size={16} /></summary><div className="acc__body">{children}</div></details>
}
