import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from '../lib/motion'
gsap.registerPlugin(ScrollTrigger)

/**
 * The monogram shutter (also the V2 opening): the film shows through the JoJo mark; scrolling opens
 * the mark until the film fills the screen, the word fades and the heading rises. Pinned for 1.4
 * screens. Reduced motion (or the controller's "Still") shows the open state at once.
 */
export function Shutter({ media, word = 'JoJo', children, className = '' }: { media: ReactNode; word?: string; children: ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = root.current!
    if (reduced()) { el.classList.add('shutter--open'); return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', pin: true, scrub: 0.6, anticipatePin: 1 } })
      tl.fromTo(el, { '--m': '34vmin' }, { '--m': '440vmax', duration: 1, ease: 'power2.in' }, 0)
        .fromTo(el.querySelector('.shutter__word'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 0.35 }, 0.2)
        .fromTo(el.querySelector('.shutter__h'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.68)
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className={'shutter ' + className}>
      <div className="shutter__film">{media}</div>
      <div className="shutter__word" aria-hidden="true">{word}</div>
      <div className="shutter__hint" aria-hidden="true">Scroll</div>
      <div className="shutter__h wrap">{children}</div>
    </section>
  )
}
