import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Phone } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { Video } from '../components/Media'
import { AddButton, OptionPicker, ProductCard } from '../components/Product'
import { bestSellers, byHandle, collectionByHandle, defaultSelection, findVariant, inCollection, money, newest, products } from '../data/catalog'
import { BRAND, CLIENTS, PROCESS } from '../data/site'
import { LIFESTYLE, PIECES, PROOF_POSTS } from '../data/content'
import { useCart } from '../lib/store'

/** Text that rises line by line from behind a mask (motion.ts animates `.ln > span`). */
export const Lines = ({ lines, d = 0 }: { lines: React.ReactNode[]; d?: number }) => <>{lines.map((l, i) => <span key={i} className="ln" data-d={d + i * 0.1}><span>{l}</span></span>)}</>

export default function HomeV1() {
  useTitle('')
  return (
    <main id="main" className="home">
      <Hero />
      <Tiles />
      <Picks />
      <CustomWork />
      <CubanBuilder />
      <Proof />
      <Story />
      <Showroom />
    </main>
  )
}

/* 1 · Hero: the piece is the only light. */
function Hero() {
  const p = PIECES[0]
  return (
    <section className="hero">
      <div className="hero__media"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
      <div className="hero__txt wrap">
        <h1 className="display"><Lines lines={['Done the', 'JoJo way']} /></h1>
        <p className="lede rv" data-d="0.3">Custom pieces and solid gold chains from 3 W 47th Street, New York. Worn by Lil Baby, Young Thug and the people who get there first.</p>
        <div className="hero__cta rv" data-d="0.4"><Link className="btn btn--lg" to="/collections/chains">Shop chains</Link><Link className="link" to="/custom">Start a custom piece</Link></div>
      </div>
      <p className="hero__cap rv" data-d="0.6">{p.title}, filmed on 47th Street</p>
    </section>
  )
}

/* 2 · Shop by piece: six tiles, edge to edge. */
function Tiles() {
  const tiles = ['chains', 'pendants', 'bracelets', 'rings', 'earrings', 'grillz'].map((h) => ({ c: collectionByHandle(h)!, p: inCollection(h)[0] })).filter((t) => t.c && t.p)
  return (
    <section className="tiles-s">
      <div className="wrap tiles-s__head"><h2 className="h2"><Lines lines={['Shop by piece']} /></h2><p className="muted rv">Solid gold, stamped. Natural VS diamonds on anything iced.</p></div>
      <div className="tiles">
        {tiles.map(({ c, p }) => (
          <Link key={c.handle} to={'/collections/' + c.handle} className="tile stage">
            <img src={p.images[0].src} alt="" loading="lazy" />
            <span className="tile__t">{c.title}<small className="num">{c.products.length} {c.products.length === 1 ? 'piece' : 'pieces'}</small></span>
          </Link>))}
      </div>
    </section>
  )
}

/* 3 · Tabbed picks: one module, three intents. */
function Picks() {
  const sets = useMemo(() => [
    ['Best sellers', bestSellers(8)],
    ['Iced out', inCollection('iced').slice(0, 8)],
    ['New', newest(8)],
    ['Under $2,500', products.filter((p) => p.variants.some((v) => v.price.amount <= 2500 && v.price.amount > 100)).slice(0, 8)],
  ] as const, [])
  const [i, setI] = useState(0)
  return (
    <section className="picks wrap">
      <div className="rail__head"><h2 className="h2"><Lines lines={['Leaving 47th', 'Street most']} /></h2>
        <div className="tabs rv" role="tablist" aria-label="Pick a set">{sets.map(([t], k) => <button key={t} role="tab" aria-selected={i === k} onClick={() => setI(k)}>{t}</button>)}</div>
      </div>
      <div className="rail__track" key={i}>{sets[i][1].map((p, k) => <ProductCard key={p.handle} p={p} variant="rail" eager={k < 2} />)}</div>
      <Link className="link picks__all" to="/collections/all">All pieces <ArrowRight size={16} /></Link>
    </section>
  )
}

/* 4 · Custom work: the four real pieces as a pinned horizontal scroll on desktop, a stack on phone. */
function CustomWork() {
  return (
    <section className="look">
      <div className="look__pin">
        <div className="look__track">
          <div className="look__intro">
            <h2 className="h2"><Lines lines={['Custom work']} /></h2>
            <p className="lede rv">Four pieces that left the bench this year. Every one started as a reference on someone’s phone.</p>
            <Link className="btn rv" to="/custom">Start yours</Link>
          </div>
          {PIECES.map((p) => (
            <figure key={p.id} className="look__item">
              <div className="stage"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
              <figcaption><b>{p.title}</b><span>{p.line}</span></figcaption>
            </figure>))}
          <div className="look__end"><Link className="btn btn--ghost" to="/custom">See the process <ArrowRight size={16} /></Link></div>
        </div>
      </div>
    </section>
  )
}

