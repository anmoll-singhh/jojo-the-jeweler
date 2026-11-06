import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
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
import { Monogram } from '../components/Logo'
import { getLenis, reduced } from '../lib/motion'
import gsap from 'gsap'

/** Text that rises line by line from behind a mask (motion.ts animates `.ln > span`). */
/* lines are blocks; the space between them keeps the heading's text (for search and screen readers) as words */
export const Lines = ({ lines, d = 0 }: { lines: React.ReactNode[]; d?: number }) => <>{lines.map((l, i) => <Fragment key={i}>{i > 0 && ' '}<span className="ln" data-d={d + i * 0.1}><span>{l}</span></span></Fragment>)}</>

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

/* 1 · Hero: the street door of the store. The page waits at a Diamond District security entrance:
   granite, brass number, steel-framed glass with the store lit behind it, and an intercom. Only the
   buzzer lets you in: the lock clicks, the doors swing open onto the piece, the headline rises.
   Once per session; skipped for reduced motion and automated browsers. */
const BUZZED = 'jojo-buzzed'
function Hero() {
  const p = PIECES[0]
  const skip = typeof window === 'undefined' || reduced() || navigator.webdriver || (() => { try { return sessionStorage.getItem(BUZZED) === '1' } catch { return false } })()
  const [gate, setGate] = useState<'shut' | 'buzz' | 'open' | 'gone'>(skip ? 'gone' : 'shut')
  const open = () => {
    if (gate !== 'shut') return
    try { sessionStorage.setItem(BUZZED, '1') } catch { /* private mode */ }
    navigator.vibrate?.([20, 60, 20])
    document.documentElement.classList.add('gate-anim')
    setGate('buzz')                                   // LED turns green, the lock clicks
    setTimeout(() => setGate('open'), 650)            // doors swing in
    setTimeout(() => { setGate('gone'); document.documentElement.classList.remove('gate-anim') }, 650 + 1900)
    gsap.fromTo('.hero .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 1.45 })
    gsap.fromTo('.hero .rv', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 1.75 })
  }
  // the film waits, paused on its first frame, until you're through the doors (nothing plays unseen behind them)
  useEffect(() => {
    const v = document.querySelector<HTMLVideoElement>('.hero__media video'); if (!v) return
    if (gate === 'gone') { v.play().catch(() => {}); return }
    v.pause(); const hold = () => v.pause(); v.addEventListener('play', hold); return () => v.removeEventListener('play', hold)
  }, [gate])
  useEffect(() => {
    if (gate !== 'shut') return
    // the page holds still until someone buzzes; there is no other way in
    document.documentElement.classList.add('doors-shut')
    const hold = () => getLenis()?.stop()
    hold(); const t = setTimeout(hold, 50), t2 = setTimeout(hold, 400) // smooth scroll may start after this
    const block = (e: Event) => e.preventDefault()
    const keys = (e: KeyboardEvent) => { if ((e.target as HTMLElement).closest?.('button, a, input')) return; if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) e.preventDefault() }
    addEventListener('wheel', block, { passive: false }); addEventListener('touchmove', block, { passive: false }); addEventListener('keydown', keys)
    return () => {
      clearTimeout(t); clearTimeout(t2)
      removeEventListener('wheel', block); removeEventListener('touchmove', block); removeEventListener('keydown', keys)
      document.documentElement.classList.remove('doors-shut'); getLenis()?.start(); scrollTo(0, 0)
    }
  }, [gate])
  return (
    <section className={'hero hero--' + gate}>
      <div className="hero__media"><Video priority mp4={p.mp4} webm={p.webm} hd={p.hd} poster={p.poster} label={p.title} /></div>
      <div className="hero__txt wrap">
        <h1 className="display"><Lines lines={['Done the', 'JoJo way']} /></h1>
        <p className="lede rv" data-d="0.3">Custom pieces, Miami Cuban chains and watches from 3 W 47th Street, New York. Shipped worldwide.</p>
        <div className="hero__cta rv" data-d="0.4"><Link className="btn btn--lg" to="/collections/chains">Shop chains</Link><Link className="link" to="/custom">Start a custom piece</Link></div>
      </div>
      <p className="hero__cap rv" data-d="0.6">Custom R money-bag pendant, iced rose gold</p>
      {gate !== 'gone' && (
        <div className="gate" aria-hidden={gate !== 'shut'}>
          {(['wide', 'tall'] as const).map((k) => (
            <div key={k} className={'gate__photo gate__photo--' + k}>
              <img className="gate__base" src={`/media/gate/${k}.webp`} alt="" fetchPriority="high" />
              <img className="gate__leaf gate__leaf--l" src={`/media/gate/${k}-l.webp`} alt="" />
              <img className="gate__leaf gate__leaf--r" src={`/media/gate/${k}-r.webp`} alt="" />
              <p className="gate__sign"><Monogram size={40} /><span>JoJo The Jeweler</span></p>
              <span className="gate__glow" />
              <button className="gate__buzz" onClick={open} aria-label="Press the buzzer to enter the store"><i /></button>
            </div>
          ))}
          <p className="gate__hint"><span>{gate === 'shut' ? 'Press the buzzer to come in' : 'Come in'}</span></p>
        </div>
      )}
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
              <div className="stage"><Video mp4={p.mp4} webm={p.webm} hd={p.hd} poster={p.poster} label={p.title} /></div>
              <figcaption><b>{p.title}</b><span>{p.line}</span></figcaption>
            </figure>))}
        </div>
      </div>
    </section>
  )
}

