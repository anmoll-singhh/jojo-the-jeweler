import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/types'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CaretDown, Heart, Ruler } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { getLenis } from '../lib/motion'
import { AddButton, OptionPicker, Qty, Rail, RecentlyViewed } from '../components/Product'
import { byHandle, chosenMetal, collectionByHandle, defaultSelection, findVariant, metalFilter, money, related, rs } from '../data/catalog'
import { SAMPLE_REVIEWS, rating, reviewsFor } from '../data/reviews'
import { Accordion } from '../components/Accordion'
import { Stars } from '../components/Stars'
import { BRAND, SAMPLE, SIZING } from '../data/site'
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
  const metal = chosenMetal(p, sel)
  const tint = metalFilter(p.photoMetal, metal)
  const previewing = tint !== 'none'
  const images = v.image ? [v.image, ...p.images.filter((i) => i.src !== v.image!.src)] : p.images
  const on = w.includes(p.handle)
  const col = collectionByHandle(p.collections[0])
  const madeToOrder = p.specs.some((s) => /lead time/i.test(s.label)) || p.tags.includes('custom')
  const navigate = useNavigate()
  const guide = useRef<HTMLDialogElement>(null)
  const buyNow = () => { add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: images[0].src }, null, qty, true); navigate('/checkout') }
  const toBag = () => add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: images[0].src }, stage.current?.querySelector('img') ?? stage.current, qty)
  const label = v.availableForSale ? `Add to bag · ${money(v.price.amount * qty)}` : 'Sold out'
  const show = (i: number) => {
    setImg(i); const g = galleryRef.current; if (!g) return
    // phone: the gallery is a sideways swipe; desktop: the photos stack, so move down the column
    if (g.scrollWidth > g.clientWidth + 4) g.scrollTo({ left: i * g.clientWidth, behavior: 'smooth' })
    else { const el = g.children[i] as HTMLElement | undefined; if (el) { const y = el.getBoundingClientRect().top + scrollY - 80; const l = getLenis(); if (l) l.scrollTo(y); else scrollTo({ top: y, behavior: 'smooth' }) } }
  }
  return (
    <main id="main" className="page pdp">
      <div className="pdp__main">
        <div className="gallery">
          <div className="gallery__track" ref={galleryRef} tabIndex={0} aria-label="Product images">
            {images.map((im, i) => <div key={im.src} className="stage gallery__slide" ref={i === 0 ? stage : undefined} style={i === 0 ? { viewTransitionName: 'pimg' } : undefined}><img {...rs(im.src, '(min-width: 56.25em) 58vw, 100vw')} style={{ filter: tint }} alt={im.alt || p.title} loading={i ? 'lazy' : 'eager'} fetchPriority={i ? 'auto' : 'high'} /></div>)}
          </div>
          {previewing && <p className="gallery__note small">Colour preview of {metal?.toLowerCase()}. Photographed in {p.photoMetal?.toLowerCase()}.</p>}
          {images.length > 1 && <>
            <div className="gallery__dots only-m" aria-hidden="true">{images.map((_, i) => <i key={i} className={i === img ? 'on' : ''} />)}</div>
            <div className="gallery__ui only-d"><button className="icon" aria-label="Previous image" onClick={() => show((img - 1 + images.length) % images.length)}><ArrowLeft size={20} /></button><span className="num">{img + 1} / {images.length}</span><button className="icon" aria-label="Next image" onClick={() => show((img + 1) % images.length)}><ArrowRight size={20} /></button></div>
          </>}
        </div>
        <div className="buy">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/collections/all">Shop</Link>{col && <><span>/</span><Link to={'/collections/' + col.handle}>{col.title}</Link></>}</nav>
          <h1 className="h2">{p.title}</h1>
          {SAMPLE_REVIEWS && <a className="buy__stars" href="#reviews"><Stars value={rating(p).stars} /><span className="num">{rating(p).stars.toFixed(1)}</span><span className="muted">{rating(p).count} reviews · sample</span></a>}
          <p className="buy__price"><span className="num">{money(v.price.amount)}</span>{v.compareAtPrice && v.compareAtPrice.amount > v.price.amount && <s className="muted num">{money(v.compareAtPrice.amount)}</s>}<span className="muted small">{madeToOrder ? 'Made to order' : 'Ready to ship'}</span></p>
          <p className="buy__desc">{p.description}</p>
          <div className="buy__opts"><OptionPicker p={p} sel={sel} setSel={setSel} /></div>
          {p.options.some((o) => /size|length/i.test(o.name)) && <button type="button" className="link small buy__guide" onClick={() => guide.current?.showModal()}><Ruler size={16} /> Size and length guide</button>}
          <div className="buy__row"><Qty v={qty} set={setQty} /><AddButton lg className="buy__add" disabled={!v.availableForSale} label={label} onAdd={() => { if (!v.availableForSale) return false; toBag() }} /></div>
          <div className="buy__alt">
            <button className="btn btn--ghost" disabled={!v.availableForSale} onClick={buyNow}>Buy now</button>
            <button className={'btn btn--ghost' + (on ? ' on' : '')} aria-pressed={on} onClick={() => wish.toggle(p.handle)}><Heart size={18} weight={on ? 'fill' : 'regular'} /> {on ? 'Saved' : 'Save'}</button>
          </div>
          {madeToOrder && <p className="small muted">A 50% deposit starts production. JoJo confirms the timeline once the design is approved.</p>}
          <h2 className="sr-only">Details, shipping and payment</h2>
          <div className="accs">
            <Acc title="Details" open><dl className="specs">{p.specs.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}{Object.entries(sel).map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}</dl></Acc>
            <Acc title="Shipping and returns"><p>{SAMPLE.shipping}</p><p>{SAMPLE.returns}</p><p>{SAMPLE.warranty}</p></Acc>
            <Acc title="Pay and pick up"><p>Cash, card and bank transfer in store; every card and wallet at checkout online. Custom deposits by wire, Zelle or Cash App.</p><p>Pick up at {BRAND.address.join(', ')}, {BRAND.hours.toLowerCase()}. Text <a className="link" href={BRAND.smsHref}>{BRAND.phone}</a> first.</p></Acc>
          </div>
          {p.sample && <p className="sample">Sample listing: the photo, price and details are examples until JoJo’s full catalog is connected.</p>}
        </div>
      </div>
      {SAMPLE_REVIEWS && <Reviews p={p} />}
      <Rail title="Goes with it" items={related(p, 4)} />
      <RecentlyViewed skip={p.handle} />
      <dialog ref={guide} className="sheet-dlg" aria-labelledby="size-h" onClick={(e) => { if (e.target === e.currentTarget) guide.current?.close() }}>
        <div className="sheet-dlg__in">
          <h2 id="size-h" className="h3">Size and length</h2>
          {SIZING.map((t) => <p key={t}>{t}</p>)}
          <p className="small muted">Not sure? Text JoJo a photo of a piece that fits: <a className="link" href={BRAND.smsHref}>{BRAND.phone}</a>.</p>
          <button type="button" className="btn" onClick={() => guide.current?.close()} autoFocus>Done</button>
        </div>
      </dialog>
      <div className={'sticky' + (sticky ? ' show' : '')} aria-hidden={!sticky} inert={!sticky}>
        <img {...rs(images[0].src, '4rem')} style={{ filter: tint }} alt="" />
        <span><b>{p.title}</b><small className="muted">{Object.values(sel).join(' · ')}</small></span>
        <AddButton label={`Add · ${money(v.price.amount * qty)}`} disabled={!v.availableForSale} onAdd={() => { if (!v.availableForSale) return false; toBag() }} />
      </div>
    </main>
  )
}

function Acc({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return <Accordion title={title} open={open}>{children}</Accordion>
}

/** Sample reviews, labelled as such (see src/data/reviews.ts). */
function Reviews({ p }: { p: Product }) {
  const r = rating(p)
  const list = reviewsFor(p)
  return (
    <section className="reviews wrap" id="reviews" aria-labelledby="reviews-h">
      <div className="reviews__head">
        <h2 className="h2" id="reviews-h">Reviews</h2>
        <p className="reviews__score"><span className="num">{r.stars.toFixed(1)}</span><Stars value={r.stars} size={20} /><span className="muted">{r.count} reviews</span></p>
        <p className="sample">Sample reviews for layout only. Real reviews appear here once a Shopify reviews app is connected.</p>
      </div>
      <ul className="reviews__list rv-group">
        {list.map((x) => <li key={x.title}><Stars value={x.stars} size={14} /><b>{x.title}</b><p>{x.body}</p><small className="muted">{x.name} · {x.when}</small></li>)}
      </ul>
    </section>
  )
}
