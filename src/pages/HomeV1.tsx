import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Phone } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { Video } from '../components/Media'
import { AddButton, OptionPicker, ProductCard } from '../components/Product'
import { Carousel3D } from '../components/Carousel3D'
import { bestSellers, byHandle, collectionByHandle, defaultSelection, findVariant, inCollection, metalFilter, money, newest, products, rs } from '../data/catalog'
import { BRAND } from '../data/site'
import { PIECES, PROOF_POSTS } from '../data/content'
import { useCart } from '../lib/store'

/** Text that rises line by line from behind a mask (motion.ts animates `.ln > span`). */
export const Lines = ({ lines, d = 0 }: { lines: React.ReactNode[]; d?: number }) => <>{lines.map((l, i) => <span key={i} className="ln" data-d={d + i * 0.1}><span>{l}</span></span>)}</>

export default function HomeV1() {
  useTitle('')
  return (
    <main id="main" className="home">
      {/* Order: what it is → browse by piece → price the signature chain → the pieces → have one made → who wears it → where to buy it. Each section is sized to one screen. */}
      <Hero />
      <ShopByPiece />
      <CubanBuilder />
      <Picks />
      <CustomWork />
      <Proof />
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
        <p className="lede rv" data-d="0.3">Custom pieces, Miami Cuban chains and watches from 3 W 47th Street, New York. Shipped worldwide.</p>
        <div className="hero__cta rv" data-d="0.4"><Link className="btn btn--lg" to="/collections/chains">Shop chains</Link><Link className="link" to="/custom">Start a custom piece</Link></div>
      </div>
      <p className="hero__cap rv" data-d="0.6">Custom R money-bag pendant, iced rose gold</p>
    </section>
  )
}

/* 2 · Shop by piece: a 3D ring of the categories, each shown with a piece from it. */
function ShopByPiece() {
  const items = ['chains', 'pendants', 'bracelets', 'rings', 'earrings', 'grillz', 'watches']
    .map((h) => ({ c: collectionByHandle(h), p: inCollection(h).find((x) => x.sample) ?? inCollection(h)[0] }))
    .filter((t) => t.c && t.p)
    .map(({ c, p }) => ({ key: c!.handle, href: '/collections/' + c!.handle, title: c!.title, sub: `${c!.products.length} ${c!.products.length === 1 ? 'piece' : 'pieces'}`, img: p!.images[0].src }))
  return (
    <section className="sbp screen">
      <div className="wrap sbp__head"><h2 className="h2"><Lines lines={['Shop by piece']} /></h2><p className="muted rv">Solid gold, stamped. Natural VS diamonds on anything iced. Drag to turn.</p></div>
      <Carousel3D items={items} label="Shop by piece" />
    </section>
  )
}

/* 3 · The pieces: one rail, four ways in. */
function Picks() {
  const sets = useMemo(() => [
    ['Best sellers', bestSellers(8)],
    ['Iced out', inCollection('iced').slice(0, 8)],
    ['New', newest(8)],
    ['Under $2,500', products.filter((p) => p.variants.some((v) => v.price.amount <= 2500 && v.price.amount > 100)).slice(0, 8)],
  ] as const, [])
  const [i, setI] = useState(0)
  return (
    <section className="picks screen wrap">
      <div className="rail__head"><h2 className="h2"><Lines lines={['The pieces']} /></h2>
        <div className="tabs rv" role="tablist" aria-label="Pick a set">{sets.map(([t], k) => <button key={t} role="tab" aria-selected={i === k} onClick={() => setI(k)}>{t}</button>)}</div>
      </div>
      <div className="rail__track" key={i}>{sets[i][1].map((p, k) => <ProductCard key={p.handle} p={p} variant="rail" eager={k < 2} />)}</div>
      <Link className="link picks__all" to="/collections/all">All pieces <ArrowRight size={16} /></Link>
    </section>
  )
}

/* 5 · Custom work: intro pinned on the left while the four films slide past (desktop); a swipe rail on phone. */
function CustomWork() {
  return (
    <section className="look screen">
      <div className="look__pin">
        <div className="look__intro">
          <h2 className="h2"><Lines lines={['Custom work']} /></h2>
          <p className="lede rv">When the piece doesn’t exist yet, JoJo makes it: sketch, mold, then polish and inspection.</p>
          <Link className="btn rv" to="/custom">Start yours</Link>
        </div>
        <div className="look__track">
          {PIECES.map((p) => (
            <figure key={p.id} className="look__item">
              <div className="stage"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
              <figcaption><b>{p.title}</b><span>{p.line}</span></figcaption>
            </figure>))}
        </div>
      </div>
    </section>
  )
}

/* 4 · The live thing: price a Cuban (after browsing, before custom). */
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
    <section className="field builder screen">
      <div className="wrap builder__in">
        <div className="builder__img stage clip"><img {...rs(p.images[0].src, '(min-width: 56.25em) 40vw, 100vw')} style={{ filter: metalFilter(p.photoMetal, sel.Metal) }} alt={`${p.title} in ${sel.Metal?.toLowerCase()}`} loading="lazy" /></div>
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
        <h2 className="h2"><Lines lines={['Who wears it']} /></h2>
        <p className="lede rv">Recent custom work and the people wearing it, from JoJo’s Instagram, with his captions.</p>
      </div>
      <div className="proof__grid rail-m">
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

/* 7 · Showroom: the address as the headline. */
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
