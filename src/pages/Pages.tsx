import { Link, useSearchParams } from 'react-router-dom'
import { Minus, Plus } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { ProductCard, Rail } from '../components/Product'
import { byHandle, metalFilter, money, search, bestSellers, rs } from '../data/catalog'
import type { Product } from '../data/types'
import { SAMPLE } from '../data/site'
import { checkoutUrl } from '../data/shopify'
import { useCart, useWish, wish } from '../lib/store'
import { Lines } from './HomeV1'

/* ── Search ───────────────────────────────────────────── */
export function SearchPage() {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || ''
  useTitle(q ? `Search: ${q}` : 'Search')
  const res = search(q, 40)
  return (
    <main id="main" className="page results wrap">
      <h1 className="h1"><Lines lines={['Search']} /></h1>
      <form className="search__bar" onSubmit={(e) => { e.preventDefault(); const v = (new FormData(e.currentTarget).get('q') as string).trim(); setSp(v ? { q: v } : {}) }}>
        <input name="q" defaultValue={q} placeholder="Search chains, pendants, rings" aria-label="Search" autoFocus />
        <button className="btn">Search</button>
      </form>
      <p className="muted results__n">{q ? `${res.length} ${res.length === 1 ? 'result' : 'results'} for “${q}”` : 'Type to search the whole collection.'}</p>
      {q && !res.length ? <div className="results__none"><p className="lede">Nothing matches “{q}”.</p><Link className="btn btn--ghost" to="/custom">Ask for a custom piece</Link></div> : <section className="grid">{res.map((p) => <ProductCard key={p.handle} p={p} />)}</section>}
      {!q && <Rail title="Start here" items={bestSellers(8)} />}
    </main>
  )
}

/* ── Cart ─────────────────────────────────────────────── */
export function Cart() {
  useTitle('Bag')
  const { lines, setQty, total, clear } = useCart()
  if (!lines.length) return <main id="main" className="page bagpage wrap"><h1 className="h1"><Lines lines={['Your bag', 'is empty']} /></h1><Link className="btn btn--lg rv" to="/collections/all">Shop all pieces</Link><Rail title="Start here" items={bestSellers(8)} /></main>
  return (
    <main id="main" className="page bagpage wrap">
      <h1 className="h1"><Lines lines={['Bag']} /></h1>
      <div className="bagpage__grid">
        <ul className="lines lines--page rv-group">{lines.map((l) => (
          <li key={l.key}>
            <Link to={'/products/' + l.handle} className="stage"><img {...rs(l.image, '7rem')} style={{ filter: metalFilter(byHandle(l.handle)?.photoMetal, l.options.Metal) }} alt="" /></Link>
            <div><Link to={'/products/' + l.handle}><b>{l.title}</b></Link><p className="small muted">{Object.values(l.options).join(' · ')}</p>
              <div className="qty"><button aria-label="Decrease quantity" onClick={() => setQty(l.key, l.qty - 1)}><Minus size={14} /></button><span className="num">{l.qty}</span><button aria-label="Increase quantity" onClick={() => setQty(l.key, l.qty + 1)}><Plus size={14} /></button><button className="link small" onClick={() => setQty(l.key, 0)}>Remove</button></div></div>
            <b className="num">{money(l.price * l.qty)}</b>
          </li>))}
        </ul>
        <aside className="summary rv">
          <div className="row"><span>Subtotal</span><b className="num">{money(total)}</b></div>
          <p className="small muted">{SAMPLE.shipping} Taxes and shipping are calculated at checkout.</p>
          <a className="btn btn--full btn--lg" href={checkoutUrl(lines.map((l) => ({ variantId: l.variantId, qty: l.qty })))}>Checkout</a>
          <p className="small muted">Checkout runs on Shopify. Until the store is connected, the link opens the existing JoJo store.</p>
          <button className="link small" onClick={clear}>Empty the bag</button>
        </aside>
      </div>
    </main>
  )
}

/* ── Wishlist ─────────────────────────────────────────── */
export function Wishlist() {
  useTitle('Wishlist')
  const w = useWish()
  const l = w.map(byHandle).filter((x): x is Product => !!x)
  return (
    <main id="main" className="page wishpage wrap">
      <header className="wishpage__head"><h1 className="h1"><Lines lines={['Saved']} /></h1><p className="muted rv">{l.length ? `${l.length} saved on this device.` : 'Tap the heart on any piece to keep it here.'}</p>{l.length > 0 && <button className="link small rv" onClick={() => wish.set([])}>Clear</button>}</header>
      {l.length ? <section className="grid">{l.map((p) => <ProductCard key={p.handle} p={p} />)}</section> : <Link className="btn btn--lg" to="/collections/all">Browse the collection</Link>}
      {!l.length && <Rail title="Start here" items={bestSellers(8)} />}
    </main>
  )
}

export function NotFound() {
  useTitle('Not found')
  return <main id="main" className="page nf wrap"><h1 className="h1"><Lines lines={['That page', 'isn’t here']} /></h1><p className="lede rv">The piece may have sold, or the link is old.</p><div className="rv"><Link className="btn" to="/collections/all">Shop all pieces</Link> <Link className="link" to="/">Home</Link></div></main>
}
