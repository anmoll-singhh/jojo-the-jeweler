/**
 * JewlX widget embed — the React version of the snippet JewlX supplies, behaving the same:
 *  - iframe 800px tall, then the height the widget reports ('jewlx-resize', clamped 500–4000px,
 *    never below the widget's minHeight). Widgets marked phoneFullScreen stay at full screen
 *    height on phones and scroll themselves, as their JewlX snippet does
 *  - 'jewlx-scroll-top' (Insta Quote): scrolls the widget's top back into view below the header
 *  - lead bridge: 'jewlx-lead' and 'jewlx-event' messages from a widget iframe on the page are
 *    pushed to window.dataLayer (Google Tag Manager / GA4), each lead only once
 * Until a widget has a `src`, the placeholder slot is shown instead.
 */
import { useEffect, useRef, useState } from 'react'
import type { JewlxWidget } from './data/jewlx'
import { EmbedSlot } from './ui'
import { getLenis } from './motion'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

type Msg = Record<string, unknown> & { type?: string }
declare global { interface Window { dataLayer?: Record<string, unknown>[]; __jewlxLeadBridge?: boolean } }

const parse = (d: unknown): Msg | null => { try { return (typeof d === 'string' ? JSON.parse(d) : d) as Msg } catch { return null } }

/** One listener for the whole site, as in the JewlX snippet. */
function installLeadBridge() {
  if (window.__jewlxLeadBridge) return
  window.__jewlxLeadBridge = true
  const seen: Record<string, true> = {}
  const fromWidget = (src: MessageEventSource | null) => !!src && [...document.getElementsByTagName('iframe')].some((f) => f.contentWindow === src)
  window.addEventListener('message', (e) => {
    const d = parse(e.data)
    if (!d || !fromWidget(e.source)) return
    if (d.type === 'jewlx-event' && d.event) {
      const ev: Record<string, unknown> = { event: d.event }
      if (d.params && typeof d.params === 'object') Object.assign(ev, d.params)
      ;(window.dataLayer = window.dataLayer || []).push(ev)
      return
    }
    if (d.type !== 'jewlx-lead') return
    const id = typeof d.lead_id === 'string' || typeof d.lead_id === 'number' ? String(d.lead_id) : ''
    if (id) { if (seen[id]) return; seen[id] = true }
    const payload: Record<string, unknown> = {
      event: typeof d.event_name === 'string' && d.event_name ? d.event_name : 'jewlx_lead',
      form_type: d.form_type, lead_id: d.lead_id,
      sha256_email_address: d.sha256_email_address, sha256_phone_number: d.sha256_phone_number,
    }
    if (typeof d.value === 'number' && d.value > 0) { payload.value = d.value; payload.currency = d.currency }
    ;(window.dataLayer = window.dataLayer || []).push(payload)
  })
}

export function JewlxEmbed({ w, placeholder, height = 640 }: { w: JewlxWidget; placeholder: string; height?: number }) {
  const ref = useRef<HTMLIFrameElement>(null)
  // Phones: full-screen widgets start at screen height (as in their JewlX snippets), then fit
  // their content once the widget reports its height, so a short step doesn't leave a tall
  // empty block above the footer.
  const [fitted, setFitted] = useState(false)
  useEffect(() => {
    if (!w.src) return
    installLeadBridge()
    const onMsg = (e: MessageEvent) => {
      const f = ref.current
      if (!f || e.source !== f.contentWindow) return
      const d = parse(e.data)
      if (!d) return
      if (d.type === 'jewlx-resize') {
        const raw = typeof d.height === 'number' ? d.height : parseInt(String(d.height), 10)
        if (isNaN(raw)) return
        const phone = window.innerWidth < 768
        if (phone && w.phoneFullScreen) setFitted(true)
        const min = phone ? (w.phoneMinHeight ?? 320) : 500
        f.style.height = Math.max(min, Math.min(w.maxHeight ?? 4000, raw)) + 'px'
      }
      if (d.type === 'jewlx-scroll-top') {
        // The widget moved to a new step: bring its top back into view, below the fixed header.
        const top = f.getBoundingClientRect().top
        const header = (document.querySelector('.nav') as HTMLElement | null)?.getBoundingClientRect().bottom ?? 0
        if (top < header) {
          const y = window.scrollY + top - header - 12
          const lenis = getLenis()
          if (lenis) lenis.scrollTo(y, { immediate: reduced() })
          else window.scrollTo({ top: y, behavior: reduced() ? 'auto' : 'smooth' })
        }
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [w.src, w.phoneFullScreen, w.phoneMinHeight, w.maxHeight])

  if (!w.src) return <EmbedSlot id={w.id} title={`The ${w.title} widget will be integrated here`} body={placeholder} height={height} />
  const cls = 'jewlx' + (w.phoneFullScreen && !fitted ? ' jewlx--phonefull' : '') + (w.phoneMinHeight || fitted ? ' jewlx--phoneauto' : '')
  const vars = { ['--jx-min' as string]: (w.minHeight ?? 500) + 'px', ['--jx-min-phone' as string]: (w.phoneMinHeight ?? 260) + 'px', ['--jx-bg' as string]: w.background ?? 'transparent' }
  return (
    <div id={w.id} className={cls} style={vars} data-lenis-prevent>
      <iframe ref={ref} id={w.id + '-iframe'} src={w.src} title={w.title} loading="lazy" allow="fullscreen; shared-autofill" allowFullScreen />
    </div>
  )
}
