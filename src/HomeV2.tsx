/**
 * The homepage (/) — the original homepage's layout, told as a story with @doublemandco's own
 * Instagram content. The previous homepage is kept at /homepage-v1 for comparison.
 *
 * Story order: the ring → making it yours → finding your piece → walk in, try it on,
 * ask the question → life at Double M → visit us.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { rings, cdn, aud, minPrice, BRAND, TESTIMONIALS, REVIEWS_LIVE } from './data/site'
import { IG, IG_URL, reelByCode, altFrom, type Reel } from './data/instagram'
import { Page, Carousel3D, Lines } from './ui'
import './homev2.css'

/** Hero reels: the chain with the M pendant, the launch-night ribbon cutting, and the custom
 *  piece in its box. Desktop shows all three side by side; phones play them in turn. */
const HERO = ['DfGjOJVKtYB', 'DfEBqv-Kzd6', 'DdBB--kqLxK']

const calm = () => typeof matchMedia !== 'undefined' && (matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true)

/** Title, and size the hero to the real header height. */
function usePage() {
  useEffect(() => {
    document.title = 'Double M & Co — Fine jewellery, North Perth'
    const fit = () => {
      const nav = document.querySelector('.nav') as HTMLElement | null
      if (nav) document.documentElement.style.setProperty('--v2-top', Math.round(nav.getBoundingClientRect().bottom) + 'px')
    }
    fit(); addEventListener('resize', fit)
    return () => { removeEventListener('resize', fit); document.documentElement.style.removeProperty('--v2-top') }
  }, [])
}

/** Reels flagged webm in the manifest list a VP9 WebM before the MP4 (smaller in Chrome and
 *  Firefox); Safari and anything without VP9 skips it and plays the MP4. */
type MediaProps = {
  r: Reel; className?: string; label?: string
  /** should be playing now */ active: boolean
  /** start downloading even though it isn't playing yet (next hero reel, reels near the screen) */ warm?: boolean
  loop?: boolean; restart?: boolean; onEnded?: () => void
  /** called once, about half a second before the end, so the next reel can crossfade in over the last frames */ onEnding?: () => void
  /** called once the reel can play through, so the hero can start loading the next one */ onReady?: () => void
  /** never start before fully buffered (desktop hero reels after the first, so they don't
   *  compete for bandwidth with one that is already playing) */ patient?: boolean
}
/**
 * A reel that never stutters into view. Its first frame (WebP, JPG fallback) stays on screen while
 * the video buffers; it only starts playing once the browser says it can play through
 * ('canplaythrough'), and the placeholder fades out only after frames are actually advancing.
 * iOS Safari doesn't buffer muted video ahead of play(), so after a short wait it is started
 * anyway, still behind the placeholder. MP4 (H.264, hardware-decoded everywhere) is listed first;
 * WebM is a fallback. With reduced motion the first frame simply stays.
 */
const IOS = typeof navigator !== 'undefined' && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

/** Slow connection (below ~5 Mbps, or data saver) as reported by the browser; Safari doesn't
 *  report it, so there the normal behaviour applies. */
const SLOW = (() => { const c = typeof navigator !== 'undefined' ? (navigator as Navigator & { connection?: { downlink?: number; saveData?: boolean } }).connection : undefined; return !!c && (c.saveData === true || (typeof c.downlink === 'number' && c.downlink > 0 && c.downlink < 5)) })()

