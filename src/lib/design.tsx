import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { load } from './store'

/** The five live themes. `fd`/`fb` are the pairing each theme ships with; the controller can override. */
export const THEMES = [
  { id: 'brand', name: 'Original brand', note: 'Black velvet, bone ink, flat gold', sw: ['#1d1c1a', '#efece4', '#d2ad5e'], fd: 'archivo', fb: 'archivo' },
  { id: 'luxury', name: 'Dark luxury', note: 'Warm graphite, champagne, serif', sw: ['#231f1a', '#ebe4d6', '#d9c29a'], fd: 'fraunces', fb: 'archivo' },
  { id: 'minimal', name: 'Modern minimal', note: 'Paper white, one ink, no accent', sw: ['#f8f7f4', '#1c1b19', '#8a8882'], fd: 'archivo-narrow', fb: 'archivo' },
  { id: 'street', name: 'Streetwear editorial', note: 'Stone paper, black, one red', sw: ['#ebe8e1', '#17151a', '#c8321f'], fd: 'shoulders', fb: 'archivo' },
  { id: 'chrome', name: 'Cinematic chrome', note: 'Cold graphite, silver, ice', sw: ['#15171c', '#e4e7ec', '#bcd5e6'], fd: 'unbounded', fb: 'archivo' },
] as const
export type ThemeId = (typeof THEMES)[number]['id']
export const DISPLAY_FONTS = [['archivo', 'Archivo Wide'], ['archivo-narrow', 'Archivo Narrow'], ['fraunces', 'Fraunces'], ['shoulders', 'Big Shoulders'], ['unbounded', 'Unbounded']] as const
export const BODY_FONTS = [['archivo', 'Archivo'], ['fraunces', 'Fraunces'], ['unbounded', 'Unbounded'], ['system', 'System']] as const
export const ACCENTS = [['', 'Theme'], ['oklch(78% 0.11 85)', 'Gold'], ['oklch(86% 0.06 230)', 'Ice'], ['oklch(55% 0.21 28)', 'Red'], ['oklch(70% 0.13 150)', 'Jade'], ['oklch(92% 0.01 90)', 'Bone']] as const

export type Design = { theme: ThemeId; fd: string; fb: string; accent: string; motion: 'on' | 'off'; radius: 'square' | 'round' }
const DEF: Design = { theme: 'brand', fd: 'archivo', fb: 'archivo', accent: '', motion: 'on', radius: 'square' }
const DCtx = createContext<[Design, (d: Partial<Design>) => void]>(null!)
export const useDesign = () => useContext(DCtx)
export const DEFAULT_DESIGN = DEF
/** The controller is a dev-preview feature: off in production unless ?design=1 or VITE_DESIGN_CONTROLLER=1 */
export const CONTROLLER_ENABLED = import.meta.env.DEV || import.meta.env.VITE_DESIGN_CONTROLLER === '1' || (typeof location !== 'undefined' && new URLSearchParams(location.search).has('design'))

export function DesignProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Design>(() => (CONTROLLER_ENABLED ? { ...DEF, ...load('jojo-design', {}) } : DEF))
  useEffect(() => {
    if (CONTROLLER_ENABLED) try { localStorage.setItem('jojo-design', JSON.stringify(d)) } catch { /* ignore */ }
    const r = document.documentElement
    r.classList.add('theming')
    r.dataset.theme = d.theme; r.dataset.fd = d.fd; r.dataset.fb = d.fb; r.dataset.motion = d.motion; r.dataset.radius = d.radius
    if (d.accent) r.style.setProperty('--accent', d.accent); else r.style.removeProperty('--accent')
    r.style.setProperty('--r', d.radius === 'round' ? '14px' : '0px')
    const t = setTimeout(() => r.classList.remove('theming'), 500)
    return () => clearTimeout(t)
  }, [d])
  const set = (p: Partial<Design>) => setD((x) => {
    // Picking a theme resets the fonts to that theme's pairing.
    const t = p.theme && THEMES.find((th) => th.id === p.theme)
    return { ...x, ...(t ? { fd: t.fd, fb: t.fb, accent: '' } : {}), ...p }
  })
  return <DCtx.Provider value={[d, set]}>{children}</DCtx.Provider>
}
