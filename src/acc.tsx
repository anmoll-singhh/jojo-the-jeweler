import { useId, useState, type ReactNode } from 'react'

/**
 * Accordion row that opens and closes smoothly (native <details> can't animate its height).
 * The panel animates grid-template-rows 0fr → 1fr, so it works for any content height without
 * measuring. Keyboard and screen readers get a real button with aria-expanded/aria-controls.
 */
export function Acc({ title, children, open: start = false }: { title: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(start)
  const id = useId()
  return (
    <div className={'acc2' + (open ? ' is-open' : '')}>
      <h3 className="acc2__h">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span>{title}</span><i aria-hidden="true" />
        </button>
      </h3>
      <div className="acc2__p" id={id} role="region" aria-label={title} inert={!open}>
        <div className="acc2__in">{children}</div>
      </div>
    </div>
  )
}
