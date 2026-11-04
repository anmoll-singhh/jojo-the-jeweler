// Full-page screenshots after walking the page (so reveals fire). usage: node scripts/dev/shots.mjs name:/path:w:h ...
import { chromium, firefox, webkit } from '@playwright/test'
const engines = { chromium, firefox, webkit }
const eng = process.env.ENGINE || 'chromium'
const b = await engines[eng].launch()
const out = []
for (const spec of process.argv.slice(2)) {
  const [name, path, w, h] = spec.split(':')
  const p = await b.newPage({ viewport: { width: +w, height: +h } })
  const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)))
  await p.goto('http://localhost:4173' + path, { waitUntil: 'networkidle' }).catch(() => {})
  const H = await p.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < H; y += +h * 0.6) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(90) }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(700)
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  await p.screenshot({ path: `/tmp/gen/s-${eng}-${name}.png`, fullPage: true })
  out.push(`${eng} ${name} h=${H} overflow=${ov} errs=${JSON.stringify(errs)}`)
  await p.close()
}
await b.close(); console.log(out.join('\n'))
