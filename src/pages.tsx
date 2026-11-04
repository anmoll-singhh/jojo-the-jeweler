import { PencilSimpleLine, MapPin, Ruler } from '@phosphor-icons/react'
import { Acc } from './acc'
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { products, collections, byHandle, rings, minPrice, aud, cdn, tint, pf, swatch, SIZES, DEFAULT_SIZE, BRAND, readyToShip, CLIENT, SIZE_CONFIRM, SIZE_OTHER, LEAD_TIME, RTS_TIME, ABOUT, PROCESS, DOCS, FAQ, TESTIMONIALS, REVIEWS_LIVE, nice, type Product } from './data/site'
import { useCart, recent, useWish } from './store'
import { RING_ATTRS, SHAPES, SETTINGS } from './data/ring-attrs'
import { FilterBar, type FGroup } from './filters'
import { ShapeIcon, SettingIcon, MetalSwatch } from './filterIcons'
import { Page, ProductCard, EmbedSlot, Stars, Trust, Recent, Lines, Arrow, Carousel3D, Marquee, AddBtn } from './ui'

const label = (n: string) => (n === 'Color' ? 'Metal' : n === 'Carat Size' ? 'Carat' : n)
const findVariant = (p: Product, sel: string[]) => p.variants.find((v) => v.options.every((o, i) => o === sel[i])) ?? p.variants[0]
const title = (t: string) => useEffect(() => { document.title = t + ' — Double M & Co' }, [t])

