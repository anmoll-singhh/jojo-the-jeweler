import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { load } from './store'

/** Five themes in the "Ice is light" family. `pair` is the font pairing each ships with. */
export const THEMES = [
  { id: 'ice', name: 'Ice', note: 'True black, bone, champagne on the action', sw: ['#0b0b0a', '#efece4', '#e3cc94'], pair: 'wide-light' },
  { id: 'champagne', name: 'Champagne', note: 'Warm black, champagne ink, serif', sw: ['#16120d', '#f0e6d2', '#dcc286'], pair: 'serif' },
  { id: 'platinum', name: 'Platinum', note: 'Cold graphite, silver, ice-blue light', sw: ['#0e1015', '#e6e9ee', '#c6dcea'], pair: 'future' },
  { id: 'rose', name: 'Rose', note: 'Rose-black, blush ink, rose-gold light', sw: ['#170f0e', '#f3e6e0', '#e1aa8b'], pair: 'wide-light' },
  { id: 'daylight', name: 'Daylight', note: 'Bone paper and black ink, for comparison', sw: ['#f2efe8', '#151412', '#8a8780'], pair: 'wide-light' },
] as const
export type ThemeId = (typeof THEMES)[number]['id']
export const PAIRS = [
  ['wide-light', 'Archivo Wide Light + Archivo', 'Quiet, wide, expensive'],
  ['serif', 'Fraunces Light + Archivo', 'Editorial luxury'],
  ['future', 'Unbounded Light + Archivo', 'Futurist, rounded'],
  ['street', 'Big Shoulders + Archivo', 'Condensed street caps'],
  ['heavy', 'Archivo Black Wide + Fraunces', 'Loud headline, bookish body'],
] as const
export const ACCENTS = [['', 'Theme'], ['oklch(84% 0.075 85)', 'Champagne'], ['oklch(78% 0.11 85)', 'Gold'], ['oklch(88% 0.045 225)', 'Ice'], ['oklch(80% 0.08 45)', 'Rose'], ['oklch(55% 0.21 28)', 'Red'], ['oklch(94% 0.008 85)', 'Bone']] as const

export type Design = {
  theme: ThemeId; pair: string; accent: string
  hs: number; bs: number; space: number; margin: number; track: number; radius: number
  motion: 'on' | 'calm' | 'off'; grain: 'off' | 'on'; img: 'natural' | 'contrast' | 'mono'; light: 'off' | 'soft' | 'strong'; cards: 'dim' | 'lit'
}
export const DEFAULT_DESIGN: Design = { theme: 'ice', pair: 'wide-light', accent: '', hs: 1, bs: 1, space: 1, margin: 1, track: 0, radius: 0, motion: 'on', grain: 'off', img: 'natural', light: 'soft', cards: 'dim' }
const DCtx = createContext<[Design, (d: Partial<Design>) => void]>(null!)
export const useDesign = () => useContext(DCtx)
/** The controller is a dev-preview feature: off in production unless ?design=1 or VITE_DESIGN_CONTROLLER=1 */
export const CONTROLLER_ENABLED = import.meta.env.DEV || import.meta.env.VITE_DESIGN_CONTROLLER === '1' || (typeof location !== 'undefined' && new URLSearchParams(location.search).has('design'))

/** Settings can travel as ?look=<base64 json> so a look can be shared or locked in. */
const fromUrl = (): Partial<Design> => { try { const l = new URLSearchParams(location.search).get('look'); return l ? JSON.parse(atob(l)) : {} } catch { return {} } }
export const lookUrl = (d: Design) => `${location.origin}${location.pathname}?design=1&look=${btoa(JSON.stringify(d))}`

export function DesignProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Design>(() => (CONTROLLER_ENABLED ? { ...DEFAULT_DESIGN, ...load('jojo-design-v2', {}), ...fromUrl() } : DEFAULT_DESIGN))
  useEffect(() => {
    if (CONTROLLER_ENABLED) try { localStorage.setItem('jojo-design-v2', JSON.stringify(d)) } catch { /* ignore */ }
    const r = document.documentElement, st = r.style
    r.classList.add('theming')
    Object.assign(r.dataset, { theme: d.theme, pair: d.pair, motion: d.motion, grain: d.grain, img: d.img, light: d.light, cards: d.cards })
    if (d.accent) st.setProperty('--accent', d.accent); else st.removeProperty('--accent')
    st.setProperty('--hs', String(d.hs)); st.setProperty('--bs', String(d.bs)); st.setProperty('--space', String(d.space)); st.setProperty('--margin', String(d.margin))
    st.setProperty('--track', d.track + 'em'); st.setProperty('--r', d.radius + 'px')
    gsap.globalTimeline.timeScale(d.motion === 'calm' ? 1.8 : 1) // calm: reveals settle quickly and quietly
    const t = setTimeout(() => r.classList.remove('theming'), 500)
    return () => clearTimeout(t)
  }, [d])
  // the page light follows the pointer (and phone tilt) as two CSS variables
  useEffect(() => {
    if (d.light === 'off') return
    const r = document.documentElement.style
    const mv = (e: PointerEvent) => { r.setProperty('--mx', e.clientX + 'px'); r.setProperty('--my', e.clientY + 'px') }
    addEventListener('pointermove', mv, { passive: true }); return () => removeEventListener('pointermove', mv)
  }, [d.light])
  const set = (p: Partial<Design>) => setD((x) => {
    // Picking a theme resets the font pair and accent to that theme's own.
    const t = p.theme && THEMES.find((th) => th.id === p.theme)
    return { ...x, ...(t ? { pair: t.pair, accent: '' } : {}), ...p }
  })
  return <DCtx.Provider value={[d, set]}>{children}</DCtx.Provider>
}