function ReelMedia({ r, className = '', label, active, warm, loop = true, restart, onEnded, onEnding, onReady, patient }: MediaProps) {
  const v = useRef<HTMLVideoElement>(null)
  const endingCalled = useRef(false)
  const [canPlay, setCanPlay] = useState(false)
  const [shown, setShown] = useState(false)
  const readyCalled = useRef(false)
  const still = calm()
  const base = r.src.replace(/\.mp4$/, '')

  // Start downloading once the reel is needed (or about to be).
  useEffect(() => {
    const el = v.current
    if (!el || still || !(active || warm)) return
    if (el.readyState >= 4) { setCanPlay(true); return }
    if (el.preload !== 'auto') { el.preload = 'auto'; if (el.networkState !== el.NETWORK_LOADING) el.load() }
  }, [active, warm, still])

  // Play only when buffered. iPhone/iPad Safari won't download a video before play(), so there it
  // starts after a moment and the first frame stays up until playback is smooth (see below).
  useEffect(() => {
    const el = v.current
    if (!el || still) return
    if (!active) {
      // Phone hero: the outgoing reel keeps its last frame while the next one fades in over it,
      // then rewinds to its first frame so it is ready for the next time round.
      el.pause()
      if (!restart) return
      const t = setTimeout(() => { try { el.currentTime = 0 } catch { /* not loaded yet */ } }, 1000)
      return () => clearTimeout(t)
    }
    endingCalled.current = false
    const go = () => { if (restart && el.currentTime > 0.05 && el.ended) el.currentTime = 0; el.play().catch(() => {}) }
    if (canPlay) { go(); return }
    if (patient && !IOS) return
    // Slow connections may never report "can play through": after a wait, start once there is
    // data ahead (the first frame stays up until playback is actually smooth).
    const t = setTimeout(() => { if (IOS || el.readyState >= 3) go() }, IOS ? 1200 : 6000)
    return () => clearTimeout(t)
  }, [active, canPlay, restart, still, patient])

  return (
    <span className={'reel ' + className + (shown ? ' ready' : '')}>
      <picture className="reel__ph" aria-hidden="true">
        <source srcSet={base + '.webp'} type="image/webp" />
        <img src={base + '.jpg'} alt="" loading={active || warm ? 'eager' : 'lazy'} fetchPriority={active ? 'high' : 'auto'} decoding="async" />
      </picture>
      <video ref={v} poster={base + '.jpg'} muted playsInline loop={loop} preload={!still && (active || warm) ? 'auto' : 'none'}
        onCanPlayThrough={() => { if (!canPlay) { setCanPlay(true); if (!SLOW && !readyCalled.current) { readyCalled.current = true; onReady?.() } } }}
        onProgress={(e) => {
          // Slow connections: hand over to the next reel only once this one is fully downloaded,
          // so three reels never split a connection that can only carry one.
          const el = e.currentTarget
          if (!SLOW || readyCalled.current || !onReady || !el.duration || !el.buffered.length) return
          if (el.buffered.end(el.buffered.length - 1) >= el.duration - 0.3) { readyCalled.current = true; onReady() }
        }}
        onTimeUpdate={(e) => {
          const el = e.currentTarget
          if (onEnding && active && !endingCalled.current && el.duration && el.duration - el.currentTime < 0.5) { endingCalled.current = true; onEnding() }
          if (shown || el.paused) return
          // Buffered and moving, or (iOS) a full second played with data ahead of it.
          if ((canPlay && el.currentTime > 0.15) || (el.currentTime > 1 && el.readyState >= 3)) setShown(true)
        }}
        onEnded={onEnded} aria-label={label ?? altFrom(r.description)}>
        <source src={r.src} type="video/mp4" />
        {r.webm && <source src={base + '.webm'} type="video/webm" />}
      </video>
    </span>
  )
}

/** A muted reel that downloads as it nears the screen and plays only while on screen. */
function Clip({ r, label }: { r?: Reel; label?: string }) {
  const box = useRef<HTMLSpanElement>(null)
  const [near, setNear] = useState(false)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = box.current; if (!el) return
    const a = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '600px 0px' })
    const b = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 })
    a.observe(el); b.observe(el)
    return () => { a.disconnect(); b.disconnect() }
  }, [r])
  if (!r) return null
  return <span ref={box} className="clipbox"><ReelMedia r={r} label={label} active={seen} warm={near} /></span>
}

