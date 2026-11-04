/**
 * Catalogue types. Shaped after the Shopify Storefront API so the mock adapter and the live one
 * return the same objects and no component changes when the store is connected.
 */
export type Money = { amount: number; currencyCode: string }
export type Image = { src: string; alt: string; width?: number; height?: number }
export type SelectedOption = { name: string; value: string }
export type Variant = {
  id: string
  title: string
  selectedOptions: SelectedOption[]
  price: Money
  compareAtPrice: Money | null
  availableForSale: boolean
  sku?: string
  image?: Image | null
}
export type ProductOption = { name: string; values: string[] }
export type Product = {
  id: string
  handle: string
  title: string
  productType: string
  vendor: string
  tags: string[]
  description: string
  descriptionHtml?: string
  options: ProductOption[]
  images: Image[]
  variants: Variant[]
  collections: string[]
  /** Short spec rows for the PDP (material, stone, width, weight…) */
  specs: { label: string; value: string }[]
  /** The metal the product photos actually show (drives the metal colour preview). */
  photoMetal?: string
  /** Set on the sample catalogue so the UI can label unverified content. */
  sample?: boolean
  createdAt?: string
}
export type Collection = { id: string; handle: string; title: string; description: string; image: Image | null; products: string[] }
export type Catalog = { source: 'shopify' | 'sample'; generatedAt: string; currency: string; products: Product[]; collections: Collection[] }
