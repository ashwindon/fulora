import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SeedForm from './SeedForm.jsx'
import { CONTACT, openStatus, hourLabel } from './contactData.js'
import { grassBlades, GRASS_FLOWERS, seeded } from './botany.js'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

const BLADES = grassBlades(150)
const TIERS = ['#2f7d3e', '#3f9a4a', '#5db35a', '#79c46a']
const SPORES = (() => {
  const r = seeded(21)
  return Array.from({ length: 16 }, () => ({ x: 4 + r() * 92, y: 8 + r() * 84, d: (r() * -7).toFixed(2), t: (5 + r() * 5).toFixed(1) }))
})()

const ICONS = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  chat: 'M4 5h16v11H9l-5 4zM8 10h8M8 13h5',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  )
}

export default function Contact() {
  const root = useRef(null)
  const [now, setNow] = useState(() => new Date())
  const status = openStatus(now)
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address.join(', '))}`

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.set('.ct-grass-in', { scaleY: 0, svgOrigin: '720 120' })
      gsap.set('.ct-left > *:not(.ct-seedbed)', { y: 36, opacity: 0 })
      gsap.set('.ct-card', { y: 30, opacity: 0, scale: 0.9 })
      gsap.set('.ct-sign', { rotation: -9, transformOrigin: '50% 0%', y: -30, opacity: 0 })
      gsap.set('.ct-form, .ct-sent', { y: 40, opacity: 0 })
      gsap.set('.ct-seedbed', { y: 30, opacity: 0 })

      gsap
        .timeline({ scrollTrigger: { trigger: '.ct-inner', start: 'top 80%', once: true } })
        .to('.ct-grass-in', { scaleY: 1, duration: 1.2, ease: 'back.out(1.5)' }, 0)
        .to('.ct-left > *:not(.ct-seedbed)', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.1)
        .to('.ct-card', { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.09 }, 0.5)
        .to('.ct-sign', { y: 0, opacity: 1, rotation: 0, duration: 1.6, ease: 'elastic.out(1, 0.35)' }, 0.4)
        .to('.ct-form, .ct-sent', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.7)
        .to('.ct-seedbed', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.9)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" id="contact" ref={root}>
      <svg className="ct-grass" viewBox="0 0 1440 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <g className="ct-grass-in">
          {GRASS_FLOWERS.map((f, i) => (
            <g key={i}>
              <path d={`M${f.x + 40} 120 V${120 - f.h}`} stroke="#2f7d3e" strokeWidth="3.5" strokeLinecap="round" />
              <g transform={`translate(${f.x + 40} ${120 - f.h})`}>
                <g fill={f.color}>
                  <circle cy="-9" r="8" />
                  <circle cx="9" r="8" />
                  <circle cy="9" r="8" />
                  <circle cx="-9" r="8" />
                </g>
                <circle r="6" fill={f.eye} />
              </g>
            </g>
          ))}
          {BLADES.map((b, i) => (
            <path className="blade" key={i} d={b.d} style={{ fill: TIERS[b.tier], '--delay': `${b.delay}s`, '--dur': `${b.dur}s` }} />
          ))}
        </g>
      </svg>

      <svg className="ct-roots" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="#b98a5c" strokeLinecap="round" opacity="0.5">
          <path className="ct-root" d="M120 0 C130 50 90 90 110 150 S130 200 120 220" strokeWidth="5" />
          <path className="ct-root" d="M110 70 C150 90 170 120 160 170" strokeWidth="3" />
          <path className="ct-root" d="M520 0 C500 40 540 80 520 130 S500 180 510 210" strokeWidth="5" />
          <path className="ct-root" d="M524 90 C560 100 590 130 580 180" strokeWidth="3" />
          <path className="ct-root" d="M980 0 C1000 50 960 90 990 140 S1010 190 1000 215" strokeWidth="5" />
          <path className="ct-root" d="M990 100 C950 110 930 150 940 190" strokeWidth="3" />
          <path className="ct-root" d="M1320 0 C1310 40 1340 80 1320 130" strokeWidth="4" />
        </g>
      </svg>

      <div className="ct-spores" aria-hidden="true">
        {SPORES.map((s, i) => (
          <span key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s`, animationDuration: `${s.t}s` }} />
        ))}
      </div>

      <div className="ct-inner">
        <div className="ct-left">
          <p className="ct-kicker">ready when you are</p>
          <h2>
            Let’s plant a <span>seed</span>
          </h2>
          <p className="ct-lede">Every great garden starts with a conversation. Call, message or drop by, and we’ll start growing something together.</p>

          <ul className="ct-cards">
            <li>
              <a className="ct-card" href={`tel:${CONTACT.phoneHref}`}>
                <span className="ct-ico">
                  <Icon name="phone" />
                </span>
                <em>Call us</em>
                <strong>{CONTACT.phone}</strong>
              </a>
            </li>
            <li>
              <a className="ct-card" href={`mailto:${CONTACT.email}`}>
                <span className="ct-ico">
                  <Icon name="mail" />
                </span>
                <em>Email</em>
                <strong>{CONTACT.email}</strong>
              </a>
            </li>
            <li>
              <a className="ct-card" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <span className="ct-ico">
                  <Icon name="chat" />
                </span>
                <em>WhatsApp</em>
                <strong>Send us a message</strong>
              </a>
            </li>
            <li>
              <a className="ct-card" href={mapHref} target="_blank" rel="noopener noreferrer">
                <span className="ct-ico">
                  <Icon name="pin" />
                </span>
                <em>Find us</em>
                <strong>{CONTACT.address.join(', ')}</strong>
              </a>
            </li>
          </ul>

          <div className="ct-seedbed" aria-hidden="true">
            <svg viewBox="0 0 280 150" width="280" height="150">
              <defs>
                <radialGradient id="ct-glow">
                  <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="140" cy="118" rx="116" ry="26" fill="#2a190d" />
              <circle className="ct-aura" cx="140" cy="100" r="64" fill="url(#ct-glow)" />
              <path className="ct-sprout" d="M140 100 C130 120 112 124 100 140 M140 100 C150 120 170 124 182 142 M140 104 C140 124 138 134 140 146" fill="none" stroke="#e8c79a" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="140" cy="94" rx="15" ry="22" fill="#c28a52" stroke="#8a5d34" strokeWidth="3" />
              <path d="M133 82 C130 92 132 100 136 106" fill="none" stroke="#e8c79a" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p>this could be your garden</p>
          </div>
        </div>

        <div className="ct-right">
          <div className="ct-sign" role="group" aria-labelledby="ct-hours-title">
            <span className="ct-chain l" />
            <span className="ct-chain r" />
            <h3 id="ct-hours-title">Garden hours</h3>
            <p className={`ct-status${status.open ? ' open' : ''}`} aria-live="polite">
              <i aria-hidden="true" />
              {status.label}
            </p>
            <ul>
              {CONTACT.hours.map((row) => (
                <li key={row.label} className={row.days.includes(status.today) ? 'today' : ''}>
                  <span>{row.label}</span>
                  <b>{row.open == null ? 'Closed' : `${hourLabel(row.open)} to ${hourLabel(row.close)}`}</b>
                </li>
              ))}
            </ul>
            <p className="ct-area">We work in {CONTACT.area}.</p>
          </div>

          <SeedForm />

          <p className="ct-aside">
            Want a proper quote? <a href="#builder">Sketch your garden first</a> and send us the plan.
          </p>
        </div>
      </div>

      <svg className="ct-worm" viewBox="0 0 400 60" aria-hidden="true">
        <path d="M0 40 C40 10 70 10 100 36 S160 62 200 34 S270 8 300 34 S360 60 400 30" fill="none" stroke="#e8909a" strokeWidth="11" strokeLinecap="round" />
      </svg>
    </section>
  )
}
