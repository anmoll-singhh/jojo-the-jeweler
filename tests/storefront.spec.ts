import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const ROUTES = ['/', '/v2', '/collections/all', '/collections/chains', '/products/miami-cuban-link-chain', '/products/custom-grillz', '/custom', '/about', '/contact', '/search?q=cuban', '/cart', '/wishlist', '/nope-404']
const VIEWPORTS = [['small phone', 320, 568], ['phone', 390, 844], ['tablet', 820, 1180], ['laptop', 1366, 768], ['desktop', 1920, 1080]] as const

/** Collect console errors and failed requests for a page. */
function watch(page: Page) {
  const errs: string[] = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  page.on('requestfailed', (r) => { if (!/favicon|\.webm$/.test(r.url())) errs.push('request failed: ' + r.url()) })
  page.on('response', (r) => { if (r.status() >= 400 && /\.(webp|png|jpg|svg|mp4|js|css)(\?|$)/.test(r.url())) errs.push(`${r.status()} ${r.url()}`) })
  return errs
}

test.describe('routes', () => {
  for (const r of ROUTES) {
    test(`renders ${r} without errors or broken media`, async ({ page }) => {
      const errs = watch(page)
      await page.goto(r, { waitUntil: 'networkidle' })
      await expect(page.locator('main#main')).toBeVisible()
      await expect(page.locator('h1').first()).toBeVisible()
      // every visible image loaded
      const broken = await page.$$eval('img', (imgs) => imgs.filter((i) => i.getBoundingClientRect().width > 0 && i.complete && i.naturalWidth === 0).map((i) => i.src))
      expect(broken, 'broken images').toEqual([])
      expect(errs, 'console/network errors').toEqual([])
    })
  }
})

test.describe('responsive', () => {
  for (const [name, w, h] of VIEWPORTS) {
    for (const r of ['/', '/v2', '/collections/all', '/products/miami-cuban-link-chain', '/custom', '/about']) {
      test(`${r} has no horizontal overflow at ${name} (${w}×${h})`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h })
        await page.goto(r, { waitUntil: 'networkidle' })
        // scroll through so pinned/lazy sections lay out
        const H = await page.evaluate(() => document.body.scrollHeight)
        for (let y = 0; y < H; y += h) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60) }
        const sw = await page.evaluate(() => document.documentElement.scrollWidth)
        expect(sw, 'scrollWidth').toBeLessThanOrEqual(w + 1)
        // headings ≤ 2 lines (taste rule): line-height × 2.2 as the ceiling
        const tall = await page.$$eval('main h1, main h2', (els) => els.filter((e) => {
          // count rendered text lines: distinct top offsets of the text's client rects
          const r = document.createRange(); r.selectNodeContents(e)
          const tops = new Set([...r.getClientRects()].filter((x) => x.width > 2).map((x) => Math.round(x.top / 4)))
          return tops.size > 2
        }).map((e) => e.textContent?.trim().slice(0, 40)))
        expect(tall, 'headings over two lines').toEqual([])
      })
    }
  }
})

