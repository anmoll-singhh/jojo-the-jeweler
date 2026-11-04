import { chromium } from '@playwright/test'
const [,, url, w = '390'] = process.argv
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 844 } })
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(500)
const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const out = []; document.querySelectorAll('body *').forEach((e) => { const r = e.getBoundingClientRect(); if (r.right > W + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed') out.push(`${e.tagName.toLowerCase()}.${[...e.classList].join('.')} right=${Math.round(r.right)} w=${Math.round(r.width)}`) }); return { W, sw: document.documentElement.scrollWidth, out: out.slice(0, 12) } })
console.log(JSON.stringify(r, null, 1)); await b.close()