/* 5 · The live thing: price a Cuban. */
function CubanBuilder() {
  const p = byHandle('miami-cuban-link-chain')
  const { add } = useCart()
  const stage = useRef<HTMLDivElement>(null)
  const [sel, setSel] = useState(() => (p ? defaultSelection(p) : {}))
  if (!p) return null
  const v = findVariant(p, sel)
  const width = parseInt(sel.Width || '8'), len = parseInt(sel.Length || '18')
  // Sample weight model: 48 g at 8mm × 18", scaling with the square of width and with length.
  const grams = Math.round(48 * (width / 8) ** 2 * (len / 18))
  return (
    <section className="field builder">
      <div className="wrap builder__in">
        <div className="builder__img stage clip"><img src={p.images[0].src} alt={p.title} loading="lazy" /></div>
        <div className="builder__ui" ref={stage}>
          <h2 className="h2"><Lines lines={['Price your', 'Cuban']} /></h2>
          <p className="rv">Pick the metal, karat, width and length. The price and the weight change as you go.</p>
          <div className="rv-group"><OptionPicker p={p} sel={sel} setSel={setSel} /></div>
          <dl className="builder__out rv">
            <div><dt>Price</dt><dd className="num">{money(v.price.amount)}</dd></div>
            <div><dt>Weight</dt><dd className="num">≈ {grams} g</dd></div>
            <div><dt>Links</dt><dd>{sel.Width} Miami Cuban</dd></div>
          </dl>
          <div className="builder__cta rv">
            <AddButton lg label={`Add to bag · ${money(v.price.amount)}`} onAdd={() => add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: p.images[0].src }, document.querySelector('.builder__img'))} />
            <Link className="link" to={'/products/' + p.handle}>Full details</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 6 · Proof: the client's own posts, with their captions as the credit. */
function Proof() {
  return (
    <section className="proof wrap">
      <div className="proof__head">
        <h2 className="h2"><Lines lines={['Worn by', 'the first']} /></h2>
        <p className="lede rv">{CLIENTS.slice(0, 4).join(', ')} and the people around them. Every picture here is from JoJo’s own feed.</p>
      </div>
      <div className="proof__grid">
        {PROOF_POSTS.slice(0, 5).map((x, i) => (
          <a key={x.code} href={x.post.url} target="_blank" rel="noreferrer" className={'proof__item' + (i === 0 ? ' proof__item--big' : '')}>
            <span className="stage"><img src={x.post.images[0].src} alt={x.title} loading="lazy" /></span>
            <span className="proof__cap"><b>{x.title}</b><small>{x.note}</small></span>
          </a>))}
      </div>
      <a className="btn btn--ghost" href={BRAND.instagram} target="_blank" rel="noreferrer">{BRAND.handle} · {BRAND.followers} <ArrowUpRight size={16} /></a>
    </section>
  )
}

/* 7 · The jeweler: facts from the client's own pages, no myth-making. */
function Story() {
  return (
    <section className="story">
      <div className="story__pic stage"><img className="drift" src={LIFESTYLE[0].src} alt={LIFESTYLE[0].alt} loading="lazy" /></div>
      <div className="story__txt">
        <h2 className="h2"><Lines lines={['Started at', 'fifteen']} /></h2>
        <p className="rv">JoJo started in jewelry at 15 and now works out of 3 W 47th Street, the block the whole industry buys from. The store calls him America’s youngest jeweler; the feed shows who wears the work.</p>
        <p className="rv">Custom pieces, Miami Cuban chains and luxury watches, sourced or bought. NYC and Miami, shipped worldwide.</p>
        <ul className="story__facts rv-group">
          {PROCESS.map(([t, body], i) => <li key={t}><b className="num">{i + 1}</b><span><b>{t}</b><br />{body}</span></li>)}
        </ul>
        <Link className="btn btn--ghost rv" to="/about">About JoJo</Link>
      </div>
      <div className="story__pic2 stage"><img className="drift" src={LIFESTYLE[6].src} alt={LIFESTYLE[6].alt} loading="lazy" /></div>
    </section>
  )
}

/* 8 · Showroom: the address as the headline. */
function Showroom() {
  return (
    <section className="room wrap">
      <h2 className="h1"><Lines lines={['3 W 47th', 'Street']} /></h2>
      <div className="room__cols rv-group">
        <div><b>New York, NY 10036</b><p className="muted">{BRAND.district}</p></div>
        <div><b>{BRAND.hours}</b><p className="muted">Walk in, or text ahead.</p></div>
        <div><a className="btn" href={BRAND.smsHref}><Phone size={18} /> Text {BRAND.phone}</a></div>
      </div>
    </section>
  )
}
