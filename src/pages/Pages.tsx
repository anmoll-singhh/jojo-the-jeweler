import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Minus, Plus, Phone } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { ProductCard, Rail } from '../components/Product'
import { Video } from '../components/Media'
import { byHandle, money, search, bestSellers } from '../data/catalog'
import type { Product } from '../data/types'
import { BRAND, CLIENTS, FAQ, PROCESS, SAMPLE } from '../data/site'
import { LIFESTYLE, PIECES, STORE_PHOTOS, HERO_REEL } from '../data/content'
import { checkoutUrl } from '../data/shopify'
import { useCart, useWish, wish } from '../lib/store'
import { Lines } from './HomeV1'

/* ── Custom ───────────────────────────────────────────── */
export function Custom() {
  useTitle('Custom pieces')
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', piece: 'Pendant', budget: '', note: '' })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    try { localStorage.setItem('jojo-custom-inquiry', JSON.stringify({ ...f, at: new Date().toISOString() })) } catch { /* ignore */ }
    const body = `Custom inquiry from ${f.name}%0APiece: ${f.piece}%0ABudget: ${f.budget || 'open'}%0A${encodeURIComponent(f.note)}`
    location.href = BRAND.email ? `mailto:${BRAND.email}?subject=Custom%20inquiry&body=${body}` : `${BRAND.smsHref}?&body=${body}`
    setSent(true)
  }
  return (
    <main id="main" className="page custom">
      <section className="custom__top wrap" id="inquiry">
        <div className="custom__intro">
          <h1 className="h1"><Lines lines={['Custom, the', 'JoJo way']} /></h1>
          <p className="lede rv">Tell JoJo what you want made. The quote and consultation are free; he replies with a price and a sketch.</p>
          {sent ? <p className="lede custom__sent">Your message is drafted in your messaging app. Send it and JoJo gets back to you with a quote.</p> : (
            <form className="form rv-group" onSubmit={submit} aria-label="Custom inquiry">
              <label><span className="lab">Name</span><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></label>
              <label><span className="lab">Phone</span><input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" /></label>
              <label><span className="lab">What kind of piece</span><select value={f.piece} onChange={(e) => setF({ ...f, piece: e.target.value })}>{['Pendant', 'Chain', 'Ring', 'Bracelet', 'Grillz', 'Watch bust-down', 'Something else'].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label><span className="lab">Budget <span className="muted">optional</span></span><input value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} placeholder="e.g. $5,000 – $10,000" inputMode="numeric" /></label>
              <label className="form__wide"><span className="lab">The idea</span><textarea required rows={4} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Describe it, or tell us what reference you'll send" /></label>
              <button className="btn btn--lg form__wide">Send the inquiry</button>
              <p className="small muted form__wide">Rather text? Send a picture of the reference to <a className="link" href={BRAND.smsHref}>{BRAND.phone}</a>.</p>
            </form>)}
        </div>
        <figure className="custom__film">
          <div className="stage"><Video mp4={PIECES[1].mp4} webm={PIECES[1].webm} poster={PIECES[1].poster} label={PIECES[1].title} /></div>
          <figcaption className="small muted">{PIECES[1].title}: {PIECES[1].line}</figcaption>
        </figure>
      </section>
      <section className="process wrap">
        <h2 className="h2"><Lines lines={['How a custom', 'piece is made']} /></h2>
        <ol className="process__list rv-group">{PROCESS.map(([t, body], i) => <li key={t}><span className="num">{i + 1}</span><b>{t}</b><p>{body}</p></li>)}</ol>
        <p className="muted small">A 50% deposit by wire, Zelle or Cash App starts the design and development stage.</p>
      </section>
      <section className="pieces">
        <h2 className="h2 wrap pieces__h"><Lines lines={['From the bench']} /></h2>
        {PIECES.filter((_, i) => i !== 1).map((p, i) => (
          <article key={p.id} className={'piece' + (i % 2 ? ' piece--flip' : '')}>
            <div className="piece__media stage clip"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
            <div className="piece__txt"><h3 className="h3">{p.title}</h3><p>{p.line}</p></div>
          </article>))}
        <div className="wrap"><a className="btn btn--lg" href="#inquiry">Start yours</a></div>
      </section>
    </main>
  )
}

