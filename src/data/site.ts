/**
 * Brand facts. Everything here is shown on the site, so only verified facts belong in BRAND; anything
 * the client still has to confirm is in SAMPLE and labelled in the UI.
 */
export const BRAND = {
  name: 'JoJo The Jeweler',
  short: 'JoJo',
  instagram: 'https://www.instagram.com/jojothejeweler_',
  handle: '@jojothejeweler_',
  shop: 'https://jojoxwaves.myshopify.com',
  /** Set VITE_CONTACT_EMAIL when the client confirms the inbox; until then the contact form uses Instagram. */
  email: (import.meta.env.VITE_CONTACT_EMAIL as string) || '',
  tagline: 'Custom pieces and heavy chains, made to be seen',
}

export const NAV = {
  shop: [
    ['Chains', '/collections/chains'],
    ['Pendants', '/collections/pendants'],
    ['Bracelets', '/collections/bracelets'],
    ['Rings', '/collections/rings'],
    ['Earrings', '/collections/earrings'],
    ['All pieces', '/collections/all'],
  ],
  more: [['Custom', '/about#custom'], ['About', '/about'], ['Contact', '/contact']],
}

/** Sample copy the client must confirm or replace. Rendered with a visible "sample" marker in dev. */
export const SAMPLE = {
  shipping: 'Insured shipping on every order. Delivery estimate is confirmed at checkout.',
  returns: '14-day returns on ready-to-ship pieces in original condition. Custom pieces are final sale.',
  warranty: 'Lifetime cleaning and inspection on every piece made by JoJo.',
  payments: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Shop Pay', 'PayPal'],
}
export const ABOUT = {
  lede: 'Hip-hop jewelry built one piece at a time: Cuban links by the gram, pendants from a sketch, stones set by hand.',
  story: [
    'JoJo The Jeweler makes the pieces people stop you to ask about. Heavy chains that lie flat and swing right, pendants cut from a drawing on a phone, rings and bracelets iced from edge to edge.',
    'Custom work starts with a conversation and a reference. From there the piece is modelled, cast in solid gold, set and polished. You see it at every stage before it ships.',
  ],
  process: [
    ['Reference', 'Send a photo, a logo or an idea. We talk through metal, size and stones.'],
    ['Model', 'The piece is modelled in 3D and sent to you to approve before anything is cast.'],
    ['Cast and set', 'Solid gold casting, hand setting, final polish. Photos and video at every step.'],
    ['Delivered', 'Insured shipping, or pick it up in person and try it on.'],
  ],
}
