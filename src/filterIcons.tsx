import { useId } from 'react'
/** Icons for the collection filters: diamond shapes, setting styles (ring seen from above) and metal swatches. */
import { SHAPE_ICON, type Shape, type Setting } from './data/ring-attrs'

/** Outline + table (half-size copy) + facet lines from each outline point to the table. */
export function ShapeIcon({ shape }: { shape: Shape }) {
  const { d, facets = [] } = SHAPE_ICON[shape]
  const inner = (x: number, y: number) => [12 + (x - 12) * 0.5, 12 + (y - 12) * 0.5]
  return (
    <svg className="ficon ficon--shape" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
      <path d={d} transform="translate(6 6) scale(.5)" className="ficon__table" />
      {facets.map(([x, y]) => { const [ix, iy] = inner(x, y); return <line key={x + ',' + y} x1={x} y1={y} x2={ix} y2={iy} className="ficon__facet" /> })}
    </svg>
  )
}

/** A ring seen from above: the band runs across, the head sits in the middle. */
export function SettingIcon({ setting }: { setting: Setting }) {
  const band = (gap: number) => <>
    <path d={`M2 14.2H${24 - gap}M${24 + gap} 14.2H46`} /><path d={`M2 17.8H${24 - gap}M${24 + gap} 17.8H46`} />
  </>
  const stone = (cx: number, r: number) => <><circle cx={cx} cy={16} r={r} /><circle cx={cx} cy={16} r={r * 0.45} className="ficon__table" /></>
  const dots = (xs: number[], r = 0.85) => xs.map((x) => <circle key={x} cx={x} cy={16} r={r} className="ficon__dot" />)
  const body = {
    solitaire: <>{band(6.5)}{stone(24, 6)}</>,
    trilogy: <>{band(13)}{stone(24, 5.4)}{stone(14.6, 3.4)}{stone(33.4, 3.4)}</>,
    halo: <>{band(8.5)}{stone(24, 4.6)}{Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={24 + Math.cos(a) * 6.9} cy={16 + Math.sin(a) * 6.9} r={0.9} className="ficon__dot" /> })}</>,
    'hidden-halo': <>{band(6.5)}{stone(24, 5.6)}<circle cx={24} cy={16} r={7.4} className="ficon__hidden" /></>,
    pave: <>{band(6.5)}{stone(24, 5.6)}{dots([5, 8.5, 12, 15.5, 32.5, 36, 39.5, 43])}</>,
    accented: <>{band(6.5)}{stone(24, 5.6)}{dots([13.5, 16, 32, 34.5], 1.1)}</>,
  }[setting]
  return <svg className="ficon ficon--setting" viewBox="0 0 48 32" aria-hidden="true">{body}</svg>
}

const METAL_FILL: Record<string, [string, string]> = {
  'Yellow Gold': ['#f3dc9b', '#c99a45'], 'White Gold': ['#f4f4f4', '#b9bcc1'], 'Rose gold': ['#f5c9b7', '#c9836b'],
}
export function MetalSwatch({ metal }: { metal: string }) {
  const [a, b] = METAL_FILL[metal] ?? (/rose/i.test(metal) ? METAL_FILL['Rose gold'] : /white|silver|platinum/i.test(metal) ? METAL_FILL['White Gold'] : METAL_FILL['Yellow Gold'])
  // unique per instance: the first copy can sit in a hidden panel, and a gradient referenced
  // from a display:none subtree paints nothing
  const id = 'mg' + useId().replace(/\W/g, '')
  return (
    <svg className="ficon ficon--metal" viewBox="0 0 24 24" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <circle cx="12" cy="12" r="9.5" fill={`url(#${id})`} stroke="rgba(0,0,0,.18)" />
    </svg>
  )
}
