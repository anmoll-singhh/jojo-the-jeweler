import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTitle } from '../App'
import { Video } from '../components/Media'
import { AddButton, ProductCard } from '../components/Product'
import { bestSellers, byHandle, findVariant, money } from '../data/catalog'
import { BRAND, CLIENTS } from '../data/site'
import { LIFESTYLE, PIECES, PROOF_POSTS } from '../data/content'
import { reduced } from '../lib/motion'
import { useCart } from '../lib/store'
import { Lines } from './HomeV1'
import type { Metal } from '../components/Chain3D'

const Chain3D = lazy(() => import('../components/Chain3D'))
gsap.registerPlugin(ScrollTrigger)

/**
 * V2: the film version. Chapters, not sections. The monogram opens like a shutter onto the piece,
 * the chain is a physical thing you drag, and the four real pieces run full-screen.
 */
export default function HomeV2() {
  useTitle('The film')
  return (
    <main id="main" className="home v2">
      <Opening />
      <WidthWall />
      <Chain />
      <Films />
      <Index />
      <ShopRail />
      <Close />
    </main>
  )
}

/* 0 · Opening: the mark is a shutter. Scroll scales the mask until the film fills the screen. */
function Opening() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = root.current!
    if (reduced()) { el.classList.add('v2-open--done'); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=160%', pin: true, scrub: 0.6, anticipatePin: 1 } })
      tl.fromTo(el, { '--m': '34vmin' }, { '--m': '440vmax', duration: 1, ease: 'power2.in' }, 0)
        .fromTo('.v2-open__word', { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 0.35 }, 0.2)
        .fromTo('.v2-open__h', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7)
    }, el)
    return () => ctx.revert()
  }, [])
  const p = PIECES[0]
  return (
    <section ref={root} className="v2-open">
      <div className="v2-open__film"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
      <div className="v2-open__word" aria-hidden="true">JoJo</div>
      <div className="v2-open__h wrap">
        <h1 className="display">Done the JoJo way</h1>
        <p className="lede">Custom pieces and solid gold chains from 3 W 47th Street, New York.</p>
        <div className="v2-open__cta"><Link className="btn btn--lg" to="/collections/all">Shop the pieces</Link><Link className="link" to="/">Back to the storefront</Link></div>
      </div>
    </section>
  )
}

/* 1 · Width wall: a pinned horizontal walk from 8mm to 15mm; the number is the headline. */
function WidthWall() {
  const p = byHandle('miami-cuban-link-chain')
  if (!p) return null
  const widths = p.options.find((o) => o.name === 'Width')?.values ?? []
  const base = { Metal: 'Yellow gold', Karat: '14K', Length: '22"' }
  return (
    <section className="v2-wall look">
      <div className="look__pin">
        <div className="look__track">
          <div className="v2-wall__intro"><h2 className="h2"><Lines lines={['The chain,', 'by the millimetre']} /></h2><p className="lede rv">Same links, same clasp. Only the width and the weight change. 14K yellow, 22 inches.</p></div>
          {widths.map((w, i) => {
            const v = findVariant(p, { ...base, Width: w })
            const grams = Math.round(48 * (parseInt(w) / 8) ** 2 * (22 / 18))
            return (
              <article key={w} className="v2-stop" style={{ ['--s' as string]: 0.62 + i * 0.13 }}>
                <div className="v2-stop__img"><img src={p.images[0].src} alt="" loading="lazy" /></div>
                <div className="v2-stop__num" aria-hidden="true">{w}</div>
                <div className="v2-stop__meta"><b className="num">{money(v.price.amount)}</b><span className="num">≈ {grams} g</span><Link className="link" to={`/products/${p.handle}`}>{w} Cuban</Link></div>
              </article>)
          })}
          <div className="v2-wall__end"><Link className="btn" to="/products/miami-cuban-link-chain">Price yours</Link></div>
        </div>
      </div>
    </section>
  )
}

