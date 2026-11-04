#!/usr/bin/env node
/**
 * Writes content/catalog.sample.json — SAMPLE products for the storefront until the client's real
 * catalogue exists in Shopify. Every product here is tagged `sample`; prices, weights and specs are
 * plausible placeholders for the client to confirm or replace. Images are generated product shots
 * (see CHANGELOG for the credit log) in public/media/products/.
 */
import { writeFileSync } from 'node:fs'

const METALS = ['Yellow gold', 'White gold', 'Rose gold']
const LENGTHS = ['18"', '20"', '22"', '24"', '26"']
const BRACELET = ['7"', '7.5"', '8"', '8.5"', '9"']
const SIZES = ['7', '8', '9', '10', '11', '12']
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

let id = 9000001
const price = (n) => ({ amount: n, currencyCode: 'USD' })
/**
 * Define a product with option axes and a price function over the chosen values.
 * axes: [{ name, values, price?: (v)=>delta }]
 */
function product({ handle, title, type, collections, description, specs, tags = [], axes, base, images = 1, compare, sold = [] }) {
  const opts = axes.map((a) => ({ name: a.name, values: a.values }))
  const combos = axes.reduce((acc, a) => acc.flatMap((c) => a.values.map((v) => [...c, v])), [[]])
  const variants = combos.map((vals) => {
    let p = base
    vals.forEach((v, i) => { const f = axes[i].price; if (f) p += typeof f === 'function' ? f(v) : f[v] ?? 0 })
    const title = vals.join(' / ')
    const soldOut = sold.includes(title)
    return { id: String(id++), title, selectedOptions: vals.map((v, i) => ({ name: axes[i].name, value: v })), price: price(p), compareAtPrice: compare ? price(Math.round(p * compare)) : null, availableForSale: !soldOut, image: null }
  })
  return {
    id: 'sample-' + handle, handle, title, productType: type, vendor: 'JoJo The Jeweler', tags: ['sample', ...tags], description, descriptionHtml: `<p>${description}</p>`,
    options: opts, images: Array.from({ length: images }, (_, i) => ({ src: `/media/products/${handle}-${i + 1}.webp`, alt: `${title}${i ? ', detail' : ''}`, width: 1600, height: 2000 })),
    variants, collections, specs: specs.map(([label, value]) => ({ label, value })), createdAt: new Date(2026, 9, 20 - (id % 20)).toISOString(),
  }
}

const karat = { name: 'Karat', values: ['10K', '14K'], price: { '10K': 0, '14K': 600 } }
const metal = { name: 'Metal', values: METALS }
const length = (step = 180) => ({ name: 'Length', values: LENGTHS, price: (v) => (parseInt(v) - 18) / 2 * step })

