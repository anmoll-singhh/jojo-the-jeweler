import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, ChatCircleText, InstagramLogo, MapPin, Phone } from '@phosphor-icons/react'
import { useTitle } from '../lib/seo'
import { BRAND } from '../data/site'
import { STORE_PHOTOS } from '../data/content'
import { Lines } from './HomeV1'

const TOPICS = [
  ['piece', 'A piece on the site'],
  ['order', 'An order I placed'],
  ['watch', 'Selling a watch'],
  ['repair', 'Repair, sizing or cleaning'],
  ['other', 'Something else'],
] as const
const MAPS = 'https://www.google.com/maps/search/?api=1&query=3+W+47th+St,+New+York,+NY+10036'
const OSM = 'https://www.openstreetmap.org/export/embed.html?bbox=-73.9832%2C40.7548%2C-73.9762%2C40.7590&layer=mapnik&marker=40.75692%2C-73.97968'
const SELL = [
  ['Tell us about it', 'Brand, model, year and condition, and whether you have the box and papers.'],
  ['Visit or ship', 'Bring it to 47th Street or send it in for inspection.'],
  ['Inspection', 'Authenticity and condition are checked, paperwork included.'],
  ['Offer and payment', 'A one-time offer with prompt, secure payment.'],
]

/** The current time on 47th Street, so a visitor anywhere knows whether a text gets a quick reply. */
function useNYTime() {
  const fmt = () => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(new Date())
  const hour = () => Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
  const [t, setT] = useState({ time: fmt(), h: hour() })
  useEffect(() => { const i = setInterval(() => setT({ time: fmt(), h: hour() }), 30000); return () => clearInterval(i) }, [])
  return t
}

export function Contact() {
  useTitle('Contact')
  const [sp] = useSearchParams()
  const ny = useNYTime()
  const inHours = ny.h >= 9 && ny.h < 18
  const [f, setF] = useState({ topic: (TOPICS.find(([k]) => k === sp.get('topic'))?.[0] ?? 'piece') as string, name: '', phone: '', note: '', watch: '' })
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) return setErr('Add your name.')
    if (!/^[+\d][\d\s().-]{6,}$/.test(f.phone.trim())) return setErr('Add a phone number JoJo can text back.')
    if (f.note.trim().length < 5) return setErr('Write a short message.')
    const topic = TOPICS.find(([k]) => k === f.topic)?.[1]
    const body = encodeURIComponent([`${topic} — ${f.name}`, f.watch && `Watch: ${f.watch}`, f.note.trim(), `Text me back: ${f.phone}`].filter(Boolean).join('\n'))
    location.href = BRAND.email ? `mailto:${BRAND.email}?subject=${encodeURIComponent(topic || 'Inquiry')}&body=${body}` : `${BRAND.smsHref}?&body=${body}`
    setSent(true)
  }
  return (
    <main id="main" className="page contact2">
      <section className="ct-hero wrap">
        <div className="ct-hero__txt">
          <h1 className="h1"><Lines lines={['Call or text', 'your jeweler']} /></h1>
          <a className="ct-phone rv" href={BRAND.smsHref}>{BRAND.phone}</a>
          <p className="ct-now rv"><span className={'ct-dot' + (inHours ? ' on' : '')} aria-hidden="true" />It’s {ny.time} on 47th Street{inHours ? ', inside store hours' : ', outside store hours: texts get answered from 9 a.m.'}</p>
        </div>
        <ul className="ct-acts rv-group" aria-label="Ways to reach JoJo">
          <li><a href={BRAND.smsHref}><ChatCircleText size={26} /><b>Text</b><span>{BRAND.phone}</span></a></li>
          <li><a href={BRAND.phoneHref}><Phone size={26} /><b>Call</b><span>{BRAND.hours}</span></a></li>
          <li><a href={`https://ig.me/m/${BRAND.handle.slice(1)}`} target="_blank" rel="noreferrer"><InstagramLogo size={26} /><b>Instagram DM</b><span>{BRAND.handle}</span></a></li>
          <li><a href={MAPS} target="_blank" rel="noreferrer"><MapPin size={26} /><b>Directions</b><span>{BRAND.address[0]}</span></a></li>
        </ul>
      </section>

      <section className="ct-main wrap">
        <div className="ct-form">
          <h2 className="h2"><Lines lines={['Send a message']} /></h2>
          {sent ? <div className="cu-done"><h3 className="h3">Your message is ready in {BRAND.email ? 'your email' : 'Messages'}</h3><p>Send it and JoJo replies from the store. <button className="link" onClick={() => setSent(false)}>Write another</button></p></div> : (
            <form onSubmit={submit} noValidate aria-label="Send a message">
              <fieldset className="cu-choice"><legend className="lab">What’s it about?</legend>
                <div className="pills" role="radiogroup" aria-label="Topic">{TOPICS.map(([k, t]) => <button type="button" key={k} role="radio" aria-checked={f.topic === k} className={'pill' + (f.topic === k ? ' on' : '')} onClick={() => { setF({ ...f, topic: k }); setErr('') }}>{t}</button>)}</div>
              </fieldset>
              {f.topic === 'watch' && <label className="cu-field"><span className="lab">The watch <span className="muted">brand, model, year</span></span><input value={f.watch} onChange={(e) => setF({ ...f, watch: e.target.value })} placeholder="e.g. Rolex Daytona 116500, 2021, box and papers" /></label>}
              {f.topic === 'piece' && <p className="small muted">Want something made from scratch? The <Link className="link" to="/custom">custom inquiry</Link> asks the right questions.</p>}
              <div className="cu-two">
                <label className="cu-field"><span className="lab">Name</span><input value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setErr('') }} autoComplete="name" /></label>
                <label className="cu-field"><span className="lab">Phone</span><input type="tel" inputMode="tel" value={f.phone} onChange={(e) => { setF({ ...f, phone: e.target.value }); setErr('') }} autoComplete="tel" placeholder="+1 …" /></label>
              </div>
              <label className="cu-field"><span className="lab">Message</span><textarea rows={5} value={f.note} onChange={(e) => { setF({ ...f, note: e.target.value }); setErr('') }} /></label>
              {err && <p className="cu-err" role="alert">{err}</p>}
              <button className="btn btn--lg">Send by {BRAND.email ? 'email' : 'text'}</button>
            </form>)}
        </div>
        <div className="ct-visit">
          <div className="ct-map stage"><iframe title="Map: 3 W 47th Street, New York" src={OSM} loading="lazy" referrerPolicy="no-referrer" /></div>
          <dl className="ct-facts">
            <div><dt>Store</dt><dd>{BRAND.address[0]}, {BRAND.address[1]}<br /><span className="muted">{BRAND.district}</span></dd></div>
            <div><dt>Hours</dt><dd>{BRAND.hours}</dd></div>
            <div><dt>Payment</dt><dd>Cash, card and bank transfer in store. Custom deposits by wire, Zelle or Cash App.</dd></div>
          </dl>
          <a className="link small" href={MAPS} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={14} /></a>
        </div>
      </section>

      <section className="ct-sell wrap" id="sell">
        <h2 className="h2"><Lines lines={['Selling a watch']} /></h2>
        <ol className="ct-sell__list rv-group">{SELL.map(([t, b], i) => <li key={t}><span className="num">{i + 1}</span><b>{t}</b><p>{b}</p></li>)}</ol>
      </section>

      <section className="ct-pics" aria-label="Photos from JoJo’s store page">{STORE_PHOTOS.slice(0, 4).map((s) => <div key={s.src} className="stage"><img src={s.src} alt={s.alt} loading="lazy" /></div>)}</section>
    </main>
  )
}
