import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, ImageSquare, X } from '@phosphor-icons/react'
import { SendPanel, deliver, validPhone, type SendMode } from '../components/SendPanel'
import { useTitle } from '../lib/seo'
import { Video } from '../components/Media'
import { BRAND, PROCESS } from '../data/site'
import { PIECES } from '../data/content'
import { Lines } from './HomeV1'

/*
 * Custom inquiry, three short steps. Nothing is sent from the browser: the last step composes a
 * message with every answer and opens it in the visitor's texting app (or email, once
 * VITE_CONTACT_EMAIL is set). The answers are kept on this device so a refresh doesn't lose them.
 */
const PIECE = ['Pendant', 'Chain', 'Ring', 'Bracelet', 'Earrings', 'Grillz', 'Watch bust-down', 'Something else']
const METAL = ['Yellow gold', 'White gold', 'Rose gold', 'Two-tone', 'Not sure yet']
const KARAT = ['10K', '14K', '18K', 'Not sure yet']
const STONES = ['Natural diamonds', 'Lab-grown diamonds', 'Coloured stones', 'No stones, solid gold', 'Not sure yet']
const SIZE = ['Small (under 1.5")', 'Medium (1.5–2.5")', 'Large (over 2.5")', 'I have exact measurements']
const BUDGET = ['Under $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000 – $25,000', '$25,000+', 'I’d like a quote first']
const REACH = ['Text', 'Call', 'Email', 'Instagram DM']

type F = { piece: string; metal: string; karat: string; stones: string; size: string; measure: string; idea: string; text: string; budget: string; date: string; occasion: string; refs: string[]; name: string; phone: string; email: string; ig: string; reach: string }
const EMPTY: F = { piece: '', metal: '', karat: '', stones: '', size: '', measure: '', idea: '', text: '', budget: '', date: '', occasion: '', refs: [], name: '', phone: '', email: '', ig: '', reach: 'Text' }
const KEY = 'jojo-custom-draft'
const load = (): F => { try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}'), refs: [] } } catch { return EMPTY } }

