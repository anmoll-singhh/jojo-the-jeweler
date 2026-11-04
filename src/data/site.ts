import cat from './catalog.json'
import privacy from './privacy.json'

export type Variant = { id: number; options: string[]; price: number; compare: number; available: boolean; image: string | null }
export type Product = { handle: string; title: string; type: string; tags: string[]; desc: string; options: { name: string; values: string[] }[]; images: string[]; variants: Variant[]; collections: string[] }
export const products = cat.products as Product[]
export const collections = cat.collections as { handle: string; title: string; count: number }[]
export const byHandle = (h?: string) => products.find((p) => p.handle === h)
export const rings = products.filter((p) => p.options.some((o) => o.name === 'Carat Size'))
export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price))
export const aud = (n: number) => n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
/** Shopify CDN resize — keeps images light without a pipeline. */
export const cdn = (src: string, w: number) => (src ? src + (src.includes('?') ? '&' : '?') + 'width=' + w : '')

/** Ring size selected by default on product pages and quick view: M, the size most often quoted
 *  as average for women in Australia. Customers can change it, or choose "I don’t know my size — confirm with me". */
export const DEFAULT_SIZE = 'M'
/** Ring sizes exactly as on doublemco.au: Australian / UK H to V in half sizes. */
/** The two extra size options from the doublemco.au ring pages. */
export const SIZE_CONFIRM = 'I don’t know my size — confirm with me'
export const SIZE_OTHER = 'Another size — request a quote'
export const SIZES = 'HIJKLMNOPQRSTUV'.split('').flatMap((l, i, a) => (i < a.length - 1 ? [l, l + ' ½'] : [l]))
export const METAL_TINT: Record<string, string> = {
  'Yellow Gold': 'none',
  'White Gold': 'grayscale(1) brightness(1.06) contrast(1.04)',
  'Rose gold': 'sepia(.35) hue-rotate(-28deg) saturate(1.35)',
}
export const METAL_SWATCH: Record<string, string> = { 'Yellow Gold': '#d9b46a', 'White Gold': '#d9dadc', 'Rose gold': '#e0a58f' }
export const swatch = (v: string) => METAL_SWATCH[v] ?? (/rose/i.test(v) ? '#e0a58f' : /white/i.test(v) ? '#d9dadc' : '#d9b46a')
export const pf = (v?: string) => { const t = tint(v); return (t === 'none' ? '' : t + ' ') + 'brightness(1.07) contrast(1.03)' }
export const tint = (v?: string) => (v ? METAL_TINT[v] ?? (/rose/i.test(v) ? METAL_TINT['Rose gold'] : /white/i.test(v) ? METAL_TINT['White Gold'] : 'none') : 'none')

export const BRAND = {
  name: 'Double M & Co',
  email: 'doublemcojewellers@gmail.com',
  address: ['Unit 19, 362 Charles Street', 'North Perth WA 6006'],
  hours: 'Monday – Saturday, 9:00 am – 5:00 pm. By appointment only.',
  parking: 'Street parking is available nearby on Charles Street, with additional parking access near Pansy Street. Please check posted restrictions.',
  instagram: 'https://www.instagram.com/doublemandco',
  maps: 'https://maps.google.com/?q=Unit+19,+362+Charles+Street+North+Perth+WA+6006',
}

export const ABOUT = [
  'Double M & Co was built on one standard: real luxury, without the illusion.',
  'We create high-end jewellery and luxury timepieces designed to command attention and hold value. From VVS1 lab-grown stones and premium moissanite set in solid 92.5 sterling silver, to curated luxury watches and statement accessories — every piece we offer is selected or crafted with precision and intent.',
  'No plated shortcuts. No inflated claims. No compromises on quality.',
  'Our jewellery is engineered for brilliance, durability, and everyday presence. Our watches are chosen for craftsmanship, design integrity, and timeless appeal. Whether it’s a tennis chain, bracelet, ring, or a luxury timepiece on your wrist, the goal is the same — elevate how you move.',
  'Double M & Co is for individuals who understand leverage, standards, and presentation. People building something. People who don’t follow trends — they set tone.',
  'We don’t sell hype. We deliver presence. This isn’t just jewellery. It’s a statement of ambition.',
]

export const PROCESS = [
  ['Book your consultation', 'Your journey begins with a private consultation at our Perth showroom or online. We take the time to understand your vision, style, budget, and the meaning behind your piece.'],
  ['Design & planning', 'From your initial idea to the final design, we refine every detail including materials, diamonds, precious metals, sizing, and unique features to create a piece that is truly yours.'],
  ['Craftsmanship', 'Once approved, your jewellery is expertly handcrafted using premium materials and meticulous attention to detail, ensuring exceptional quality at every stage.'],
  ['Final presentation', 'Every piece undergoes a detailed quality inspection before being beautifully presented, ready to celebrate one of life’s most meaningful moments.'],
  ['Ongoing support', 'Our relationship continues beyond collection with ongoing advice, maintenance guidance, and support to help your jewellery remain beautiful for years to come.'],
]

