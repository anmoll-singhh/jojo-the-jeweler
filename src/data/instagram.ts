/**
 * Instagram archive for @doublemandco, read from content/instagram/manifest.json.
 * That file is written by scripts/fetch-instagram.mjs (GitHub Action). Media lives in
 * public/media/ig/. Until the first fetch lands, the older hand-picked stills are used.
 */
export type Reel = { code: string; hero?: boolean; hq?: boolean; webm?: boolean; url: string; src: string; poster: string; w?: number; h?: number; dur?: number; description?: string; date_posted?: string; likes?: number; views?: number }
export type Post = { code: string; url: string; type?: string; images: { src: string; w?: number; h?: number }[]; description?: string; date_posted?: string; likes?: number }
export type Manifest = { fetched?: string; profile?: { followers?: number; posts_count?: number; biography?: string; avatar?: string } | null; hero?: string[]; reels: Reel[]; posts: Post[]; highlights: { title: string; cover: string | null }[] }

const found = import.meta.glob<Manifest>('../../content/instagram/manifest.json', { eager: true, import: 'default' })
const fromRepo = Object.values(found)[0]

const STILLS: [string, string][] = [
  ['ig9', 'The Elongated Cushion Ring, 4ct centre in 18k gold'], ['ig1', 'A consultation in the North Perth showroom'],
  ['ig11', 'Stacked rings, tried on in the showroom'], ['ig3', 'Launch night at Charles Street'],
  ['ig7', 'The showroom cabinets'], ['ig8', 'Details, up close'], ['ig2', 'An engagement ring on the hand'], ['ig5', 'Rings in the showroom'],
]
const fallback: Manifest = {
  reels: [], highlights: [],
  posts: STILLS.map(([i, a]) => ({ code: i, url: 'https://www.instagram.com/doublemandco', images: [{ src: `/media/ig/${i}.webp` }], description: a })),
}

export const IG: Manifest = fromRepo && (fromRepo.reels?.length || fromRepo.posts?.length) ? fromRepo : fallback
export const IG_URL = 'https://www.instagram.com/doublemandco'

/** Hero order. The two couple reels open on almost the same frame (hands, bracelet), so they
 *  sit at the ends: desktop shows the first three, phones get all four as Stories. */
const HERO_ORDER = ['DetCIo0qFCh', 'DfGjOJVKtYB', 'DfEBqv-Kzd6', 'Ded415hqhBp']
export const heroReels = (): Reel[] => {
  const picked = HERO_ORDER.map((c) => IG.reels.find((r) => r.code === c)).filter(Boolean) as Reel[]
  const rest = IG.reels.filter((r) => !picked.includes(r)).sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  return [...picked, ...rest].slice(0, 4)
}

/** Reels chosen for a job on the page, by shortcode, with a fallback to any unused reel. */
export const reelByCode = (code: string) => IG.reels.find((r) => r.code === code)
export const PROOF_REEL = 'DewMtfsqN2e' // The Elongated Cushion Ring, 4ct
export const BUILD_REEL = 'DewMOjbqMWe' // The Statement Ring, 5ct
export const CHAIN_REEL = 'DdDVCLmqQnH' // Tennis chains, done right

/** Total reel views, rounded down so the claim is always true: 585,000 reads as "500,000". */
export const totalViews = () => {
  const n = IG.reels.reduce((a, r) => a + (r.views ?? 0), 0)
  if (n < 10000) return 0
  const step = n >= 1e6 ? 1e6 : n >= 1e5 ? 1e5 : 1e4
  return Math.floor(n / step) * step
}

/** Short, readable alt text from a caption: first sentence, no hashtags or emoji. */
export const altFrom = (s?: string, fb = 'Double M & Co on Instagram') => {
  const t = (s ?? '').replace(/#[\w]+/g, '').replace(/@[\w.]+/g, '').replace(/[\p{Extended_Pictographic}️]/gu, '').split(/[.\n!?]/)[0].replace(/\s+/g, ' ').trim()
  return t.length > 3 ? t.slice(0, 110) : fb
}

/** Route a post to the collection it shows, from its caption. */
export const shopFor = (s = ''): [string, string] => {
  const t = s.toLowerCase()
  if (/earring|bracelet|necklace|pendant|watch|timepiece/.test(t)) return ['Shop all jewellery', '/collections/all']
  if (/chain|cuban/.test(t)) return ['Shop chains', '/collections/chains']
  if (/band|wedding|eternity/.test(t)) return ['Shop wedding bands', '/collections/wedding-bands']
  if (/custom|commission|bespoke/.test(t)) return ['Start a custom piece', '/custom']
  if (/\bring|carat|ct\b|solitaire|oval|cushion|emerald|radiant|engag/.test(t)) return ['Shop engagement rings', '/collections/engagement-rings']
  return ['Shop all jewellery', '/collections/all']
}

export const sentence = (t: string) => { const c = t.replace(/[.]+$/, '').trim(); return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase() }

export const compact = (n?: number) => (n == null ? '' : n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n))
