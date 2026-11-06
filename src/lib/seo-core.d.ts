export type SeoConfig = { origin: string; siteName: string; image: string; org: Record<string, any>; pages: Record<string, { title: string; description?: string; h1?: string; noindex?: boolean }>; collection: { title: string; description: string } }
export type Meta = { url: string; image?: string; type: string; title?: string; description?: string; h1?: string; noindex?: boolean; ld: object[] }
export function orgLd(seo: SeoConfig): object
export function metaFor(seo: SeoConfig, path: string, data?: { catalog?: any; faq?: [string, string][] }): Meta
export function ldJson(m: Meta): string
