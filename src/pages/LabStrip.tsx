import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { LIFESTYLE } from '../data/content'

/** Photo-strip alternatives for the About page, built with JoJo's own lifestyle photos. */
const PICS = LIFESTYLE.slice(0, 12).map((l) => ({ src: l.src.replace('.webp', '-sm.webp'), alt: l.alt }))

/* 1 · Dome: photos line the inside of a sphere; drag to look around, tap to bring one forward */
export function Dome() {
  const [rot, setRot] = useState({ x: -6, y: 0 }), [open, setOpen] = useState<number | null>(null)
  const drag = useRef<{ x: number; y: number; rx: number; ry: number; moved: boolean } | null>(null)
  useEffect(() => { let r = 0; const tick = () => { if (!drag.current && open === null) setRot((p) => ({ ...p, y: p.y + 0.04 })); r = requestAnimationFrame(tick) }; r = requestAnimationFrame(tick); return () => cancelAnimationFrame(r) }, [open])
  const rows = [-44, -22, 0, 22, 44], cols = 18
  const tiles = rows.flatMap((lat, ri) => Array.from({ length: cols }, (_, ci) => ({ lat, lon: ci * (360 / cols) + (ri % 2 ? 10 : 0), pic: PICS[(ci * 7 + ri * 5) % PICS.length], k: ri * cols + ci })))
  return (
    <div className="dome" onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y, moved: false }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true; setRot({ y: d.ry + dx * 0.25, x: Math.max(-30, Math.min(30, d.rx - dy * 0.2)) }) }}
      onPointerUp={() => { setTimeout(() => (drag.current = null), 0) }}>
      <div className="dome__sphere" style={{ transform: `translateZ(var(--r)) rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
        {tiles.map((t) => <button key={t.k} className="dome__tile" style={{ transform: `rotateY(${t.lon}deg) rotateX(${t.lat}deg) translateZ(calc(var(--r) * -1))` }} onClick={() => !drag.current?.moved && setOpen(t.k % PICS.length)}><img src={t.pic.src} alt="" draggable={false} /></button>)}
      </div>
      <p className="lab-strip__hint">Drag to look around · tap a photo</p>
      {open !== null && <div className="dome__open" onClick={() => setOpen(null)}><img src={PICS[open].src.replace('-sm.webp', '.webp')} alt={PICS[open].alt} /><span>{PICS[open].alt}</span></div>}
    </div>
  )
}

/* 2 · Circular: a curved ribbon of photos that bends with drag / wheel and keeps drifting */
export function Circular() {
  const [off, setOff] = useState(0), v = useRef(0.25), drag = useRef<{ x: number; o: number } | null>(null)
  useEffect(() => { let r = 0; const tick = () => { if (!drag.current) { setOff((o) => o + v.current); v.current += (0.25 - v.current) * 0.04 } r = requestAnimationFrame(tick) }; r = requestAnimationFrame(tick); return () => cancelAnimationFrame(r) }, [])
  const n = PICS.length * 2, step = 360 / n
  return (
    <div className="circ" onWheel={(e) => { v.current += e.deltaY * 0.02 }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, o: off }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => { const d = drag.current; if (d) { const no = d.o - (e.clientX - d.x) * 0.15; v.current = (no - off) * 0.6; setOff(no) } }}
      onPointerUp={() => (drag.current = null)}>
      <div className="circ__ring" style={{ transform: `translateZ(calc(var(--r) * -1)) rotateX(-4deg) rotateY(${-off}deg)` }}>
        {Array.from({ length: n }, (_, i) => <figure key={i} className="circ__item" style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))` }}><img src={PICS[i % PICS.length].src} alt="" draggable={false} /></figure>)}
      </div>
      <p className="lab-strip__hint">Drag or scroll over it</p>
    </div>
  )
}

/* 3 · Image trail: photos pop up behind the cursor (or finger) like flashbulbs, then fade */
export function Trail() {
  const box = useRef<HTMLDivElement>(null), [items, setItems] = useState<{ id: number; x: number; y: number; i: number; r: number }[]>([])
  const last = useRef({ x: 0, y: 0, n: 0, id: 0 })
  const move = (x: number, y: number) => {
    const L = last.current, r = box.current!.getBoundingClientRect(); const px = x - r.left, py = y - r.top
    if (Math.hypot(px - L.x, py - L.y) < 90) return
    L.x = px; L.y = py; L.n++; L.id++
    const it = { id: L.id, x: px, y: py, i: L.n % PICS.length, r: (Math.random() - 0.5) * 14 }
    setItems((s) => [...s.slice(-9), it]); setTimeout(() => setItems((s) => s.filter((q) => q.id !== it.id)), 1300)
  }
  useEffect(() => { // idle demo: a path through the box until the visitor moves
    let t = 0, live = true; const el = box.current!
    const iv = setInterval(() => { if (!live) return; t += 0.35; const r = el.getBoundingClientRect(); move(r.left + r.width * (0.5 + 0.36 * Math.cos(t)), r.top + r.height * (0.5 + 0.3 * Math.sin(t * 1.7))) }, 140)
    const stop = () => { live = false }; el.addEventListener('pointermove', stop, { once: true })
    return () => clearInterval(iv)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="trail" ref={box} onPointerMove={(e) => move(e.clientX, e.clientY)}>
      <h3 className="trail__h">Worn by the culture</h3>
      {items.map((it) => <img key={it.id} className="trail__img" src={PICS[it.i].src} alt="" style={{ left: it.x, top: it.y, '--r': `${it.r}deg` } as CSSProperties} />)}
      <p className="lab-strip__hint">Move the cursor, or swipe, across the page</p>
    </div>
  )
}

/* 4 · Contact sheet: a film contact sheet; the picks get a red grease-pencil circle; tap to enlarge */
export function Contact() {
  const [open, setOpen] = useState<number | null>(null)
  const picks = new Set([1, 4, 9])
  return (
    <div className="sheet">
      <div className="sheet__film">
        {PICS.map((p, i) => (
          <button key={i} className={'sheet__frame' + (picks.has(i) ? ' is-pick' : '')} onClick={() => setOpen(i)} style={{ '--d': `${i * 60}ms` } as CSSProperties}>
            <img src={p.src} alt={p.alt} loading="lazy" />
            <span className="sheet__no">{String(i + 1).padStart(2, '0')}A</span>
            {picks.has(i) && <svg className="sheet__circle" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 4 C 82 3, 97 22, 96 50 C 95 80, 76 97, 48 96 C 20 95, 3 78, 4 50 C 5 24, 22 6, 55 7" /></svg>}
          </button>
        ))}
      </div>
      <p className="sheet__cap">JOJO · 47TH ST · ROLL 15 · KODAK 400TX</p>
      {open !== null && <div className="dome__open" onClick={() => setOpen(null)}><img src={PICS[open].src.replace('-sm.webp', '.webp')} alt={PICS[open].alt} /><span>{PICS[open].alt}</span></div>}
    </div>
  )
}
