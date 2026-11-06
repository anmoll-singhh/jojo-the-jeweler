import { useEffect, useRef, useState } from 'react'
import { reduced } from '../lib/motion'

/**
 * Muted looping video with a poster (WebM for Chrome/Firefox/Edge, MP4 for Safari and anything else).
 * Only the `priority` video (the hero) loads up front; every other one downloads nothing until it is
 * about a screen away, then plays while on screen. Reduced motion: the poster stands in.
 */
/** Big screens (or dense ones) get the 1920-tall cut, phones the lighter 1080 one. */
/** Safari's WebM playback is unreliable (stalls, won't loop); it gets the H.264 MP4. */
const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|chromium|crios|android|edg).)*safari/i.test(navigator.userAgent)
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
    // some browsers (Safari with WebM) stop at the end despite loop: restart by hand
    const again = () => { v.currentTime = 0; v.play().catch(() => {}) }
    // Safari can sit on the last frame without firing "ended": jump back just before the end
    const nearEnd = () => { if (v.duration && v.currentTime > v.duration - 0.12) again() }
    v.addEventListener('ended', again); v.addEventListener('timeupdate', nearEnd)
    const vis = () => { if (document.hidden) v.pause() }
    document.addEventListener('visibilitychange', vis)
    return () => { near.disconnect(); on.disconnect(); v.removeEventListener('ended', again); v.removeEventListener('timeupdate', nearEnd); document.removeEventListener('visibilitychange', vis) }
  }, [priority])
  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline autoPlay={priority} preload={priority ? 'auto' : 'none'} aria-label={label} disablePictureInPicture>
      {src.webm && !isSafari && <source src={src.webm} type="video/webm" />}
      <source src={src.mp4} type="video/mp4" />
    </video>
  )
}