/* ── About ────────────────────────────────────────────── */
export function About() {
  useTitle('About JoJo')
  useEffect(() => { const id = location.hash.slice(1); if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400) }, [])
  return (
    <main id="main" className="page about">
      <section className="about__hero">
        <div className="about__media stage"><Video mp4={HERO_REEL.mp4} webm={HERO_REEL.webm} poster={HERO_REEL.poster} label="JoJo The Jeweler" /></div>
        <div className="about__txt wrap">
          <h1 className="h1"><Lines lines={['Meet JoJo']} /></h1>
          <p className="lede rv">JoJo The Jeweler, 3 W 47th Street, New York Diamond District. Jewelry, watches and custom pieces.</p>
        </div>
      </section>
      <section className="story">
        <div className="story__pic stage"><img className="drift" src={LIFESTYLE[0].src} alt={LIFESTYLE[0].alt} loading="lazy" /></div>
        <div className="story__txt">
          <h2 className="h2"><Lines lines={['Started at', 'fifteen']} /></h2>
          <p className="rv">JoJo started in jewelry at 15 and now works out of 3 W 47th Street in the New York Diamond District. His store calls him America’s youngest jeweler; his feed shows who wears the work.</p>
          <p className="rv">Custom pieces, Miami Cuban chains and luxury watches, sourced or bought. NYC and Miami, shipped worldwide.</p>
          <p className="rv">Every custom piece goes the same way: sketch and design, mold and production, then polish, inspection and delivery.</p>
          <Link className="btn btn--ghost rv" to="/custom">Start a custom piece</Link>
        </div>
        <div className="story__pic2 stage"><img className="drift" src={LIFESTYLE[6].src} alt={LIFESTYLE[6].alt} loading="lazy" /></div>
      </section>
      <section className="facts wrap">
        <dl className="facts__list rv-group">
          <div><dt>Started</dt><dd>At {BRAND.startedAt}</dd></div>
          <div><dt>Where</dt><dd>3 W 47th Street, NYC</dd></div>
          <div><dt>Also</dt><dd>Miami</dd></div>
          <div><dt>Instagram</dt><dd>{BRAND.followers} followers</dd></div>
          <div><dt>Worn by</dt><dd>{CLIENTS.join(', ')}</dd></div>
          <div><dt>Ships</dt><dd>Worldwide</dd></div>
        </dl>
      </section>
      <section className="gallery-s">
        {LIFESTYLE.filter((_, i) => i !== 0 && i !== 6).slice(0, 6).map((l, i) => <div key={l.src} className={'gallery-s__item stage' + (i === 0 || i === 5 ? ' gallery-s__item--wide' : '')}><img src={l.src} alt={l.alt} loading="lazy" /></div>)}
      </section>
      <section className="watches wrap" id="watches">
        <div className="watches__txt">
          <h2 className="h2"><Lines lines={['Watches,', 'both ways']} /></h2>
          <p className="rv">JoJo sources luxury watches and buys them. Bring one in or ship it: it is inspected for authenticity and condition, paperwork included, and you get a one-time offer with prompt, secure payment. Part-exchange against a piece can be considered.</p>
          <div className="rv"><Link className="btn" to="/products/watch-sourcing">Source a watch · $50 deposit</Link> <Link className="link" to="/contact">Sell a watch</Link></div>
        </div>
        <div className="watches__pic stage"><img src="/media/store/jojo-watch.webp" alt="JoJo The Jeweler watch" loading="lazy" /></div>
      </section>
      <section className="policies wrap">
        <h2 className="h2"><Lines lines={['Orders']} /></h2>
        <div className="policies__grid rv-group">
          <div id="shipping"><h3>Shipping</h3><p>{SAMPLE.shipping}</p></div>
          <div id="returns"><h3>Returns</h3><p>{SAMPLE.returns}</p></div>
          <div id="warranty"><h3>Warranty</h3><p>{SAMPLE.warranty}</p></div>
          <div id="sizing"><h3>Sizing</h3><p>Chains: 18" sits at the collarbone, 20" just below, 22" mid-chest, 24" and 26" for pendants. Bracelets: measure the wrist and add half an inch. Rings: US sizes; text a photo of a ring that fits and JoJo will size it.</p></div>
        </div>
        <p className="sample">Shipping, returns and warranty wording is sample copy for the client to confirm.</p>
      </section>
      <section className="faq wrap" id="faq">
        <h2 className="h2"><Lines lines={['Questions']} /></h2>
        <div className="faq__list rv-group">{FAQ.map(([q, a]) => <details key={q} className="acc"><summary>{q}<Plus size={16} className="acc__plus" /><Minus size={16} className="acc__minus" /></summary><div className="acc__body"><p>{a}</p></div></details>)}</div>
      </section>
    </main>
  )
}

