import { useMemo, useRef, useState } from 'react'
import { useModal } from '../lib/a11y'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { ProductCard } from '../components/Product'
import { collectionByHandle, collections, inCollection, isMetalOption, minPrice, newest } from '../data/catalog'
import type { Product } from '../data/types'
import { Lines } from './HomeV1'
import { NotFound } from './Pages'

// [url key, label, from, to] — keys are URL-safe; labels contain commas, which the old comma-separated URL split apart
const PRICE_BANDS: [string, string, number, number][] = [['u2500', 'Under $2,500', 0, 2500], ['2500-7500', '$2,500 – $7,500', 2500, 7500], ['7500-20000', '$7,500 – $20,000', 7500, 20000], ['20000+', '$20,000 and up', 20000, Infinity]]
const SEP = '|'
const labelOf = (k: string, v: string) => (k === 'price' ? PRICE_BANDS.find((b) => b[0] === v)?.[1] ?? v : v)
const SORTS: [string, string][] = [['featured', 'Featured'], ['new', 'Newest'], ['low', 'Price, low to high'], ['high', 'Price, high to low']]

/** Shop / collection page. Filters live in the URL (shareable), several values per group, OR within a group, AND across. */
export function Collection() {
  const { handle = 'all' } = useParams()
  const col = collectionByHandle(handle)
  const unknown = handle !== 'all' && !col
  useTitle(unknown ? 'Not found' : col?.title ?? 'All pieces')
  const [sp, setSp] = useSearchParams()
  const [open, setOpen] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  useModal(open, sheet, () => setOpen(false))
  const base = inCollection(handle)
  const sort = sp.get('sort') || 'featured'
  const f = { metal: (sp.get('metal') || '').split(SEP).filter(Boolean), type: (sp.get('type') || '').split(SEP).filter(Boolean), price: (sp.get('price') || '').split(SEP).filter(Boolean), iced: sp.get('iced') === '1' }
  const metalOf = (p: Product) => p.options.find((o) => isMetalOption(o.name))?.values ?? []
  const test = (k: string, p: Product, vals: string[]) => {
    if (k === 'metal') return vals.some((v) => metalOf(p).includes(v))
    if (k === 'type') return vals.includes(p.productType)
    if (k === 'price') return vals.some((v) => { const b = PRICE_BANDS.find((x) => x[0] === v); return b && minPrice(p) >= b[2] && minPrice(p) < b[3] })
    return true
  }
  const passes = (p: Product, skip = '') => (!f.iced || skip === 'iced' || p.collections.includes('iced')) && (['metal', 'type', 'price'] as const).every((k) => k === skip || !f[k].length || test(k, p, f[k]))
  const count = (k: string, v: string) => base.filter((p) => passes(p, k) && test(k, p, [v])).length
  const key = sp.toString()
  const list = useMemo(() => {
    let l = base.filter((p) => passes(p))
    if (sort === 'low') l = [...l].sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'high') l = [...l].sort((a, b) => minPrice(b) - minPrice(a))
    if (sort === 'new') l = newest(999).filter((p) => l.includes(p))
    return l
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, key])
  const write = (n: URLSearchParams) => setSp(n, { replace: true })
  const toggle = (k: 'metal' | 'type' | 'price', v: string) => { const cur = f[k]; const nx = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]; const n = new URLSearchParams(sp); if (nx.length) n.set(k, nx.join(SEP)); else n.delete(k); write(n) }
  const clearAll = () => { const n = new URLSearchParams(sp); ['metal', 'type', 'price', 'iced'].forEach((k) => n.delete(k)); write(n) }
  const active = f.metal.length + f.type.length + f.price.length + (f.iced ? 1 : 0)
  const metals = [...new Set(base.flatMap(metalOf))]
  const types = [...new Set(base.map((p) => p.productType))]
  const groups: [string, 'metal' | 'type' | 'price', string[]][] = [
    ...(types.length > 1 ? [['Piece', 'type', types] as [string, 'type', string[]]] : []),
    ...(metals.length > 1 ? [['Metal', 'metal', metals] as [string, 'metal', string[]]] : []),
    ['Price', 'price', PRICE_BANDS.map((b) => b[0]).filter((v) => count('price', v) > 0 || f.price.includes(v))],
  ]
  const filters = (
    <div className="filters__body">
      {groups.map(([label, key, vals]) => (
        <fieldset key={key} className="fgroup"><legend>{label}</legend>
          {vals.map((v) => { const n = count(key, v); return <label key={v} className={n ? '' : 'off'}><input type="checkbox" checked={f[key].includes(v)} onChange={() => toggle(key, v)} disabled={!n && !f[key].includes(v)} /> <span>{labelOf(key, v)}</span> <span className="num muted">{n}</span></label> })}
        </fieldset>))}
      {handle !== 'iced' && <label className="fgroup--row"><input type="checkbox" checked={f.iced} onChange={() => { const n = new URLSearchParams(sp); if (f.iced) n.delete('iced'); else n.set('iced', '1'); write(n) }} /> Iced out only</label>}
      {active > 0 && <button className="link small" onClick={clearAll}>Clear all</button>}
    </div>
  )
  if (unknown) return <NotFound />
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
        <label className="shop__sort"><span className="sr-only">Sort</span><select value={sort} onChange={(e) => { const n = new URLSearchParams(sp); if (e.target.value === 'featured') n.delete('sort'); else n.set('sort', e.target.value); write(n) }}>{SORTS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
      </div>
      <div className="shop__body wrap">
        <aside className="filters only-d" aria-label="Filters">{filters}</aside>
        <section className="grid" aria-live="polite">
          {list.map((p, i) => <ProductCard key={p.handle} p={p} eager={i < 4} />)}
          {!list.length && <p className="lede shop__none">Nothing matches those filters. <button className="link" onClick={clearAll}>Clear them</button> or <Link className="link" to="/custom">ask for a custom piece</Link>.</p>}
        </section>
      </div>
      <div ref={sheet} className={'fsheet' + (open ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Filters" aria-hidden={!open} inert={!open}>
        <div className="fsheet__scrim" onClick={() => setOpen(false)} />
        <div className="fsheet__panel">
          <div className="fsheet__head"><b>Filter</b><button className="icon" aria-label="Close filters" onClick={() => setOpen(false)}><X size={22} /></button></div>
          {filters}
          <button className="btn btn--full" onClick={() => setOpen(false)}>Show {list.length} {list.length === 1 ? 'piece' : 'pieces'}</button>
        </div>
      </div>
    </main>
  )
}
