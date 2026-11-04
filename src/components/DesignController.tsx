import { useState } from 'react'
import { SlidersHorizontal, X } from '@phosphor-icons/react'
import { ACCENTS, BODY_FONTS, DEFAULT_DESIGN, DISPLAY_FONTS, THEMES, useDesign } from '../lib/design'

/**
 * Live design controller (preview only). Themes, display/body face, accent, corners and motion
 * switch instantly through data-attributes on <html>; nothing re-renders the page.
 */
export function DesignController() {
  const [d, set] = useDesign()
  const [open, setOpen] = useState(false)
  return (
    <div className={'dc' + (open ? ' open' : '')}>
      <button className="dc__fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="dc-panel">{open ? <X size={16} /> : <SlidersHorizontal size={16} />} Design</button>
      {open && (
        <div id="dc-panel" className="dc__panel" role="dialog" aria-label="Design controller" data-lenis-prevent>
          <fieldset><legend>Theme</legend>{THEMES.map((t) => (
            <button key={t.id} className={'dc__theme' + (d.theme === t.id ? ' on' : '')} onClick={() => set({ theme: t.id })}>
              <span className="dc__sw">{t.sw.map((c) => <i key={c} style={{ background: c }} />)}</span><span><b>{t.name}</b><small>{t.note}</small></span>
            </button>))}
          </fieldset>
          <fieldset><legend>Display face</legend><div className="dc__seg">{DISPLAY_FONTS.map(([id, n]) => <button key={id} className={d.fd === id ? 'on' : ''} onClick={() => set({ fd: id })}>{n}</button>)}</div></fieldset>
          <fieldset><legend>Body face</legend><div className="dc__seg">{BODY_FONTS.map(([id, n]) => <button key={id} className={d.fb === id ? 'on' : ''} onClick={() => set({ fb: id })}>{n}</button>)}</div></fieldset>
          <fieldset><legend>Accent</legend><div className="dc__seg dc__seg--sw">{ACCENTS.map(([v, n]) => <button key={n} className={d.accent === v ? 'on' : ''} onClick={() => set({ accent: v })} title={n}>{v ? <i style={{ background: v }} /> : 'Auto'}</button>)}</div></fieldset>
          <fieldset><legend>Appearance</legend><div className="dc__seg">
            <button className={d.radius === 'square' ? 'on' : ''} onClick={() => set({ radius: 'square' })}>Square</button><button className={d.radius === 'round' ? 'on' : ''} onClick={() => set({ radius: 'round' })}>Rounded</button>
            <button className={d.motion === 'on' ? 'on' : ''} onClick={() => set({ motion: 'on' })}>Motion</button><button className={d.motion === 'off' ? 'on' : ''} onClick={() => set({ motion: 'off' })}>Still</button>
          </div></fieldset>
          <button className="link small" onClick={() => set(DEFAULT_DESIGN)}>Reset to brand</button>
        </div>
      )}
    </div>
  )
}