export function Custom() {
  useTitle('Custom pieces')
  const [f, setF] = useState<F>(load)
  const [step, setStep] = useState(0)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState<SendMode | null>(null)
  const set = (p: Partial<F>) => { const n = { ...f, ...p }; setF(n); setErr(''); try { const { refs: _r, ...rest } = n; void _r; localStorage.setItem(KEY, JSON.stringify(rest)) } catch { /* private mode */ } }
  const steps = ['The piece', 'The idea', 'You', 'Send']
  const check = (s: number) => {
    if (s === 0 && !f.piece) return 'Pick what kind of piece it is.'
    if (s === 0 && !f.metal) return 'Pick a metal, or “Not sure yet”.'
    if (s === 1 && f.idea.trim().length < 10) return 'Tell JoJo a little more about the idea (a sentence is enough).'
    if (s === 1 && !f.budget) return 'Pick a budget range, or “I’d like a quote first”.'
    if (s === 2 && !f.name.trim()) return 'Add your name.'
    if (s === 1 && f.date && f.date < new Date().toISOString().slice(0, 10)) return 'Pick a date from today on, or leave it empty.'
    if (s === 2 && !validPhone(f.phone)) return 'Add a phone number JoJo can text, with area code.'
    if (s === 2 && f.reach === 'Email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return 'Add an email, or pick another way to reach you.'
    if (s === 2 && f.reach === 'Instagram DM' && !f.ig.trim()) return 'Add your Instagram handle, or pick another way to reach you.'
    return ''
  }
  const next = (e?: FormEvent) => { e?.preventDefault(); const m = check(step); if (m) { setErr(m); return } setStep(Math.min(3, step + 1)); document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const message = useMemo(() => [
    `Custom inquiry — ${f.name}`,
    `Piece: ${f.piece}${f.size ? `, ${f.size}` : ''}${f.measure ? ` (${f.measure})` : ''}`,
    `Metal: ${f.metal}${f.karat ? `, ${f.karat}` : ''}`,
    f.stones && `Stones: ${f.stones}`,
    f.text && `Text or initials on it: ${f.text}`,
    `Idea: ${f.idea.trim()}`,
    `Budget: ${f.budget}`,
    (f.date || f.occasion) && `Needed by: ${[f.date, f.occasion].filter(Boolean).join(', ')}`,
    f.refs.length > 0 && `References: ${f.refs.length} photo${f.refs.length > 1 ? 's' : ''} (attaching next)`,
    `Reach me by ${f.reach.toLowerCase()}: ${f.phone}${f.email ? ` · ${f.email}` : ''}${f.ig ? ` · IG ${f.ig}` : ''}`,
  ].filter(Boolean).join('\n'), [f])
  const send = () => setSent(deliver(message, 'Custom inquiry — ' + f.name))
  const film = PIECES[1]

  return (
    <main id="main" className="page custom">
      <section className="cu-top wrap" id="inquiry">
        <div className="cu-intro">
          <h1 className="h1"><Lines lines={['Custom, the', 'JoJo way']} /></h1>
          <p className="lede rv">Three short steps, then check and send. The quote and consultation are free; JoJo replies with a price and a sketch before anything is made.</p>
        </div>

        <div className="cu-form">
          {sent ? (
            <SendPanel mode={sent} message={message} onBack={() => { setSent(null); setStep(3) }} onReset={() => { setSent(null); setStep(0); set(EMPTY) }} />
          ) : (
            <form onSubmit={next} noValidate aria-label="Custom inquiry">
              <ol className="cu-steps" aria-label="Steps">{steps.map((s, i) => <li key={s} className={(i === step ? 'on' : '') + (i < step ? ' done' : '')}><button type="button" disabled={i > step} onClick={() => i < step && setStep(i)} aria-current={i === step ? 'step' : undefined}><span className="num">{i < step ? <Check size={12} weight="bold" /> : i + 1}</span>{s}</button></li>)}</ol>

              <div className="cu-panel" key={step}>
                {step === 0 && <>
                  <Choice label="What are we making?" opts={PIECE} v={f.piece} set={(piece) => set({ piece })} />
                  <Choice label="Metal" opts={METAL} v={f.metal} set={(metal) => set({ metal })} />
                  <Choice label="Karat" hint="optional" opts={KARAT} v={f.karat} set={(karat) => set({ karat })} />
                  <Choice label="Stones" hint="optional" opts={STONES} v={f.stones} set={(stones) => set({ stones })} />
                  {!/Chain|Bracelet|Watch/.test(f.piece) && <Choice label="Size" hint="optional" opts={SIZE} v={f.size} set={(size) => set({ size })} />}
                  {(f.size === 'I have exact measurements' || /Chain|Bracelet|Ring/.test(f.piece)) && <Field label={/Ring/.test(f.piece) ? 'Ring size' : /Chain|Bracelet/.test(f.piece) ? 'Length and width' : 'Measurements'} hint="optional"><input value={f.measure} onChange={(e) => set({ measure: e.target.value })} placeholder={/Ring/.test(f.piece) ? 'e.g. US 10' : /Chain|Bracelet/.test(f.piece) ? 'e.g. 22", 12mm' : 'e.g. 2" tall'} /></Field>}
                </>}
                {step === 1 && <>
                  <Field label="Describe the idea" hint={`${f.idea.length}/600`}><textarea rows={5} maxLength={600} value={f.idea} onChange={(e) => set({ idea: e.target.value })} placeholder="A logo, a character, your initials, a piece you saw… What should it look like, and how should it wear?" /></Field>
                  <Field label="Reference photos" hint="optional">
                    <label className="cu-file"><ImageSquare size={22} /><span>{f.refs.length ? `${f.refs.length} photo${f.refs.length > 1 ? 's' : ''} chosen` : 'Choose photos (sketches, screenshots, logos)'}</span><input type="file" accept="image/*" multiple onChange={(e) => { const files = [...(e.target.files || [])].slice(0, 6); set({ refs: files.map((x) => URL.createObjectURL(x)) }) }} /></label>
                    {f.refs.length > 0 && <div className="cu-thumbs">{f.refs.map((u, i) => <span key={u} className="stage"><img src={u} alt={`Reference ${i + 1}`} /><button type="button" className="icon" aria-label={`Remove reference ${i + 1}`} onClick={() => set({ refs: f.refs.filter((x) => x !== u) })}><X size={14} /></button></span>)}</div>}
                    <small className="muted">Photos stay on your phone; you attach them in the message thread after you send.</small>
                  </Field>
                  <Field label="Text, names or initials on the piece" hint="optional"><input value={f.text} onChange={(e) => set({ text: e.target.value })} maxLength={60} placeholder="e.g. “22 CREW”" /></Field>
                  <Choice label="Budget" opts={BUDGET} v={f.budget} set={(budget) => set({ budget })} />
                  <div className="cu-two">
                    <Field label="Needed by" hint="optional"><input type="date" value={f.date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set({ date: e.target.value })} /></Field>
                    <Field label="For an occasion?" hint="optional"><input value={f.occasion} onChange={(e) => set({ occasion: e.target.value })} placeholder="Birthday, tour, a gift…" /></Field>
                  </div>
                </>}
                {step === 2 && <>
                  <div className="cu-two">
                    <Field label="Name"><input value={f.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" /></Field>
                    <Field label="Phone"><input type="tel" inputMode="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="+1 …" /></Field>
                  </div>
                  <div className="cu-two">
                    <Field label="Email" hint={f.reach === 'Email' ? '' : 'optional'}><input type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" /></Field>
                    <Field label="Instagram" hint={f.reach === 'Instagram DM' ? '' : 'optional'}><input value={f.ig} onChange={(e) => set({ ig: e.target.value })} placeholder="@handle" autoCapitalize="none" /></Field>
                  </div>
                  <Choice label="Best way to reach you" opts={REACH} v={f.reach} set={(reach) => set({ reach })} />
                </>}
                {step === 3 && <div className="cu-review">
                  <p className="muted">This is the message JoJo will get. Change anything by going back a step.</p>
                  <pre className="cu-msg">{message}</pre>
                  {f.refs.length > 0 && <div className="cu-thumbs">{f.refs.map((u, i) => <span key={u} className="stage"><img src={u} alt={`Reference ${i + 1}`} /></span>)}</div>}
                </div>}
              </div>

              {err && <p className="cu-err" role="alert">{err}</p>}
              <div className="cu-nav">
                {step > 0 && <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={18} /> Back</button>}
                {step < 3 ? <button className="btn btn--lg">{step === 2 ? 'Review' : 'Next'} <ArrowRight size={18} /></button>
                  : <button type="button" className="btn btn--lg btn--accent" onClick={send}>Send to JoJo</button>}
              </div>
              <p className="small muted">Rather talk? Text a picture of the reference to <a className="link" href={BRAND.smsHref}>{BRAND.phone}</a>.</p>
            </form>
          )}
        </div>

        <figure className="cu-film">
          <div className="stage"><Video priority mp4={film.mp4} webm={film.webm} poster={film.poster} label={film.title} /></div>
          <figcaption className="small muted">{film.title}: {film.line}</figcaption>
        </figure>
      </section>

      <section className="process wrap">
        <h2 className="h2"><Lines lines={['How a custom', 'piece is made']} /></h2>
        <ol className="process__list rv-group">{PROCESS.map(([t, body], i) => <li key={t}><span className="num">{i + 1}</span><b>{t}</b><p>{body}</p></li>)}</ol>
        <p className="muted small">A 50% deposit by wire, Zelle or Cash App starts the design and development stage.</p>
      </section>

      <section className="pieces">
        <div className="wrap"><h2 className="h2"><Lines lines={['From the bench']} /></h2></div>
        <div className="pieces__rail">
          {PIECES.filter((_, i) => i !== 1).map((p) => (
            <article key={p.id} className="piece">
              <div className="piece__media stage"><Video mp4={p.mp4} webm={p.webm} poster={p.poster} label={p.title} /></div>
              <div className="piece__txt"><h3 className="h3">{p.title}</h3><p>{p.line}</p></div>
            </article>))}
        </div>
        <div className="wrap"><a className="btn btn--lg" href="#inquiry">Start yours</a></div>
      </section>
    </main>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="cu-field"><span className="lab">{label}{hint && <span className="muted">{hint}</span>}</span>{children}</label>
}
function Choice({ label, hint, opts, v, set }: { label: string; hint?: string; opts: string[]; v: string; set: (v: string) => void }) {
  return (
    <fieldset className="cu-choice">
      <legend className="lab">{label}{hint && <span className="muted">{hint}</span>}</legend>
      <div className="pills" role="radiogroup" aria-label={label}>{opts.map((o) => <button type="button" key={o} role="radio" aria-checked={v === o} className={'pill' + (v === o ? ' on' : '')} onClick={() => set(v === o && hint ? '' : o)}>{o}</button>)}</div>
    </fieldset>
  )
}
