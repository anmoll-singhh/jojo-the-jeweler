import { useEffect, useRef, useState } from 'react'
import { getLenis } from '../lib/motion'
import { ArrowLeft, Copy, InstagramLogo, Phone } from '@phosphor-icons/react'
import { BRAND } from '../data/site'

/** 10–15 digits in any common format: "(212) 555-1234", "212.555.1234", "+44 20 7946 0958". */
export const validPhone = (s: string) => { const d = s.replace(/\D/g, ''); return d.length >= 10 && d.length <= 15 && !/[a-z]/i.test(s) }

/** Phones can hand a text to Messages; desktops can't, so there the message is shown to copy instead. */
const canText = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && matchMedia('(pointer: coarse)').matches
export type SendMode = 'email' | 'sms' | 'desktop'
export const sendMode = (): SendMode => (BRAND.email ? 'email' : canText() ? 'sms' : 'desktop')

/** Opens the visitor's own app with the message filled in (the site has no server to send from). */
export function deliver(message: string, subject: string): SendMode {
  const mode = sendMode()
  const body = encodeURIComponent(message)
  if (mode === 'email') location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${body}`
  if (mode === 'sms') location.href = `${BRAND.smsHref}?&body=${body}`
  return mode
}

/** What the visitor sees after pressing send. Never claims the message was sent: only their app can send it. */
export function SendPanel({ mode, message, onBack, onReset }: { mode: SendMode; message: string; onBack: () => void; onReset?: () => void }) {
  const [copied, setCopied] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  // the form it replaces was taller, so bring the panel into view
  useEffect(() => {
    const el = box.current; if (!el) return
    const r = el.getBoundingClientRect(); if (r.top > 80 && r.top < innerHeight * 0.6) return
    const y = r.top + scrollY - 96; const l = getLenis(); if (l) l.scrollTo(y, { duration: 0.8 }); else scrollTo({ top: y })
    el.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true })
  }, [])
  const copy = async () => { try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* clipboard blocked */ } }
  const ig = `https://ig.me/m/${BRAND.handle.slice(1)}`
  return (
    <div ref={box} className="send" role="status">
      {mode === 'desktop' ? <>
        <h3 className="h3" tabIndex={-1}>Text this to {BRAND.phone}</h3>
        <p>Texting needs a phone, so copy the message below and send it from yours, or send it to JoJo on Instagram.</p>
      </> : <>
        <h3 className="h3" tabIndex={-1}>Your message is open in {mode === 'email' ? 'your email app' : 'Messages'}</h3>
        <p>Press send there. If it didn’t open, copy the message and {mode === 'email' ? `email it to ${BRAND.email}` : `text it to ${BRAND.phone}`}.</p>
      </>}
      <pre className="cu-msg">{message}</pre>
      <div className="send__acts">
        <button type="button" className="btn" onClick={copy}><Copy size={18} /> {copied ? 'Copied' : 'Copy the message'}</button>
        <a className="btn btn--ghost" href={ig} target="_blank" rel="noreferrer"><InstagramLogo size={18} /> Instagram DM</a>
        <a className="btn btn--ghost" href={BRAND.phoneHref}><Phone size={18} /> Call</a>
      </div>
      <div className="send__more">
        <button type="button" className="link small" onClick={onBack}><ArrowLeft size={14} /> Edit the message</button>
        {onReset && <button type="button" className="link small" onClick={onReset}>Start a new one</button>}
      </div>
    </div>
  )
}