const products = [
  product({ handle: 'miami-cuban-link-chain', title: 'Miami Cuban link chain', type: 'Chains', collections: ['chains', 'best-sellers'], tags: ['best-seller', 'cuban'], base: 2850, images: 2,
    description: 'The chain JoJo is known for. Solid gold Miami Cuban links, hand-polished so every link lies flat and swings the right way. Box clasp with a double safety lock.',
    specs: [['Metal', 'Solid gold, stamped'], ['Links', 'Miami Cuban, hand-set and polished'], ['Clasp', 'Box clasp, double safety'], ['Weight', 'From 48 g at 8mm, 18"']],
    axes: [metal, karat, { name: 'Width', values: ['8mm', '10mm', '12mm', '15mm'], price: { '8mm': 0, '10mm': 1650, '12mm': 3900, '15mm': 8200 } }, length(220)] }),
  product({ handle: 'iced-cuban-link-chain', title: 'Iced Cuban link chain', type: 'Chains', collections: ['chains', 'iced', 'best-sellers'], tags: ['best-seller', 'iced'], base: 18500, images: 2,
    description: 'Miami Cuban links fully iced with VS diamonds, prong-set by hand. Made to order in about six weeks.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds, G–H colour'], ['Setting', 'Prong, hand-set'], ['Lead time', 'Made to order']],
    axes: [metal, { name: 'Width', values: ['10mm', '12mm', '15mm'], price: { '10mm': 0, '12mm': 6500, '15mm': 15800 } }, length(900)] }),
  product({ handle: 'tennis-chain', title: 'Tennis chain', type: 'Chains', collections: ['chains', 'iced'], tags: ['iced'], base: 6900,
    description: 'A single row of round brilliants, four-prong set, with a hidden box clasp. Wears on its own or over a Cuban.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Clasp', 'Hidden box clasp']],
    axes: [metal, { name: 'Stone size', values: ['3mm', '4mm', '5mm'], price: { '3mm': 0, '4mm': 3200, '5mm': 8900 } }, length(600)] }),
  product({ handle: 'rope-chain', title: 'Rope chain', type: 'Chains', collections: ['chains'], base: 1650,
    description: 'Solid gold rope, diamond-cut so it catches light at every turn. The everyday chain.',
    specs: [['Metal', 'Solid gold'], ['Finish', 'Diamond-cut'], ['Clasp', 'Lobster']],
    axes: [metal, karat, { name: 'Width', values: ['4mm', '6mm', '8mm'], price: { '4mm': 0, '6mm': 1100, '8mm': 2600 } }, length(140)] }),
  product({ handle: 'franco-chain', title: 'Franco chain', type: 'Chains', collections: ['chains'], base: 1900,
    description: 'Four-sided Franco weave, solid gold, built for pendants.',
    specs: [['Metal', 'Solid gold'], ['Clasp', 'Lobster']],
    axes: [metal, karat, { name: 'Width', values: ['3mm', '4mm', '5mm'], price: { '3mm': 0, '4mm': 700, '5mm': 1500 } }, length(160)] }),

  product({ handle: 'iced-cross-pendant', title: 'Iced cross pendant', type: 'Pendants', collections: ['pendants', 'iced', 'best-sellers'], tags: ['best-seller', 'iced'], base: 3200,
    description: 'Baguette and round diamonds set edge to edge across a solid gold cross. Bail fits chains up to 8mm.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds, baguette and round'], ['Size', '2.2" / 1.6"']],
    axes: [metal, { name: 'Size', values: ['Medium', 'Large'], price: { Medium: 0, Large: 2400 } }] }),
  product({ handle: 'baguette-letter-pendant', title: 'Baguette letter pendant', type: 'Pendants', collections: ['pendants', 'iced'], tags: ['iced'], base: 2400,
    description: 'One initial, cut in solid gold and set with baguettes. Pick your letter; chain sold separately.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS baguette diamonds'], ['Height', '1.5"']],
    axes: [metal, { name: 'Letter', values: LETTERS }] }),
  product({ handle: 'money-bag-pendant', title: 'Money bag pendant', type: 'Pendants', collections: ['pendants', 'iced'], tags: ['iced'], base: 5600, images: 2,
    description: 'A fully iced money bag with a dollar-sign face. Round brilliants over solid gold, hand-set.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Height', '1.8"']],
    axes: [metal] }),
  product({ handle: 'praying-hands-pendant', title: 'Praying hands pendant', type: 'Pendants', collections: ['pendants', 'iced'], tags: ['iced'], base: 4800,
    description: 'Praying hands in solid gold, iced with round diamonds, with a sculpted rosary detail.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Height', '2"']],
    axes: [metal] }),
  product({ handle: 'gem-monogram-pendant', title: 'Gem monogram pendant', type: 'Pendants', collections: ['pendants', 'iced'], tags: ['iced', 'logo'], base: 3900,
    description: 'The JoJo mark as a pendant: the gem outline and the mirrored Js, iced edge to edge.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Height', '1.6"']],
    axes: [metal] }),

  product({ handle: 'miami-cuban-bracelet', title: 'Miami Cuban bracelet', type: 'Bracelets', collections: ['bracelets', 'best-sellers'], tags: ['best-seller', 'cuban'], base: 1950,
    description: 'The chain, cut to the wrist. Solid gold Miami Cuban links with a box clasp and double safety.',
    specs: [['Metal', 'Solid gold'], ['Clasp', 'Box clasp, double safety']],
    axes: [metal, karat, { name: 'Width', values: ['8mm', '10mm', '12mm'], price: { '8mm': 0, '10mm': 1200, '12mm': 2700 } }, { name: 'Length', values: BRACELET, price: (v) => (parseFloat(v) - 7) * 260 }] }),
  product({ handle: 'tennis-bracelet', title: 'Tennis bracelet', type: 'Bracelets', collections: ['bracelets', 'iced'], tags: ['iced'], base: 4200,
    description: 'Round brilliants in a four-prong line, hidden clasp.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds']],
    axes: [metal, { name: 'Stone size', values: ['3mm', '4mm'], price: { '3mm': 0, '4mm': 2600 } }, { name: 'Length', values: BRACELET.slice(0, 4), price: (v) => (parseFloat(v) - 7) * 500 }] }),
  product({ handle: 'iced-cuban-bracelet', title: 'Iced Cuban bracelet', type: 'Bracelets', collections: ['bracelets', 'iced'], tags: ['iced'], base: 9800,
    description: 'Miami Cuban links fully iced with VS diamonds. Made to order.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Lead time', 'Made to order']],
    axes: [metal, { name: 'Width', values: ['10mm', '12mm'], price: { '10mm': 0, '12mm': 3800 } }, { name: 'Length', values: BRACELET.slice(0, 4), price: (v) => (parseFloat(v) - 7) * 900 }] }),

  product({ handle: 'iced-baguette-band', title: 'Iced baguette band', type: 'Rings', collections: ['rings', 'iced'], tags: ['iced'], base: 2900,
    description: 'Baguettes channel-set the whole way round. Solid gold, comfort fit.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS baguette diamonds'], ['Width', '6mm']],
    axes: [metal, { name: 'Size', values: SIZES }] }),
  product({ handle: 'cuban-link-ring', title: 'Cuban link ring', type: 'Rings', collections: ['rings'], tags: ['cuban'], base: 1450,
    description: 'Miami Cuban links as a ring. Solid gold, polished.',
    specs: [['Metal', 'Solid gold'], ['Width', '8mm']],
    axes: [metal, karat, { name: 'Size', values: SIZES }] }),
  product({ handle: 'iced-letter-ring', title: 'Iced letter ring', type: 'Rings', collections: ['rings', 'iced'], tags: ['iced'], base: 3800,
    description: 'Your initial, iced with baguettes on a pavé shank. Made to order.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Lead time', 'Made to order']],
    axes: [metal, { name: 'Letter', values: LETTERS }, { name: 'Size', values: SIZES }] }),

  product({ handle: 'iced-cuban-hoops', title: 'Iced Cuban hoops', type: 'Earrings', collections: ['earrings', 'iced'], tags: ['iced'], base: 1900,
    description: 'Cuban-link hoops, iced on the face. Sold as a pair.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Diameter', '18mm']],
    axes: [metal] }),
  product({ handle: 'diamond-studs', title: 'Diamond studs', type: 'Earrings', collections: ['earrings', 'iced', 'best-sellers'], tags: ['best-seller'], base: 1200,
    description: 'Round brilliant studs, four-prong, screw backs. Sold as a pair; carat weight is the total for both.',
    specs: [['Metal', 'Solid 14K gold'], ['Stones', 'Natural VS diamonds'], ['Backs', 'Screw back']],
    axes: [metal, { name: 'Total carat', values: ['0.5ct', '1ct', '2ct'], price: { '0.5ct': 0, '1ct': 1900, '2ct': 6400 } }] }),

  product({ handle: 'custom-grillz', title: 'Custom grillz', type: 'Grillz', collections: ['grillz'], tags: ['custom'], base: 650,
    description: 'Fitted to a mold of your teeth. Solid gold, polished, or iced on the face. Mold kit ships to you, or come to 47th Street.',
    specs: [['Metal', 'Solid gold'], ['Fit', 'Custom mold'], ['Lead time', 'Made to order']],
    axes: [metal, karat, { name: 'Teeth', values: ['6 top', '6 bottom', '8 top', '8 bottom', '10 top', '10 bottom'], price: (v) => (parseInt(v) - 6) * 110 }, { name: 'Finish', values: ['Solid', 'Iced'], price: { Solid: 0, Iced: 1400 } }] }),
  product({ handle: 'iced-watch-bust-down', title: 'Iced watch bust-down', type: 'Watches', collections: ['watches', 'iced'], tags: ['iced', 'custom'], base: 12500,
    description: 'Bring your watch, or let JoJo source one, and we set the case, bezel and bracelet with VS diamonds. Priced for a 41mm steel case.',
    specs: [['Stones', 'Natural VS diamonds'], ['Work', 'Case, bezel and bracelet'], ['Lead time', 'Made to order']],
    axes: [{ name: 'Coverage', values: ['Bezel only', 'Case and bezel', 'Full bust-down'], price: { 'Bezel only': 0, 'Case and bezel': 6500, 'Full bust-down': 19800 } }] }),
]

