import { useState } from 'react'

const SIZES = ['Small (a courtyard or balcony)', 'Medium (a typical back garden)', 'Large (lots of room)', 'Not sure yet']
const TIMINGS = ['As soon as possible', 'Within three months', 'Next season', 'Just dreaming for now']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY = { name: '', email: '', phone: '', postcode: '', size: '', timing: '', notes: '', company: '' }

// Sends the request to VITE_QUOTE_ENDPOINT when one is set (any service that accepts a JSON POST).
// Without it the form runs in demo mode: it validates, shows the success state and logs the payload.
export default function QuoteForm({ items, mood, onEdit }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (values.company) return
    const next = {}
    if (!values.name.trim()) next.name = 'Tell us your name'
    if (!EMAIL.test(values.email.trim())) next.email = 'Enter an email we can reply to'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    const { company: _company, ...contact } = values
    const payload = {
      ...contact,
      mood,
      garden: items.map((i) => ({ plant: i.name, x: Math.round(i.x), y: Math.round(i.y), size: +i.s.toFixed(2), rotation: Math.round(i.r) })),
      sentAt: new Date().toISOString(),
    }
    try {
      const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT
      if (endpoint) {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      } else {
        await new Promise((r) => setTimeout(r, 900))
        console.info('[Fulora] quote request (demo mode, nothing was sent)', payload)
      }
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div className="gb-card gb-sent" role="status">
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          <ellipse cx="60" cy="100" rx="40" ry="10" fill="#6a4528" />
          <path className="gb-sprout-stem" d="M60 100 C58 80 62 62 60 44" fill="none" stroke="#3f9a4a" strokeWidth="5" strokeLinecap="round" />
          <path className="gb-sprout-leaf a" d="M60 78 C44 76 36 66 34 56 C48 58 58 66 60 78Z" fill="#5db35a" />
          <path className="gb-sprout-leaf b" d="M60 66 C76 64 86 54 88 44 C74 46 62 54 60 66Z" fill="#79c46a" />
          <g className="gb-sprout-bloom">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx="60" cy="26" rx="5" ry="11" fill={i % 2 ? '#ec3f86' : '#d81b66'} transform={`rotate(${i * 45} 60 38)`} />
            ))}
            <circle cx="60" cy="38" r="7" fill="#ffd23f" />
          </g>
        </svg>
        <h3>Seed planted!</h3>
        <p>Thanks, {values.name.split(' ')[0] || 'friend'}. We have your garden and will be in touch at {values.email} soon.</p>
        <button type="button" className="gb-btn" onClick={() => setStatus('idle')}>
          Back to my garden
        </button>
        <button type="button" className="gb-link" onClick={onEdit}>
          Keep editing
        </button>
      </div>
    )
  }

  const field = (k, label, props = {}) => (
    <label className="gb-field">
      <span>{label}</span>
      <input value={values[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `err-${k}` : undefined} {...props} />
      {errors[k] && (
        <em id={`err-${k}`} role="alert">
          {errors[k]}
        </em>
      )}
    </label>
  )

  return (
    <form className="gb-card gb-form" onSubmit={submit} noValidate>
      <h3>Turn it into a quote</h3>
      <p className="gb-form-lede">We get your plan along with your details, so we can talk about your actual garden.</p>

      {field('name', 'Your name', { autoComplete: 'name', placeholder: 'Alex Green' })}
      {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'alex@example.com' })}
      <div className="gb-row">
        {field('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel' })}
        {field('postcode', 'Postcode or area', { autoComplete: 'postal-code' })}
      </div>
      <div className="gb-row">
        <label className="gb-field">
          <span>Garden size</span>
          <select value={values.size} onChange={set('size')}>
            <option value="">Choose one</option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="gb-field">
          <span>When</span>
          <select value={values.timing} onChange={set('timing')}>
            <option value="">Choose one</option>
            {TIMINGS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="gb-field">
        <span>Anything we should know?</span>
        <textarea rows="3" value={values.notes} onChange={set('notes')} placeholder="Shady corner, a dog who digs, a love of peonies..." />
      </label>
      <input className="gb-hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={values.company} onChange={set('company')} />

      {status === 'failed' && (
        <p className="gb-fail" role="alert">
          That didn’t go through. Check your connection and try again.
        </p>
      )}
      <button className="gb-send" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Planting your seed…' : 'Send my garden'}
      </button>
    </form>
  )
}
