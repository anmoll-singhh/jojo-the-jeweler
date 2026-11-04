/**
 * Diamond shape and setting style for each engagement ring, for the collection filters.
 * Taken from each product's own description (catalog.json). When a product is added or
 * changes in Shopify, add or edit its line here; a ring missing from this map still shows
 * under "All shapes" and "All settings", it just can't be filtered.
 *
 * A ring can have more than one setting style (e.g. a hidden halo on a pavé band).
 */
export const SHAPES = [
  ['oval', 'Oval'], ['round', 'Round'], ['radiant', 'Radiant'], ['emerald', 'Emerald'], ['marquise', 'Marquise'],
  ['pear', 'Pear'], ['cushion', 'Cushion'], ['hexagon', 'Hexagon'],
] as const
export const SETTINGS = [
  ['solitaire', 'Solitaire'], ['trilogy', 'Trilogy'], ['halo', 'Halo'], ['hidden-halo', 'Hidden halo'],
  ['pave', 'Pavé'], ['accented', 'Accented shoulders'],
] as const

export type Shape = (typeof SHAPES)[number][0]
export type Setting = (typeof SETTINGS)[number][0]

export const RING_ATTRS: Record<string, { shape?: Shape; settings: Setting[] }> = {
  aurelia: { shape: 'round', settings: ['hidden-halo'] },
  thea: { shape: 'radiant', settings: ['hidden-halo', 'pave'] },
  delilah: { shape: 'round', settings: ['solitaire'] },
  bonnie: { settings: ['hidden-halo'] }, // description doesn't name the centre stone's shape — confirm with the client
  blair: { shape: 'oval', settings: ['solitaire'] },
  zoya: { shape: 'marquise', settings: ['accented'] },
  safiya: { shape: 'round', settings: ['solitaire'] },
  inaya: { shape: 'round', settings: ['hidden-halo', 'pave'] },
  elara: { shape: 'oval', settings: ['hidden-halo', 'accented'] },
  alina: { shape: 'emerald', settings: ['hidden-halo'] },
  zahra: { shape: 'oval', settings: ['pave'] },
  yasmin: { shape: 'marquise', settings: ['trilogy'] },
  samira: { shape: 'oval', settings: ['solitaire'] },
  nyla: { shape: 'round', settings: ['solitaire'] },
  nadia: { shape: 'cushion', settings: ['solitaire'] }, // elongated cushion
  zara: { shape: 'emerald', settings: ['accented'] },
  soraya: { shape: 'pear', settings: ['solitaire'] },
  saffa: { shape: 'marquise', settings: ['accented'] },
  liyana: { shape: 'round', settings: ['trilogy'] },
  farnaz: { shape: 'emerald', settings: ['accented'] },
  farah: { shape: 'marquise', settings: ['pave'] },
  ayla: { shape: 'round', settings: ['trilogy'] },
  arian: { shape: 'hexagon', settings: ['solitaire'] },
  aria: { shape: 'round', settings: ['pave'] },
  amira: { shape: 'pear', settings: ['halo', 'pave'] },
  marwa: { shape: 'oval', settings: ['accented'] },
}

/**
 * Shape icons (24×24, stroked): the outline, the table (the same outline at half size) and, for
 * step and brilliant cuts, the facet lines joining them — the way jewellers draw a shape guide.
 */
export const SHAPE_ICON: Record<Shape, { d: string; facets?: [number, number][] }> = {
  round: { d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', facets: [[12, 3], [18.4, 5.6], [21, 12], [18.4, 18.4], [12, 21], [5.6, 18.4], [3, 12], [5.6, 5.6]] },
  oval: { d: 'M12 2.5c3.6 0 6.5 4.3 6.5 9.5s-2.9 9.5-6.5 9.5S5.5 17.2 5.5 12S8.4 2.5 12 2.5Z', facets: [[12, 2.5], [17.1, 6.2], [18.5, 12], [17.1, 17.8], [12, 21.5], [6.9, 17.8], [5.5, 12], [6.9, 6.2]] },
  radiant: { d: 'M8.5 3h7L19 6.5v11L15.5 21h-7L5 17.5v-11Z', facets: [[8.5, 3], [15.5, 3], [19, 6.5], [19, 17.5], [15.5, 21], [8.5, 21], [5, 17.5], [5, 6.5]] },
  emerald: { d: 'M9 2.5h6l3 3v13l-3 3H9l-3-3v-13Z', facets: [[9, 2.5], [15, 2.5], [18, 5.5], [18, 18.5], [15, 21.5], [9, 21.5], [6, 18.5], [6, 5.5]] },
  marquise: { d: 'M12 2c3.2 3.2 5 6.6 5 10s-1.8 6.8-5 10c-3.2-3.2-5-6.6-5-10s1.8-6.8 5-10Z', facets: [[12, 2], [17, 12], [12, 22], [7, 12]] },
  pear: { d: 'M12 2.5c-3.4 4.2-6 8.2-6 12a6 6 0 0 0 12 0c0-3.8-2.6-7.8-6-12Z', facets: [[12, 2.5], [18, 14.5], [12, 20.5], [6, 14.5]] },
  cushion: { d: 'M8 3h8c2.8 0 4 1.2 4 4v10c0 2.8-1.2 4-4 4H8c-2.8 0-4-1.2-4-4V7c0-2.8 1.2-4 4-4Z', facets: [[5.2, 4.2], [18.8, 4.2], [18.8, 19.8], [5.2, 19.8]] },
  hexagon: { d: 'M12 2.5l8 4.6v9.8l-8 4.6l-8-4.6V7.1Z', facets: [[12, 2.5], [20, 7.1], [20, 16.9], [12, 21.5], [4, 16.9], [4, 7.1]] },
}