// Real service product from the existing store (verified): the $50 watch-sourcing deposit.
products.push({
  id: 'real-watch-sourcing', handle: 'watch-sourcing', title: 'Watch sourcing deposit', productType: 'Services', vendor: 'JoJo The Jeweler', tags: ['service'],
  description: 'A non-refundable $50 deposit for JoJo to source your watch. After the deposit, JoJo reaches out to you personally to get the watch you want on your wrist.',
  descriptionHtml: '', options: [], images: [{ src: '/media/store/jojo-watch.webp', alt: 'JoJo The Jeweler watch', width: 1138, height: 1287 }],
  variants: [{ id: '9100000001', title: 'Default', selectedOptions: [], price: price(50), compareAtPrice: null, availableForSale: true, image: null }],
  collections: ['watches'], specs: [['Deposit', '$50, non-refundable'], ['Next step', 'JoJo contacts you to discuss the watch']].map(([label, value]) => ({ label, value })), createdAt: '2026-10-01T00:00:00Z',
})

const collections = [
  ['chains', 'Chains', 'Miami Cuban, tennis, rope and Franco. Solid gold, by the width.'],
  ['pendants', 'Pendants', 'Crosses, letters, characters and the JoJo mark, iced edge to edge.'],
  ['bracelets', 'Bracelets', 'The chain, cut to the wrist.'],
  ['rings', 'Rings', 'Bands, Cuban rings and iced initials.'],
  ['earrings', 'Earrings', 'Studs and iced hoops, sold as pairs.'],
  ['grillz', 'Grillz', 'Fitted to a mold of your teeth. Solid or iced.'],
  ['watches', 'Watches', 'Sourcing, bust-downs and trade-ins.'],
  ['iced', 'Iced out', 'Everything set with natural VS diamonds.'],
  ['best-sellers', 'Best sellers', 'The pieces that leave 47th Street most often.'],
].map(([handle, title, description]) => ({ id: 'col-' + handle, handle, title, description, image: null, products: [] }))

writeFileSync('content/catalog.sample.json', JSON.stringify({ products, collections }, null, 1) + '\n')
console.log(`sample: ${products.length} products, ${products.reduce((s, p) => s + p.variants.length, 0)} variants`)