/* ── HOME ─────────────────────────────────────────────── */
export function Home() {
  title('Fine jewellery, North Perth')
  // Kept at /homepage-v1 for comparison only; keep it out of search results.
  useEffect(() => { const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, nofollow'; document.head.appendChild(m); return () => m.remove() }, [])
  const sig = rings.slice(0, 10)
  const M = '/media/v6/'
  return (
    <Page className="home home6">
      <HeroSplit />

      <section className="sig wrap">
        <div className="h6head"><div><h2 className="cap">Our signature designs</h2><p className="muted">Our most loved engagement rings, in yellow, white and rose gold.</p></div><Link className="btn btn--line" to="/collections/engagement-rings">Discover all</Link></div>
        <Carousel3D items={sig} />
      </section>

      <section className="band">
        <img src={M + 'craft.webp'} alt="A jeweller sketching an engagement ring design at the bench" loading="lazy" />
        <div className="band__txt"><h2 className="cap">Build your dream ring</h2><p>Choose the shape, the carat and the gold. We make it by hand in North Perth.</p><Link className="btn btn--light" to="/build-your-ring">Start designing</Link></div>
      </section>

      <section className="styles wrap">
        <div className="h6head"><h2 className="cap">Browse by style</h2><Link className="btn btn--line only-d" to="/collections/all">Shop all jewellery</Link></div>
        <div className="styles__grid">{[['st-solitaire', 'Solitaire', '/collections/engagement-rings'], ['st-pave', 'Pavé band', '/collections/engagement-rings'], ['st-bands', 'Wedding bands', '/collections/wedding-bands'], ['st-chains', 'Chains', '/collections/chains']].map(([i, t, h]) => (
          <Link key={i} to={h} className="styles__tile"><span className="styles__img"><img src={M + i + '.webp'} alt={t} loading="lazy" /></span><span className="cap cap--xs">{t}</span></Link>))}</div>
      </section>

      <section className="rooms">
        {[['showroom', 'The North Perth showroom', 'Book a visit', '/book-appointment'], ['consult', 'Private consultations', 'Book a consultation', '/book-appointment'], ['propose', 'Ready to propose', 'Shop ready to ship', '/collections/ready-to-ship']].map(([i, t, c, h]) => (
          <Link key={i} to={h} className="rooms__tile"><img src={M + i + '.webp'} alt={t} loading="lazy" /><span className="rooms__cap"><span className="cap cap--sm">{t}</span><span className="ul">{c}</span></span></Link>))}
      </section>

      {REVIEWS_LIVE && <section className="reviews wrap">
        <div className="h6head"><h2 className="cap">Client testimonials</h2></div>
        <div className="reviews__grid">{TESTIMONIALS.map(([q, n, w]) => <figure key={n}><blockquote>{q}</blockquote><figcaption><b>{n}</b><span className="muted">{w}</span></figcaption></figure>)}</div>
      </section>}

      <section className="igs wrap" aria-label="Instagram">
        <div className="h6head"><h2 className="cap">@doublemandco</h2><a className="btn btn--line" href={BRAND.instagram} target="_blank" rel="noreferrer">Follow on Instagram</a></div>
        <div className="igs__row">{[['ig9', 'The Elongated Cushion Ring, 4ct centre in 18k gold'], ['ig1', 'Consultations in the North Perth showroom'], ['ig11', 'Stacked rings, tried on in the showroom'], ['ig3', 'Launch night at Charles Street'], ['ig7', 'Our showroom cabinets'], ['ig8', 'Details, up close']].map(([i, a]) => <a key={i} href={BRAND.instagram} target="_blank" rel="noreferrer" className="igs__i"><img src={'/media/ig/' + i + '.webp'} alt={a} loading="lazy" /></a>)}</div>
      </section>

      <section className="visitb">
        <div className="visitb__txt">
          <h2 className="cap">Visit our showroom</h2>
          <p>Try on every design, see the stones under our lights and talk it through with the person who will make your ring.</p>
          <dl className="facts"><div><dt>Address</dt><dd>{BRAND.address.join(', ')}</dd></div><div><dt>Hours</dt><dd>{BRAND.hours}</dd></div></dl>
          <div className="cta"><Link className="btn btn--light" to="/book-appointment">Book an appointment</Link><Link className="ul" to="/custom">Start a custom piece</Link></div>
        </div>
        <div className="visitb__rail">{rings.slice(10, 14).map((r) => <Link key={r.handle} to={'/products/' + r.handle} className="visitb__p"><span className="stage"><img src={cdn(r.images[0], 500)} alt={r.title} loading="lazy" /></span><b>{r.title}</b><small>from {aud(minPrice(r))}</small></Link>)}</div>
      </section>

      <section className="press wrap" aria-label="Our promise">
        {[['Lab-grown', 'D–F colour, VS1 clarity or better'], ['18k gold', 'Yellow, white and rose'], ['Made to order', 'About 3–4 weeks of production'], ['Showroom', 'Collection by arrangement']].map(([a, b]) => <div key={a}><b>{a}</b><span>{b}</span></div>)}
      </section>
    </Page>
  )
}

const HS = [
  ['/media/v6/hero-l.webp', 'An engaged couple laughing together on a sofa', 'Forever starts here', 'Discover engagement rings', '/collections/engagement-rings'],
  ['/media/v6/hero-r.webp', 'Three Double M & Co engagement rings in an oxblood velvet tray on marble', 'The signature range', 'Shop signature designs', '/collections/engagement-rings'],
  ['/media/v6/consult.webp', 'Trying on an engagement ring at a private consultation', 'Private consultations', 'Book a consultation', '/book-appointment'],
  ['/media/v6/st-chains.webp', 'An iced moissanite Cuban chain', 'Iced chains', 'Shop chains', '/collections/chains'],
]
function HeroSplit() {
  const [i, setI] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const go = (k: number) => { const el = ref.current; if (el) el.scrollTo({ left: k * el.clientWidth, behavior: 'smooth' }) }
  useEffect(() => {
    const el = ref.current!; const f = () => setI(Math.round(el.scrollLeft / el.clientWidth)); el.addEventListener('scroll', f, { passive: true })
    return () => el.removeEventListener('scroll', f)
  }, [])
  useEffect(() => { if (!matchMedia('(max-width:900px)').matches) return; const t = setTimeout(() => go((i + 1) % HS.length), 6000); return () => clearTimeout(t) }, [i])
  return (
    <section className="h6hero" aria-roledescription="carousel" aria-label="Featured">
      <div className="h6hero__track" ref={ref}>
        {HS.map(([src, alt, t, c, h], k) => (
          <Link key={src} to={h} className={'h6hero__s' + (k > 1 ? ' h6hero__x' : '')} aria-hidden={false}>
            <img src={src} alt={alt} fetchPriority={k ? 'low' : 'high'} loading={k > 1 ? 'lazy' : 'eager'} />
            <span className="h6hero__cap">{k === 0 ? <h1 className="cap">{t}</h1> : <span className="cap cap--sm">{t}</span>}<span className="ul">{c}</span></span>
          </Link>))}
      </div>
      <div className="h6hero__dots" role="tablist">{HS.map((s, k) => <button key={s[0]} role="tab" aria-selected={k === i} aria-label={'Slide ' + (k + 1)} className={k === i ? 'on' : ''} onClick={() => go(k)} />)}</div>
    </section>
  )
}

const SLIDES = [
  ['/media/hero1.webp', 'Real luxury,', 'without', 'the illusion', '70%'],
  ['/media/hero2.webp', 'Light that', 'stays', 'with you', '72%'],
  ['/media/hero3.webp', 'The question,', 'answered', 'in gold', '66%'],
  ['/media/hero4.webp', 'Made to be', 'worn', 'every day', '68%'],
]
function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (paused) return; const t = setTimeout(() => setI((x) => (x + 1) % SLIDES.length), 6500); return () => clearTimeout(t) }, [i, paused])
  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {SLIDES.map(([src, , , , pos], k) => <div key={src} className={'hero__slide' + (k === i ? ' on' : '')} aria-hidden={k !== i}><img src={src} alt="" style={{ objectPosition: pos + ' 30%' }} fetchPriority={k ? 'low' : 'high'} loading={k ? 'lazy' : 'eager'} /></div>)}
      <div className="hero__scrim" />
      <div className="hero__top meta"><span>North Perth, Western Australia</span><span className="only-d">Lab-grown diamonds · Moissanite · 18k gold</span></div>
      <h1 className="hero__h" key={i}><Lines lines={[SLIDES[i][1], <em key="e">{SLIDES[i][2]}</em>, SLIDES[i][3]]} d={0.05} /></h1>
      <div className="hero__foot">
        <div className="hero__dots" role="tablist">{SLIDES.map((s, k) => <button key={s[0]} role="tab" aria-selected={k === i} aria-label={'Slide ' + (k + 1)} className={k === i ? 'on' : ''} onClick={() => setI(k)}><i style={{ animationPlayState: paused ? 'paused' : 'running' }} /></button>)}</div>
        <div className="cta"><Link className="btn" to="/build-your-ring">Build your ring <Arrow /></Link><Link className="btn btn--line" to="/collections/engagement-rings">Shop engagement <Arrow /></Link></div>
      </div>
    </section>
  )
}

