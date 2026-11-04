import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from '@phosphor-icons/react'
import { useTitle } from '../App'
import { ProductCard } from '../components/Product'
import { collectionByHandle, collections, inCollection, isMetalOption, minPrice, newest } from '../data/catalog'
import type { Product } from '../data/types'
import { Lines } from './HomeV1'

const PRICE_BANDS: [string, number, number][] = [['Under $2,500', 0, 2500], ['$2,500 – $7,500', 2500, 7500], ['$7,500 – $20,000', 7500, 20000], ['$20,000 and up', 20000, Infinity]]
const SORTS: [string, string][] = [['featured', 'Featured'], ['new', 'Newest'], ['low', 'Price, low to high'], ['high', 'Price, high to low']]

/** Shop / collection page. Filters live in the URL (shareable), several values per group, OR within a group, AND across. */
export function Collection() {
  const { handle = 'all' } = useParams()
  const col = collectionByHandle(handle)
  useTitle(col?.title ?? 'All pieces')
  const [sp, setSp] = useSearchParams()
  const [open, setOpen] = useState(false)
  const base = inCollection(handle)
  const sort = sp.get('sort') || 'featured'
  const f = { metal: (sp.get('metal') || '').split(',').filter(Boolean), type: (sp.get('type') || '').split(',').filter(Boolean), price: (sp.get('price') || '').split(',').filter(Boolean), iced: sp.get('iced') === '1' }
  const metalOf = (p: Product) => p.options.find((o) => isMetalOption(o.name))?.values ?? []
  const test = (k: string, p: Product, vals: string[]) => {
    if (k === 'metal') return vals.some((v) => metalOf(p).includes(v))
    if (k === 'type') return vals.includes(p.productType)
    if (k === 'price') return vals.some((v) => { const b = PRICE_BANDS.find((x) => x[0] === v); return b && minPrice(p) >= b[1] && minPrice(p) < b[2] })
    return true
  }
  const passes = (p: Product, skip = '') => (!f.iced || skip === 'iced' || p.collections.includes('iced')) && (['metal', 'type', 'price'] as const).every((k) => k === skip || !f[k].length || test(k, p, f[k]))
  const count = (k: string, v: string) => base.filter((p) => passes(p, k) && test(k, p, [v])).length
  const list = useMemo(() => {
    let l = base.filter((p) => passes(p))
    if (sort === 'low') l = [...l].sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'high') l = [...l].sort((a, b) => minPrice(b) - minPrice(a))
    if (sort === 'new') l = newest(999).filter((p) => l.includes(p))
    return l
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, sp.toString()])
  const write = (n: URLSearchParams) => setSp(n, { replace: true })
  const toggle = (k: 'metal' | 'type' | 'price', v: string) => { const cur = f[k]; const nx = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]; const n = new URLSearchParams(sp); nx.length ? n.set(k, nx.join(',')) : n.delete(k); write(n) }
  const clearAll = () => { const n = new URLSearchParams(sp); ['metal', 'type', 'price', 'iced'].forEach((k) => n.delete(k)); write(n) }
  const active = f.metal.length + f.type.length + f.price.length + (f.iced ? 1 : 0)
  const metals = [...new Set(base.flatMap(metalOf))]
  const types = [...new Set(base.map((p) => p.productType))]
  const groups: [string, 'metal' | 'type' | 'price', string[]][] = [
    ...(types.length > 1 ? [['Piece', 'type', types] as [string, 'type', string[]]] : []),
    ...(metals.length > 1 ? [['Metal', 'metal', metals] as [string, 'metal', string[]]] : []),
    ['Price', 'price', PRICE_BANDS.map((b) => b[0])],
  ]
  const Filters = () => (
    <div className="filters__body">
      {groups.map(([label, key, vals]) => (
        <fieldset key={key} className="fgroup"><legend>{label}</legend>
          {vals.map((v) => { const n = count(key, v); return <label key={v} className={n ? '' : 'off'}><input type="checkbox" checked={f[key].includes(v)} onChange={() => toggle(key, v)} disabled={!n && !f[key].includes(v)} /> {v} <span className="num muted">{n}</span></label> })}
        </fieldset>))}
      {handle !== 'iced' && <label className="fgroup fgroup--row"><input type="checkbox" checked={f.iced} onChange={() => { const n = new URLSearchParams(sp); f.iced ? n.delete('iced') : n.set('iced', '1'); write(n) }} /> Iced out only</label>}
      {active > 0 && <button className="link small" onClick={clearAll}>Clear all</button>}
    </div>
  )
  return (
    <main id="main" className="page shop">
      <header className="shop__head wrap">
        <nav className="shop__nav" aria-label="Collections">{[{ handle: 'all', title: 'All pieces' }, ...collections.filter((c) => !['best-sellers'].includes(c.handle))].map((c) => <Link key={c.handle} to={'/collections/' + c.handle} className={c.handle === handle ? 'on' : ''}>{c.title}</Link>)}</nav>
        <h1 className="h1"><Lines lines={[col?.title ?? 'All pieces']} /></h1>
        <p className="lede rv">{col?.description || 'Every piece on the site. Solid gold, stamped; natural VS diamonds on anything iced.'}</p>
      </header>
      <div className="shop__bar wrap">
        <button className="btn btn--ghost only-m" onClick={() => setOpen(true)}><SlidersHorizontal size={18} /> Filter{active ? ` · ${active}` : ''}</button>
        <span className="num muted">{list.length} {list.length === 1 ? 'piece' : 'pieces'}</span>
        <label className="shop__sort"><span className="sr-only">Sort</span><select value={sort} onChange={(e) => { const n = new URLSearchParams(sp); e.target.value === 'featured' ? n.delete('sort') : n.set('sort', e.target.value); write(n) }}>{SORTS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
      </div>
      <div className="shop__body wrap">
        <aside className="filters only-d" aria-label="Filters"><Filters /></aside>
        <section className="grid" aria-live="polite">
          {list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 4} />)}
          {!list.length && <p className="lede">Nothing matches those filters. <button className="link" onClick={clearAll}>Clear them</button> or <Link className="link" to="/custom">ask for a custom piece</Link>.</p>}
        </section>
      </div>
      <div className={'fsheet' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Filters" aria-hidden={!open} inert={!open}>
        <div className="fsheet__scrim" onClick={() => setOpen(false)} />
        <div className="fsheet__panel">
          <div className="fsheet__head"><b>Filter</b><button className="icon" aria-label="Close filters" onClick={() => setOpen(false)}><X size={22} /></button></div>
          <Filters />
          <button className="btn btn--full" onClick={() => setOpen(false)}>Show {list.length} {list.length === 1 ? 'piece' : 'pieces'}</button>
        </div>
      </div>
    </main>
  )
}
