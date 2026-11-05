import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Minus, Plus } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTitle } from '../lib/seo'
import { getLenis, reduced } from '../lib/motion'
import { Video } from '../components/Media'
import { Shutter } from '../components/Shutter'
import { BRAND, CLIENTS, FAQ, PROCESS, SAMPLE, SIZING } from '../data/site'
import { HERO_REEL, IG_PROFILE, LIFESTYLE, PIECES, STORE_PHOTOS } from '../data/content'
import { Lines } from './HomeV1'
gsap.registerPlugin(ScrollTrigger)

/**
 * About. Chapters, each with its own motion:
 *  1 the shutter (JoJo's reel through the mark) · 2 "15" scrubs in beside the story
 *  3 facts count up · 4 two rows of photographs travel in opposite directions with the scroll
 *  5 the three steps of a custom piece, drawn by a line that fills as you read · 6 watches · 7 orders · 8 questions
 */
export function About() {
  useTitle('About JoJo')
  const root = useRef<HTMLElement>(null)
  const { hash } = useLocation()
  // /about#shipping etc.: wait for the pinned sections to measure, then scroll past them to the target
  useEffect(() => {
    const id = hash.slice(1); if (!id) return
    const t = setTimeout(() => {
      const el = document.getElementById(id); if (!el) return
      ScrollTrigger.refresh()
      const y = el.getBoundingClientRect().top + scrollY - ((document.querySelector('.nav') as HTMLElement | null)?.offsetHeight ?? 64) - 24
      // jump (a smooth scroll from the top would be cut off by the pinned shutter re-measuring)
      const l = getLenis(); if (l) l.scrollTo(y, { immediate: true, force: true }); else scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
    }, 1000)
    return () => clearTimeout(t)
  }, [hash])
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      // 2 · the numeral scrubs from small and dim to full as the story passes
      gsap.fromTo('.ab-story__num', { scale: 0.55, opacity: 0.12 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.ab-story', start: 'top 85%', end: 'center 45%', scrub: true } })
      // 3 · counters
      gsap.utils.toArray<HTMLElement>('.ab-count').forEach((el) => {
        const to = Number(el.dataset.to), suffix = el.dataset.suffix ?? '', o = { v: 0 }
        gsap.to(o, { v: to, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v) + suffix } })
      })
      // 4 · photo rows travel against each other
      gsap.utils.toArray<HTMLElement>('.ab-strip__row').forEach((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -18 : 0 }, { xPercent: i % 2 ? 0 : -18, ease: 'none', scrollTrigger: { trigger: '.ab-strip', start: 'top bottom', end: 'bottom top', scrub: true } }))
      // 5 · the process line fills with the scroll
      gsap.fromTo('.ab-steps__line i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.ab-steps__list', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('.ab-steps__list li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 65%', onEnter: () => li.classList.add('on'), onLeaveBack: () => li.classList.remove('on') }))
      // 6 · watch picture opens from the centre
      gsap.fromTo('.ab-watch__pic', { clipPath: 'inset(18% 18% 18% 18%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.ab-watch', start: 'top 80%', end: 'center 50%', scrub: true } })
    }, root)
    const t = setTimeout(() => ScrollTrigger.refresh(), 800)
    return () => { clearTimeout(t); ctx.revert() }
  }, [])
  const rowA = LIFESTYLE.slice(0, 5), rowB = LIFESTYLE.slice(5, 10)
  const followersK = Math.floor((IG_PROFILE?.followers ?? 109000) / 1000)
  return (
    <main id="main" ref={root} className="page about">
      <Shutter className="ab-shutter" media={<Video priority mp4={HERO_REEL.mp4} webm={HERO_REEL.webm} poster={HERO_REEL.poster} label="JoJo The Jeweler" />}>
        <h1 className="display">Meet JoJo</h1>
        <p className="lede">The jeweler at 3 W 47th Street, New York Diamond District. Jewelry, watches and custom pieces.</p>
      </Shutter>

      <section className="ab-story wrap">
        <div className="ab-story__num" aria-hidden="true">15</div>
        <div className="ab-story__txt">
          <h2 className="h2"><Lines lines={['Started at', 'fifteen']} /></h2>
          <p className="lede rv">JoJo started in jewelry at 15. Today he works out of 3 W 47th Street in the New York Diamond District, and his store calls him America’s youngest jeweler.</p>
          <p className="rv">Custom pieces, Miami Cuban chains and luxury watches, sourced or bought. Between New York and Miami, shipped worldwide. His Instagram shows who wears the work.</p>
          <Link className="btn btn--ghost rv" to="/custom">Start a custom piece</Link>
        </div>
        <div className="ab-story__pic stage clip"><img className="drift" src={STORE_PHOTOS[1].src} alt={STORE_PHOTOS[1].alt} loading="lazy" /></div>
      </section>

      <section className="ab-facts wrap" aria-label="In numbers">
        <dl>
          <div><dt>Started at</dt><dd><span className="ab-count num" data-to={BRAND.startedAt}>{BRAND.startedAt}</span></dd></div>
          <div><dt>Instagram followers</dt><dd><span className="ab-count num" data-to={followersK} data-suffix="K">{followersK}K</span></dd></div>
          <div><dt>Days a week, 9 a.m. to 6 p.m.</dt><dd><span className="ab-count num" data-to="6">6</span></dd></div>
          <div><dt>Worn by</dt><dd className="ab-facts__names">{CLIENTS.join(' · ')}</dd></div>
        </dl>
      </section>

      <section className="ab-strip" aria-label="Photographs">
        <div className="ab-strip__row">{[...rowA, ...rowA].map((l, i) => <div key={i} className="ab-strip__item stage"><img src={l.src.replace('.webp', '-sm.webp')} alt={i < rowA.length ? l.alt : ''} loading="lazy" /></div>)}</div>
        <div className="ab-strip__row">{[...rowB, ...rowB].map((l, i) => <div key={i} className="ab-strip__item stage"><img src={l.src.replace('.webp', '-sm.webp')} alt={i < rowB.length ? l.alt : ''} loading="lazy" /></div>)}</div>
      </section>

      <section className="ab-steps wrap">
        <div className="ab-steps__head">
          <h2 className="h2"><Lines lines={['How a piece', 'gets made']} /></h2>
          <p className="rv">The same three steps for every custom order, in the store’s own words.</p>
          <div className="ab-steps__film stage"><Video mp4={PIECES[2].mp4} webm={PIECES[2].webm} poster={PIECES[2].poster} label={PIECES[2].title} /></div>
        </div>
        <div className="ab-steps__body">
          <span className="ab-steps__line" aria-hidden="true"><i /></span>
          <ol className="ab-steps__list">{PROCESS.map(([t, body], i) => <li key={t}><span className="num">{i + 1}</span><h3>{t}</h3><p>{body}</p></li>)}</ol>
        </div>
      </section>

      <section className="ab-watch wrap" id="watches">
        <div className="ab-watch__pic stage"><img src="/media/store/jojo-watch.webp" alt="Holding up two iced watches" loading="lazy" /></div>
        <div className="ab-watch__txt">
          <h2 className="h2"><Lines lines={['Watches,', 'both ways']} /></h2>
          <p className="rv">JoJo sources luxury watches and buys them. Bring one in or ship it: it is inspected for authenticity and condition, paperwork included, and you get a one-time offer with prompt, secure payment. Part-exchange against a piece can be considered.</p>
          <div className="ab-watch__cta rv"><Link className="btn" to="/products/watch-sourcing">Source a watch · $50 deposit</Link><Link className="link" to="/contact?topic=watch">Sell a watch</Link></div>
        </div>
      </section>

      <section className="policies wrap">
        <h2 className="h2"><Lines lines={['Orders']} /></h2>
        <div className="policies__grid rv-group">
          <div id="shipping"><h3>Shipping</h3><p>{SAMPLE.shipping}</p></div>
          <div id="returns"><h3>Returns</h3><p>{SAMPLE.returns}</p></div>
          <div id="warranty"><h3>Warranty</h3><p>{SAMPLE.warranty}</p></div>
          <div id="sizing"><h3>Sizing</h3><p>{SIZING.join(' ')}</p></div>
        </div>
        <p className="sample">Sample wording: JoJo confirms shipping, returns and warranty terms with every order.</p>
      </section>

      <section className="faq wrap" id="faq">
        <h2 className="h2"><Lines lines={['Questions']} /></h2>
        <div className="faq__list rv-group">{FAQ.map(([q, a]) => <details key={q} className="acc"><summary>{q}<Plus size={16} className="acc__plus" /><Minus size={16} className="acc__minus" /></summary><div className="acc__body"><p>{a}</p></div></details>)}</div>
      </section>
    </main>
  )
}
