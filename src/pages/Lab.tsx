import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../lib/seo'
import { bestSellers, byHandle, findVariant, defaultSelection, metalFilter, money, rs } from '../data/catalog'
import { PIECES, HERO_REEL } from '../data/content'
import { BRAND } from '../data/site'
import { Video } from '../components/Media'
import type { Metal } from '../components/Chain3D'
import { Boundary } from '../components/Boundary'
import '../styles/lab.css'

const Chain3D = lazy(() => import('../components/Chain3D'))
const Chain = (p: { metal?: Metal; width?: number; drop?: boolean; className?: string }) => (
  <Boundary fallback={<img className="chain3d--still" src="/media/products/miami-cuban-link-chain-1-800.webp" alt="" />}><Suspense fallback={null}><Chain3D {...p} /></Suspense></Boundary>
)

/**
 * /lab — design previews for choosing a direction. Not linked from the site, noindex.
 * Each panel is a working sketch with the real photos, not the finished build.
 */
export function Lab() {
  useTitle('Lab · design previews')
  useEffect(() => { const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m); return () => m.remove() }, [])
  return (
    <main id="main" className="labpage">
      <header className="lab__intro">
        <p className="lab__tag">Lab · previews to choose from, not the live site</p>
        <h1>Pick a direction</h1>
        <p>Three directions, four homepage moments and three takes on “Price your Cuban”. Each one works: move the cursor, drag, tap. Use the tabs to switch.</p>
        <nav className="lab__jump"><a href="#dir">1 · Directions</a><a href="#hero">2 · Hero moment</a><a href="#cuban">3 · Price your Cuban</a></nav>
      </header>
      <Group id="dir" n="1" title="Overall direction" chosen="A · Ice is light" tabs={[['A', 'Ice is light', <DirA key="a" />], ['B', '3 W 47th Street', <DirB key="b" />], ['C', 'Liner notes', <DirC key="c" />]]} />
      <Group id="hero" n="2" title="Homepage wow moment" chosen="Buzz in" start={2} tabs={[['1', 'The drop', <HeroDrop key="1" />], ['2', 'The loupe', <HeroLoupe key="2" />], ['3', 'Buzz in', <HeroBuzz key="3" />], ['4', 'Pavé wordmark', <HeroPave key="4" />]]} />
      <Group id="cuban" n="3" title="Replacing “Price your Cuban” · round 2" tabs={[['4', 'The caliper', <CubanCaliper key="4" />], ['5', 'Scroll to size', <CubanScroll key="5" />], ['6', 'Weigh it', <CubanScale key="6" />]]} />
      <footer className="lab__foot"><p>Tell me the letter and numbers you like (for example “A, 1, 1”), or mix them.</p><Link to="/">Back to the site</Link></footer>
    </main>
  )
}

function Group({ id, n, title, tabs, chosen, start = 0 }: { id: string; n: string; title: string; tabs: [string, string, ReactNode][]; chosen?: string; start?: number }) {
  const [i, setI] = useState(start)
  return (
    <section className="lab__group" id={id}>
      <div className="lab__bar">
        <h2><span>{n}</span>{title}{chosen && <em className="lab__chosen">Chosen: {chosen}</em>}</h2>
        <div className="lab__tabs" role="tablist">{tabs.map(([k, t], j) => <button key={k} role="tab" aria-selected={i === j} className={i === j ? 'on' : ''} onClick={() => setI(j)}><b>{k}</b> {t}</button>)}</div>
      </div>
      <div className="lab__stage" role="tabpanel">{tabs[i][2]}</div>
    </section>
  )
}

/* pointer position as CSS vars on an element (also works with touch drag) */
function usePointer<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const set = (x: number, y: number) => { const r = el.getBoundingClientRect(); el.style.setProperty('--x', `${x - r.left}px`); el.style.setProperty('--y', `${y - r.top}px`); el.style.setProperty('--px', `${(x - r.left) / r.width}`); el.style.setProperty('--py', `${(y - r.top) / r.height}`) }
    const mv = (e: PointerEvent) => set(e.clientX, e.clientY)
    const r = el.getBoundingClientRect(); set(r.left + r.width * 0.62, r.top + r.height * 0.45)
    el.addEventListener('pointermove', mv); el.addEventListener('pointerdown', mv)
    // phones: tilt moves the light
    const tilt = (e: DeviceOrientationEvent) => { if (e.gamma == null || e.beta == null) return; const b = el.getBoundingClientRect(); set(b.left + b.width * (0.5 + e.gamma / 60), b.top + b.height * (0.5 + (e.beta - 45) / 80)) }
    addEventListener('deviceorientation', tilt)
    return () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerdown', mv); removeEventListener('deviceorientation', tilt) }
  }, [])
  return ref
}

