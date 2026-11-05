import { useState } from 'react'
import { ArrowCounterClockwise, Check, Copy, SlidersHorizontal, X } from '@phosphor-icons/react'
import { ACCENTS, DEFAULT_DESIGN, PAIRS, THEMES, lookUrl, useDesign, type Design } from '../lib/design'

/**
 * Live design controller (preview only: dev, or ?design=1). Everything switches through
 * data-attributes and CSS variables on <html>, so the page restyles instantly without re-rendering.
 */
export function DesignController() {
  const [d, set] = useDesign()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'look' | 'type' | 'space' | 'fx'>('look')
  const [copied, setCopied] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(lookUrl(d)); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* blocked */ } }
  const Slider = ({ k, label, min, max, step, fmt }: { k: keyof Design; label: string; min: number; max: number; step: number; fmt: (v: number) => string }) => (
    <label className="dc__sl"><span>{label}<b>{fmt(d[k] as number)}</b></span>
      <input type="range" min={min} max={max} step={step} value={d[k] as number} onChange={(e) => set({ [k]: +e.target.value } as Partial<Design>)} onDoubleClick={() => set({ [k]: DEFAULT_DESIGN[k] } as Partial<Design>)} />
    </label>
  )
  const Seg = <K extends keyof Design>({ k, opts }: { k: K; opts: [Design[K], string][] }) => (
    <div className="dc__seg">{opts.map(([v, n]) => <button key={String(v)} className={d[k] === v ? 'on' : ''} onClick={() => set({ [k]: v } as Partial<Design>)}>{n}</button>)}</div>
  )
  const pct = (v: number) => Math.round(v * 100) + '%'
  return (
    <div className={'dc' + (open ? ' open' : '')}>
      <button className="dc__fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="dc-panel">{open ? <X size={16} /> : <SlidersHorizontal size={16} />} Design</button>
      {open && (
        <div id="dc-panel" className="dc__panel" role="dialog" aria-label="Design controller" data-lenis-prevent>
          <div className="dc__tabs" role="tablist">{([['look', 'Theme'], ['type', 'Type'], ['space', 'Space'], ['fx', 'Effects']] as const).map(([k, n]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{n}</button>)}</div>

          {tab === 'look' && <>
            <fieldset><legend>Theme</legend>{THEMES.map((t) => (
              <button key={t.id} className={'dc__theme' + (d.theme === t.id ? ' on' : '')} onClick={() => set({ theme: t.id })}>
                <span className="dc__sw">{t.sw.map((c) => <i key={c} style={{ background: c }} />)}</span><span><b>{t.name}</b><small>{t.note}</small></span>
              </button>))}
            </fieldset>
            <fieldset><legend>Accent</legend><div className="dc__seg dc__seg--sw">{ACCENTS.map(([v, n]) => <button key={n} className={d.accent === v ? 'on' : ''} onClick={() => set({ accent: v })} title={n}>{v ? <i style={{ background: v }} /> : 'Auto'}</button>)}</div></fieldset>
          </>}

          {tab === 'type' && <>
            <fieldset><legend>Font pair</legend>{PAIRS.map(([id, n, note]) => (
              <button key={id} className={'dc__theme dc__pair dc__pair--' + id + (d.pair === id ? ' on' : '')} onClick={() => set({ pair: id })}><span className="dc__aa">Aa</span><span><b>{n}</b><small>{note}</small></span></button>))}
            </fieldset>
            {Slider({ k: "hs", label: "Heading size", min: 0.7, max: 1.4, step: 0.02, fmt: pct })}
            {Slider({ k: "bs", label: "Body text", min: 0.85, max: 1.25, step: 0.01, fmt: pct })}
            {Slider({ k: "track", label: "Heading letter-spacing", min: -0.05, max: 0.08, step: 0.005, fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(3) + 'em' })}
          </>}

          {tab === 'space' && <>
            {Slider({ k: "space", label: "Space between sections", min: 0.5, max: 1.6, step: 0.05, fmt: pct })}
            {Slider({ k: "margin", label: "Page margins", min: 0.5, max: 2.5, step: 0.05, fmt: pct })}
            {Slider({ k: "radius", label: "Corner radius", min: 0, max: 24, step: 1, fmt: (v) => v + 'px' })}
          </>}

          {tab === 'fx' && <>
            <fieldset><legend>Cursor light</legend>{Seg({ k: "light", opts: [['off', 'Off'], ['soft', 'Soft'], ['strong', 'Strong']] })}</fieldset>
            <fieldset><legend>Product cards</legend>{Seg({ k: "cards", opts: [['dim', 'Dim until hover'], ['lit', 'Always lit']] })}</fieldset>
            <fieldset><legend>Photography</legend>{Seg({ k: "img", opts: [['natural', 'Natural'], ['contrast', 'High contrast'], ['mono', 'Mono']] })}</fieldset>
            <fieldset><legend>Film grain</legend>{Seg({ k: "grain", opts: [['off', 'Off'], ['on', 'On']] })}</fieldset>
            <fieldset><legend>Motion</legend>{Seg({ k: "motion", opts: [['on', 'Full'], ['calm', 'Calm'], ['off', 'Still']] })}</fieldset>
          </>}

          <div className="dc__foot">
            <button className="dc__btn" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Link copied' : 'Copy this look'}</button>
            <button className="dc__btn dc__btn--ghost" onClick={() => set(DEFAULT_DESIGN)}><ArrowCounterClockwise size={14} /> Reset</button>
          </div>
          <p className="dc__hint">Double-click a slider to reset it. “Copy this look” gives a link that opens the site with these settings.</p>
        </div>
      )}
    </div>
  )
}
