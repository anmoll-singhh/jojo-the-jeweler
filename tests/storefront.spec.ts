import { readFileSync } from 'node:fs'
import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const ROUTES = ['/', '/v2', '/collections/all', '/collections/chains', '/products/miami-cuban-link-chain', '/products/custom-grillz', '/custom', '/about', '/contact', '/search?q=cuban', '/cart', '/wishlist', '/nope-404']
const VIEWPORTS = [['small phone', 320, 568], ['phone', 390, 844], ['tablet', 820, 1180], ['laptop', 1366, 768], ['desktop', 1920, 1080]] as const

/** Collect console errors and failed requests for a page. */
function watch(page: Page) {
  const errs: string[] = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  // third-party embeds (the map) depend on the test machine's network, so only our own requests count
  page.on('requestfailed', (r) => { if (!/favicon|\.webm$/.test(r.url()) && r.url().startsWith('http://localhost')) errs.push('request failed: ' + r.url()) })
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
        // count laid-out lines from offsetHeight (not affected by the reveal transforms); line-mask headings sum their lines
        const tall = await page.$$eval('main h1, main h2', (els) => els.filter((e) => {
          const lh = parseFloat(getComputedStyle(e).lineHeight) || parseFloat(getComputedStyle(e).fontSize)
          const parts = e.querySelectorAll(':scope > .ln')
          const lines = parts.length ? [...parts].reduce((n, l) => n + Math.round((l as HTMLElement).offsetHeight / lh), 0) : Math.round((e as HTMLElement).offsetHeight / lh)
          return lines > 2
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
    await expect(checkout).toHaveAttribute('href', '/checkout')
    await page.locator('.drawer__head button').click()
    await expect(page.locator('.drawer.is-open')).toHaveCount(0)
    await page.goto('/cart')
    await expect(page.locator('.lines--page li')).toHaveCount(1)
    await page.getByRole('button', { name: 'Remove' }).click()
    await expect(page.locator('h1')).toContainText('empty')
  })

  test('buy now goes to checkout, which validates and composes the order', async ({ page }) => {
    await page.goto('/products/diamond-studs', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Buy now' }).click()
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.locator('.co-sum li')).toHaveCount(1)
    await page.getByRole('button', { name: /Send order to JoJo/ }).click()
    await expect(page.locator('.cu-err')).toContainText('name')
    await page.getByLabel('Name').fill('Test Buyer')
    await page.getByLabel('Phone').fill('(212) 555-0100')
    await page.getByRole('radio', { name: /Pick up/ }).click()
    await page.getByRole('button', { name: /Send order to JoJo/ }).click()
    await expect(page.locator('.send .cu-msg')).toContainText('Diamond')
    await expect(page.locator('.send .cu-msg')).toContainText('Pick up')
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
    const saved = page.locator('.wishpage > .grid .card')
    await expect(saved).toHaveCount(1)
    await saved.first().locator('.heart').click()
    await expect(saved).toHaveCount(0)
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
    await page.locator('.filters').getByLabel(/Chains/).click()
    await expect(page).toHaveURL(/type=Chains/)
    await expect.poll(() => page.locator('.grid .card').count()).toBeLessThan(n)
    await page.locator('.shop__sort select').selectOption('high')
    await expect(page).toHaveURL(/sort=high/)
    const prices = await page.$$eval('.grid .card p.num', (els) => els.map((e) => Number((e.textContent || '').replace(/[^0-9]/g, ''))))
    expect([...prices].sort((a, b) => b - a)).toEqual(prices)
    await page.getByRole('button', { name: 'Clear all' }).click()
    await expect(page.locator('.grid .card')).toHaveCount(n)
  })

  test('homepage Weigh it: grams and price change, adds to bag', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const out = page.locator('.weigh__out b')
    const lcd = page.locator('.weigh .lcd__val')
    await out.scrollIntoViewIfNeeded()
    const a = await out.textContent(), g = await lcd.textContent()
    await page.locator('.weigh').getByRole('radio', { name: '12mm' }).click()
    await expect(out).not.toHaveText(a!)
    await expect(lcd).not.toHaveText(g!)
    await page.locator('.weigh').getByRole('radio', { name: 'Rose gold' }).click()
    await expect(page.locator('.weigh').getByRole('radio', { name: 'Rose gold' })).toHaveAttribute('aria-checked', 'true')
    await page.locator('.weigh .addbtn').click()
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
    await page.locator('.menu__main a', { hasText: /^Rings/ }).click()
    await expect(page).toHaveURL(/\/collections\/rings/)
  })

  test('desktop Shop panel opens on hover, lists categories, closes on leave', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('/')
    await page.hover('.nav__shopbtn')
    await expect(page.locator('.mega.open')).toBeVisible()
    await expect(page.locator('.mega__list a')).toHaveCount(8)
    await page.mouse.move(600, 700)
    await expect(page.locator('.mega.open')).toHaveCount(0)
    await page.locator('.nav__shopbtn').click()
    await page.locator('.mega__list a', { hasText: 'Grillz' }).click()
    await expect(page).toHaveURL(/\/collections\/grillz/)
  })

  test('shop-by-piece carousel turns and opens the front category', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('.sbp').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.locator('.c3d__ui .btn')).toHaveText('Shop pendants')
    await page.locator('.c3d__item.is-front').click()
    await expect(page).toHaveURL(/\/collections\/pendants/)
  })

  test('design controller switches theme, fonts and sizes live', async ({ page }) => {
    await page.goto('/?design=1', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Design' }).click()
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    await page.getByRole('button', { name: /Daylight/ }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'daylight')
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(bg)
    await page.getByRole('tab', { name: 'Type' }).click()
    await page.getByRole('button', { name: /Fraunces Light/ }).click()
    await expect(page.locator('html')).toHaveAttribute('data-pair', 'serif')
    const h = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('h2.h2')!).fontSize))
    await page.locator('.dc__sl input').first().fill('1.3')
    await expect.poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('h2.h2')!).fontSize))).toBeGreaterThan(h * 1.2)
    await page.getByRole('tab', { name: 'Effects' }).click()
    await page.getByRole('button', { name: 'Mono' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-img', 'mono')
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
    await expect(page).toHaveTitle(/^Tennis chain \| .*JoJo The Jeweler$/)
    expect(await page.locator('h1').count()).toBe(1)
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/products\/tennis-chain$/)
    const ld = JSON.parse((await page.locator('#ld-page').textContent()) || '{}')
    expect(ld['@graph'].map((x: { '@type': string }) => x['@type'])).toEqual(['Product', 'BreadcrumbList'])
    // static heads written at build (vite preview serves the SPA shell, Vercel serves these files)
    const html = readFileSync('dist/about/index.html', 'utf8')
    expect(html).toContain('FAQPage'); expect(html).toContain('<link rel="canonical" href="https://jojo-the-jeweler-two.vercel.app/about"')
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

test.describe('round 2', () => {
  test('PDP metal choice recolours the photo and says so; stars and sample reviews show', async ({ page }) => {
    await page.goto('/products/miami-cuban-link-chain', { waitUntil: 'networkidle' })
    const img = page.locator('.gallery__slide img').first()
    expect(await img.evaluate((e) => getComputedStyle(e).filter)).toBe('none')
    await page.getByRole('radio', { name: 'White gold' }).click()
    await expect.poll(() => img.evaluate((e) => getComputedStyle(e).filter)).toContain('grayscale')
    await expect(page.locator('.gallery__note')).toContainText('Photographed in yellow gold')
    await expect(page.locator('.buy__stars .stars')).toBeVisible()
    await expect(page.locator('#reviews .reviews__list li')).toHaveCount(3)
    await expect(page.locator('#reviews .sample')).toContainText('Sample reviews')
  })

  test('PDP opens on the metal the photo was shot in', async ({ page }) => {
    await page.goto('/products/iced-cuban-link-chain', { waitUntil: 'networkidle' })
    await expect(page.getByRole('radio', { name: 'Rose gold' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.locator('.gallery__note')).toHaveCount(0)
  })

  test('card metal dots preview the colour', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('/collections/chains', { waitUntil: 'networkidle' })
    const card = page.locator('.card').first()
    await card.getByRole('button', { name: 'White gold' }).click()
    expect(await card.locator('.card__frame img').first().evaluate((e) => getComputedStyle(e).filter)).toContain('grayscale')
  })

  test('phone menu has a Shop section listing every category', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const shop = page.locator('.menu__acc')
    await expect(shop).toHaveAttribute('aria-expanded', 'true')
    for (const c of ['Chains', 'Pendants', 'Bracelets', 'Rings', 'Earrings', 'Grillz', 'Watches', 'All pieces']) await expect(page.locator('#menu-shop a', { hasText: new RegExp('^' + c) }).first()).toBeVisible()
    await shop.click()
    await expect(shop).toHaveAttribute('aria-expanded', 'false')
    for (const t of ['Custom', 'About', 'Contact']) await expect(page.locator('.menu__main > a', { hasText: t })).toBeVisible()
  })

  test('homepage order', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const order = await page.$$eval('main > section', (s) => s.map((e) => e.className.split(' ')[0]))
    expect(order).toEqual(['hero', 'sbp', 'weigh', 'picks', 'look', 'proof', 'room'])
  })

  test('custom inquiry: validation, three steps, review', async ({ page }) => {
    await page.goto('/custom', { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.removeItem('jojo-custom-draft'))
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Next/ }).click()
    await expect(page.locator('.cu-err')).toContainText('Pick what kind of piece')
    await page.getByRole('radio', { name: 'Pendant' }).click()
    await page.getByRole('radio', { name: 'Rose gold' }).click()
    await page.getByRole('radio', { name: 'Natural diamonds' }).click()
    await page.getByRole('button', { name: /Next/ }).click()
    await page.getByLabel('Describe the idea').fill('My initials in baguettes with a crown on top')
    await page.getByRole('radio', { name: '$5,000 – $10,000' }).click()
    await page.getByRole('button', { name: /Next/ }).click()
    await page.getByLabel('Name').fill('Test Buyer')
    await page.getByLabel('Phone').fill('+1 212 555 0100')
    await page.getByRole('button', { name: /Review/ }).click()
    const msg = page.locator('.cu-msg')
    for (const t of ['Test Buyer', 'Pendant', 'Rose gold', 'Natural diamonds', 'crown', '$5,000 – $10,000', '+1 212 555 0100']) await expect(msg).toContainText(t)
    await expect(page.getByRole('button', { name: /Send to JoJo/ })).toBeVisible()
  })

  test('contact: topic shows watch field, validation, actions', async ({ page }) => {
    await page.goto('/contact?topic=watch', { waitUntil: 'networkidle' })
    await expect(page.getByRole('radio', { name: 'Selling a watch' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByLabel(/The watch/)).toBeVisible()
    await page.getByRole('button', { name: /Send to JoJo/ }).click()
    await expect(page.locator('.cu-err')).toContainText('name')
    await expect(page.locator('.ct-acts a')).toHaveCount(4)
    await expect(page.locator('.ct-acts a').first()).toHaveAttribute('href', /^sms:/)
    await expect(page.locator('.ct-now')).toContainText('47th Street')
  })

  test('about: shutter, story, counters, steps', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' })
    await expect(page.locator('.shutter')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Started at\s*fifteen/ })).toBeAttached()
    await page.locator('.ab-facts').scrollIntoViewIfNeeded()
    await expect.poll(() => page.locator('.ab-count').nth(1).textContent(), { timeout: 5000 }).toBe('109K')
    await expect(page.locator('.ab-steps__list li')).toHaveCount(3)
  })

  test('failed image is retried, then hidden (no broken icon)', async ({ page }) => {
    let hits = 0
    await page.route('**/media/products/rope-chain-1*.webp*', (r) => { hits++; return r.abort() })
    await page.goto('/products/rope-chain', { waitUntil: 'networkidle' })
    await expect.poll(() => hits, { timeout: 8000 }).toBeGreaterThanOrEqual(2)
    await expect(page.locator('.gallery__slide img').first()).toHaveClass(/img-failed/)
  })
})