function MakeItYours() {
  const p = rings[1]
  const metals = p.options[0].values
  const [m, setM] = useState(metals[0])
  return (
    <section className="teaser wrap">
      <div className="teaser__img stage"><img src={cdn(p.images[0], 1000)} alt={p.title + ' in ' + m} loading="lazy" style={{ filter: pf(m) }} /></div>
      <div className="teaser__txt">
        <p className="meta rv">Make it yours</p>
        <h2 className="h2"><Lines lines={['Your stone.', 'Your gold.', 'Your ring.']} /></h2>
        <p className="muted rv">Design it shape by shape and see an instant price in the ring builder.</p>
        <div className="swatches rv">{metals.map((v) => <button key={v} className={'sw' + (m === v ? ' on' : '')} onClick={() => setM(v)}><i style={{ background: swatch(v) }} />{nice(v)}</button>)}</div>
        <Link className="btn rv" to="/build-your-ring">Build your ring <Arrow /></Link>
      </div>
    </section>
  )
}

export function Wishlist() {
  title('Wishlist')
  const w = useWish()
  const l = w.map(byHandle).filter(Boolean) as Product[]
  return <Page className="wrap"><header className="svc"><h1 className="display"><Lines lines={['Saved pieces']} /></h1><p className="muted">{l.length ? `${l.length} saved on this device.` : 'Tap the heart on any piece to keep it here.'}</p></header>{l.length ? <section className="grid">{l.map((p) => <ProductCard key={p.handle} p={p} />)}</section> : <Link className="btn btn--line" to="/collections/all">Browse the collection <Arrow /></Link>}</Page>
}

