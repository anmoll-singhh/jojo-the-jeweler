/**
 * Diamond shapes drawn top-down, the way a jeweler's chart shows them: the girdle outline, the table,
 * and facet lines (brilliant cuts) or concentric steps (step cuts). Outlines are generated from the
 * shape's geometry so every shape shares one drawing style.
 */
export type Shape = 'Round' | 'Princess' | 'Cushion' | 'Oval' | 'Emerald' | 'Pear' | 'Marquise' | 'Radiant' | 'Asscher' | 'Heart' | 'Trillion'
type P = [number, number]
const N = 16 // facet points around the girdle
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const ellipse = (rx: number, ry: number, n = N): P[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2 - Math.PI / 2; return [rx * Math.cos(t), ry * Math.sin(t)] })
const poly = (pts: P[], n = N): P[] => { // resample a closed polygon to n evenly spaced points
  const seg = pts.map((p, i) => [p, pts[(i + 1) % pts.length]] as [P, P]), len = seg.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), tot = len.reduce((s, x) => s + x, 0)
  return Array.from({ length: n }, (_, k) => { let d = (k / n) * tot, i = 0; while (d > len[i]) { d -= len[i]; i++ } return lerp(seg[i][0], seg[i][1], d / len[i]) })
}
const cutRect = (w: number, h: number, c: number): P[] => [[-w + c, -h], [w - c, -h], [w, -h + c], [w, h - c], [w - c, h], [-w + c, h], [-w, h - c], [-w, -h + c]]
const superellipse = (rx: number, ry: number, e: number, n = N): P[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2 - Math.PI / 4; const c = Math.cos(t), s = Math.sin(t); return [rx * Math.sign(c) * Math.abs(c) ** (2 / e), ry * Math.sign(s) * Math.abs(s) ** (2 / e)] })
const pear = (n = N): P[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; const x = 30 * Math.sin(t) * (1 - 0.35 * Math.cos(t)) , y = -40 * Math.cos(t) * 1 + 6; return [x * (0.75 + 0.25 * (1 + Math.cos(t)) / 2), y] })
const marquise = (n = N): P[] => { const h = 44, w = 23, half = n / 2, pts: P[] = []; for (let i = 0; i < half; i++) { const y = -h + (2 * h * i) / half; pts.push([w * (1 - (y / h) ** 2), y]) } for (let i = 0; i < half; i++) { const y = h - (2 * h * i) / half; pts.push([-w * (1 - (y / h) ** 2), y]) } return pts }
const heart = (n = N): P[] => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; const x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); return [x * 2.4, y * 2.4 - 4] })
const trillion = (): P[] => { const r = 44, pts: P[] = []; for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 3; const b = a + (2 * Math.PI) / 3; const A: P = [r * Math.cos(a), r * Math.sin(a) + 8], B: P = [r * Math.cos(b), r * Math.sin(b) + 8]; pts.push(lerp(A, B, 0.06), lerp(A, B, 0.94)) } return pts }

const GEO: Record<Shape, { outline: P[]; step?: boolean }> = {
  Round: { outline: ellipse(42, 42) },
  Oval: { outline: ellipse(31, 43) },
  Princess: { outline: poly([[-38, -38], [38, -38], [38, 38], [-38, 38]]) },
  Cushion: { outline: superellipse(38, 40, 3.2) },
  Emerald: { outline: cutRect(28, 42, 10), step: true },
  Asscher: { outline: cutRect(38, 38, 13), step: true },
  Radiant: { outline: poly(cutRect(30, 41, 9)) },
  Pear: { outline: pear() },
  Marquise: { outline: marquise() },
  Heart: { outline: heart(24) },
  Trillion: { outline: poly(trillion(), 12) },
}
const d = (pts: P[]) => 'M' + pts.map((p) => p.map((v) => v.toFixed(2)).join(' ')).join(' L') + ' Z'

export function Diamond({ shape, size = 64, className = '' }: { shape: Shape; size?: number; className?: string }) {
  const g = GEO[shape]
  const o = g.outline, table = o.map(([x, y]) => [x * 0.5, y * 0.5] as P)
  const id = 'dg-' + shape
  return (
    <svg className={'diamond ' + className} width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".45" stopColor="#dfe8f0" stopOpacity=".55" /><stop offset="1" stopColor="#9fb0c0" stopOpacity=".35" /></linearGradient>
      </defs>
      <path d={d(o)} fill={`url(#${id})`} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      {g.step ? [0.78, 0.6].map((k) => <path key={k} d={d(o.map(([x, y]) => [x * k, y * k] as P))} fill="none" stroke="currentColor" strokeWidth=".8" opacity=".7" />)
        : o.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={table[Math.floor(i / 2) * 2 % o.length][0]} y2={table[Math.floor(i / 2) * 2 % o.length][1]} stroke="currentColor" strokeWidth=".7" opacity=".6" />)}
      <path d={d(g.step ? o.map(([x, y]) => [x * 0.42, y * 0.42] as P) : table.filter((_, i) => i % 2 === 0))} fill="#fff" fillOpacity=".25" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
export const SHAPES: { shape: Shape; note: string }[] = [
  { shape: 'Round', note: 'The most sparkle; the classic.' },
  { shape: 'Oval', note: 'Looks bigger for its weight; lengthens the finger.' },
  { shape: 'Princess', note: 'Square, sharp corners, lots of fire.' },
  { shape: 'Cushion', note: 'Soft square with rounded corners; vintage feel.' },
  { shape: 'Emerald', note: 'Step-cut rectangle; clean, mirror-like flashes.' },
  { shape: 'Radiant', note: 'Cut corners with brilliant sparkle.' },
  { shape: 'Pear', note: 'A teardrop: round on one end, pointed on the other.' },
  { shape: 'Marquise', note: 'Long and pointed; the most spread for its weight.' },
  { shape: 'Asscher', note: 'Square step cut with a hall-of-mirrors look.' },
  { shape: 'Heart', note: 'A statement; best from about 1 carat up.' },
  { shape: 'Trillion', note: 'A triangle; bold alone or as side stones.' },
]
