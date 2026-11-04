import { useEffect, useRef, useState } from 'react'
import { rs } from '../data/catalog'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'

export type C3DItem = { key: string; href: string; title: string; sub: string; img: string }

/**
 * 3D ring carousel (CSS 3D, no WebGL). Items sit on a cylinder; the ring turns with drag, swipe,
 * the arrow buttons or the arrow keys, and snaps to the nearest item. Clicking a side item brings
 * it to the front; clicking the front item opens it. Items facing away are hidden from assistive
 * tech and the tab order.
 */
export function Carousel3D({ items: src, label }: { items: C3DItem[]; label: string }) {
  // Short lists go round the ring twice so the arc in view stays full (each item shows once per half-turn).
  const reps = src.length < 10 ? 2 : 1
  const items = Array.from({ length: reps }, (_, r) => src.map((it) => ({ ...it, k: it.key + '-' + r }))).flat()
  const M = src.length
  const N = items.length
  const step = 360 / N
  const [rot, setRot] = useState(0)
  const [drag, setDrag] = useState(false)
  const [w, setW] = useState(300)
  const stage = useRef<HTMLDivElement>(null)
  const st = useRef({ x: 0, r: 0, moved: false, id: -1 })
  useEffect(() => {
    const el = stage.current!
    const measure = () => { const it = el.querySelector<HTMLElement>('.c3d__item'); if (it) setW(it.offsetWidth) }
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect()
  }, [])
  const radius = Math.round((w / 2 + 14) / Math.tan(Math.PI / N))
  const front = ((Math.round(-rot / step) % N) + N) % N
  const snap = (r: number) => Math.round(r / step) * step
  const go = (d: number) => setRot((r) => snap(r) - d * step)
  const bring = (i: number) => { let d = i - front; if (d > N / 2) d -= N; if (d < -N / 2) d += N; go(d) }
  const down = (e: React.PointerEvent) => { st.current = { x: e.clientX, r: rot, moved: false, id: e.pointerId }; setDrag(true) }
  const move = (e: React.PointerEvent) => {
    if (!drag || e.pointerId !== st.current.id) return
    const dx = e.clientX - st.current.x
    if (Math.abs(dx) > 6 && !st.current.moved) { st.current.moved = true; stage.current?.setPointerCapture(e.pointerId) }
    if (st.current.moved) setRot(st.current.r + dx * (step / (w * 0.9)))
  }
  const up = () => { if (!drag) return; setDrag(false); setRot((r) => snap(r)) }
  const cur = src[front % M]
  return (
    <div className="c3d" role="group" aria-roledescription="carousel" aria-label={label}>
      <div ref={stage} className={'c3d__stage' + (drag ? ' is-drag' : '')} tabIndex={0} aria-label={`${label}: use the left and right arrow keys`}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) } }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
        <div className="c3d__ring" style={{ transform: `translateZ(${-radius}px) rotateY(${rot}deg)` }}>
          {items.map((it, i) => {
            const rel = ((((i * step + rot) % 360) + 540) % 360) - 180
            const facing = Math.cos((rel * Math.PI) / 180)
            const isFront = i === front
            const away = Math.abs(rel) > 95
            return (
              <Link key={it.k} to={it.href} className={'c3d__item stage' + (isFront ? ' is-front' : '')} draggable={false}
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)`, ['--f' as string]: Math.max(0, facing).toFixed(3) }}
                aria-hidden={away} tabIndex={isFront ? 0 : -1}
                onClick={(e) => { if (st.current.moved) { e.preventDefault(); return } if (!isFront) { e.preventDefault(); bring(i) } }}>
                <img {...rs(it.img, '(min-width: 56.25em) 22rem, 56vw')} alt="" draggable={false} loading={Math.abs(rel) < 100 ? 'eager' : 'lazy'} />
                <span className="c3d__t">{it.title}<small className="num">{it.sub}</small></span>
              </Link>)
          })}
        </div>
      </div>
      <div className="c3d__ui">
        <button className="icon c3d__btn" aria-label="Previous" onClick={() => go(-1)}><ArrowLeft size={20} /></button>
        <span className="sr-only" aria-live="polite">{cur.title}, {cur.sub}</span>
        <Link className="btn" to={cur.href}>Shop {cur.title.toLowerCase()}</Link>
        <button className="icon c3d__btn" aria-label="Next" onClick={() => go(1)}><ArrowRight size={20} /></button>
      </div>
    </div>
  )
}