/* ── COLLECTION ───────────────────────────────────────── */
export function Collection() {
  const { handle = 'all' } = useParams()
  const col = collections.find((c) => c.handle === handle)
  title(col?.title ?? 'All jewellery')
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const sort = sp.get('sort') || 'featured'
  const isRings = handle === 'engagement-rings'
  const base = col ? products.filter((p) => p.collections.includes(handle)) : products
  // Filters: several values per group (comma-separated in the URL), OR within a group, AND across groups.
  const f: Record<string, string[]> = Object.fromEntries(['metal', 'shape', 'setting', 'carat'].map((k) => [k, (sp.get(k) || '').split(',').filter(Boolean)]))
  const test = (k: string, p: Product, vals: string[]) => {
    const a = RING_ATTRS[p.handle]
    if (k === 'metal') return vals.some((v) => p.options[0]?.values.includes(v))
    if (k === 'carat') return vals.some((v) => p.options.some((o) => o.name === 'Carat Size' && o.values.includes(v)))
    if (k === 'shape') return !!a?.shape && vals.includes(a.shape)
    if (k === 'setting') return vals.some((v) => (a?.settings as string[] | undefined)?.includes(v))
    return true
  }
  const passes = (p: Product, skip = '') => Object.entries(f).every(([k, vals]) => k === skip || !vals.length || test(k, p, vals))
  const count = (k: string, v: string) => base.filter((p) => passes(p, k) && test(k, p, [v])).length
  const list = useMemo(() => {
    let l = base.filter((p) => passes(p))
    if (sort === 'low') l = [...l].sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'high') l = [...l].sort((a, b) => minPrice(b) - minPrice(a))
    return l
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, sp.toString(), sort])
  const write = (n: URLSearchParams) => setSp(n, { replace: true })
  const toggle = (k: string, v: string) => { const cur = f[k]; const nx = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]; const n = new URLSearchParams(sp); nx.length ? n.set(k, nx.join(',')) : n.delete(k); write(n) }
  const clearGroup = (k: string) => { const n = new URLSearchParams(sp); n.delete(k); write(n) }
  const clearAll = () => { const n = new URLSearchParams(sp); ['metal', 'shape', 'setting', 'carat'].forEach((k) => n.delete(k)); write(n) }
  const setSort = (v: string) => { const n = new URLSearchParams(sp); v === 'featured' ? n.delete('sort') : n.set('sort', v); write(n) }
  // "Beloved" belongs to the three most-loved rings themselves, not to whichever three cards a
  // filter or sort happens to put first.
  const beloved = new Set(base.slice(0, 3).map((p) => p.handle))
  const metals = [...new Set(base.flatMap((p) => p.options[0]?.values ?? []))]
  const carats = [...new Set(base.flatMap((p) => p.options.find((o) => o.name === 'Carat Size')?.values ?? []))]
  const groups: FGroup[] = [
    ...(metals.length > 1 ? [{ key: 'metal', label: 'Metal', layout: 'list' as const, options: metals.map((m) => ({ v: m, label: m.replace(/gold/i, 'Gold'), icon: <MetalSwatch metal={m} />, n: count('metal', m) })) }] : []),
    ...(isRings ? [
      { key: 'shape', label: 'Shape', layout: 'grid' as const, options: SHAPES.map(([v, t]) => ({ v, label: t, icon: <ShapeIcon shape={v} />, n: count('shape', v) })) },
      { key: 'setting', label: 'Setting style', layout: 'grid' as const, options: SETTINGS.map(([v, t]) => ({ v, label: t, icon: <SettingIcon setting={v} />, n: count('setting', v) })) },
    ] : []),
    ...(carats.length ? [{ key: 'carat', label: 'Carat', layout: 'chips' as const, options: carats.map((c) => ({ v: c, label: c, n: count('carat', c) })) }] : []),
  ]
  const hero = base[2] ?? base[0]
  return (
    <Page className="collection">
      <header className="colband">
        <img src={BAND[handle] ?? '/media/v6/hero-r.webp'} alt="" />
        <div className="colband__txt"><h1 className="cap">{col?.title ?? 'All jewellery'}</h1><p>{intro[handle] ?? 'Every piece in the Double M & Co collection.'}</p></div>
      </header>
      {handle === 'all' && <nav className="shapes wrap" aria-label="Shop by style">{rings.slice(0, 8).map((r) => <Link key={r.handle} to={'/products/' + r.handle} className="shapes__i"><span className="stage"><img src={cdn(r.images[0], 200)} alt="" loading="lazy" /></span><span>{r.title}</span></Link>)}</nav>}
      <FilterBar groups={groups} value={f} toggle={toggle} clearGroup={clearGroup} clearAll={clearAll} total={list.length} sort={sort} setSort={setSort}
        extra={!isRings && <label className="fdrop fdrop--cat"><span className="sr-only">Category</span><select className="fdrop__btn" value={handle} onChange={(e) => nav('/collections/' + e.target.value)}>{[{ handle: 'all', title: 'All jewellery' }, ...collections].map((c) => <option key={c.handle} value={c.handle}>{c.title}</option>)}</select></label>} />
      <section className="grid wrap">{list.map((p, i) => [i === 5 && list.length > 8 && <Link key="promo" to="/build-your-ring" className="promo"><img src="/media/v6/consult.webp" alt="" loading="lazy" /><span className="promo__txt"><span className="cap cap--sm">Design your own</span><span className="ul">Build your ring</span></span></Link>, <ProductCard key={p.handle} p={p} badge={handle === 'engagement-rings' && beloved.has(p.handle) ? 'Beloved' : undefined} />])}</section>
    </Page>
  )
}
const BAND: Record<string, string> = { 'engagement-rings': '/media/v6/hero-r.webp', 'wedding-bands': '/media/v6/st-bands.webp', chains: '/media/v6/st-chains.webp', moissanite: '/media/v6/st-chains.webp', 'ready-to-ship': '/media/v6/propose.webp', all: '/media/v6/hero-l.webp' }
const intro: Record<string, string> = {
  'engagement-rings': 'Twenty-six designs, each in yellow, white or rose gold from one to four carats. Choose here, or build yours step by step.',
  'wedding-bands': 'Bands made to sit flush with your engagement ring, or to stand on their own.',
  chains: 'Iced Cuban, baguette and cluster tennis chains, finished in white, yellow or rose gold plating.',
  moissanite: 'Iced chains set with moissanite, the fire of a diamond, in 925 sterling silver. Ready to ship.',
  'ready-to-ship': 'Finished pieces, ready to leave the showroom now.',
}