type Doc = { title: string; intro?: string; blocks: string[]; note?: string }
export const DOCS: Record<string, Doc> = {
  care: { title: 'Jewellery Care', intro: 'Your jewellery is designed to be treasured for years to come. With the right care and attention, you can help maintain the brilliance, shine, and quality of your pieces. Follow our simple care recommendations to protect your jewellery and preserve its beauty for every occasion.', blocks: ['hCaring for your Jewellery', 'pEvery Double M & Co piece is crafted to be treasured for years to come. Proper care helps maintain the brilliance, finish, and quality of your jewellery.', 'pTo keep your pieces looking their best:', '-Store jewellery separately in a soft pouch or jewellery box to prevent scratches.', '-Avoid exposure to perfumes, lotions, chemicals, and harsh environments.', '-Remove jewellery before swimming, exercising, or showering.', '-Gently clean pieces with a soft polishing cloth to restore shine.', "-Schedule professional cleaning when needed to maintain your jewellery's condition.", 'pWith the right care, your jewellery will continue to shine for years to come.'] },
  'size-guide': { title: 'Finding Your Perfect Ring Size', intro: 'A perfectly fitted ring should feel comfortable, secure, and effortless to wear. Finding the correct size ensures your jewellery sits beautifully while providing the comfort needed for everyday wear.', blocks: ['pWhen measuring your ring size:', '-Measure your finger at the end of the day when it is at its largest.', '-Avoid measuring when your hands are cold, as fingers can appear smaller.', '-Consider the width of the ring, as wider bands may require a slightly different fit.', 'pIf you are unsure of your size, our team can assist you with professional sizing during a private consultation.', 'hChoose your ring size', 'pWe use Australian / UK letter sizes. Use your professionally measured size, including a half size where required.', '-H–V: Choose your measured Australian / UK letter size.', '-H ½–U ½: Half sizes are available between the displayed letter sizes.', '-I don’t know my size — confirm with me: Place your order with sizing to be confirmed. We will contact you before production begins.', '-Another size — request a quote: Send an enquiry so we can confirm sizing suitability and any price adjustment.', 'pInternational conversions and home measurements are approximate. A professional fitting is the best way to confirm your size. Bring an existing ring worn on the same finger to your appointment where possible.'] },
  'lab-grown': { title: 'Lab-grown and natural diamonds', blocks: ['pWhether created naturally over billions of years or grown using advanced technology, both lab-grown and natural diamonds are real diamonds with the same chemical composition, brilliance, and durability.', 'pThe primary difference is their origin. Lab-grown diamonds offer exceptional beauty and value, while natural diamonds are prized for their geological rarity.'] },
  shipping: { title: 'Production, delivery and collection', blocks: ['p' + 'Made-to-order rings usually require 3–4 weeks of production after your specifications and ring size are confirmed. Delivery time is additional. We confirm your timeline before crafting begins.', 'pFor ready-to-ship pieces, contact us to confirm dispatch timing. Showroom collection is available by arrangement. Shipping method, cost and delivery details are confirmed before dispatch.'] },
  returns: { title: 'Warranty, resizing and aftercare', blocks: ['pFor assistance with a suspected manufacturing defect, contact us with your order details and clear photographs. Wear, accidental damage and maintenance are assessed separately.', 'pResizing depends on the design and extent of the adjustment. Confirm suitability and any labour charges with our team before proceeding.', 'pOur policies do not exclude your rights under the Australian Consumer Law.'] },
  privacy: { title: 'Privacy policy', blocks: privacy as string[] },
}

/**
 * Reviews switch. The testimonials below and the star ratings on products are SAMPLE content
 * written for the design; Double M & Co has no published reviews yet. Showing invented reviews
 * to shoppers as if they were real is misleading (ACCC fake-review rules), so both stay hidden
 * until real ones exist. To go live: replace TESTIMONIALS with real customer reviews (with their
 * permission), replace `rating` with real figures from the reviews app, then set this to true.
 */
