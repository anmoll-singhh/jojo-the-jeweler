import { chromium } from '@playwright/test'
const P = 'http://localhost:4173/media/products/'
const rows = [
  ['miami-cuban-link-chain-1-800', 'yellow', { white: 'grayscale(1) brightness(1.12) contrast(1.06)', rose: 'hue-rotate(-24deg) saturate(.85) brightness(1.02)' }],
  ['iced-cuban-link-chain-1-800', 'rose', { yellow: 'hue-rotate(22deg) saturate(1.25)', white: 'grayscale(1) brightness(1.08) contrast(1.05)' }],
  ['tennis-bracelet-1-800', 'white', { yellow: 'sepia(.85) saturate(2.4) hue-rotate(-6deg) brightness(.98)', rose: 'sepia(.7) saturate(1.8) hue-rotate(-28deg) brightness(1)' }],
]
const html = `<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(3,260px);gap:6px">` + rows.map(([f, base, m]) =>
  [`<div><img src="${P}${f}.webp" style="width:260px"><p style="color:#fff;margin:2px">${base} (original)</p></div>`, ...Object.entries(m).map(([k, flt]) => `<div><img src="${P}${f}.webp" style="width:260px;filter:${flt}"><p style="color:#fff;margin:2px">→ ${k}</p></div>`)].join('')).join('') + '</body>'
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 1100 } })
await p.goto('http://localhost:4173/robots.txt'); await p.setContent(html); await p.waitForTimeout(800); await p.screenshot({ path: '/tmp/gen/tint.png', fullPage: true }); await b.close()
