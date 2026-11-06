import { useEffect, useRef, useState } from 'react'
import { reduced } from '../lib/motion'

/**
 * Muted looping video with a poster (WebM for Chrome/Firefox/Edge, MP4 for Safari and anything else).
 * Only the `priority` video (the hero) loads up front; every other one downloads nothing until it is
 * about a screen away, then plays while on screen. Reduced motion: the poster stands in.
 */
/** Big screens (or dense ones) get the 1920-tall cut, phones the lighter 1080 one. */
const wantHd = () => typeof window !== 'undefined' && (matchMedia('(min-width: 56.25em)').matches || innerWidth * devicePixelRatio > 1500)
export function Video({ mp4, webm, poster, className = '', label, priority = false, hd }: { mp4: string; webm?: string; poster: string; className?: string; label?: string; priority?: boolean; hd?: { mp4: string; webm?: string } }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [big] = useState(() => !!hd && wantHd())
  const src = big && hd ? hd : { mp4, webm }
  useEffect(() => {
    const v = ref.current; if (!v) return
    if (reduced()) { v.removeAttribute('autoplay'); v.preload = 'none'; v.pause(); return }
    let armed = priority
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting && !armed) { armed = true; v.preload = 'auto'; v.load() } }, { rootMargin: '100% 0px' })
    const on = new IntersectionObserver(([e]) => { if (e.isIntersecting && armed) v.play().catch(() => {}); else v.pause() }, { threshold: 0.15 })
    near.observe(v); on.observe(v)
    const vis = () => { if (document.hidden) v.pause() }
    document.addEventListener('visibilitychange', vis)
    return () => { near.disconnect(); on.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [priority])
  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline autoPlay={priority} preload={priority ? 'auto' : 'none'} aria-label={label} disablePictureInPicture>
      {src.webm && <source src={src.webm} type="video/webm" />}
      <source src={src.mp4} type="video/mp4" />
    </video>
  )
}