const picks = () => ['miami-cuban-link-chain', 'iced-cross-pendant', 'money-bag-pendant', 'tennis-chain'].map((h) => byHandle(h)).filter(Boolean).concat(bestSellers(6)).filter((p, i, a) => a.findIndex((x) => x!.handle === p!.handle) === i).slice(0, 4) as NonNullable<ReturnType<typeof byHandle>>[]

/* ── A · Ice is light ── */
function DirA() {
  const ref = usePointer<HTMLDivElement>()
  return (
    <div className="dA">
      <div className="dA__hero" ref={ref}>
        <img className="dA__dim" src="/media/products/iced-cuban-link-chain-1.webp" alt="" />
        <img className="dA__lit" src="/media/products/iced-cuban-link-chain-1.webp" alt="Iced Cuban link chain, rose gold" />
        <div className="dA__glint" />
        <div className="dA__txt">
          <p className="dA__k">3 W 47th Street · New York</p>
          <h3>The jewellery<br />is the light</h3>
          <p>Move the cursor, or tilt your phone. Nothing on the page glows except the work.</p>
          <span className="dA__btn">Shop the pieces</span>
        </div>
      </div>
      <div className="dA__row">{picks().map((p) => (
        <div key={p.handle} className="dA__card"><div className="dA__img"><img {...rs(p.images[0].src, '25vw')} alt="" /></div><b>{p.title}</b><span>{money(findVariant(p, defaultSelection(p)).price.amount)}</span></div>
      ))}</div>
      <Note>Type: wide grotesk, small and quiet. Colour: true black, bone, no accent except the metal itself. Motion: light and glints only. Cards stay dim until you point at them.</Note>
    </div>
  )
}

/* ── B · 3 W 47th Street ── */
function DirB() {
  const ref = usePointer<HTMLDivElement>()
  return (
    <div className="dB">
      <div className="dB__front">
        <div className="dB__sign"><span>JoJo</span><small>The Jeweler · 3 W 47th</small></div>
        <p className="dB__hours">Open 9–6 · Mon–Sat · Buzz for entry</p>
      </div>
      <div className="dB__case" ref={ref}>
        <div className="dB__glass" />
        <div className="dB__shelf">{picks().map((p, i) => (
          <figure key={p.handle} className="dB__item" style={{ '--r': `${[-4, 3, -2, 5][i]}deg` } as CSSProperties}>
            <img {...rs(p.images[0].src, '25vw')} alt="" />
            <figcaption className="dB__tag"><i />{p.title}<b>{money(findVariant(p, defaultSelection(p)).price.amount)}</b></figcaption>
          </figure>
        ))}</div>
        <div className="dB__loupe" aria-hidden="true">{picks().map((p) => <span key={p.handle} />)}</div>
        <p className="dB__hint">Hover the case: the cursor is a jeweler’s loupe</p>
      </div>
      <Note>Type: a lit sign for the name, a typewriter face for tags and the cart “work ticket”. Colour: night-street black, warm case light, brass. Motion: door, case light, swinging tags.</Note>
    </div>
  )
}

