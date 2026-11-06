import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTitle } from '../lib/seo'
import { reduced } from '../lib/motion'
import { Video } from '../components/Media'
import { PIECES, STORE_PHOTOS } from '../data/content'
import { Dome } from './LabStrip'
import { Lines } from './HomeV1'
gsap.registerPlugin(ScrollTrigger)

/**
 * Clients. Every name, piece and line comes from JoJo's own Instagram captions or his store
 * (sources noted per entry), nothing inferred from who appears in a photo.
 */
type Media = { kind: 'video'; mp4: string; webm: string; poster: string; hd?: { mp4: string; webm: string } } | { kind: 'img'; src: string; alt: string }
type Client = { id: string; name: string; piece: string; story: string; quote?: string; credit?: string; media: Media; second?: Media; ig?: string; source: string }
const yt = PIECES.find((p) => p.id === 'sp5der')!
const CLIENTS: Client[] = [
  { id: 'lil-baby', name: 'Lil Baby', piece: 'YSL chain and pendant', story: 'A custom chain and pendant, all mosaic set with three different shapes of diamonds.', credit: 'Gifted by Young Thug', quote: 'Take notes from the youngin', media: { kind: 'video', mp4: '/media/clients/ysl.mp4', webm: '/media/clients/ysl.webm', poster: '/media/clients/ysl.webp' }, second: { kind: 'video', mp4: '/media/clients/lil-baby.mp4', webm: '/media/clients/lil-baby.webm', poster: '/media/clients/lil-baby.webp' }, ig: 'https://www.instagram.com/p/DdKzkilpMaT/', source: 'Instagram DdKzkilpMaT, DLF_8ZaS40c' },
  { id: 'young-thug', name: 'Young Thug', piece: 'Sp5der bracelet and pieces', story: 'A custom Sp5der bracelet, and rose and white gold Sp5der logos mosaic set on a tennis chain.', credit: 'Bracelet gifted by @itstrevvv23', media: { kind: 'video', mp4: yt.mp4, webm: yt.webm, poster: yt.poster, hd: yt.hd }, second: { kind: 'img', src: '/media/proof/sp5der.webp', alt: 'Sp5der pendants, mosaic set' }, ig: 'https://www.instagram.com/p/DSdEg59ERnC/', source: 'Instagram DSdEg59ERnC; Drive young thug v3.mov' },
  { id: 'richard-rios', name: 'Richard Ríos', piece: '‘RR6’ pendant and seven friends-and-family pieces', story: 'A custom ‘RR6’ pendant in a fancy-shape mosaic setting, with seven small ‘RR6’ pieces for friends and family, all in rose gold.', media: { kind: 'video', mp4: '/media/clients/rr6.mp4', webm: '/media/clients/rr6.webm', poster: '/media/clients/rr6.webp' }, second: { kind: 'img', src: '/media/clients/rios.webp', alt: 'Richard Ríos' }, ig: 'https://www.instagram.com/p/DeVFs6dpFqb/', source: 'Instagram DeVFs6dpFqb' },
  { id: 'nav', name: 'NAV', piece: 'Birthday at Harbor, New York', story: 'JoJo and NAV shut down the city for NAV’s birthday celebration at Harbor New York City.', quote: 'Me and my brother @nav', media: { kind: 'img', src: '/media/clients/nav.webp', alt: 'NAV birthday celebration at Harbor New York City' }, ig: 'https://www.instagram.com/p/DfS42D8psCT/', source: 'Instagram DfS42D8psCT' },
  { id: 'twenty-two-gz', name: '22Gz', piece: '22 Crew pieces', story: 'Iced 22 Crew pendants on tennis chains, stacked.', media: { kind: 'img', src: STORE_PHOTOS[2].src, alt: STORE_PHOTOS[2].alt }, second: { kind: 'img', src: STORE_PHOTOS[0].src, alt: STORE_PHOTOS[0].alt }, source: 'Client named on the store; photos from the store page' },
]
const ALSO = ['Lil Mabu'] // named on the store, no photographed piece to show yet

function M({ m, label }: { m: Media; label: string }) {
  return m.kind === 'video' ? <Video mp4={m.mp4} webm={m.webm} poster={m.poster} hd={m.hd} label={label} /> : <img src={m.src} alt={m.alt} loading="lazy" />
}

