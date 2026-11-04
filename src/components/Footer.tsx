import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { BRAND, NAV, SAMPLE } from '../data/site'
import { getLenis } from '../lib/motion'
import { Monogram } from './Logo'
import { useState, type FormEvent } from 'react'

/** Footer as a designed close: the name at full width, one contact fact as the headline, then the links. */
export function Footer() {
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState(false)
  const join = (e: FormEvent) => { e.preventDefault(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return; try { localStorage.setItem('jojo-list-signup', email) } catch { /* ignore */ } setOk(true) }
  return (
    <footer className="foot">
      <div className="foot__top wrap">
        <div className="foot__lead">
          <h2 className="h2">New drops land on Instagram first</h2>
          <a className="btn btn--ghost" href={BRAND.instagram} target="_blank" rel="noreferrer">{BRAND.handle} <ArrowUpRight size={18} /></a>
        </div>
        <form className="foot__list" onSubmit={join} aria-label="Email list">
          <label className="lab" htmlFor="foot-email">Or get them by email</label>
          <div className="foot__row">
            <input id="foot-email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={ok} />
            <button className="btn" disabled={ok}>{ok ? 'Saved' : 'Join'}</button>
          </div>
          <p className="small muted">{ok ? 'Email drops start when the new store opens. Until then they go up first on Instagram.' : 'No spam. Drops, restocks and custom work.'}</p>
        </form>
      </div>
      <nav className="foot__links wrap" aria-label="Footer">
        <div><h3>Shop</h3>{NAV.shop.map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}</div>
        <div><h3>JoJo</h3>{NAV.more.map(([t, h]) => <Link key={h} to={h}>{t}</Link>)}<Link to="/wishlist">Wishlist</Link><Link to="/search">Search</Link></div>
        <div><h3>Orders</h3><Link to="/about#shipping">Shipping</Link><Link to="/about#returns">Returns</Link><Link to="/about#warranty">Warranty</Link><Link to="/about#sizing">Sizing</Link></div>
        <div><h3>Pay with</h3><p className="small">{SAMPLE.payments.join(', ')}</p></div>
      </nav>
      <div className="foot__name wrap" aria-hidden="true"><Monogram size={48} /><span>JoJo The Jeweler</span></div>
      <div className="foot__base wrap">
        <span>© {new Date().getFullYear()} {BRAND.name}</span>
        <button className="link" onClick={() => { const l = getLenis(); if (l) l.scrollTo(0); else scrollTo({ top: 0, behavior: 'smooth' }) }}>Back to top</button>
        <Link to="/v2">The film version</Link>
        <a href="https://wavesmvmnt.com" target="_blank" rel="noopener noreferrer">Site by WAVES</a>
      </div>
    </footer>
  )
}
