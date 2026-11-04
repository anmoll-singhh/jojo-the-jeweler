import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../lib/seo'
import { useCart } from '../lib/store'
import { byHandle, metalFilter, money, rs } from '../data/catalog'
import { checkoutUrl, isLive } from '../data/shopify'
import { BRAND } from '../data/site'
import { SendPanel, deliver, validPhone, type SendMode } from '../components/SendPanel'
import { Lines } from './HomeV1'

/*
 * Checkout. With the Storefront API connected it hands the bag to Shopify checkout. Until then it is
 * an order request: the visitor reviews the bag, adds contact and delivery details and a payment
 * preference, and the order goes to JoJo as a text (or email), the way the store already takes
 * custom deposits. JoJo confirms availability, shipping and payment before anything is charged.
 */
const PAY = ['Card (JoJo sends a secure payment link)', 'Zelle', 'Wire transfer', 'Cash App', 'Pay in store']

export function Checkout() {
  useTitle('Checkout')
  const { lines, total } = useCart()
  useEffect(() => { if (isLive() && lines.length) location.href = checkoutUrl(lines.map((l) => ({ variantId: l.variantId, qty: l.qty }))) }, [lines])
  const [f, setF] = useState({ name: '', phone: '', email: '', ship: 'Ship to me', address: '', city: '', zip: '', pay: PAY[0], note: '' })
  const [err, setErr] = useState('')
  const [sent, setSent] = useState<SendMode | null>(null)
  const set = (p: Partial<typeof f>) => { setF({ ...f, ...p }); setErr('') }
  const ship = f.ship === 'Ship to me'
  const message = [
    `Order request — ${f.name}`,
    ...lines.map((l) => `• ${l.qty} × ${l.title} (${Object.values(l.options).join(', ')}) — ${money(l.price * l.qty)}`),
    `Subtotal: ${money(total)}`,
    ship ? `Ship to: ${[f.address, f.city, f.zip].filter(Boolean).join(', ')}` : 'Pick up at 3 W 47th Street',
    `Pay by: ${f.pay}`,
    f.note && `Note: ${f.note}`,
    `Reach me: ${f.phone}${f.email ? ` · ${f.email}` : ''}`,
  ].filter(Boolean).join('\n')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.name.trim()) return setErr('Add your name.')
    if (!validPhone(f.phone)) return setErr('Add a phone number with area code, so JoJo can confirm the order.')
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return setErr('Check the email address, or leave it empty.')
    if (ship && (!f.address.trim() || !f.city.trim() || !f.zip.trim())) return setErr('Add the delivery address, city and ZIP or postcode, or choose pick-up.')
    setSent(deliver(message, 'Order request — ' + f.name))
  }

  if (!lines.length) return <main id="main" className="page bagpage wrap"><h1 className="h1"><Lines lines={['Checkout']} /></h1><p className="lede">Your bag is empty.</p><Link className="btn btn--lg" to="/collections/all">Shop all pieces</Link></main>
  return (
    <main id="main" className="page checkout wrap">
      <div className="co-grid">
        <div className="co-main">
          <h1 className="h1"><Lines lines={['Checkout']} /></h1>
          <p className="lede rv">Send your order to JoJo. He confirms the piece, shipping and how you’d like to pay before anything is charged.</p>
          {sent ? <SendPanel mode={sent} message={message} onBack={() => setSent(null)} /> : (
            <form onSubmit={submit} noValidate aria-label="Order details" className="co-form">
              <fieldset><legend className="h3">You</legend>
                <div className="cu-two">
                  <label className="cu-field"><span className="lab">Name</span><input value={f.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" /></label>
                  <label className="cu-field"><span className="lab">Phone</span><input type="tel" inputMode="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" placeholder="+1 …" /></label>
                </div>
                <label className="cu-field"><span className="lab">Email <span className="muted">optional, for a receipt</span></span><input type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" /></label>
              </fieldset>
              <fieldset><legend className="h3">Delivery</legend>
                <div className="pills" role="radiogroup" aria-label="Delivery">{['Ship to me', 'Pick up on 47th Street'].map((o) => <button type="button" key={o} role="radio" aria-checked={f.ship === o} className={'pill' + (f.ship === o ? ' on' : '')} onClick={() => set({ ship: o })}>{o}</button>)}</div>
                {ship ? <>
                  <label className="cu-field"><span className="lab">Address</span><input value={f.address} onChange={(e) => set({ address: e.target.value })} autoComplete="street-address" /></label>
                  <div className="cu-two">
                    <label className="cu-field"><span className="lab">City</span><input value={f.city} onChange={(e) => set({ city: e.target.value })} autoComplete="address-level2" /></label>
                    <label className="cu-field"><span className="lab">ZIP or postcode</span><input value={f.zip} onChange={(e) => set({ zip: e.target.value })} autoComplete="postal-code" /></label>
                  </div>
                  <p className="small muted">Insured shipping; JoJo confirms the cost and delivery date with you.</p>
                </> : <p className="small muted">{BRAND.address.join(', ')} · {BRAND.hours}.</p>}
              </fieldset>
              <fieldset><legend className="h3">Payment</legend>
                <div className="pills" role="radiogroup" aria-label="Payment">{PAY.map((o) => <button type="button" key={o} role="radio" aria-checked={f.pay === o} className={'pill' + (f.pay === o ? ' on' : '')} onClick={() => set({ pay: o })}>{o}</button>)}</div>
                <label className="cu-field"><span className="lab">Note <span className="muted">optional</span></span><textarea rows={3} value={f.note} onChange={(e) => set({ note: e.target.value })} placeholder="Gift wrap, engraving, a date you need it by…" /></label>
              </fieldset>
              {err && <p className="cu-err" role="alert">{err}</p>}
              <button className="btn btn--lg btn--accent">Send order to JoJo · {money(total)}</button>
            </form>)}
        </div>
        <aside className="co-sum" aria-label="Order summary">
          <h2 className="h3">Your bag</h2>
          <ul className="lines lines--page">{lines.map((l) => (
            <li key={l.key}>
              <Link to={'/products/' + l.handle} className="stage"><img {...rs(l.image, '6rem')} style={{ filter: metalFilter(byHandle(l.handle)?.photoMetal, l.options.Metal) }} alt="" /></Link>
              <div><b>{l.title}</b><p className="small muted">{Object.values(l.options).join(' · ')}</p><p className="small muted">Qty {l.qty}</p></div>
              <b className="num">{money(l.price * l.qty)}</b>
            </li>))}
          </ul>
          <div className="row"><span>Subtotal</span><b className="num">{money(total)}</b></div>
          <Link className="link small" to="/cart">Edit bag</Link>
        </aside>
      </div>
    </main>
  )
}
