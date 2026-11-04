import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Handbag, Heart, List, MagnifyingGlass, X, ArrowUpRight, CaretDown, Plus } from '@phosphor-icons/react'
import { useCart, useWish } from '../lib/store'
import { getLenis } from '../lib/motion'
import { BRAND, NAV } from '../data/site'
import { collections, inCollection, rs } from '../data/catalog'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'
import { CartDrawer } from './CartDrawer'

/**
 * Nav (remounted on every route change by App, which closes menus and search).
 * Desktop: Shop (hover or click opens the category panel), Custom, About · wordmark · search, wishlist, bag.
 * Phone: menu · wordmark · search, bag. Transparent over heroes (`.nav--over`), solid
 * once scrolled. The menu opens as a full-screen sheet with a clip-path reveal; its sections
 * stagger in (CSS) and the first collection images live inside it, so the menu is a page, not a list.
 */
export function Nav({ over = false }: { over?: boolean }) {
  const { count, setOpen } = useCart()
  const wl = useWish()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [shop, setShop] = useState(false)
  const [shopOpen, setShopOpen] = useState(true)
  const shut = useRef<number | undefined>(undefined)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const openShop = () => { clearTimeout(shut.current); setShop(true) }
  const closeShop = (delay = 160) => { clearTimeout(shut.current); shut.current = window.setTimeout(() => setShop(false), delay) }
  useEffect(() => { if (!shop) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && setShop(false); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [shop])
  useEffect(() => () => clearTimeout(shut.current), [])
  useEffect(() => { const f = () => setScrolled(scrollY > 24); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const l = getLenis(); if (l) { if (menu) l.stop(); else l.start() }
    if (menu) closeBtn.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [menu])
  const feature = NAV.shop.slice(0, 4).map(([t, h]) => ({ t, h, p: inCollection(h.split('/').pop()!).find((x) => x.sample) ?? inCollection(h.split('/').pop()!)[0] }))
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={'nav' + (over && !scrolled && !menu && !shop ? ' nav--over' : '') + (scrolled ? ' nav--scrolled' : '')}>
        <div className="nav__l">
          <button className="icon nav__menu" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><List size={24} /></button>
          <nav className="nav__links only-d" aria-label="Primary">
            <div className="nav__shop" onPointerEnter={(e) => e.pointerType === 'mouse' && openShop()} onPointerLeave={(e) => e.pointerType === 'mouse' && closeShop()}>
              <button className={'nav__shopbtn' + (shop ? ' on' : '')} aria-expanded={shop} aria-controls="shop-panel" onClick={() => (shop ? setShop(false) : openShop())}>Shop <CaretDown size={14} /></button>
              <div id="shop-panel" className={'mega' + (shop ? ' open' : '')} inert={!shop} onFocus={openShop} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) closeShop(0) }}>
                <div className="mega__in">
                  <ul className="mega__list">
                    {NAV.shop.map(([t, h]) => { const c = collections.find((x) => x.handle === h.split('/').pop()); return <li key={h}><Link to={h} onClick={() => setShop(false)}>{t}{c && <span className="num">{c.products.length}</span>}</Link></li> })}
                  </ul>
                  <div className="mega__feat">
                    {feature.filter((f) => f.p).slice(0, 3).map((f) => <Link key={f.h} to={f.h} className="stage" onClick={() => setShop(false)}><img {...rs(f.p!.images[0].src, '20vw')} alt="" loading="lazy" /><span>{f.t}</span></Link>)}
                  </div>
                </div>
              </div>
            </div>
            <NavLink to="/custom">Custom</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
        <Link to="/" className="nav__logo" aria-label={BRAND.name + ' home'}><Logo /></Link>
        <div className="nav__r">
          <button className="icon" aria-label="Search" onClick={() => setSearch(true)}><MagnifyingGlass size={22} /></button>
          <Link className="icon badge only-d" to="/wishlist" aria-label={`Wishlist, ${wl.length} saved`}><Heart size={22} />{wl.length > 0 && <i>{wl.length}</i>}</Link>
          <button className="icon badge bag" aria-label={`Bag, ${count} items`} onClick={() => setOpen(true)}><Handbag size={22} />{count > 0 && <i key={count}>{count}</i>}</button>
        </div>
      </header>

      <div className={'menu' + (menu ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!menu} inert={!menu} data-lenis-prevent>
        <div className="menu__top"><Logo /><button ref={closeBtn} className="icon" aria-label="Close menu" onClick={() => setMenu(false)}><X size={26} /></button></div>
        <div className="menu__body">
          <nav className="menu__main" aria-label="Menu">
            <button className="menu__a menu__acc" aria-expanded={shopOpen} aria-controls="menu-shop" onClick={() => setShopOpen(!shopOpen)} style={{ ['--i' as string]: 0 }}>Shop <Plus size={22} className={shopOpen ? 'rot' : ''} /></button>
            <div id="menu-shop" className={'menu__sub' + (shopOpen ? ' open' : '')} inert={!shopOpen}>
              <div>
                {NAV.shop.map(([t, h]) => <Link key={h} to={h}>{t}<span className="num">{collections.find((c) => c.handle === h.split('/').pop())?.products.length ?? ''}</span></Link>)}
                <div className="menu__feat">
                  {feature.filter((f) => f.p).slice(0, 2).map((f) => <Link key={f.h} to={f.h} className="stage"><img {...rs(f.p!.images[0].src, '20vw')} alt="" loading="lazy" /><span>{f.t}</span></Link>)}
                </div>
              </div>
            </div>
            {[['Custom', '/custom'], ['About', '/about'], ['Contact', '/contact']].map(([t, h], i) => <Link key={h} to={h} className="menu__a" style={{ ['--i' as string]: i + 1 }}>{t}</Link>)}
          </nav>
          <nav className="menu__more" aria-label="More">
            <Link to="/wishlist" style={{ ['--i' as string]: 5 }}>Wishlist{wl.length > 0 && <span className="num"> {wl.length}</span>}</Link>
            <Link to="/search" style={{ ['--i' as string]: 6 }}>Search</Link>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" style={{ ['--i' as string]: 7 }}>Instagram <ArrowUpRight size={16} /></a>
            <a href={BRAND.smsHref} style={{ ['--i' as string]: 8 }}>Text {BRAND.phone}</a>
          </nav>
        </div>
      </div>
      {search && <SearchOverlay close={() => setSearch(false)} />}
      <CartDrawer />
    </>
  )
}
