import { useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { ArrowLeft, ArrowRight, CalendarBlank, Check, ChatCircleText, Diamond as DiamondIcon, Hammer, Package, Flask, Mountains, PencilSimpleLine, Storefront, VideoCamera, Phone } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { BRAND } from '../data/site'
import { SHAPES, type Shape } from '../components/Diamond'
const gem = (s: Shape) => `/media/engagement/shape-${s.toLowerCase()}.webp`
import { SendPanel, deliver, validPhone, type SendMode } from '../components/SendPanel'
import { Accordion } from '../components/Accordion'
import { Lines } from './HomeV1'

/*
 * Custom engagement ring enquiry. Eight short steps with a live preview of the ring as it's described.
 * Nothing is sent from the browser: the last step composes the full enquiry and opens it in the
 * visitor's texting app (or email once VITE_CONTACT_EMAIL is set). Answers are kept on this device.
 */
const CARAT = [['Under 1 ct', 0.8], ['1 – 2 ct', 1.5], ['2 – 3 ct', 2.5], ['3 – 4 ct', 3.5], ['4 ct +', 4.5]] as const
const ORIGIN = [
  { v: 'Lab-grown diamond', note: 'Chemically the same diamond, grown above ground. More size for the budget.' },
  { v: 'Natural diamond', note: 'Formed in the earth over billions of years. The traditional choice.' },
  { v: 'Help me decide', note: 'JoJo walks you through both at the consultation.' },
]
const SETTING = [
  { v: 'Solitaire', note: 'One stone, clean band' },
  { v: 'Hidden halo', note: 'Diamonds under the centre stone' },
  { v: 'Halo', note: 'A ring of diamonds around the centre' },
  { v: 'Pavé band', note: 'Diamonds set along the band' },
  { v: 'Three stone', note: 'Centre stone with two side stones' },
  { v: 'Bezel', note: 'Metal rim around the stone' },
]
const METAL = [['Platinum', 'white'], ['14K white gold', 'white'], ['14K yellow gold', 'yellow'], ['14K rose gold', 'rose'], ['18K yellow gold', 'yellow']] as const
const SIZES = ['I don’t know', ...Array.from({ length: 21 }, (_, i) => String(3 + i * 0.5))]
const BUDGET = ['$2,500 – $5,000', '$5,000 – $10,000', '$10,000 – $15,000', '$15,000 – $25,000', '$25,000 +']
const WHEN = ['Two weeks', 'One month', 'Two months +', 'No rush']
const MEET = [{ v: 'In store', icon: Storefront, note: '3 W 47th Street' }, { v: 'Video call', icon: VideoCamera, note: 'FaceTime or WhatsApp' }, { v: 'Phone call', icon: Phone, note: 'JoJo calls you' }]
const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
const STEPS = [['Shape', 'Select cut'], ['Carat', 'Weight'], ['Diamond', 'Origin'], ['Setting', 'Style'], ['Metal', 'And size'], ['Budget', 'And timing'], ['Consult', 'Day and time'], ['You', 'Details']] as const

type F = { shape: string; other: string; carat: string; origin: string; setting: string; metal: string; size: string; budget: string; when: string; meet: string; day: string; time: string; name: string; phone: string; email: string; notes: string }
const EMPTY: F = { shape: '', other: '', carat: '', origin: '', setting: '', metal: '', size: 'I don’t know', budget: '', when: '', meet: 'In store', day: '', time: '', name: '', phone: '', email: '', notes: '' }
const KEY = 'jojo-engagement-draft'
const load = (): F => { try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return EMPTY } }
const fmtDay = (iso: string) => (iso ? new Date(iso + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : '')

export function Engagement() {
  useTitle('Custom engagement rings')
  const [f, setF] = useState<F>(() => { const q = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('shape') : null; const d = load(); return q && SHAPES.some((x) => x.shape === q) ? { ...d, shape: q } : d })
  const [step, setStep] = useState(0)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState<SendMode | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const set = (p: Partial<F>) => { const n = { ...f, ...p }; setF(n); setErr(''); try { localStorage.setItem(KEY, JSON.stringify(n)) } catch { /* private mode */ } }
  const check = (s: number) => {
    if (s === 0 && !f.shape) return 'Pick a diamond shape.'
    if (s === 0 && f.shape === 'Other' && !f.other.trim()) return 'Tell us the shape you have in mind.'
    if (s === 1 && !f.carat) return 'Pick a carat range.'
    if (s === 2 && !f.origin) return 'Pick lab-grown, natural, or “Help me decide”.'
    if (s === 3 && !f.setting) return 'Pick a setting style.'
    if (s === 4 && !f.metal) return 'Pick a metal.'
    if (s === 5 && !f.budget) return 'Pick a budget range.'
    if (s === 5 && !f.when) return 'Pick when you need it.'
    if (s === 6 && (!f.day || !f.time)) return 'Pick a day and a time for the consultation.'
    if (s === 7 && !f.name.trim()) return 'Add your name.'
    if (s === 7 && !validPhone(f.phone)) return 'Add a phone number with area code.'
    if (s === 7 && f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return 'Check the email address, or leave it empty.'
    return ''
  }
  const go = (n: number) => { setStep(n); setErr(''); requestAnimationFrame(() => { const r = box.current?.getBoundingClientRect(); if (r && (r.top < 0 || r.top > innerHeight * 0.4)) scrollTo({ top: r.top + scrollY - 90, behavior: 'smooth' }) }) }
  const next = () => { const m = check(step); if (m) { setErr(m); return } if (step < 7) go(step + 1); else setSent(deliver(message, 'Engagement ring enquiry — ' + f.name)) }
  const message = useMemo(() => [
    `Engagement ring enquiry — ${f.name}`,
    `Shape: ${f.shape === 'Other' ? f.other : f.shape}`,
    `Carat: ${f.carat}`, `Diamond: ${f.origin}`, `Setting: ${f.setting}`,
    `Metal: ${f.metal} · Ring size: ${f.size}`,
    `Budget: ${f.budget} · Needed: ${f.when}`,
    `Consultation: ${f.meet}, ${fmtDay(f.day)} at ${f.time}`,
    f.notes.trim() && `Notes: ${f.notes.trim()}`,
    `Reach me: ${f.phone}${f.email ? ` · ${f.email}` : ''}`,
  ].filter(Boolean).join('\n'), [f])
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const last = new Date(today); last.setDate(last.getDate() + 60)

  return (
    <main id="main" className="page eng">
      <section className="eng-hero">
        <img className="eng-hero__img" src="/media/engagement/hero.webp" alt="Oval diamond engagement ring on a pavé band" fetchPriority="high" />
        <div className="eng-hero__txt wrap">
          <p className="eng-kick rv">Bespoke · 3 W 47th Street</p>
          <h1 className="display"><Lines lines={['Make the ring', 'she says yes to']} /></h1>
          <p className="lede rv" data-d="0.3">Choose the shape, the size and the style. JoJo turns it into a ring, and meets you to finalise every detail.</p>
          <a className="btn btn--lg rv" data-d="0.4" href="#design" onClick={(e) => { e.preventDefault(); box.current?.scrollIntoView({ behavior: 'smooth' }) }}>Design your ring <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="eng-how wrap" aria-label="How it works">
        {[[PencilSimpleLine, 'Tell us the ring', 'Shape, carat, setting and metal, in eight quick steps.'], [ChatCircleText, 'Consult with JoJo', 'In store, by video or phone. Stones and sketch, side by side.'], [Hammer, 'Made by hand', 'Set and finished in New York once you approve the design.'], [Package, 'Insured delivery', 'Picked up on 47th Street or shipped insured.']].map(([Icon, t, b], i) => {
          const I = Icon as typeof PencilSimpleLine
          return <div key={i} className="eng-how__item rv"><span className="eng-how__ic"><I size={22} weight="light" /></span><b>{t as string}</b><p>{b as string}</p></div>
        })}
      </section>

      <section className="eng-build wrap" id="design" ref={box} aria-label="Design your ring">
        <ol className="eng-steps" aria-label="Steps">
          {STEPS.map(([t, s], i) => (
            <li key={t} className={(i === step ? 'on' : '') + (i < step ? ' done' : '')}>
              <button type="button" onClick={() => i < step && go(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined}>
                <span className="eng-steps__n">{i < step ? <Check size={12} weight="bold" /> : i + 1}</span><span className="eng-steps__t">{t}<small>{s}</small></span>
              </button>
            </li>))}
        </ol>

        <div className="eng-grid">
          <div className="eng-panel" key={sent ? 'sent' : step}>
            {sent ? <SendPanel mode={sent} message={message} onBack={() => setSent(null)} onReset={() => { setSent(null); setF(EMPTY); setStep(0); try { localStorage.removeItem(KEY) } catch { /* */ } }} /> : <>
              {step === 0 && <Q title="Select a diamond shape" sub="Every ring starts with the centre stone. Pick the outline you love.">
                <div className="eng-shapes" role="radiogroup" aria-label="Diamond shape">
                  {SHAPES.map(({ shape, note }) => <button key={shape} type="button" role="radio" aria-checked={f.shape === shape} className={'eng-shape' + (f.shape === shape ? ' on' : '')} onClick={() => set({ shape })}><img className="eng-gem" src={gem(shape)} alt="" loading="lazy" /><b>{shape}</b><small>{note}</small></button>)}
                  <button type="button" role="radio" aria-checked={f.shape === 'Other'} className={'eng-shape eng-shape--other' + (f.shape === 'Other' ? ' on' : '')} onClick={() => set({ shape: 'Other' })}><DiamondIcon size={44} weight="thin" /><b>Other</b><small>Have something specific in mind?</small></button>
                </div>
                {f.shape === 'Other' && <label className="cu-field"><span className="lab">Describe the shape</span><input value={f.other} onChange={(e) => set({ other: e.target.value })} placeholder="e.g. old mine cut, kite, hexagon…" autoFocus /></label>}
              </Q>}
              {step === 1 && <Q title="What carat size are you looking for?" sub="Carat is weight. The preview grows with it.">
                <Cards opts={CARAT.map(([c]) => ({ v: c }))} v={f.carat} set={(carat) => set({ carat })} render={(o) => <><span className="eng-ct" style={{ ['--k' as string]: Math.sqrt(CARAT.find((c) => c[0] === o.v)![1]) / 2.1 }}><img src={gem((f.shape in GEOFIX ? f.shape : 'Round') as Shape)} alt="" /></span><b>{o.v}</b></>} />
              </Q>}
              {step === 2 && <Q title="What kind of diamond?" sub="Both are real diamonds. The difference is where they were formed.">
                <Cards opts={ORIGIN} v={f.origin} set={(origin) => set({ origin })} render={(o) => { const I = o.v.startsWith('Lab') ? Flask : o.v.startsWith('Natural') ? Mountains : ChatCircleText; return <><span className={'eng-orig eng-orig--' + o.v.split(' ')[0].toLowerCase()}><I size={26} weight="duotone" /></span><b>{o.v}</b><small>{o.note}</small></> }} />
              </Q>}
              {step === 3 && <Q title="Choose a setting" sub="How the centre stone sits on the band.">
                <Cards opts={SETTING} v={f.setting} set={(setting) => set({ setting })} render={(o) => <><img className="eng-ringimg" src={`/media/engagement/setting-${o.v.toLowerCase().replace(/ /g, '-').replace('é', 'e')}.webp`} alt="" loading="lazy" /><b>{o.v}</b><small>{o.note}</small></>} />
              </Q>}
              {step === 4 && <Q title="Metal and ring size" sub="Not sure of the size? Leave it, JoJo sizes it at the consultation.">
                <div className="eng-metals" role="radiogroup" aria-label="Metal">{METAL.map(([m, k]) => <button key={m} type="button" role="radio" aria-checked={f.metal === m} className={'eng-metal eng-metal--' + k + (f.metal === m ? ' on' : '')} onClick={() => set({ metal: m })}><i />{m}</button>)}</div>
                <label className="cu-field eng-size"><span className="lab">Ring size (US)</span><select value={f.size} onChange={(e) => set({ size: e.target.value })}>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></label>
                <p className="small muted">Tip: borrow a ring she wears on that finger and bring it, or text JoJo a photo of it beside a ruler.</p>
              </Q>}
              {step === 5 && <Q title="Budget and timing" sub="So JoJo can show you stones that fit.">
                <Pills label="Budget" opts={BUDGET} v={f.budget} set={(budget) => set({ budget })} />
                <Pills label="When do you need it?" opts={WHEN} v={f.when} set={(when) => set({ when })} />
              </Q>}
              {step === 6 && <Q title="Pick your day for a consultation" sub={`Monday to Saturday, ${BRAND.hours.split(',')[0]}. JoJo confirms by text.`}>
                <div className="eng-meet" role="radiogroup" aria-label="Consultation type">{MEET.map(({ v, icon: I, note }) => <button key={v} type="button" role="radio" aria-checked={f.meet === v} className={'eng-meet__o' + (f.meet === v ? ' on' : '')} onClick={() => set({ meet: v })}><I size={22} weight="light" /><b>{v}</b><small>{note}</small></button>)}</div>
                <div className="eng-when">
                  <DayPicker mode="single" selected={f.day ? new Date(f.day + 'T12:00') : undefined} onSelect={(d) => d && set({ day: new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) })}
                    disabled={[{ before: today }, { after: last }, { dayOfWeek: [0] }]} startMonth={today} endMonth={last} weekStartsOn={1} className="eng-cal" />
                  <div className="eng-slots">
                    <p className="lab"><span><CalendarBlank size={16} /> {f.day ? fmtDay(f.day) : 'Select a day'}</span></p>
                    <div role="radiogroup" aria-label="Time">{SLOTS.map((t) => <button key={t} type="button" role="radio" disabled={!f.day} aria-checked={f.time === t} className={'pill' + (f.time === t ? ' on' : '')} onClick={() => set({ time: t })}>{t}</button>)}</div>
                  </div>
                </div>
              </Q>}
              {step === 7 && <Q title="Your details" sub="Check the summary, then send it to JoJo.">
                <div className="cu-two">
                  <label className="cu-field"><span className="lab">Name</span><input value={f.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" /></label>
                  <label className="cu-field"><span className="lab">Phone</span><input type="tel" inputMode="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="+1 …" /></label>
                </div>
                <label className="cu-field"><span className="lab">Email <span className="muted">optional</span></span><input type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" /></label>
                <label className="cu-field"><span className="lab">Anything else <span className="muted">optional</span></span><textarea rows={3} value={f.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Engraving, a date you're proposing, a ring she's shown you…" /></label>
                <dl className="eng-review">{[['Shape', f.shape === 'Other' ? f.other : f.shape, 0], ['Carat', f.carat, 1], ['Diamond', f.origin, 2], ['Setting', f.setting, 3], ['Metal', `${f.metal} · size ${f.size}`, 4], ['Budget', `${f.budget} · ${f.when}`, 5], ['Consultation', `${f.meet}, ${fmtDay(f.day)} at ${f.time}`, 6]].map(([k, v, s]) => <div key={k as string}><dt>{k}</dt><dd>{v}</dd><button type="button" className="link small" onClick={() => go(s as number)}>Edit</button></div>)}</dl>
              </Q>}
              {err && <p className="cu-err" role="alert">{err}</p>}
              <div className="eng-nav">
                {step > 0 && <button type="button" className="btn btn--ghost btn--lg" onClick={() => go(step - 1)}><ArrowLeft size={18} /> Back</button>}
                <button type="button" className="btn btn--lg btn--accent" onClick={next}>{step < 7 ? <>Next step <ArrowRight size={18} /></> : 'Send enquiry to JoJo'}</button>
              </div>
            </>}
          </div>

        </div>
      </section>

      <section className="eng-faq wrap">
        <h2 className="h2"><Lines lines={['Questions']} /></h2>
        <div className="faq__list">
          <Accordion title="Lab-grown or natural: which should I choose?"><p>Both are real diamonds with the same hardness and sparkle. Lab-grown gives more size for the budget; natural is the traditional choice. JoJo shows you both side by side at the consultation.</p></Accordion>
          <Accordion title="How do I find her ring size secretly?"><p>Borrow a ring she wears on her ring finger and bring it in, or text JoJo a photo of it on a ruler. If you're unsure, the ring can be sized after she says yes.</p></Accordion>
          <Accordion title="Is there a deposit?"><p>Custom pieces start with a 50% deposit once you approve the design. JoJo confirms the price, stone and timeline with you before anything is made.</p></Accordion>
          <Accordion title="How long does it take?"><p>It depends on the stone and setting. Tell us your date in the form and JoJo confirms what's possible at the consultation.</p></Accordion>
        </div>
        <p className="small muted">Prefer to talk first? <a className="link" href={BRAND.smsHref}>Text {BRAND.phone}</a> or see <Link className="link" to="/custom">all custom pieces</Link>.</p>
      </section>
    </main>
  )
}
const GEOFIX: Record<string, true> = Object.fromEntries(SHAPES.map((s) => [s.shape, true]))

function Q({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return <div className="eng-q"><h2 className="h3">{title}</h2><p className="muted">{sub}</p>{children}</div>
}
function Cards<T extends { v: string; note?: string }>({ opts, v, set, render }: { opts: readonly T[]; v: string; set: (v: string) => void; render?: (o: T) => ReactNode }) {
  return <div className="eng-cards" role="radiogroup">{opts.map((o) => <button key={o.v} type="button" role="radio" aria-checked={v === o.v} className={'eng-card' + (v === o.v ? ' on' : '')} onClick={() => set(o.v)}>{render ? render(o) : <><b>{o.v}</b>{o.note && <small>{o.note}</small>}</>}<i className="eng-card__tick"><Check size={12} weight="bold" /></i></button>)}</div>
}
function Pills({ label, opts, v, set }: { label: string; opts: string[]; v: string; set: (v: string) => void }) {
  return <fieldset className="cu-choice"><legend className="lab">{label}</legend><div className="pills" role="radiogroup" aria-label={label}>{opts.map((o) => <button type="button" key={o} role="radio" aria-checked={v === o} className={'pill' + (v === o ? ' on' : '')} onClick={() => set(o)}>{o}</button>)}</div></fieldset>
}