/* ── C · Liner notes ── */
function DirC() {
  const [play, setPlay] = useState(0)
  return (
    <div className="dC">
      <div className="dC__cover">
        <div className="dC__art"><img src={PIECES[1].stills[1]} alt="" /><span className="dC__sticker">1 of 1<br />custom</span></div>
        <div className="dC__title">
          <p>JoJo The Jeweler presents</p>
          <h3>Done<br />the JoJo<br />way</h3>
          <p className="dC__vol">Vol. 15 · New York Diamond District</p>
        </div>
      </div>
      <ol className="dC__tracks">{PIECES.map((p, i) => (
        <li key={p.id} className={play === i ? 'on' : ''} onClick={() => setPlay(i)}>
          <span className="dC__n">{String(i + 1).padStart(2, '0')}</span>
          <span className="dC__t">{p.title}<small>{p.line}</small></span>
          <span className="dC__play">{play === i ? '▮▮' : '▶'}</span>
        </li>))}
      </ol>
      <Note>Type: heavy condensed caps, credits in small print. Colour: stone paper, black, one red. Every custom piece is a “track” with its credits (metal, setting, client); the Instagram wall becomes the B-side.</Note>
    </div>
  )
}

/* ── Hero moments ── */
function HeroDrop() {
  const [k, setK] = useState(0)
  return (
    <div className="hD">
      <h3 className="hD__h">Done the<br />JoJo way</h3>
      <div className="hD__chain"><Chain key={k} drop metal="yellow" width={14} /></div>
      <div className="hD__ui"><p>A real 3D Miami Cuban falls into the hero and settles behind you. Grab it and throw it: it swings. On scroll it would lift into “Shop by piece”.</p><button className="lab__btn" onClick={() => setK(k + 1)}>Drop it again</button></div>
    </div>
  )
}

function HeroLoupe() {
  const ref = usePointer<HTMLDivElement>()
  const src = PIECES[2].stills[2]
  return (
    <div className="hL" ref={ref}>
      <img src={src} alt="Letter M ring with a bee" />
      <div className="hL__lens" style={{ backgroundImage: `url(${src})` }} />
      <div className="hL__txt"><h3>Look closer</h3><p>The cursor (or your finger) is a jeweler’s loupe. Every stone is set by hand; this lets people see it.</p></div>
    </div>
  )
}

function HeroBuzz() {
  const [open, setOpen] = useState(false)
  return (
    <div className={'hB' + (open ? ' open' : '')}>
      <div className="hB__in"><Video mp4={HERO_REEL.mp4} webm={HERO_REEL.webm} poster={HERO_REEL.poster} label="Inside JoJo's" /><div className="hB__txt"><h3>Come in</h3><p>Then the homepage carries on as the store.</p><button className="lab__btn" onClick={() => setOpen(false)}>Close the doors</button></div></div>
      <div className="hB__door hB__door--l"><span>3 W</span></div>
      <div className="hB__door hB__door--r"><span>47th</span></div>
      <button className="hB__buzz" onClick={() => setOpen(true)} aria-label="Buzz in"><i /><span>Press to buzz in</span></button>
    </div>
  )
}

function HeroPave() {
  const ref = usePointer<HTMLDivElement>()
  return (
    <div className="hP" ref={ref}>
      <h3 className="hP__word" style={{ backgroundImage: `url(${PIECES[2].stills[0]})` }}>JoJo</h3>
      <h3 className="hP__glint" aria-hidden="true">JoJo</h3>
      <p className="hP__sub">The name, set in pavé. The glint follows the cursor, or the tilt of the phone.</p>
    </div>
  )
}

/* ── Price your Cuban ── */
const METALS: [Metal, string][] = [['yellow', 'Yellow gold'], ['white', 'White gold'], ['rose', 'Rose gold']]
const WIDTHS = [8, 10, 12, 15], LENGTHS = [18, 20, 22, 24]
function useCubanPrice(metal: string, karat: string, width: number, len: number) {
  const p = byHandle('miami-cuban-link-chain')
  const sel = p ? { ...defaultSelection(p), Metal: metal, Karat: karat, Width: width + 'mm', Length: len + '"' } : {}
  const price = p ? findVariant(p, sel).price.amount : 0
  return { price, grams: Math.round(48 * (width / 8) ** 2 * (len / 18)) }
}
function Count({ v, fmt }: { v: number; fmt: (n: number) => string }) {
  const [n, setN] = useState(v); const from = useRef(v)
  useEffect(() => { const a = from.current, t0 = performance.now(); let r = 0; const step = (t: number) => { const k = Math.min(1, (t - t0) / 600), e = 1 - (1 - k) ** 3; setN(a + (v - a) * e); if (k < 1) r = requestAnimationFrame(step); else from.current = v }; r = requestAnimationFrame(step); return () => cancelAnimationFrame(r) }, [v])
  return <>{fmt(n)}</>
}
function Pills<T extends string | number>({ label, opts, v, set, show = String }: { label: string; opts: T[]; v: T; set: (x: T) => void; show?: (x: T) => string }) {
  return <div className="cz__opt"><span>{label}</span><div>{opts.map((o) => <button key={String(o)} className={o === v ? 'on' : ''} onClick={() => set(o)}>{show(o)}</button>)}</div></div>
}

