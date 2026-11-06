/**
 * Editorial content: the client's own media, with captions traced to their sources.
 */
import ig from '../../content/instagram/manifest.json'

export type Piece = { id: string; title: string; line: string; mp4: string; webm: string; poster: string; still: string; stills: string[]; source: string; hd?: { mp4: string; webm: string } }

/** The four custom-piece films from the client's Drive (4K, shot on black satin). */
export const PIECES: Piece[] = [
  { id: 'r-money', title: 'R money-bag pendant', line: 'A money bag with a face and an R, fully iced in rose gold, shot on hundreds.', mp4: '/media/drive/r-money.mp4', webm: '/media/drive/r-money.webm', hd: { mp4: '/media/drive/r-money-hd.mp4', webm: '/media/drive/r-money-hd.webm' }, poster: '/media/drive/r-money.webp', still: '/media/stills/r-money-2.webp', stills: ['/media/stills/r-money-1.webp', '/media/stills/r-money-2.webp', '/media/stills/r-money-3.webp'], source: 'Drive: R money.mov' },
  { id: 'sp5der', title: 'Sp5der pieces for Young Thug', line: 'Rose and white gold Sp5der logos, mosaic set, on a tennis chain. Done the JoJo way.', mp4: '/media/drive/young-thug-v3.mp4', webm: '/media/drive/young-thug-v3.webm', hd: { mp4: '/media/drive/young-thug-v3-hd.mp4', webm: '/media/drive/young-thug-v3-hd.webm' }, poster: '/media/drive/young-thug-v3.webp', still: '/media/stills/starburst-2.webp', stills: ['/media/stills/starburst-1.webp', '/media/stills/starburst-2.webp', '/media/stills/starburst-3.webp'], source: 'Drive: young thug v3.mov; Instagram DSdEg59ERnC' },
  { id: 'm-ring', title: 'Letter M ring with a bee', line: 'Baguette-cut letter on a rose-gold pavé shank, with a sculpted bee on the shoulder.', mp4: '/media/drive/m-ring.mp4', webm: '/media/drive/m-ring.webm', hd: { mp4: '/media/drive/m-ring-hd.mp4', webm: '/media/drive/m-ring-hd.webm' }, poster: '/media/drive/m-ring.webp', still: '/media/stills/m-ring-3.webp', stills: ['/media/stills/m-ring-1.webp', '/media/stills/m-ring-2.webp', '/media/stills/m-ring-3.webp'], source: 'Drive: M ring .mov' },
  { id: 'danny-p', title: 'Danny Phantom pendant', line: 'A full character in white gold and black diamonds, green eyes, iced to the fingertips.', mp4: '/media/drive/danny-p.mp4', webm: '/media/drive/danny-p.webm', hd: { mp4: '/media/drive/danny-p-hd.mp4', webm: '/media/drive/danny-p-hd.webm' }, poster: '/media/drive/danny-p.webp', still: '/media/stills/danny-p-2.webp', stills: ['/media/stills/danny-p-1.webp', '/media/stills/danny-p-2.webp', '/media/stills/danny-p-3.webp'], source: 'Drive: danny P.mov' },
]

/** Lifestyle photography from the client's Drive. */
export const LIFESTYLE = [
  { src: '/media/drive/27081c3e-bb5d-4f02-9209-451ad9ce25fa.webp', w: 2000, h: 3000, alt: 'Seated in a private jet cabin' },
  { src: '/media/drive/9129b316-9a3c-4ab3-bdf3-a7a7ec797e03.webp', w: 2000, h: 3000, alt: 'On a private jet with a monogram travel bag' },
  { src: '/media/drive/d31529fc-3d01-465b-a237-7166a5c8a754.webp', w: 2000, h: 1334, alt: 'Courtside, chains on' },
  { src: '/media/drive/dsc01276.webp', w: 2000, h: 3000, alt: 'Backstage under stage lights' },
  { src: '/media/drive/dsc04942.webp', w: 2000, h: 2684, alt: 'A group in chains outdoors' },
  { src: '/media/drive/img-4620.webp', w: 2000, h: 2994, alt: 'Three friends in chains at an event' },
  { src: '/media/drive/img-4638.webp', w: 2000, h: 3000, alt: 'Two people posing at a party, chains on' },
  { src: '/media/drive/img-6778.webp', w: 1196, h: 1474, alt: 'Walking out at night' },
  { src: '/media/drive/img-8523.webp', w: 2000, h: 3000, alt: 'Chrome Hearts fit beside a Rolls-Royce' },
  { src: '/media/drive/img-8798.webp', w: 1206, h: 1468, alt: 'In a crowd, a cross pendant held up' },
]

/** Photos from the client's existing store (the 22 Crew pieces). */
export const STORE_PHOTOS = [
  { src: '/media/store/crew-1.webp', alt: 'A 22 Crew pendant on a tennis chain' },
  { src: '/media/store/crew-2.webp', alt: 'Two people with iced chains' },
  { src: '/media/store/crew-3.webp', alt: 'Stacked iced chains and a 22 Crew pendant, close up' },
  { src: '/media/store/crew-4.webp', alt: 'Client smiling in a 22 Crew hoodie and chain' },
  { src: '/media/store/crew-5.webp', alt: 'Client with iced watches and chains' },
]

export type IgPost = { code: string; url: string; type: string; images: { src: string; w: number; h: number }[]; description?: string; date_posted?: string }
export const IG_PROFILE = ig.profile as { account: string; full_name: string; biography: string; followers: number; posts_count: number; is_verified: boolean; avatar: string }
export const IG_POSTS = (ig.posts as IgPost[]).filter((p) => p.images?.length)
/** Posts that show a piece and name it, used as proof with the caption as the credit. */
export const PROOF_POSTS = [
  // Sharp sources: frames and a clip from the full reels (720p) and the 4K Drive film, not the 640px thumbnails.
  { code: 'Dc4hhnPp0Sh', title: 'J pendant with a custom eagle bail', note: 'All mosaic set, big rocks', img: '/media/proof/j-pendant.webp', video: { mp4: '/media/proof/j-pendant.mp4', webm: '/media/proof/j-pendant.webm' } },
  { code: 'DdKzkilpMaT', title: 'YSL chain and pendant for Lil Baby', note: 'Mosaic set with three shapes of diamond', img: '/media/proof/ysl-lil-baby.webp' },
  { code: 'DSdEg59ERnC', title: 'Sp5der pieces for Young Thug', note: 'Rose and white gold, mosaic set', img: '/media/proof/sp5der.webp' },
  { code: 'DeVFs6dpFqb', title: 'RR6 pendant, with seven friends-and-family pieces', note: 'Fancy-shape mosaic setting, rose gold', img: '/media/proof/rr6.webp' },
  { code: 'DLF_8ZaS40c', title: 'Lil Baby', note: '“Take notes from the youngin”', img: '/media/proof/lil-baby.webp' },
].map((p) => ({ ...p, post: IG_POSTS.find((x) => x.code === p.code) })).filter((p) => p.post) as { code: string; title: string; note: string; img: string; video?: { mp4: string; webm: string }; post: IgPost }[]

export const HERO_REEL = { mp4: '/media/store/reel.mp4', webm: '/media/store/reel.webm', poster: '/media/store/reel.webp' }