/* ── Hero: two reels covering the whole background, muted, no controls ── */
function Hero() {
  const [phone, setPhone] = useState(() => matchMedia('(max-width: 899px)').matches)
  // Phones play one reel at a time and open on the custom piece in its box (reel 3), then the
  // ribbon cutting, then the chain reel. Desktop keeps the side-by-side order.
  const order = phone ? [HERO[2], HERO[1], HERO[0]] : HERO
  const reels = order.map(reelByCode).filter(Boolean) as Reel[]
  const [i, setI] = useState(0)
  useEffect(() => { const q = matchMedia('(max-width: 899px)'); const f = () => setPhone(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f) }, [])
  // Desktop: all reels play side by side. Phone: one fills the screen, the next one downloads
  // while it plays, and takes over when it ends.
  const next = (i + 1) % reels.length
  // The reel that just finished stays fully visible underneath while the next one fades in over
  // it, so the loop 1 → 2 → 3 → 1 never dips to black.
  const [prev, setPrev] = useState(-1)
  const advance = (k: number) => { if (!phone) return; setI((cur) => { if (cur !== k) return cur; setPrev(cur); return (cur + 1) % reels.length }) }
  // Desktop: reel 1 loads first; each next reel starts loading as soon as the one before it can
  // play through, so the first never shares the connection while it is still buffering.
  const [ready, setReady] = useState(0)

  return (
    <section className="v2hero" aria-label="Double M & Co">
      <div className="v2hero__bg" aria-hidden="true" style={{ ['--n' as string]: reels.length }}>
        {reels.map((r, k) => (
          <ReelMedia key={r.code} r={r} className={k === i ? 'on' : k === prev ? 'prev' : ''} active={phone ? k === i : k <= ready} warm={phone ? k === next : k <= ready} loop={!phone} restart={phone} patient={!phone && k > 0}
            onReady={() => setReady((n) => Math.max(n, k + 1))} onEnding={phone ? () => advance(k) : undefined} onEnded={() => advance(k)} />
        ))}
      </div>
      <div className="v2hero__cap">
        <h1 className="cap"><Lines lines={['Real luxury,', 'without the illusion']} d={0.2} /></h1>
        <div className="v2hero__links">
          <Link className="ul" to="/collections/engagement-rings">Discover engagement rings</Link>
          <Link className="ul" to="/book-appointment">Book a consultation</Link>
        </div>
      </div>
    </section>
  )
}

/** The main homepage's own style photography. */
const STYLES: [string, string, string][] = [
  ['st-solitaire', 'Solitaire', '/collections/engagement-rings'],
  ['st-pave', 'Pavé band', '/collections/engagement-rings'],
  ['st-bands', 'Wedding bands', '/collections/wedding-bands'],
  ['st-chains', 'Chains', '/collections/chains'],
]

/** Three reels, each captioned with what it actually shows. */
const BEATS: [string, string, string, string][] = [
  // A couple at the showroom: the ring goes on her finger, then her reaction.
  ['DdI6f2AKCa_', 'Choose it together', 'Book a consultation', '/book-appointment'],
  // A blue flower bracelet being clasped onto a wrist at the counter.
  ['De1djcGqv5a', 'Clasped on at the counter', 'Book a visit', '/book-appointment'],
  // The couple's hands afterwards, her engagement ring on show.
  ['Ded415hqhBp', 'Ask the question', 'Shop engagement rings', '/collections/engagement-rings'],
]

/** Launch night on Charles Street: photos from the three launch carousels, [post, slide]. */
const NIGHT: [string, number][] = [['De-yTEYGfZT', 0], ['De_o0UYGcLn', 0], ['De_nRDjmYja', 0], ['De-yTEYGfZT', 2], ['De_o0UYGcLn', 3], ['De_nRDjmYja', 4]]
const nightShots = () => NIGHT.flatMap(([code, k]) => {
  const p = IG.posts.find((x) => x.code === code)
  const im = p?.images[Math.min(k, (p?.images.length ?? 1) - 1)]
  return p && im ? [{ key: code + k, src: im.src, url: p.url }] : []
})

