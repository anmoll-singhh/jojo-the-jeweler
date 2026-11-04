import { chromium } from '@playwright/test'
const b = await chromium.launch()
const errs = []
const page = async (w, h) => { const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); return p }
const go = (p, u) => p.goto('http://localhost:4173' + u, { waitUntil: 'networkidle' })
const walk = async (p, h) => { const H = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < H; y += h * 0.7) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(110) } await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500) }
for (const [n, u, w, h] of [['home-d', '/', 1440, 900], ['home-m', '/', 390, 844], ['custom-d', '/custom', 1440, 900], ['custom-m', '/custom', 390, 844], ['about-d', '/about', 1440, 900], ['about-m', '/about', 390, 844]]) {
  const p = await page(w, h); await go(p, u); await walk(p, h)
  console.log(n, 'overflow', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth))
  await p.screenshot({ path: `/tmp/gen/r-${n}.png`, fullPage: true }); await p.close()
}
{ const p = await page(1440, 900); await go(p, '/'); await p.hover('.nav__shopbtn'); await p.waitForTimeout(700); await p.screenshot({ path: '/tmp/gen/r-mega.png' })
  await p.mouse.move(700, 800); await p.waitForTimeout(600); console.log('mega closes on leave', await p.locator('.mega.open').count() === 0)
  // carousel: next button, drag
  await p.locator('.sbp').scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
  const now = () => p.locator('.c3d .sr-only').textContent(); const before = await now()
  await p.getByRole('button', { name: 'Next' }).click(); await p.waitForTimeout(1000)
  const after = await now()
  const box = await p.locator('.c3d__stage').boundingBox()
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.mouse.move(box.x + box.width / 2 - 420, box.y + box.height / 2, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(1000)
  const dragged = await now()
  console.log('carousel', before, '→ next', after, '→ drag', dragged)
  await p.screenshot({ path: '/tmp/gen/r-c3d.png' })
  await p.locator('.c3d__item.is-front').click(); await p.waitForTimeout(600); console.log('front click →', new URL(p.url()).pathname)
  await p.close() }
console.log('errors', errs)
await b.close()
