import { useId, useState, type ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react'

/**
 * Accordion row that opens and closes smoothly (grid-rows 0fr → 1fr, works in every browser),
 * with the answer fading and rising in. A real button with aria-expanded/aria-controls.
 */
export function Accordion({ title, children, open: start = false, className = '' }: { title: ReactNode; children: ReactNode; open?: boolean; className?: string }) {
  const [open, setOpen] = useState(start)
  const id = useId()
  return (
    <div className={'acx' + (open ? ' is-open' : '') + (className ? ' ' + className : '')}>
      <h3 className="acx__h">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span>{title}</span><i className="acx__icon" aria-hidden="true"><CaretDown size={16} /></i>
        </button>
      </h3>
      <div className="acx__panel" id={id} role="region" aria-hidden={!open} inert={!open}>
        <div className="acx__inner"><div className="acx__body">{children}</div></div>
      </div>
    </div>
  )
}