export function Clients() {
  useTitle('Clients')
  const root = useRef<HTMLElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      // hero: the name rows slide against each other with the scroll
      gsap.utils.toArray<HTMLElement>('.cl-marq__row').forEach((row, i) => gsap.fromTo(row, { xPercent: i % 2 ? -25 : 0 }, { xPercent: i % 2 ? 0 : -25, ease: 'none', scrollTrigger: { trigger: '.cl-hero', start: 'top top', end: 'bottom top', scrub: true } }))
      gsap.to('.cl-hero__film', { scale: 1.15, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.cl-hero', start: 'top top', end: 'bottom top', scrub: true } })
      // chapters: the film opens from a slit, the big number drifts, the second picture rises
      gsap.utils.toArray<HTMLElement>('.cl-ch').forEach((ch) => {
        gsap.fromTo(ch.querySelector('.cl-ch__main'), { clipPath: 'inset(40% 12% 40% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: ch, start: 'top 85%', end: 'top 25%', scrub: true } })
        gsap.fromTo(ch.querySelector('.cl-ch__no'), { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } })
        const sec = ch.querySelector('.cl-ch__second'); if (sec) gsap.fromTo(sec, { yPercent: 25, rotate: -4 }, { yPercent: -15, rotate: 3, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, root)
    const t = setTimeout(() => ScrollTrigger.refresh(), 800)
    return () => { clearTimeout(t); ctx.revert() }
  }, [])
  // index: the picture follows the cursor
  const follow = (e: React.PointerEvent) => { const el = preview.current; if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)` }
  const names = [...CLIENTS.map((c) => c.name), ...ALSO]
  const thumb = (c: Client) => (c.media.kind === 'img' ? c.media.src : c.media.poster)
  return (
    <main id="main" ref={root} className="page clients">
      <section className="cl-hero">
        <div className="cl-hero__film"><Video priority mp4="/media/clients/lil-baby.mp4" webm="/media/clients/lil-baby.webm" poster="/media/clients/lil-baby.webp" label="Lil Baby with JoJo" /></div>
        <div className="cl-marq" aria-hidden="true">
          {[0, 1, 2].map((r) => <div key={r} className="cl-marq__row">{[...names, ...names, ...names].map((n, i) => <span key={i} className={(i + r) % 2 ? 'o' : ''}>{n}</span>)}</div>)}
        </div>
        <div className="cl-hero__txt wrap">
          <h1 className="display"><Lines lines={['Worn by']} /></h1>
          <p className="lede rv" data-d="0.3">The pieces JoJo made for the people you know, in the words he posted them with.</p>
        </div>
      </section>

      <section className="cl-index wrap" aria-label="Clients" onPointerMove={follow} onPointerLeave={() => setHover(null)}>
        <ol>{CLIENTS.map((c, i) => (
          <li key={c.id} onPointerEnter={() => setHover(i)}>
            <a href={'#' + c.id} onClick={(e) => { e.preventDefault(); document.getElementById(c.id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }) }}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span><b>{c.name}</b><small>{c.piece}</small>
              <img className="cl-index__thumb" src={thumb(c)} alt="" loading="lazy" />
            </a>
          </li>))}
          {ALSO.map((n) => <li key={n} className="cl-index__also"><span className="num">—</span><b>{n}</b><small>On the list</small></li>)}
        </ol>
        <div ref={preview} className={'cl-preview' + (hover !== null ? ' on' : '')} aria-hidden="true">
          {CLIENTS.map((c, i) => <img key={c.id} src={thumb(c)} alt="" className={hover === i ? 'on' : ''} />)}
        </div>
      </section>

      {CLIENTS.map((c, i) => (
        <section key={c.id} id={c.id} className={'cl-ch wrap' + (i % 2 ? ' cl-ch--flip' : '')}>
          <span className="cl-ch__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="cl-ch__media">
            <div className="cl-ch__main stage"><M m={c.media} label={`${c.piece} for ${c.name}`} /></div>
            {c.second && <div className="cl-ch__second stage"><M m={c.second} label={c.name} /></div>}
          </div>
          <div className="cl-ch__txt">
            <p className="cl-ch__kick rv">For</p>
            <h2 className="h1"><Lines lines={[c.name]} /></h2>
            <h3 className="cl-ch__piece rv">{c.piece}</h3>
            <p className="rv">{c.story}</p>
            {c.quote && <blockquote className="cl-ch__quote rv">“{c.quote}”</blockquote>}
            {c.credit && <p className="small muted rv">{c.credit}</p>}
            {c.ig && <a className="link rv" href={c.ig} target="_blank" rel="noreferrer">See the post <ArrowUpRight size={14} /></a>}
          </div>
        </section>
      ))}

      <section className="cl-wall">
        <div className="wrap cl-wall__head"><h2 className="h2"><Lines lines={['Around the store']} /></h2><p className="muted rv">Drag to look around. Tap a photo.</p></div>
        <Dome />
      </section>

      <section className="cl-cta wrap">
        <h2 className="display"><Lines lines={['Your name', 'next']} /></h2>
        <p className="lede rv">Every piece on this page started as a text to JoJo.</p>
        <div className="cl-cta__acts rv"><Link className="btn btn--lg" to="/custom">Start a custom piece</Link><Link className="link" to="/contact">Text JoJo</Link></div>
      </section>
    </main>
  )
}