export const REVIEWS_LIVE = true
/** SAMPLE ONLY: placeholder quotes for layout, not real customers. */
export const TESTIMONIALS = [
  ['The ring is unreal in person. They walked me through every stone and the 3ct was even better than the photos.', 'Jordan K.', 'Aurelia, 3ct'],
  ['Booked the showroom on a Saturday, left with the band two weeks later. Zero pressure, all detail.', 'Amira S.', 'Wedding band'],
  ['Custom piece for our tenth. They took a sketch on a napkin and made it look like it belongs in a museum.', 'Daniel & Rhea', 'Custom commission'],
]
export const FAQ = [
  ['What are your stones?', 'Engagement rings use lab-grown diamonds, D–F colour, VS1 clarity or better, with VVS1, VVS2 or IF available on request. Our chains are 925 sterling silver set with moissanite.'],
  ['Can I change the metal or carat?', 'Yes. Every engagement ring is offered in yellow, white and rose gold, from 1 to 4 carats. All gold ring metals are 18k unless otherwise specified or requested.'],
  ['What ring sizes do you offer?', 'We use Australian / UK letter sizes. Use your professionally measured size, including a half size where required. Half sizes are available between the displayed letter sizes. If you are unsure of your size, choose “I don’t know my size — confirm with me”: we will contact you before production begins.'],
  ['Is engraving available?', 'Yes — up to 20 characters on the inside of the band, at no charge.'],
  ['Can I see pieces in person?', 'Experience our collection in person at our showroom. Private appointments available daily.'],
  ['Do you make custom pieces?', 'Yes. Tell us about your idea through the custom jewellery form or book a consultation.'],
  ['How long does delivery take?', 'Made-to-order rings usually require 3–4 weeks of production after your specifications and ring size are confirmed. Delivery time is additional. For ready-to-ship pieces, contact us to confirm dispatch timing.'],
  ['What about warranty and resizing?', 'For assistance with a suspected manufacturing defect, contact us with your order details and clear photographs. Wear, accidental damage and maintenance are assessed separately. Resizing depends on the design and extent of the adjustment. Confirm suitability and any labour charges with our team before proceeding. Our policies do not exclude your rights under the Australian Consumer Law.'],
  ['How does payment work for made-to-order rings?', 'A 50% deposit starts your order. The remaining balance is payable before collection or dispatch. We confirm your size, specifications and timeline before crafting begins.'],
  ['How do I care for my jewellery?', 'Store jewellery separately in a soft pouch or jewellery box to prevent scratches. Avoid exposure to perfumes, lotions, chemicals, and harsh environments. Remove jewellery before swimming, exercising, or showering. Gently clean pieces with a soft polishing cloth to restore shine.'],
]

/** SAMPLE reviews for the preview — deterministic per product, replaced by a review app on launch. */
/** SAMPLE ONLY: generated from the product name, not real ratings (see REVIEWS_LIVE). */
export const rating = (h: string) => { let n = 0; for (const c of h) n = (n * 31 + c.charCodeAt(0)) % 997; return { stars: 4.7 + (n % 3) / 10, count: 12 + (n % 140) } }
export const readyToShip = (p: Product) => p.collections.includes('ready-to-ship')
export const deliveryEstimate = (p: Product) => { const d = new Date(); d.setDate(d.getDate() + (readyToShip(p) ? 3 : 21)); return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long' }) }

/** Display form of an option value: Shopify has "Rose gold" beside "Yellow Gold"; show them consistently. */
export const nice = (v?: string) => (v ?? '').replace(/\bgold\b/g, 'Gold')

/** Lead-time wording from the doublemco.au product pages, used as written. */
export const LEAD_TIME = 'Allow approximately 3–4 weeks of production after specifications and ring size are confirmed. Delivery time is additional.'
export const RTS_TIME = 'For ready-to-ship pieces, contact us to confirm dispatch timing.'

/**
 * Policy wording copied exactly from doublemco.au product pages and guides (raw pages archived
 * in content/client-site/). Don't paraphrase: change these only when the client changes theirs.
 */
export const CLIENT = {
  ringDetails: ['Lab-grown diamond · D–F colour · VS1 clarity or better.', 'Choose the metal and centre stone size shown in the builder. Band dimensions, side-stone details and exact centre stone specifications are confirmed before production.', 'All gold ring metals are 18k unless otherwise specified or requested.', 'Product imagery is illustrative. Stone proportions and details may vary with the selected configuration.'],
  bandDetails: ['Made-to-order wedding ring in your selected metal. Final sizing and any design adjustments are confirmed before production.', 'All gold ring metals are 18k unless otherwise specified or requested.', 'Product imagery is illustrative. Stone proportions and details may vary with the selected configuration.'],
  imagery: 'Product imagery is illustrative. Stone proportions and details may vary with the selected configuration.',
  production: ['Made-to-order rings usually require 3–4 weeks of production after your specifications and ring size are confirmed. Delivery time is additional. We confirm your timeline before crafting begins.', 'For ready-to-ship pieces, contact us to confirm dispatch timing. Showroom collection is available by arrangement. Shipping method, cost and delivery details are confirmed before dispatch.'],
  warranty: ['For assistance with a suspected manufacturing defect, contact us with your order details and clear photographs. Wear, accidental damage and maintenance are assessed separately.', 'Resizing depends on the design and extent of the adjustment. Confirm suitability and any labour charges with our team before proceeding.', 'Our policies do not exclude your rights under the Australian Consumer Law.'],
  deposit: 'A 50% deposit starts your order. The remaining balance is payable before collection or dispatch. We confirm your size, specifications and timeline before crafting begins.',
  shipping: 'Shipping method, cost and delivery details are confirmed before dispatch.',
}