/* ── PRODUCT ──────────────────────────────────────────── */
function useRingSelection(p?: Product) {
  const [sel, setSel] = useState<string[]>([])
  useEffect(() => { if (p) setSel(p.variants[0].options) }, [p?.handle])
  return [sel, setSel] as const
}

export function ProductPage() {
  const { handle } = useParams()
  const p = byHandle(handle)
  const { add } = useCart()
  const [sel, setSel] = useRingSelection(p)
  const [img, setImg] = useState(0)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [eng, setEng] = useState('')
  const [sticky, setSticky] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  title(p?.title ?? 'Not found')
  useEffect(() => { if (p) recent.push(p.handle) }, [p?.handle])
  // The sticky bar appears only once the main Add to bag button has scrolled off the top, so the
  // two are never on screen together.
  useEffect(() => {
    const el = document.querySelector('.buy .addbtn'); if (!el) return
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el); return () => io.disconnect()
  }, [p?.handle])
  // While the sticky bar shows, the footer gets room at the bottom so its last line isn't hidden.
  useEffect(() => { document.body.classList.toggle('has-sticky', sticky); return () => document.body.classList.remove('has-sticky') }, [sticky])
  if (!p) return <NotFound />
  const v = findVariant(p, sel.length ? sel : p.variants[0].options)
  const isRing = p.options.some((o) => o.name === 'Carat Size') || p.collections.includes('wedding-bands')
  const metal = sel[0]
  const toBag = () => {
    if (isRing && !size) { document.getElementById('size')?.focus(); return }
    const o: Record<string, string> = {}
    p.options.forEach((op, i) => (o[label(op.name)] = sel[i]))
    if (isRing) o.Size = size
    if (eng.trim()) o.Engraving = eng.trim()
    add({ handle: p.handle, variantId: v.id, title: p.title, options: o, price: v.price, image: v.image || p.images[0] }, stage.current)
  }
  const related = products.filter((x) => x.handle !== p.handle && x.collections[0] === p.collections[0]).slice(0, 4)
  const look = products.filter((x) => x.handle !== p.handle && !x.collections.some((c) => p.collections.includes(c))).filter((_, i) => i % 3 === 0).slice(0, 4)
  return (
    <Page className="pdp">
      <div className="pdp__main wrap">
        <div className="gallery">
          <div className="thumbs">{p.images.map((s, i) => <button key={s} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={'View image ' + (i + 1)}><img src={cdn(s, 160)} alt="" style={{ filter: pf(metal) }} /></button>)}</div>
          <div className="gallery__stage" ref={stage} style={{ viewTransitionName: 'pimg' }}><img key={img + metal} src={cdn(p.images[img] ?? p.images[0], 1400)} alt={`${p.title} in ${metal}`} style={{ filter: pf(metal) }} /></div>
          {metal && metal !== p.options[0].values[0] && /gold/i.test(metal) && <p className="muted small">Colour preview of {metal}. Photographed in {p.options[0].values[0]}.</p>}
        </div>
        <div className="buy">
          <Link to={'/collections/' + (p.collections[0] ?? 'all')} className="crumb">{collections.find((c) => c.handle === p.collections[0])?.title ?? 'Jewellery'}</Link>
          <p className="lead muted small">{readyToShip(p) ? 'Ready to ship' : 'Made to order'}</p>
          <h1 className="display cap">{p.title}</h1>
          <div className="pricerow"><p className="price">{aud(v.price)} <span className="muted small">AUD incl. GST</span></p><Stars h={p.handle} small /></div>
          <p className="desc">{p.desc}</p>
          {p.options.map((o, i) => (
            <fieldset key={o.name} className="opt"><legend>{label(o.name)}<span>{nice(sel[i])}</span></legend>
              <div className={i === 0 ? 'swatches' : 'pills'}>{o.values.map((val) => (
                <button key={val} className={(i === 0 ? 'sw' : 'pill') + (sel[i] === val ? ' on' : '')} aria-pressed={sel[i] === val} onClick={() => setSel(sel.map((s, j) => (j === i ? val : s)))}>
                  {i === 0 && <i style={{ background: swatch(val) }} />}{nice(val)}
                </button>))}</div>
            </fieldset>))}
          {isRing && <>
            <label className="opt"><span className="lab">Ring size <Link className="link" to="/pages/size-guide">Size guide</Link></span>
              <select id="size" value={size} onChange={(e) => setSize(e.target.value)} required><option value="">Select your ring size</option><option>{SIZE_CONFIRM}</option>{SIZES.map((s) => <option key={s}>{s}</option>)}<option>{SIZE_OTHER}</option></select>
              {size === DEFAULT_SIZE && <small className="opt__hint">Set to M, the most common size. Not sure? Choose “{SIZE_CONFIRM}”.</small>}</label>
            <label className="opt"><span className="lab">Engraving <span className="muted">optional, free · {eng.length}/20</span></span><input value={eng} maxLength={20} onChange={(e) => setEng(e.target.value)} placeholder="Inside the band" /></label>
          </>}
          {readyToShip(p) && <p className="stock">Ready to ship — only a few in the showroom</p>}
          <p className="eta">{readyToShip(p) ? RTS_TIME : LEAD_TIME}</p>
          <AddBtn full thumb={cdn(p.images[0], 120)} onAdd={() => { if (isRing && !size) { document.getElementById('size')?.focus(); return false } toBag() }} label={isRing && !size ? 'Select a size' : 'Add to bag · ' + aud(v.price)} />
          <div className="buy__alt">{p.options.some((o) => o.name === 'Carat Size') && <Link className="btn btn--ghost" to="/build-your-ring"><PencilSimpleLine size={16} weight="light" />Design your ring</Link>}<Link className="btn btn--ghost" to="/book-appointment"><MapPin size={16} weight="light" />Visit showroom</Link></div>
          {isRing && <div className="deposit small"><p><span>50% deposit</span><b>{aud(v.price / 2)}</b></p><p><span>Balance before collection / dispatch</span><b>{aud(v.price / 2)}</b></p><p className="muted">{CLIENT.deposit}</p></div>}
          <div className="promise"><h2 className="cap cap--xs">Our promise</h2><Trust moissanite={p.collections.includes('moissanite')} /></div>
          <div className="accs">
            {/* The three sections on every doublemco.au product page, in their words */}
            <Acc title="Product details">{(p.collections.includes('wedding-bands') ? CLIENT.bandDetails : isRing ? CLIENT.ringDetails : [p.desc, CLIENT.imagery]).map((t) => <p key={t}>{t}</p>)}</Acc>
            <Acc title="Production, delivery and collection">{CLIENT.production.map((t) => <p key={t}>{t}</p>)}</Acc>
            <Acc title="Warranty, resizing and aftercare">{CLIENT.warranty.map((t) => <p key={t}>{t}</p>)}<p><Link className="link" to="/contact">Contact our team</Link> · <Link className="link" to="/pages/care">Jewellery care</Link></p></Acc>
          </div>
        </div>
      </div>
      {related.length > 0 && <section className="rail wrap"><div className="head"><h2 className="h2">Also consider</h2></div><div className="grid">{related.map((r) => <ProductCard key={r.handle} p={r} />)}</div></section>}
      {look.length > 0 && <section className="rail wrap"><div className="head"><h2 className="h2">Complete the look</h2></div><div className="grid">{look.map((r) => <ProductCard key={r.handle} p={r} />)}</div></section>}
      <Recent skip={p.handle} />
      <div className={'sticky' + (sticky ? ' show' : '')} aria-hidden={!sticky}>
        <img src={cdn(p.images[0], 120)} alt="" style={{ filter: pf(metal) }} /><span><b>{p.title}</b><small>{sel.join(' · ')}</small></span><b className="sticky__price"><small>{p.title}</small>{aud(v.price)}</b>
        {isRing && !size ? <button className="btn" tabIndex={sticky ? 0 : -1} onClick={() => { document.getElementById('size')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(() => document.getElementById('size')?.focus(), 500) }}><Ruler size={16} weight="light" /> Choose size</button> : <AddBtn thumb={cdn(p.images[0], 120)} onAdd={() => toBag()} />}
      </div>
    </Page>
  )
}

