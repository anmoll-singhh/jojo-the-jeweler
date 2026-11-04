import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Sheets and drawers: focus moves in on open, Tab stays inside, Escape closes, focus returns on close. */
export function useModal(open: boolean, ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const items = () => [...(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter((el) => el.offsetParent !== null)
    const t = setTimeout(() => items()[0]?.focus({ preventScroll: true }), 30)
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return }
      if (e.key !== 'Tab') return
      const l = items(); if (!l.length) return
      const first = l[0], last = l[l.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      else if (!ref.current?.contains(document.activeElement)) { e.preventDefault(); first.focus() }
    }
    addEventListener('keydown', k)
    return () => { clearTimeout(t); removeEventListener('keydown', k); if (prev && document.contains(prev)) prev.focus({ preventScroll: true }) }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
}

/** Arrow keys move through any role="radiogroup" of buttons and select, like native radios. */
export function useRadioKeys() {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return
      const t = e.target as HTMLElement
      if (t.getAttribute('role') !== 'radio') return
      const g = t.closest('[role="radiogroup"]'); if (!g) return
      const l = [...g.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])')]
      const i = l.indexOf(t), d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
      const n = l[(i + d + l.length) % l.length]
      e.preventDefault(); n.focus(); n.click()
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])
}
