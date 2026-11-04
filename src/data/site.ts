/**
 * Brand facts. Everything in BRAND, FAQ, PROCESS and CLIENTS is taken from the client's own sources
 * (existing store jojoxwaves.myshopify.com and the @jojothejeweler_ profile, see docs/research/brand.md).
 * SAMPLE holds copy the client still has to confirm; it is marked in the UI.
 */
export const BRAND = {
  name: 'JoJo The Jeweler',
  short: 'JoJo',
  igName: 'JoJo Diamonds',
  handle: '@jojothejeweler_',
  instagram: 'https://www.instagram.com/jojothejeweler_/',
  tiktok: 'https://www.tiktok.com/@jojothejeweler_',
  youtube: 'https://www.youtube.com/@jojothejeweler_',
  facebook: 'https://www.facebook.com/profile.php?id=61552054877926',
  phone: '917-715-0337',
  phoneHref: 'tel:+19177150337',
  smsHref: 'sms:+19177150337',
  address: ['3 W 47th Street', 'New York, NY 10036'],
  district: 'New York Diamond District',
  hours: '9 a.m. to 6 p.m., six days a week',
  bio: 'Jewelry, watches, custom pieces. NYC and Miami. Worldwide shipping.',
  followers: '109K',
  startedAt: 15,
  shop: 'https://jojoxwaves.myshopify.com',
  /** Set VITE_CONTACT_EMAIL when the client confirms the inbox; until then the contact form hands off to text/Instagram. */
  email: (import.meta.env.VITE_CONTACT_EMAIL as string) || '',
}

/** Named on the client's store ("Lil Baby, Lil Mabu, 22Gz") and in their Instagram captions. */
export const CLIENTS = ['Lil Baby', 'Young Thug', 'Lil Mabu', '22Gz', 'NAV']

/** The custom process in the store's own words. */
export const PROCESS = [
  ['The sketch and design', 'Send a reference, a logo or an idea. JoJo sketches the piece and you approve the design before anything is made.'],
  ['Mold and production', 'The approved design is modelled, cast in solid gold and set by hand. A 50% deposit starts this stage.'],
  ['Polish, inspection and delivery', 'Final polish and a full inspection, then insured delivery worldwide or pick-up on 47th Street.'],
]

/** FAQ as published on the store's contact page. */
export const FAQ = [
  ['Where are you located?', 'The New York Diamond District: 3 W 47th Street, New York, NY 10036.'],
  ['What are your opening hours?', '9 a.m. to 6 p.m., six days a week.'],
  ['Do you require a deposit to get started?', 'Yes. A 50% payment is required before the design and development of a custom piece begins. Deposits are taken by wire, Zelle or Cash App.'],
  ['How long does a custom pendant take?', 'Every piece has its own production time. Design, quality and the materials used all change the schedule, so JoJo confirms a timeline with you once the design is approved.'],
  ['What payment methods do you accept?', 'Cash, secure credit and debit card payments, and bank transfers.'],
  ['Do you accept part-exchange?', 'Depending on the piece’s value, authenticity and quality, a partial swap can be considered.'],
  ['Do you buy watches?', 'Yes. Fill in the form, bring or ship the watch for inspection, and you get a one-time offer with prompt, secure payment.'],
]

export const NAV = {
  shop: [
    ['Chains', '/collections/chains'],
    ['Pendants', '/collections/pendants'],
    ['Bracelets', '/collections/bracelets'],
    ['Rings', '/collections/rings'],
    ['Earrings', '/collections/earrings'],
    ['Grillz', '/collections/grillz'],
    ['Watches', '/collections/watches'],
    ['All pieces', '/collections/all'],
  ],
  more: [['Custom', '/custom'], ['About', '/about'], ['Contact', '/contact']],
}

/** Sample copy the client must confirm or replace. */
export const SAMPLE = {
  shipping: 'Insured worldwide shipping. The delivery estimate is confirmed at checkout.',
  returns: 'Ready-to-ship pieces can be exchanged within 14 days in original condition. Custom pieces are final.',
  warranty: 'Every piece made by JoJo comes with lifetime cleaning and inspection on 47th Street.',
  payments: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Shop Pay', 'PayPal'],
}

/** Sizing guide, shown on About and in the PDP size dialog. */
export const SIZING = [
  'Chains: 18" sits at the collarbone, 20" just below, 22" mid-chest, 24" and 26" for pendants.',
  'Bracelets: measure the wrist and add half an inch.',
  'Rings: US sizes; text a photo of a ring that fits and JoJo will size it.',
]