/* ── Contact ──────────────────────────────────────────── */
export function Contact() {
  useTitle('Contact')
  const [f, setF] = useState({ name: '', phone: '', note: '' })
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const body = `${encodeURIComponent(f.note)}%0A%0A${f.name}`
    location.href = BRAND.email ? `mailto:${BRAND.email}?subject=Inquiry&body=${body}` : `${BRAND.smsHref}?&body=${body}`
    setSent(true)
  }
  return (
    <main id="main" className="page contact wrap">
      <div className="contact__grid">
        <div className="contact__txt">
          <h1 className="h1"><Lines lines={['Call or text', 'your jeweler']} /></h1>
          <a className="btn btn--lg rv" href={BRAND.smsHref}><Phone size={20} /> {BRAND.phone}</a>
          <dl className="contact__facts rv-group">
            <div><dt>Store</dt><dd>{BRAND.address[0]}<br />{BRAND.address[1]}<br /><span className="muted">{BRAND.district}</span></dd></div>
            <div><dt>Hours</dt><dd>{BRAND.hours}</dd></div>
            <div><dt>Online</dt><dd><a className="link" href={BRAND.instagram} target="_blank" rel="noreferrer">Instagram</a> · <a className="link" href={BRAND.tiktok} target="_blank" rel="noreferrer">TikTok</a> · <a className="link" href={BRAND.youtube} target="_blank" rel="noreferrer">YouTube</a></dd></div>
          </dl>
        </div>
        <div className="contact__form">
          {sent ? <p className="lede">Your message is drafted in your messaging app. Send it and JoJo replies from the store.</p> : (
            <form className="form rv-group" onSubmit={submit} aria-label="Send a message">
              <label><span className="lab">Name</span><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></label>
              <label><span className="lab">Phone</span><input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" /></label>
              <label className="form__wide"><span className="lab">Message</span><textarea required rows={5} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Selling a watch, a repair, a question about a piece" /></label>
              <button className="btn btn--lg form__wide">Send</button>
              <p className="small muted form__wide">Custom pieces have their own form. <Link className="link" to="/custom">Start a custom inquiry</Link>.</p>
            </form>)}
        </div>
      </div>
      <div className="contact__pics">{STORE_PHOTOS.slice(0, 3).map((s) => <div key={s.src} className="stage"><img src={s.src} alt={s.alt} loading="lazy" /></div>)}</div>
    </main>
  )
}

