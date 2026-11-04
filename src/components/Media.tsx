import { useEffect, useRef } from 'react'
import { reduced } from '../lib/motion'

/**
 * Muted looping video with a poster. Plays only while on screen and when motion is allowed;
 * otherwise the poster stands in, so the reduced-motion page is the finished page.
 */
export function Video({ mp4, webm, poster, className = '', label }: { mp4: string; webm?: string; poster: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current; if (!v) return
    if (reduced()) { v.removeAttribute('autoplay'); v.pause(); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.15 })
    io.observe(v)
    const vis = () => { if (document.hidden) v.pause() }
    document.addEventListener('visibilitychange', vis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [])
  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline autoPlay preload="metadata" aria-label={label} disablePictureInPicture>
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  )
}