export default function HomeV2() {
  usePage()
  const sig = rings.slice(0, 10)
  return (
    <Page className="home home6 hv2">
      <Hero />

      <section className="sig wrap">
        <div className="h6head"><div><h2 className="cap">It starts with a ring</h2><p className="muted">Our most loved engagement rings, in yellow, white and rose gold.</p></div><Link className="btn btn--line" to="/collections/engagement-rings">Discover all</Link></div>
        <Carousel3D items={sig} />
      </section>

      <section className="band">
        {/* Wide screens: the vertical reel is shown whole on the right (nothing cropped off the ring),
            over a blurred, dimmed copy of its first frame that fills the band. */}
        <span className="band__bd" aria-hidden="true" style={{ backgroundImage: `url(${(reelByCode('Dcu1IFHKOr2')?.poster ?? '').replace(/\.jpg$/, '.webp')}), url(${reelByCode('Dcu1IFHKOr2')?.poster ?? ''})` }} />
        <Clip r={reelByCode('Dcu1IFHKOr2')} />
        {/* The reel: two hands comparing rings at the counter, then a chain lifted from the case. */}
        <div className="band__txt"><h2 className="cap">See it in person</h2><p>Compare rings on your own hand and watch every chain come out of the case under our showroom lights.</p><Link className="btn btn--light" to="/book-appointment">Book a consultation</Link><Link className="ul" to="/build-your-ring">Or build your ring online</Link></div>
      </section>

      <section className="styles wrap">
        <div className="h6head"><div><h2 className="cap">Find your piece</h2><p className="muted">Solitaires, pavé bands, wedding bands and chains.</p></div><Link className="btn btn--line only-d" to="/collections/all">Shop all jewellery</Link></div>
        <div className="styles__grid">{STYLES.map(([f, t, h]) => (
          <Link key={f} to={h} className="styles__tile"><span className="styles__img"><img src={`/media/v6/${f}.webp`} alt={t} loading="lazy" /></span><span className="cap cap--xs">{t}</span></Link>
        ))}</div>
      </section>

      <section className="rooms" aria-label="In the showroom">
        {BEATS.map(([code, t, c, h]) => (
          <Link key={code} to={h} className="rooms__tile">
            <Clip r={reelByCode(code)} />
            <span className="rooms__cap"><span className="cap cap--sm">{t}</span><span className="ul">{c}</span></span>
          </Link>))}
      </section>

      {REVIEWS_LIVE && <section className="v2rev wrap" aria-labelledby="v2rev-h">
        <h2 id="v2rev-h" className="cap">Then they tell us about it</h2>
        <ul className="v2rev__list">{TESTIMONIALS.map(([q, n, w]) => <li key={n}><blockquote>{q}</blockquote><p><b>{n}</b> <span>{w}</span></p></li>)}</ul>
      </section>}

      <section className="igs wrap" aria-label="Instagram">
        <div className="h6head"><div><h2 className="cap">The night we opened</h2><p className="muted">Launch night on Charles Street, from @doublemandco.</p></div><a className="btn btn--line" href={IG_URL} target="_blank" rel="noreferrer">Follow on Instagram</a></div>
        <div className="igs__row">{nightShots().map((m) => (
          <a key={m.key} href={m.url} target="_blank" rel="noreferrer" className="igs__i"><img src={m.src} alt="Launch night at the Charles Street showroom" loading="lazy" /></a>
        ))}</div>
      </section>

      <section className="v2end">
      <div className="visitb">
        <div className="visitb__txt">
          <h2 className="cap">Your story starts on Charles Street</h2>
          <p>Try on every design, see the stones under our lights and talk it through with the person who will make your ring.</p>
          <dl className="facts"><div><dt>Address</dt><dd>{BRAND.address.join(', ')}</dd></div><div><dt>Hours</dt><dd>{BRAND.hours}</dd></div></dl>
          <div className="cta"><Link className="btn btn--light" to="/book-appointment">Book an appointment</Link><Link className="ul" to="/custom">Start a custom piece</Link></div>
        </div>
        <div className="visitb__rail">{rings.slice(10, 14).map((r) => <Link key={r.handle} to={'/products/' + r.handle} className="visitb__p"><span className="stage"><img src={cdn(r.images[0], 500)} alt={r.title} loading="lazy" /></span><b>{r.title}</b><small>from {aud(minPrice(r))}</small></Link>)}</div>
      </div>
      <div className="press" aria-label="Our promise">
        {[['Lab-grown', 'D–F colour, VS1 clarity or better'], ['18k gold', 'Yellow, white and rose'], ['Made to order', 'About 3–4 weeks of production'], ['Showroom', 'Collection by arrangement']].map(([a, b]) => <div key={a}><b>{a}</b><span>{b}</span></div>)}
      </div>
      </section>
    </Page>
  )
}
