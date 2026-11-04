/**
 * SAMPLE reviews. These are placeholders so the layout can be judged with ratings in place; they are
 * not from real customers and every place that shows them says so. Replace with a Shopify reviews app
 * (Judge.me, Okendo, Shopify Product Reviews) when the store goes live, or set SAMPLE_REVIEWS = false
 * to hide every star and review on the site.
 */
import type { Product } from './types'

export const SAMPLE_REVIEWS = true

/** Deterministic per product so a page never changes between visits. */
const hash = (s: string) => { let n = 7; for (const c of s) n = (n * 31 + c.charCodeAt(0)) % 9973; return n }
export const rating = (p: Product) => { const n = hash(p.handle); return { stars: 4.6 + (n % 4) / 10, count: 6 + (n % 37) } }

const BY_TYPE: Record<string, [string, string, number][]> = {
  Chains: [['Sits flat, no kinks', 'Wore it every day for a month and the links still lie flat. Clasp clicks shut properly.', 5], ['Heavier than I expected', 'In a good way. The weight on the scale matched what they quoted.', 5], ['Length guide helped', 'Went one size up for a pendant, glad I did.', 4]],
  Pendants: [['Stones catch every light', 'Pictures don’t do it justice. Setting is clean on the back too.', 5], ['Bail fits my Cuban', 'Slid straight onto my 10mm.', 5], ['Took a little longer', 'A few days past the estimate but they kept me posted.', 4]],
  Bracelets: [['Clasp is solid', 'Double lock, no worries wearing it out.', 5], ['Measured right', 'Wrist plus half an inch like the guide says. Perfect.', 5], ['Shines up', 'Free clean on 47th Street brought it back like new.', 4]],
  Rings: [['Fit first time', 'Sent a photo of a ring that fits and they sized it right.', 5], ['Clean channel setting', 'No stones sitting high, nothing catches on clothes.', 5], ['Bigger in person', 'Bolder than the photos, which I wanted.', 4]],
  Earrings: [['Screw backs stay put', 'Wore them to a show, didn’t touch them once.', 5], ['Bright stones', 'Very white, very sharp.', 5], ['Good pair', 'Matched size and colour.', 4]],
  Grillz: [['Mold kit was easy', 'Clear instructions, fit snug on the first try.', 5], ['Comfortable', 'Can talk normally in them.', 5], ['Worth the wait', 'Production took time but the finish is right.', 4]],
  Watches: [['Smooth process', 'They explained every step and the result is clean.', 5], ['Stones set evenly', 'Bezel looks factory, not aftermarket.', 5], ['Great service', 'Answered every text.', 4]],
}
const NAMES = ['M. R.', 'D. J.', 'A. K.', 'T. L.', 'J. P.', 'K. S.']

export const reviewsFor = (p: Product) => {
  const list = BY_TYPE[p.productType] ?? BY_TYPE.Chains
  const n = hash(p.handle)
  return list.map(([title, body, stars], i) => ({ title, body, stars, name: NAMES[(n + i) % NAMES.length], when: `${2 + ((n + i * 5) % 9)} weeks ago` }))
}
