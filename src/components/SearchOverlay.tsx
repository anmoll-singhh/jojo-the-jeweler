import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { search, fromPrice, collections } from '../data/catalog'

export function SearchOverlay({ close }: { close: () => void }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    ref.current?.focus(); document.body.style.overflow = 'hidden'
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close()
    addEventListener('keydown', k); return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [close])
  const res = useMemo(() => search(q, 8), [q])
  const go = () => { if (q.trim()) nav('/search?q=' + encodeURIComponent(q.trim())); close() }
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search" data-lenis-prevent>
      <div className="wrap">
        <form className="search__bar" onSubmit={(e) => { e.preventDefault(); go() }}>
          <MagnifyingGlass size={26} />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chains, pendants, rings" aria-label="Search" />
          <button type="button" className="icon" aria-label="Close search" onClick={close}><X size={26} /></button>
        </form>
        <div className="search__res">
          {!q && <div className="search__hints">{collections.filter((c) => c.handle !== 'all').map((c) => <Link key={c.handle} to={'/collections/' + c.handle} className="btn btn--ghost">{c.title}</Link>)}</div>}
          {q && !res.length && <p className="lede">Nothing matches “{q}”. <Link className="link" to="/contact">Ask for a custom piece.</Link></p>}
          {res.map((p) => <Link key={p.handle} to={'/products/' + p.handle} className="sres"><span className="stage"><img src={p.images[0].src} alt="" loading="lazy" /></span><span>{p.title}</span><span className="muted num">{fromPrice(p)}</span></Link>)}
          {q && res.length > 0 && <button className="link" onClick={go}>All results for “{q}”</button>}
        </div>
      </div>
    </div>
  )
}
