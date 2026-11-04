/**
 * Collection filter bar, modelled on Cullen Jewellery's: one dropdown per filter (Metal, Shape,
 * Setting style, Carat), the result count and sort on the right, active filters as removable
 * chips below. Each dropdown allows several choices.
 *
 * Phones get a "Filter" button on the left and "Sort" on the right. Filter opens a drawer from the
 * left with every filter in it (Myntra style: filter names in a column on the left, the options
 * of the selected one on the right, "Clear all" and "Show N results" pinned at the bottom).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CaretDown, X, Check, SlidersHorizontal } from '@phosphor-icons/react'
import { getLenis } from './motion'

export type FOption = { v: string; label: string; icon?: ReactNode; n: number }
export type FGroup = { key: string; label: string; layout: 'grid' | 'list' | 'chips'; options: FOption[] }

type Props = {
  groups: FGroup[]
  value: Record<string, string[]>
  toggle: (key: string, v: string) => void
  clearGroup: (key: string) => void
  clearAll: () => void
  total: number
  sort: string
  setSort: (v: string) => void
  extra?: ReactNode
}

const SORTS: [string, string][] = [['featured', 'Featured'], ['low', 'Price, low to high'], ['high', 'Price, high to low']]

function Opts({ g, sel, toggle }: { g: FGroup; sel: string[]; toggle: (key: string, v: string) => void }) {
  return (
    <div className={'fpanel__opts fopts--' + g.layout}>{g.options.map((o) => {
      const on = sel.includes(o.v)
      return (
        <button key={o.v} className={'fopt' + (on ? ' on' : '')} aria-pressed={on} disabled={!o.n && !on} onClick={() => toggle(g.key, o.v)}>
          {o.icon && <span className="fopt__ic">{o.icon}</span>}
          <span className="fopt__l">{o.label}</span>
          <span className="fopt__n">{o.n}</span>
          {on && g.layout === 'list' && <Check className="fopt__ck" size={14} weight="bold" aria-hidden="true" />}
        </button>
      )
    })}</div>
  )
}

export function FilterBar({ groups, value, toggle, clearGroup, clearAll, total, sort, setSort, extra }: Props) {
  const [open, setOpen] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [tab, setTab] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const nSel = groups.reduce((n, g) => n + (value[g.key]?.length ?? 0), 0)
  const curTab = groups.find((g) => g.key === tab) ?? groups[0]

  // Drawer: lock the page behind it, close on Escape.
  useEffect(() => {
    if (!drawer) return
    document.body.style.overflow = 'hidden'; document.body.classList.add('has-sheet'); getLenis()?.stop()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false) }
    document.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; document.body.classList.remove('has-sheet'); getLenis()?.start(); document.removeEventListener('keydown', key) }
  }, [drawer])

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const down = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen('') }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen('') }
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key) }
  }, [open])

  const active = groups.flatMap((g) => (value[g.key] ?? []).map((v) => ({ g, o: g.options.find((o) => o.v === v) })).filter((x) => x.o))
  const sortLabel = SORTS.find(([v]) => v === sort)?.[1] ?? 'Featured'

  return (
    <div className="fbar wrap" ref={root}>
      <div className="fbar__row">
        <button className="fdrop__btn fbar__filter" onClick={() => setDrawer(true)} aria-haspopup="dialog" aria-expanded={drawer}>
          <SlidersHorizontal size={16} weight="regular" aria-hidden="true" />Filter{nSel > 0 && <span className="fdrop__n">{nSel}</span>}
        </button>
        <div className="fbar__groups">
          {extra}
          {groups.map((g) => {
            const sel = value[g.key] ?? []
            const isOpen = open === g.key
            return (
              <div key={g.key} className={'fdrop' + (isOpen ? ' open' : '')}>
                <button className={'fdrop__btn' + (sel.length ? ' has' : '')} aria-expanded={isOpen} aria-controls={'fp-' + g.key} onClick={() => setOpen(isOpen ? '' : g.key)}>
                  {g.label}{sel.length > 0 && <span className="fdrop__n">{sel.length}</span>}<CaretDown size={14} weight="bold" aria-hidden="true" />
                </button>
                <div id={'fp-' + g.key} className={'fpanel fpanel--' + g.layout} role="group" aria-label={g.label} hidden={!isOpen}>
                  <div className="fpanel__head"><b>{g.label}</b><button className="icon" aria-label="Close" onClick={() => setOpen('')}><X size={18} /></button></div>
                  <div className="fpanel__opts">{g.options.map((o) => {
                    const on = sel.includes(o.v)
                    return (
                      <button key={o.v} className={'fopt' + (on ? ' on' : '')} aria-pressed={on} disabled={!o.n && !on} onClick={() => toggle(g.key, o.v)}>
                        {o.icon && <span className="fopt__ic">{o.icon}</span>}
                        <span className="fopt__l">{o.label}</span>
                        <span className="fopt__n">{o.n}</span>
                        {on && g.layout === 'list' && <Check className="fopt__ck" size={14} weight="bold" aria-hidden="true" />}
                      </button>
                    )
                  })}</div>
                  <div className="fpanel__foot">
                    {sel.length > 0 ? <button className="link" onClick={() => clearGroup(g.key)}>Clear</button> : <span />}
                    <button className="btn fpanel__done" onClick={() => setOpen('')}>Show {total} {total === 1 ? 'result' : 'results'}</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="fbar__end">
          <span className="fbar__count">{total} {total === 1 ? 'result' : 'results'}</span>
          <div className={'fdrop fdrop--sort' + (open === 'sort' ? ' open' : '')}>
            <button className="fdrop__btn" aria-expanded={open === 'sort'} onClick={() => setOpen(open === 'sort' ? '' : 'sort')}>
              <span className="fdrop__pre">Sort:</span> {sortLabel}<CaretDown size={14} weight="bold" aria-hidden="true" />
            </button>
            <div className="fpanel fpanel--list fpanel--sort" role="listbox" aria-label="Sort" hidden={open !== 'sort'}>
              <div className="fpanel__opts">{SORTS.map(([v, t]) => (
                <button key={v} role="option" aria-selected={sort === v} className={'fopt' + (sort === v ? ' on' : '')} onClick={() => { setSort(v); setOpen('') }}>
                  <span className="fopt__l">{t}</span>{sort === v && <Check className="fopt__ck" size={14} weight="bold" aria-hidden="true" />}
                </button>
              ))}</div>
            </div>
          </div>
        </div>
      </div>
      {active.length > 0 && (
        <div className="fbar__chips">
          {active.map(({ g, o }) => (
            <button key={g.key + o!.v} className="fchip" onClick={() => toggle(g.key, o!.v)} aria-label={`Remove ${o!.label}`}>
              {o!.icon && <span className="fopt__ic">{o!.icon}</span>}{o!.label}<X size={12} weight="bold" aria-hidden="true" />
            </button>
          ))}
          <button className="link fbar__clear" onClick={clearAll}>Clear all</button>
        </div>
      )}
      {open && <div className="fscrim" onClick={() => setOpen('')} aria-hidden="true" />}

      {createPortal(<>
      <div className={'fdrawer' + (drawer ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Filters" aria-hidden={!drawer} inert={!drawer} data-lenis-prevent>
        <div className="fdrawer__head"><b>Filters</b><button className="icon" aria-label="Close filters" onClick={() => setDrawer(false)}><X size={20} weight="light" /></button></div>
        {extra && <div className="fdrawer__extra">{extra}</div>}
        <div className="fdrawer__body">
          <div className="fdrawer__tabs" role="tablist" aria-orientation="vertical">
            {groups.map((g) => {
              const n = value[g.key]?.length ?? 0
              return (
                <button key={g.key} role="tab" aria-selected={curTab?.key === g.key} className={'fdrawer__tab' + (curTab?.key === g.key ? ' on' : '')} onClick={() => setTab(g.key)}>
                  {g.label}{n > 0 && <span className="fdrop__n">{n}</span>}
                </button>
              )
            })}
          </div>
          <div className="fdrawer__opts" role="tabpanel" aria-label={curTab?.label}>
            {curTab && <Opts g={curTab} sel={value[curTab.key] ?? []} toggle={toggle} />}
          </div>
        </div>
        <div className="fdrawer__foot">
          <button className="link" onClick={clearAll} disabled={!nSel}>Clear all</button>
          <button className="btn" onClick={() => setDrawer(false)}>Show {total} {total === 1 ? 'result' : 'results'}</button>
        </div>
      </div>
      <div className={'fdrawer__scrim' + (drawer ? ' open' : '')} onClick={() => setDrawer(false)} aria-hidden="true" />
      </>, document.body)}
    </div>
  )
}