const WMAP = (w: number) => WIDTHS.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a))
const CHAIN_IMG = '/media/products/miami-cuban-link-chain-1.webp'
const tint = (m: Metal) => metalFilter('Yellow gold', METALS.find((x) => x[0] === m)![1])
function MetalDots({ v, set }: { v: Metal; set: (m: Metal) => void }) {
  return <div className="mdots" role="radiogroup" aria-label="Metal">{METALS.map(([m, t]) => <button key={m} role="radio" aria-checked={v === m} className={'mdot mdot--' + m + (v === m ? ' on' : '')} onClick={() => set(m)}><i />{t}</button>)}</div>
}

/* 1 · The caliper: drag the jaw of a jeweler's digital caliper open; the gap is the chain width */
function CubanCaliper() {
  const [mm, setMm] = useState(10), [metal, setMetal] = useState<Metal>('yellow'), [len, setLen] = useState(20), [drag, setDrag] = useState(false)
  const beam = useRef<HTMLDivElement>(null)
  const w = WMAP(mm), { price, grams } = useCubanPrice(METALS.find((x) => x[0] === metal)![1], '14K', w, len)
  const MIN = 6, MAX = 17
  const at = (x: number) => { const r = beam.current!.getBoundingClientRect(); const k = Math.max(0, Math.min(1, (x - r.left - r.width * 0.18) / (r.width * 0.7))); setMm(MIN + k * (MAX - MIN)) }
  const pos = 18 + ((mm - MIN) / (MAX - MIN)) * 70
  return (
    <div className="cc">
      <div className="cc__head"><h3>Measure your Cuban</h3><p>Drag the caliper open. The jaws show the width; it settles on the nearest size JoJo makes.</p></div>
      <div className={'cc__tool' + (drag ? ' is-drag' : '')} ref={beam}
        onPointerDown={(e) => { setDrag(true); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); at(e.clientX) }}
        onPointerMove={(e) => drag && at(e.clientX)} onPointerUp={() => { setDrag(false); setMm(w) }} onPointerCancel={() => { setDrag(false); setMm(w) }}>
        <div className="cc__beam">{Array.from({ length: 23 }, (_, i) => <i key={i} style={{ left: `${18 + i * (70 / 22)}%` }} className={i % 2 ? '' : 'big'}>{i % 2 ? '' : MIN + i / 2}</i>)}</div>
        <div className="cc__jaw cc__jaw--fixed" />
        <div className="cc__slider" style={{ left: `${pos}%` }}><div className="cc__lcd"><span>{mm.toFixed(1)}</span><small>mm</small></div><div className="cc__jaw cc__jaw--move" /></div>
        <div className="cc__link" style={{ left: '17.4%', width: `${pos - 17.4}%` }}>
          <svg viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id={'ccg' + metal} x1="0" y1="0" x2="1" y2="1">{({ yellow: ['#fff0bf', '#d6a743', '#7a5520'], white: ['#ffffff', '#c6cbd2', '#6f757d'], rose: ['#ffe3d6', '#d58f70', '#7d4636'] } as const)[metal].map((c, i) => <stop key={i} offset={i / 2} stopColor={c} />)}</linearGradient></defs>
            {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(50 ${18 + i * 28}) skewY(${i % 2 ? 12 : -12})`}><rect x="-48" y="-17" width="96" height="34" rx="16" fill={`url(#ccg${metal})`} stroke="#0008" strokeWidth=".8" /><rect x="-26" y="-6" width="52" height="12" rx="6" fill="#070707" /><rect x="-40" y="-14" width="56" height="4" rx="2" fill="#fff" opacity=".45" /></g>)}
          </svg>
        </div>
      </div>
      <div className="cc__opts">
        <MetalDots v={metal} set={setMetal} />
        <Pills label="Length" opts={LENGTHS} v={len} set={setLen} show={(l) => l + '"'} />
      </div>
      <div className="cc__read"><span><small>{w}mm · {len}" · 14K</small><b><Count v={price} fmt={(n) => money(Math.round(n))} /></b></span><span><small>Approx. weight</small><b><Count v={grams} fmt={(n) => Math.round(n) + ' g'} /></b></span><span className="lab__btn">Add to bag</span></div>
      <Note>Jewelers size chains with a caliper; here the visitor does too. Tactile on phones (drag with a thumb), and nobody else sells chains this way.</Note>
    </div>
  )
}

/* 2 · Scroll to size: the section pins, and scrolling grows the link from 8 to 15mm under the light */
function CubanScroll() {
  const box = useRef<HTMLDivElement>(null), [k, setK] = useState(0), [metal, setMetal] = useState<Metal>('yellow')
  useEffect(() => {
    const f = () => { const el = box.current; if (!el) return; const r = el.getBoundingClientRect(); setK(Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)))) }
    f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f)
  }, [])
  const mm = 8 + k * 7, w = WMAP(mm), { price, grams } = useCubanPrice(METALS.find((x) => x[0] === metal)![1], '14K', w, 20)
  return (
    <div className="cs" ref={box}>
      <div className="cs__pin">
        <div className="cs__img" style={{ transform: `scale(${0.75 + k * 0.9})` }}><img src={CHAIN_IMG} alt="" style={{ filter: tint(metal) }} /></div>
        <div className="cs__mm"><b>{mm.toFixed(1)}</b><span>mm</span></div>
        <ol className="cs__marks">{WIDTHS.map((x) => <li key={x} className={x === w ? 'on' : ''}>{x}mm</li>)}</ol>
        <div className="cs__ui"><MetalDots v={metal} set={setMetal} /><p><small>{w}mm · 20" · 14K</small><b>{money(price)}</b><small>≈ {grams} g</small></p></div>
        <p className="cs__hint">{k < 0.05 ? 'Scroll to size it ↓' : k > 0.95 ? 'Stop anywhere. That’s your chain.' : 'Keep scrolling'}</p>
      </div>
    </div>
  )
}