/* ── CHECKOUT (demo) ──────────────────────────────────── */
export function Checkout() {
  title('Checkout')
  const { lines, total, clear } = useCart()
  const [done, setDone] = useState('')
  // Show the confirmation from the top, not wherever the form was scrolled to.
  useEffect(() => { if (done) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) }, [done])
  if (done) return <Page className="narrow"><h1 className="display">Thank you</h1><p>Order {done} is confirmed. A receipt is on its way to your inbox, and we will be in touch about sizing and delivery.</p><Link className="btn" to="/">Back to the store</Link></Page>
  if (!lines.length) return <Page className="narrow"><h1 className="display">Checkout</h1><p>Your bag is empty.</p><Link className="btn" to="/collections/engagement-rings">Shop engagement rings</Link></Page>
  const submit = (e: FormEvent) => { e.preventDefault(); clear(); setDone('DM-' + Math.floor(1000 + Math.random() * 9000)) }
  return (
    <Page className="checkout wrap">
      <form onSubmit={submit} className="co__form">
        <h1 className="display">Checkout</h1>
        <p className="meta">Secure checkout · Shop Pay · Apple Pay · Google Pay · PayPal · Cards</p>
        <fieldset><legend>Contact</legend><input required type="email" placeholder="Email" autoComplete="email" /><input type="tel" placeholder="Phone (for delivery)" autoComplete="tel" /></fieldset>
        <fieldset><legend>Delivery</legend><div className="two"><input required placeholder="First name" autoComplete="given-name" /><input required placeholder="Last name" autoComplete="family-name" /></div><input required placeholder="Address" autoComplete="street-address" /><div className="two"><input required placeholder="Suburb" /><input required placeholder="Postcode" inputMode="numeric" /></div>
          <label className="check"><input type="radio" name="ship" defaultChecked /> Delivery</label><label className="check"><input type="radio" name="ship" /> Showroom collection (by arrangement)</label><p className="muted small">{CLIENT.shipping}</p></fieldset>
        <fieldset><legend>Payment</legend><div className="paym"><label className="check"><input type="radio" name="pay" defaultChecked /> Credit or debit card</label><label className="check"><input type="radio" name="pay" /> Shop Pay</label><label className="check"><input type="radio" name="pay" /> PayPal</label><label className="check"><input type="radio" name="pay" /> Apple Pay</label><label className="check"><input type="radio" name="pay" /> Google Pay</label></div></fieldset>
        <button className="btn btn--full">Place order — {aud(total)}</button>
      </form>
      <aside className="co__sum"><h2 className="h3">Order summary</h2>
        <ul className="lines">{lines.map((l) => <li key={l.key}><img src={cdn(l.image, 160)} alt="" style={{ filter: pf(l.options.Metal || l.options.Plating) }} /><div><b>{l.title} × {l.qty}</b><small>{Object.values(l.options).join(' · ')}</small></div><b>{aud(l.price * l.qty)}</b></li>)}</ul>
        <div className="row"><span>Delivery</span><span>Confirmed before dispatch</span></div><div className="row total"><span>Total</span><b>{aud(total)}</b></div><p className="muted small">Includes GST of {aud(total / 11)}</p>
      </aside>
    </Page>
  )
}