/* 4 · Weigh it: gold is sold by weight on 47th Street. Pick the chain and it drops onto the scale;
   the display counts the grams and the price rolls up. */
const SCALE_METALS: [string, string][] = [['Yellow gold', 'yellow'], ['White gold', 'white'], ['Rose gold', 'rose']]
function Roll({ v, fmt }: { v: number; fmt: (n: number) => string }) {
  const [n, setN] = useState(v); const from = useRef(v)
  useEffect(() => {
    if (reduced()) { setN(v); from.current = v; return }
    const a = from.current, t0 = performance.now(); let r = 0
    const step = (t: number) => { const k = Math.min(1, (t - t0) / 650), e = 1 - (1 - k) ** 3; setN(a + (v - a) * e); if (k < 1) r = requestAnimationFrame(step); else from.current = v }
    r = requestAnimationFrame(step); return () => cancelAnimationFrame(r)
  }, [v])
  return <>{fmt(n)}</>
}
function CubanBuilder() {
  const p = byHandle('miami-cuban-link-chain')
  const { add } = useCart()
  const [sel, setSel] = useState(() => (p ? defaultSelection(p) : {}))
  const [drop, setDrop] = useState(0)
  const first = useRef(true)
  useEffect(() => { if (first.current) { first.current = false; return } setDrop((d) => d + 1) }, [sel])
  if (!p) return null
  const v = findVariant(p, sel)
  const width = parseInt(sel.Width || '8'), len = parseInt(sel.Length || '18')
  // Sample weight model: 48 g at 8mm × 18", scaling with the square of width and with length.
  const grams = Math.round(48 * (width / 8) ** 2 * (len / 18))
  const opt = (name: string) => p.options.find((o) => o.name === name)?.values ?? []
  const pick = (name: string, val: string) => setSel({ ...sel, [name]: val })
  const Row = ({ name }: { name: string }) => (
    <div className="weigh__opt" role="radiogroup" aria-label={name}><span>{name}</span><div>{opt(name).map((x) => <button key={x} role="radio" aria-checked={sel[name] === x} className={sel[name] === x ? 'on' : ''} onClick={() => pick(name, x)}>{x}</button>)}</div></div>
  )
  return (
    <section className="weigh screen">
      <div className="weigh__stage" aria-hidden="true">
        <div className="weigh__photo">
          <img className="weigh__img" src="/media/gate/scale.webp" alt="" loading="lazy" />
          <div className="weigh__chain" key={drop} style={{ '--s': 0.92 + (width - 8) * 0.08 } as React.CSSProperties}>
            <img {...rs(p.images[0].src, '(min-width: 56.25em) 30vw, 70vw')} style={{ filter: metalFilter(p.photoMetal, sel.Metal) }} alt="" />
          </div>
          <div className="weigh__lcd" key={'l' + drop}><Roll v={grams} fmt={(n) => n.toFixed(1)} /><small>g</small></div>
        </div>
      </div>
      <div className="weigh__ui">
        <h2 className="h2"><Lines lines={['Weigh it']} /></h2>
        <p className="rv">Gold is sold by weight on 47th Street. Build your Miami Cuban and put it on the scale.</p>
        <div className="weigh__metals" role="radiogroup" aria-label="Metal">{SCALE_METALS.map(([name, k]) => <button key={k} role="radio" aria-checked={sel.Metal === name} className={'weigh__metal weigh__metal--' + k + (sel.Metal === name ? ' on' : '')} onClick={() => pick('Metal', name)}><i />{name}</button>)}</div>
        <Row name="Karat" />
        <Row name="Width" />
        <Row name="Length" />
        <div className="weigh__out">
          <div><small>{sel.Karat} · {sel.Width} · {sel.Length}</small><b className="num"><Roll v={v.price.amount} fmt={(n) => money(Math.round(n))} /></b><small>≈ {grams} g, sample weight</small></div>
          <div className="weigh__cta">
            <AddButton lg label="Add to bag" onAdd={() => add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: p.images[0].src }, document.querySelector('.weigh__chain img') as HTMLElement)} />
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
      </div>
      <div className="proof__grid rail-m">
        {PROOF_POSTS.slice(0, 5).map((x, i) => (
          <a key={x.code} href={x.post.url} target="_blank" rel="noreferrer" className={'proof__item' + (i === 0 ? ' proof__item--big' : '')}>
            <span className="stage">{x.video ? <Video mp4={x.video.mp4} webm={x.video.webm} poster={x.img} label={x.title} /> : <img src={x.img} alt={x.title} loading="lazy" />}</span>
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