/* 3 · On the scale: pick a size and the chain drops onto a jeweler's gold scale; grams and price read out */
function CubanScale() {
  const [w, setW] = useState(10), [len, setLen] = useState(20), [metal, setMetal] = useState<Metal>('yellow'), [drop, setDrop] = useState(0)
  const { price, grams } = useCubanPrice(METALS.find((x) => x[0] === metal)![1], '14K', w, len)
  useEffect(() => setDrop((d) => d + 1), [w, len, metal])
  return (
    <div className="cw">
      <div className="cw__stage">
        <div className="cw__chain" key={drop} style={{ '--s': 0.7 + (w - 8) * 0.07 } as CSSProperties}><img src={CHAIN_IMG} alt="" style={{ filter: tint(metal) }} /></div>
        <div className="cw__scale"><div className="cw__pan" key={'p' + drop} /><div className="cw__body"><div className="cw__lcd"><Count v={grams} fmt={(n) => n.toFixed(1)} /><small>g</small></div><span>JoJo · 47th St.</span></div></div>
      </div>
      <div className="cw__ui">
        <h3>Weigh it</h3>
        <p>Gold is sold by weight on 47th Street. Pick a size and put it on the scale.</p>
        <MetalDots v={metal} set={setMetal} />
        <Pills label="Width" opts={WIDTHS} v={w} set={setW} show={(x) => x + 'mm'} />
        <Pills label="Length" opts={LENGTHS} v={len} set={setLen} show={(l) => l + '"'} />
        <div className="cw__price"><small>14K · {w}mm · {len}"</small><b><Count v={price} fmt={(n) => money(Math.round(n))} /></b></div>
      </div>
    </div>
  )
}

const Note = ({ children }: { children: ReactNode }) => <p className="lab__note">{children}</p>