test.describe('commerce', () => {
  test('variant switching, quantity, add to bag, drawer, cart page, remove', async ({ page }) => {
    await page.goto('/products/miami-cuban-link-chain', { waitUntil: 'networkidle' })
    const price = page.locator('.buy__price .num').first()
    const before = await price.textContent()
    await page.getByRole('radio', { name: '15mm' }).click()
    await expect(price).not.toHaveText(before!)
    await page.getByRole('radio', { name: 'Rose gold' }).click()
    await expect(page.getByRole('radio', { name: 'Rose gold' })).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('button', { name: 'Increase' }).click()
    await expect(page.locator('.qty--big .num')).toHaveText('2')
    await page.locator('.buy__add').click()
    await expect(page.locator('.drawer.is-open')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.lines li')).toHaveCount(1)
    await expect(page.locator('.lines .qty .num')).toHaveText('2')
    await expect(page.locator('.nav .bag i')).toHaveText('2')
    const checkout = page.locator('.drawer__foot a.btn')
    await expect(checkout).toHaveAttribute('href', /myshopify\.com\/cart\/\d+:2/)
    await page.locator('.drawer__head button').click()
    await expect(page.locator('.drawer.is-open')).toHaveCount(0)
    await page.goto('/cart')
    await expect(page.locator('.lines--page li')).toHaveCount(1)
    await page.getByRole('button', { name: 'Remove' }).click()
    await expect(page.locator('h1')).toContainText('empty')
  })

  test('buy now links to Shopify cart permalink', async ({ page }) => {
    await page.goto('/products/diamond-studs')
    await expect(page.getByRole('link', { name: 'Buy now' })).toHaveAttribute('href', /myshopify\.com\/cart\/\d+:1/)
  })

  test('quick add from a card', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('/collections/pendants', { waitUntil: 'networkidle' })
    const card = page.locator('.card').first()
    await card.locator('.card__media').hover()
    await card.locator('.card__quick').click()
    await expect(page.locator('.qv__panel')).toBeVisible()
    await page.locator('.qv__foot .addbtn').click()
    await expect(page.locator('.drawer.is-open')).toBeVisible({ timeout: 5000 })
  })

  test('wishlist persists across pages', async ({ page }) => {
    await page.goto('/collections/rings', { waitUntil: 'networkidle' })
    await page.locator('.card .heart').first().click()
    await page.goto('/wishlist')
    await expect(page.locator('.card')).toHaveCount(1)
    await page.locator('.card .heart').first().click()
    await expect(page.locator('.card')).toHaveCount(0)
  })

  test('search overlay and search page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('textbox', { name: 'Search' }).fill('tennis')
    await expect(page.locator('.sres')).toHaveCount(2)
    await page.getByRole('textbox', { name: 'Search' }).press('Enter')
    await expect(page).toHaveURL(/\/search\?q=tennis/)
    await expect(page.locator('.grid .card')).toHaveCount(2)
  })

  test('collection filters and sort update the URL and the grid', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('/collections/all', { waitUntil: 'networkidle' })
    const n = await page.locator('.grid .card').count()
    await page.locator('.filters').getByLabel(/Chains/).check()
    await expect(page).toHaveURL(/type=Chains/)
    expect(await page.locator('.grid .card').count()).toBeLessThan(n)
    await page.locator('.shop__sort select').selectOption('high')
    await expect(page).toHaveURL(/sort=high/)
    const prices = await page.$$eval('.grid .card .num', (els) => els.map((e) => Number((e.textContent || '').replace(/[^0-9]/g, ''))))
    expect([...prices].sort((a, b) => b - a)).toEqual(prices)
    await page.getByRole('button', { name: 'Clear all' }).click()
    await expect(page.locator('.grid .card')).toHaveCount(n)
  })

  test('homepage Cuban builder prices and adds', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const out = page.locator('.builder__out dd.num').first()
    await out.scrollIntoViewIfNeeded()
    const a = await out.textContent()
    await page.locator('.builder').getByRole('radio', { name: '12mm' }).click()
    await expect(out).not.toHaveText(a!)
    await page.locator('.builder .addbtn').click()
    await expect(page.locator('.drawer.is-open')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('navigation and controller', () => {
  test('menu opens, links work, escape closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('.menu.open')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.menu.open')).toHaveCount(0)
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.locator('.menu__main a', { hasText: 'Rings' }).click()
    await expect(page).toHaveURL(/\/collections\/rings/)
  })

  test('design controller switches theme live', async ({ page }) => {
    await page.goto('/?design=1')
    await page.getByRole('button', { name: 'Design' }).click()
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    await page.getByRole('button', { name: /Modern minimal/ }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'minimal')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(bg)
    await page.getByRole('button', { name: 'Fraunces', exact: true }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-fd', 'fraunces')
  })

  test('404 route', async ({ page }) => {
    await page.goto('/this-does-not-exist')
    await expect(page.locator('h1')).toContainText('isn’t here')
  })
})

test.describe('accessibility and seo', () => {
  for (const r of ['/', '/collections/all', '/products/miami-cuban-link-chain', '/custom']) {
    test(`axe: no serious violations on ${r}`, async ({ page }) => {
      await page.goto(r, { waitUntil: 'networkidle' })
      const res = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze()
      const serious = res.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))
      expect(serious.map((v) => `${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }
  test('title, description, one h1, lang, sitemap and robots', async ({ page, request }) => {
    await page.goto('/products/tennis-chain')
    await expect(page).toHaveTitle(/Tennis chain · JoJo The Jeweler/)
    expect(await page.locator('h1').count()).toBe(1)
    expect(await page.getAttribute('html', 'lang')).toBe('en-US')
    expect((await page.locator('meta[name=description]').getAttribute('content'))?.length).toBeGreaterThan(50)
    expect((await request.get('/sitemap.xml')).status()).toBe(200)
    expect((await request.get('/robots.txt')).status()).toBe(200)
  })
  test('reduced motion: content visible without animation', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } })
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'load' })
    await expect(page.locator('.hero__txt .lede')).toBeVisible()
    await page.goto('/v2', { waitUntil: 'load' })
    await expect(page.locator('.v2-open__h .display')).toBeVisible()
    await ctx.close()
  })
})