/* 2 · The chain you can turn. */
function Chain() {
  const p = byHandle('miami-cuban-link-chain')
  const { add } = useCart()
  const [metal, setMetal] = useState<Metal>('yellow')
  const [width, setWidth] = useState('12mm')
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const io = new IntersectionObserver(([e]) => e.isIntersecting && setReady(true), { rootMargin: '400px' }); if (ref.current) io.observe(ref.current); return () => io.disconnect() }, [])
  if (!p) return null
  const metalName = { yellow: 'Yellow gold', white: 'White gold', rose: 'Rose gold' }[metal]
  const sel = { Metal: metalName, Karat: '14K', Width: width, Length: '22"' }
  const v = findVariant(p, sel)
  return (
    <section className="v2-chain" ref={ref}>
      <div className="v2-chain__stage">{ready && <Suspense fallback={null}><Chain3D metal={metal} width={parseInt(width)} /></Suspense>}</div>
      <div className="v2-chain__ui wrap">
        <h2 className="h2"><Lines lines={['Turn it', 'over']} /></h2>
        <p className="rv">Drag the chain. Pick the gold. Built in the browser, so it is a model, not the piece; the real one is on 47th Street.</p>
        <div className="v2-chain__rows rv-group">
          <div className="swatches" role="radiogroup" aria-label="Metal">{(['yellow', 'white', 'rose'] as Metal[]).map((m) => <button key={m} role="radio" aria-checked={metal === m} className={'sw' + (metal === m ? ' on' : '')} onClick={() => setMetal(m)}><i style={{ background: { yellow: '#d2ad5e', white: '#d4d6da', rose: '#d8a48f' }[m] }} />{{ yellow: 'Yellow', white: 'White', rose: 'Rose' }[m]}</button>)}</div>
          <div className="pills" role="radiogroup" aria-label="Width">{['8mm', '10mm', '12mm', '15mm'].map((w) => <button key={w} role="radio" aria-checked={width === w} className={'pill' + (width === w ? ' on' : '')} onClick={() => setWidth(w)}>{w}</button>)}</div>
        </div>
        <p className="v2-chain__price num rv">{money(v.price.amount)} <span className="muted">· 14K · 22"</span></p>
        <div className="v2-chain__cta rv"><AddButton lg label="Add to bag" onAdd={() => add({ handle: p.handle, variantId: v.id, title: p.title, options: sel, price: v.price.amount, image: p.images[0].src }, null)} /><Link className="link" to={'/products/' + p.handle}>All options</Link></div>
      </div>
    </section>
  )
}

/* 3 · Films: four full-screen chapters, the title over the piece. */
function Films() {
  return (
    <section className="v2-films">
      <h2 className="sr-only">Custom work</h2>
      {PIECES.map((p) => (
        <article key={p.id} className="v2-film">
          <div className="v2-film__media"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
          <div className="v2-film__txt wrap">
            <h3 className="h1"><Lines lines={p.title.split(' for ').length > 1 ? [p.title.split(' for ')[0], 'for ' + p.title.split(' for ')[1]] : [p.title]} /></h3>
            <p className="lede rv">{p.line}</p>
          </div>
        </article>))}
      <div className="v2-films__cta wrap"><Link className="btn btn--lg" to="/custom">Start a custom piece</Link></div>
    </section>
  )
}

/* 4 · Index: the names as a typographic list; the picture follows the pointer. */
function Index() {
  const [i, setI] = useState(0)
  const items = PROOF_POSTS.slice(0, 5)
  return (
    <section className="v2-index wrap">
      <h2 className="h2"><Lines lines={['Worn first by']} /></h2>
      <ul className="v2-index__list">
        {items.map((x, k) => <li key={x.code}><a href={x.post.url} target="_blank" rel="noreferrer" onPointerEnter={() => setI(k)} onFocus={() => setI(k)} className={k === i ? 'on' : ''}><span className="v2-index__t">{x.title}</span><span className="v2-index__n small muted">{x.note}</span></a></li>)}
      </ul>
      <div className="v2-index__pic stage" aria-hidden="true">{items.map((x, k) => <img key={x.code} src={x.post.images[0].src} alt="" loading="lazy" className={k === i ? 'on' : ''} />)}</div>
      <p className="muted small">{CLIENTS.join(' · ')}</p>
    </section>
  )
}

/* 5 · Shop: the commerce rail, so the film still sells. */
function ShopRail() {
  return (
    <section className="v2-shop wrap">
      <div className="rail__head"><h2 className="h2"><Lines lines={['Ready now']} /></h2><Link className="link" to="/collections/all">All pieces</Link></div>
      <div className="rail__track">{bestSellers(8).map((p) => <ProductCard key={p.handle} p={p} variant="rail" />)}</div>
    </section>
  )
}

/* 6 · Close: the address, and a picture of the city. */
function Close() {
  return (
    <section className="v2-close">
      <div className="v2-close__pic stage"><img className="drift" src={LIFESTYLE[8].src} alt={LIFESTYLE[8].alt} loading="lazy" /></div>
      <div className="v2-close__txt wrap">
        <h2 className="display"><Lines lines={['3 W 47th']} /></h2>
        <p className="lede rv">{BRAND.address[1]}. {BRAND.hours}. Text <a className="link" href={BRAND.smsHref}>{BRAND.phone}</a>.</p>
      </div>
    </section>
  )
}
