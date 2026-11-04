import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Handbag, Heart, List, MagnifyingGlass, X, ArrowUpRight } from '@phosphor-icons/react'
import { useCart, useWish } from '../lib/store'
import { getLenis } from '../lib/motion'
import { BRAND, NAV } from '../data/site'
import { collections, inCollection } from '../data/catalog'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'
import { CartDrawer } from './CartDrawer'

/**
 * Nav: wordmark, four plain links, three actions. Transparent over heroes (`.nav--over`), solid
 * once scrolled. The menu opens as a full-screen sheet with a clip-path reveal; its sections
 * stagger in (CSS) and the first collection images live inside it, so the menu is a page, not a list.
 */
export function Nav({ over = false }: { over?: boolean }) {
  const { count, setOpen } = useCart()
  const wl = useWish()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const closeBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => { setMenu(false); setSearch(false) }, [pathname])
  useEffect(() => { const f = () => setScrolled(scrollY > 24); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const l = getLenis(); if (l) { if (menu) l.stop(); else l.start() }
    if (menu) closeBtn.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [menu])
  const feature = NAV.shop.slice(0, 4).map(([t, h]) => ({ t, h, p: inCollection(h.split('/').pop()!)[0] }))
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={'nav' + (over && !scrolled && !menu ? ' nav--over' : '') + (scrolled ? ' nav--scrolled' : '')}>
        <div className="nav__l">
          <button className="icon nav__menu" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><List size={24} /></button>
          <nav className="nav__links only-d" aria-label="Primary">
            {NAV.shop.slice(0, 3).map(([t, h]) => <NavLink key={h} to={h}>{t}</NavLink>)}
            <NavLink to="/collections/all">Shop all</NavLink>
          </nav>
        </div>
        <Link to="/" className="nav__logo" aria-label={BRAND.name + ' home'}><Logo /></Link>
        <div className="nav__r">
          <nav className="nav__links only-d" aria-label="Secondary">{NAV.more.map(([t, h]) => <NavLink key={h} to={h}>{t}</NavLink>)}</nav>
          <button className="icon" aria-label="Search" onClick={() => setSearch(true)}><MagnifyingGlass size={22} /></button>
          <Link className="icon badge only-d" to="/wishlist" aria-label={`Wishlist, ${wl.length} saved`}><Heart size={22} />{wl.length > 0 && <i>{wl.length}</i>}</Link>
          <button className="icon badge bag" aria-label={`Bag, ${count} items`} onClick={() => setOpen(true)}><Handbag size={22} />{count > 0 && <i key={count}>{count}</i>}</button>
        </div>
      </header>

      <div className={'menu' + (menu ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!menu} inert={!menu} data-lenis-prevent>
        <div className="menu__top"><Logo /><button ref={closeBtn} className="icon" aria-label="Close menu" onClick={() => setMenu(false)}><X size={26} /></button></div>
        <div className="menu__body">
          <nav className="menu__main" aria-label="Shop">
            {NAV.shop.map(([t, h], i) => <Link key={h} to={h} style={{ ['--i' as string]: i }}>{t}<span className="num">{collections.find((c) => c.handle === h.split('/').pop())?.products.length ?? ''}</span></Link>)}
          </nav>
          <nav className="menu__more" aria-label="More">
            {NAV.more.map(([t, h], i) => <Link key={h} to={h} style={{ ['--i' as string]: i + 6 }}>{t}</Link>)}
            <Link to="/wishlist" style={{ ['--i' as string]: 9 }}>Wishlist{wl.length > 0 && <span className="num"> {wl.length}</span>}</Link>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" style={{ ['--i' as string]: 10 }}>Instagram <ArrowUpRight size={16} /></a>
          </nav>
          <div className="menu__feat">
            {feature.filter((f) => f.p).map((f, i) => <Link key={f.h} to={f.h} className="stage" style={{ ['--i' as string]: i + 2 }}><img src={f.p!.images[0].src} alt="" loading="lazy" /><span>{f.t}</span></Link>)}
          </div>
        </div>
      </div>
      {search && <SearchOverlay close={() => setSearch(false)} />}
      <CartDrawer />
    </>
  )
}
