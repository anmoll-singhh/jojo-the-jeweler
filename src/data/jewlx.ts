/**
 * The four JewlX widgets Double M & Co subscribes to, with the sizing each one's JewlX embed
 * code specifies. src/jewlx.tsx renders them; a widget without `src` shows a placeholder.
 *
 *  minHeight        CSS min-height on tablets and desktop (px)
 *  phoneMinHeight   if set, phones start at this height and resize to the widget (Insta Quote)
 *  phoneFullScreen  phones start the iframe at screen height, then fit the widget's height once it reports one
 *  maxHeight        largest height a resize message may set (px)
 *  background       colour behind the iframe while it loads
 */
export type JewlxWidget = {
  id: string; title: string; src?: string
  minHeight?: number; phoneMinHeight?: number; phoneFullScreen?: boolean; maxHeight?: number; background?: string
}

export const JEWLX: Record<'customEnquiry' | 'instaQuote' | 'metalIq' | 'ringBuilder', JewlxWidget> = {
  // Custom Jewellery page (/custom). Embed code supplied 3 Nov 2026.
  customEnquiry: {
    id: 'jewlx-enquiry-5abcd348',
    title: 'JewlX Custom Enquiry',
    src: 'https://builder.jewlx.ai/custom-enquiry/5abcd348-2b13-419f-a64a-d31803868f00?v=mw0iso6k',
    minHeight: 500, phoneFullScreen: true, maxHeight: 4000,
  },
  // Instant ring quote page (/instant-quote). Embed code supplied 3 Nov 2026.
  instaQuote: {
    id: 'jewlx-quote-5abcd348',
    title: 'JewlX Quote Estimator Form',
    src: 'https://builder.jewlx.ai/quote/5abcd348-2b13-419f-a64a-d31803868f00',
    minHeight: 500, phoneMinHeight: 260, maxHeight: 6000, background: '#000000',
  },
  // Sell your gold page (/sell-gold). Embed code supplied 3 Nov 2026.
  metalIq: {
    id: 'metalx-widget-5abcd348',
    title: 'Metal IQ Buying Form',
    src: 'https://builder.jewlx.ai/metal-buying/5abcd348-2b13-419f-a64a-d31803868f00?v=mw0jaijm',
    minHeight: 600, maxHeight: 4000,
  },
  // Ring builder page (/build-your-ring). JewlX Diamonds form, embed code supplied 3 Nov 2026.
  ringBuilder: {
    id: 'jewlx-diamonds-5abcd348',
    title: 'JewlX Diamonds Form',
    src: 'https://builder.jewlx.ai/diamonds/5abcd348-2b13-419f-a64a-d31803868f00',
    minHeight: 500, phoneFullScreen: true, maxHeight: 6000,
  },
}