/* ── SERVICES ─────────────────────────────────────────── */
export function Appointment() {
  title('Book an appointment')
  return (
    <Page className="service">
      <section className="split"><div className="clip"><img src="/media/showroom.webp" alt="" /></div><div><h1 className="display">Book an appointment</h1><p>Request a private appointment at our North Perth showroom for engagement and wedding rings, custom jewellery, or a viewing. Appointments are confirmed by our team.</p>
        <dl className="facts"><div><dt>Where</dt><dd>{BRAND.address.join(', ')} · <a className="link" href={BRAND.maps} target="_blank" rel="noreferrer">Directions</a></dd></div><div><dt>When</dt><dd>{BRAND.hours}</dd></div><div><dt>Parking</dt><dd>{BRAND.parking}</dd></div></dl></div></section>
      <div className="wrap"><EmbedSlot id="crm-calendar" title="Appointment calendar" body="Our booking calendar will appear here: choose consultation type, date and time, and receive instant confirmation." height={680} /></div>
      <p className="wrap muted center">You can also request a time by email: <a className="link" href={`mailto:${BRAND.email}?subject=Appointment request`}>{BRAND.email}</a></p>
    </Page>
  )
}

/* ── INFO ─────────────────────────────────────────────── */
export function About() {
  title('About')
  return (
    <Page className="about">
      <section className="split"><div className="clip"><picture><source srcSet="/media/ig/stills/our-story.webp" type="image/webp" /><img src="/media/ig/stills/our-story.jpg" alt="A consultation beneath the Double M & Co Fine Jewellers sign in the North Perth showroom" /></picture></div><div><h1 className="display">{ABOUT[0]}</h1></div></section>
      <div className="prose wrap">{ABOUT.slice(1).map((t) => <p key={t} className={t.length < 80 ? 'display big' : ''}>{t}</p>)}<div className="cta"><Link className="btn" to="/book-appointment">Visit the showroom</Link><Link className="btn btn--ghost" to="/collections/all">Shop the collection</Link></div></div>
    </Page>
  )
}
export function Faq() {
  title('FAQ')
  return <Page className="narrow"><h1 className="display">Questions</h1><div className="accs">{FAQ.map(([q, a]) => <Acc key={q} title={q}><p>{a}</p></Acc>)}</div><p className="muted">Anything else? <Link className="link" to="/contact">Contact us</Link>.</p></Page>
}
const ShowroomMap = lazy(() => import('./ShowroomMap'))