/* ── Search ───────────────────────────────────────────── */
export function SearchPage() {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || ''
  useTitle(q ? `Search: ${q}` : 'Search')
  const res = search(q, 40)
  return (
    <main id="main" className="page results wrap">
      <h1 className="h1"><Lines lines={['Search']} /></h1>
      <form className="search__bar" onSubmit={(e) => { e.preventDefault(); const v = (new FormData(e.currentTarget).get('q') as string).trim(); setSp(v ? { q: v } : {}) }}>
        <input name="q" defaultValue={q} placeholder="Search chains, pendants, rings" aria-label="Search" autoFocus />
        <button className="btn">Search</button>
      </form>
      <p className="muted results__n">{q ? `${res.length} ${res.length === 1 ? 'result' : 'results'} for “${q}”` : 'Type to search the whole collection.'}</p>
      {q && !res.length ? <div className="results__none"><p className="lede">Nothing matches “{q}”.</p><Link className="btn btn--ghost" to="/custom">Ask for a custom piece</Link></div> : <section className="grid">{res.map((p) => <ProductCard key={p.handle} p={p} />)}</section>}
      {!q && <Rail title="Start here" items={bestSellers(8)} />}
    </main>
  )
}

/* ── Cart ─────────────────────────────────────────────── */
export function Cart() {
  useTitle('Bag')
  const { lines, setQty, total, clear } = useCart()
  if (!lines.length) return <main id="main" className="page bagpage wrap"><h1 className="h1"><Lines lines={['Your bag', 'is empty']} /></h1><Link className="btn btn--lg rv" to="/collections/all">Shop all pieces</Link><Rail title="Start here" items={bestSellers(8)} /></main>
  return (
    <main id="main" className="page bagpage wrap">
      <h1 className="h1"><Lines lines={['Bag']} /></h1>
      <div className="bagpage__grid">
        <ul className="lines lines--page rv-group">{lines.map((l) => (
          <li key={l.key}>
            <Link to={'/products/' + l.handle} className="stage"><img src={l.image} alt="" /></Link>
            <div><Link to={'/products/' + l.handle}><b>{l.title}</b></Link><p className="small muted">{Object.values(l.options).join(' · ')}</p>
              <div className="qty"><button aria-label="Decrease quantity" onClick={() => setQty(l.key, l.qty - 1)}><Minus size={14} /></button><span className="num">{l.qty}</span><button aria-label="Increase quantity" onClick={() => setQty(l.key, l.qty + 1)}><Plus size={14} /></button><button className="link small" onClick={() => setQty(l.key, 0)}>Remove</button></div></div>
            <b className="num">{money(l.price * l.qty)}</b>
          </li>))}
        </ul>
        <aside className="summary rv">
          <div className="row"><span>Subtotal</span><b className="num">{money(total)}</b></div>
          <p className="small muted">{SAMPLE.shipping} Taxes and shipping are calculated at checkout.</p>
          <a className="btn btn--full btn--lg" href={checkoutUrl(lines.map((l) => ({ variantId: l.variantId, qty: l.qty })))}>Checkout</a>
          <p className="small muted">Checkout runs on Shopify. Until the store is connected, the link opens the existing JoJo store.</p>
          <button className="link small" onClick={clear}>Empty the bag</button>
        </aside>
      </div>
    </main>
  )
}

/* ── Wishlist ─────────────────────────────────────────── */
export function Wishlist() {
  useTitle('Wishlist')
  const w = useWish()
  const l = w.map(byHandle).filter((x): x is Product => !!x)
  return (
    <main id="main" className="page wishpage wrap">
      <header className="wishpage__head"><h1 className="h1"><Lines lines={['Saved']} /></h1><p className="muted rv">{l.length ? `${l.length} saved on this device.` : 'Tap the heart on any piece to keep it here.'}</p>{l.length > 0 && <button className="link small rv" onClick={() => wish.set([])}>Clear</button>}</header>
      {l.length ? <section className="grid">{l.map((p) => <ProductCard key={p.handle} p={p} />)}</section> : <Link className="btn btn--lg" to="/collections/all">Browse the collection</Link>}
      {!l.length && <Rail title="Start here" items={bestSellers(8)} />}
    </main>
  )
}

export function NotFound() {
  useTitle('Not found')
  return <main id="main" className="page nf wrap"><h1 className="h1"><Lines lines={['That page', 'isn’t here']} /></h1><p className="lede rv">The piece may have sold, or the link is old.</p><div className="rv"><Link className="btn" to="/collections/all">Shop all pieces</Link> <Link className="link" to="/">Home</Link></div></main>
}
