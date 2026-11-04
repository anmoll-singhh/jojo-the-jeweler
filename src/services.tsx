/**
 * Pages for the four JewlX widgets Double M & Co subscribes to. Each page is only the site
 * header, the widget and the footer (a visually hidden heading keeps the page titled for
 * screen readers and search engines).
 *   /custom           Custom Enquiry — custom jewellery
 *   /instant-quote    Insta Quote — instant engagement ring quote
 *   /sell-gold        Metal IQ — sell gold and silver
 *   /build-your-ring  Ring builder (JewlX Diamonds form)
 * Widget ids, iframe sources and sizing are in src/data/jewlx.ts.
 */
import { useEffect } from 'react'
import { Page } from './ui'
import { JewlxEmbed } from './jewlx'
import { JEWLX, type JewlxWidget } from './data/jewlx'

function WidgetPage({ name, w, placeholder }: { name: string; w: JewlxWidget; placeholder: string }) {
  useEffect(() => { document.title = name + ' — Double M & Co' }, [name])
  return (
    <Page className="service widget-page">
      <h1 className="sr-only">{name}</h1>
      <JewlxEmbed w={w} placeholder={placeholder} />
    </Page>
  )
}

export const CustomJewellery = () => <WidgetPage name="Custom jewellery" w={JEWLX.customEnquiry} placeholder="Customers describe their piece, budget and timing, and the enquiry goes straight to the Double M & Co team." />
export const InstantQuote = () => <WidgetPage name="Instant ring quote" w={JEWLX.instaQuote} placeholder="Customers choose shape, carat, metal and setting and receive an instant price estimate." />
export const SellGold = () => <WidgetPage name="Sell your gold" w={JEWLX.metalIq} placeholder="Customers choose metal, purity and weight and see an estimate based on today's prices." />
export const RingBuilder = () => <WidgetPage name="Ring builder" w={JEWLX.ringBuilder} placeholder="Customers design their ring step by step and send it to the Double M & Co team." />