export function Contact() {
  title('Contact')
  return (
    <Page className="contact2">
      <section className="contact2__grid wrap">
        <div className="contact2__txt">
          <h1 className="display">Contact</h1>
          <dl className="facts"><div><dt>Email</dt><dd><a className="link" href={'mailto:' + BRAND.email}>{BRAND.email}</a></dd></div><div><dt>Showroom</dt><dd>{BRAND.address.join(', ')}</dd></div><div><dt>Hours</dt><dd>{BRAND.hours}</dd></div><div><dt>Parking</dt><dd>{BRAND.parking}</dd></div><div><dt>Instagram</dt><dd><a className="link" href={BRAND.instagram} target="_blank" rel="noreferrer">@doublemandco</a></dd></div></dl>
          <div className="cta"><Link className="btn" to="/book-appointment">Book an appointment</Link><Link className="btn btn--ghost" to="/custom">Custom enquiry</Link></div>
        </div>
        <Suspense fallback={<div className="smap smap--loading" />}><ShowroomMap /></Suspense>
      </section>
    </Page>
  )
}
export function Doc() {
  const { slug = '' } = useParams()
  const d = DOCS[slug]
  title(d?.title ?? 'Not found')
  if (!d) return <NotFound />
  return (
    <Page className="narrow doc"><h1 className="display">{d.title}</h1>{d.intro && <p className="lede">{d.intro}</p>}
      {(() => { const out: React.ReactNode[] = []; let ul: string[] = []
        const flush = () => { if (ul.length) out.push(<ul key={out.length}>{ul.map((x) => <li key={x}>{x}</li>)}</ul>); ul = [] }
        d.blocks.forEach((b) => { const t = b.slice(1); if (b[0] === '-') return ul.push(t); flush(); out.push(b[0] === 'h' ? <h2 key={out.length} className="h3">{t}</h2> : <p key={out.length}>{t}</p>) }); flush(); return out })()}
    </Page>
  )
}
export function NotFound() {
  const n = useNavigate()
  return <Page className="narrow"><h1 className="display">This page has moved on</h1><p>The piece or page you were looking for isn’t here.</p><div className="cta"><button className="btn" onClick={() => n('/collections/all')}>Browse the collection</button></div></Page>
}
