import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, X } from '@phosphor-icons/react'
import { useCart } from '../lib/store'
import { byHandle, metalFilter, money, rs } from '../data/catalog'
import { checkoutUrl } from '../data/shopify'
import { SAMPLE } from '../data/site'

export function CartDrawer() {
  const { lines, open, setOpen, setQty, total } = useCart()
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [open, setOpen])
  return (
    <div className={'drawer' + (open ? ' is-open' : '')} aria-hidden={!open} inert={!open}>
      <div className="drawer__scrim" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Your bag" data-lenis-prevent>
        <div className="drawer__head"><h2 className="h3">Bag <span className="num muted">{lines.reduce((s, l) => s + l.qty, 0) || ''}</span></h2><button className="icon" aria-label="Close bag" onClick={() => setOpen(false)}><X size={24} /></button></div>
        {!lines.length ? (
          <div className="drawer__empty"><p className="lede">Nothing in the bag yet.</p><Link className="btn" to="/collections/all" onClick={() => setOpen(false)}>Shop all pieces</Link></div>
        ) : (
          <>
            <ul className="lines">{lines.map((l) => (
              <li key={l.key}>
                <Link to={'/products/' + l.handle} onClick={() => setOpen(false)} className="stage"><img {...rs(l.image, '6rem')} style={{ filter: metalFilter(byHandle(l.handle)?.photoMetal, l.options.Metal) }} alt="" /></Link>
                <div>
                  <Link to={'/products/' + l.handle} onClick={() => setOpen(false)}><b>{l.title}</b></Link>
                  <p className="small muted">{Object.values(l.options).join(' · ')}</p>
                  <div className="qty"><button aria-label="Decrease quantity" onClick={() => setQty(l.key, l.qty - 1)}><Minus size={14} /></button><span className="num">{l.qty}</span><button aria-label="Increase quantity" onClick={() => setQty(l.key, l.qty + 1)}><Plus size={14} /></button><button className="link small" onClick={() => setQty(l.key, 0)}>Remove</button></div>
                </div>
                <b className="num">{money(l.price * l.qty)}</b>
              </li>))}
            </ul>
            <div className="drawer__foot">
              <div className="row"><span>Subtotal</span><b className="num">{money(total)}</b></div>
              <p className="small muted">{SAMPLE.shipping}</p>
              <a className="btn btn--full btn--lg" href={checkoutUrl(lines.map((l) => ({ variantId: l.variantId, qty: l.qty })))}>Checkout</a>
              <Link className="link small" to="/cart" onClick={() => setOpen(false)}>View bag</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
