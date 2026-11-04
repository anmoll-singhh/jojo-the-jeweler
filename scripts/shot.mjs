import { chromium } from '@playwright/test'
const [,, url, out, w = '1440', h = '900', full = '1'] = process.argv
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 })
const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e)))
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(800)
// scroll through to trigger reveals, then back to top
const H = await p.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < H; y += +h * 0.8) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(120) }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600)
const ov = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
await p.screenshot({ path: out, fullPage: full === '1' })
console.log(JSON.stringify({ url, w, height: H, overflow: ov, errs }))
await b.close()
