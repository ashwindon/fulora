import { useState } from 'react'
import { deliver } from './submit.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: '', email: '', message: '', company: '' }

// The message is emailed to the owner through submit.js (see README.md, "Getting form emails").
export default function SeedForm() {
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
    if (values.message.trim().length < 5) next.message = 'Say a little more so we know where to start'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    const name = values.name.trim()
    const email = values.email.trim()
    const message = values.message.trim()
    try {
      await deliver({
        subject: `New message from ${name} (Fulora website)`,
        name,
        email,
        message: ['New message from the website contact form', '', `Name: ${name}`, `Email: ${email}`, '', message].join('\n'),
        data: { name, email, message },
      })
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div className="ct-note ct-sent" role="status">
        <svg viewBox="0 0 240 220" width="240" height="220" aria-hidden="true">
          <ellipse cx="120" cy="190" rx="86" ry="16" fill="#4a2e1a" />
          <ellipse cx="120" cy="186" rx="64" ry="10" fill="#5a3a22" />
          <ellipse className="ct-seed-drop" cx="120" cy="178" rx="9" ry="13" fill="#c28a52" stroke="#8a5d34" strokeWidth="2" />
          <path className="ct-stem" d="M120 184 C116 150 126 120 120 70" fill="none" stroke="#5db35a" strokeWidth="7" strokeLinecap="round" />
          <path className="ct-leaf a" d="M120 150 C94 148 80 134 78 118 C100 120 116 132 120 150Z" fill="#79c46a" />
          <path className="ct-leaf b" d="M120 124 C146 122 160 108 162 92 C140 94 124 106 120 124Z" fill="#5db35a" />
          <g className="ct-bloom">
            {Array.from({ length: 10 }, (_, i) => (
              <ellipse key={i} cx="120" cy="40" rx="8" ry="20" fill={i % 2 ? '#ec3f86' : '#d81b66'} transform={`rotate(${i * 36} 120 66)`} />
            ))}
            <circle cx="120" cy="66" r="11" fill="#ffd23f" />
          </g>
        </svg>
        <h3>Seed planted!</h3>
        <p>Thanks, {values.name.split(' ')[0] || 'friend'}. We’ll reply to {values.email} as soon as we can.</p>
        <button type="button" className="ct-link" onClick={() => { setValues(EMPTY); setStatus('idle') }}>
          Plant another
        </button>
      </div>
    )
  }

  const err = (k) =>
    errors[k] && (
      <em id={`ct-err-${k}`} role="alert">
        {errors[k]}
      </em>
    )

  return (
    <form className="ct-note ct-form" onSubmit={submit} noValidate>
      <h3>Say hello</h3>
      <p className="ct-form-lede">Tell us a little about your garden, even if it’s still just a daydream.</p>
      <label className="ct-field">
        <span>Your name</span>
        <input value={values.name} onChange={set('name')} autoComplete="name" placeholder="Alex Green" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'ct-err-name' : undefined} />
        {err('name')}
      </label>
      <label className="ct-field">
        <span>Email</span>
        <input type="email" value={values.email} onChange={set('email')} autoComplete="email" placeholder="alex@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'ct-err-email' : undefined} />
        {err('email')}
      </label>
      <label className="ct-field">
        <span>Your message</span>
        <textarea rows="4" value={values.message} onChange={set('message')} placeholder="A sunny corner, a very muddy lawn, a love of peonies..." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ct-err-message' : undefined} />
        {err('message')}
      </label>
      <input className="ct-hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={values.company} onChange={set('company')} />
      {status === 'failed' && (
        <p className="ct-fail" role="alert">
          That didn’t go through. Check your connection and try again.
        </p>
      )}
      <button className="ct-plant" type="submit" disabled={status === 'sending'}>
        <svg viewBox="0 0 24 30" width="20" height="24" aria-hidden="true">
          <ellipse cx="12" cy="16" rx="8" ry="12" fill="#c28a52" stroke="#fff3dc" strokeWidth="2" />
        </svg>
        {status === 'sending' ? 'Planting…' : 'Plant this seed'}
      </button>
    </form>
  )
}
