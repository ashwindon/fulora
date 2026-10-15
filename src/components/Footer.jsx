import { CONTACT, hourLabel } from './contactData.js'
import './Footer.css'

const LINKS = [
  ['Services', '#services'],
  ['Garden builder', '#builder'],
  ['Meet the grower', '#about'],
  ['Plant a seed', '#contact'],
]

const SOCIAL = {
  Instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.5 6.5v.01',
  Facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z',
  YouTube: 'M3 8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM10 9l5 3-5 3z',
}

const todayYear = new Date().getFullYear()

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const weekdays = CONTACT.hours[0]
  return (
    <footer className="footer">
      <div className="ft-top">
        <div className="ft-brand">
          <a className="ft-logo" href="#top" aria-label="Fulora, back to the top">
            <svg viewBox="-16 -16 32 32" width="34" height="34" aria-hidden="true">
              <g fill="#ff6f4d">
                <circle cy="-7" r="6" />
                <circle cx="7" r="6" />
                <circle cy="7" r="6" />
                <circle cx="-7" r="6" />
              </g>
              <circle r="5" fill="#ffb627" />
            </svg>
            Fulora
          </a>
          <p>Gardens that make you grin. Designed, planted and looked after with a little too much enthusiasm.</p>
          <ul className="ft-social">
            {CONTACT.socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={SOCIAL[s.name]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="ft-col" aria-label="Footer">
          <h4>Explore</h4>
          <ul>
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ft-col">
          <h4>Visit and call</h4>
          <address>
            {CONTACT.address.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </address>
          <p className="ft-hours">
            {weekdays.label}: {hourLabel(weekdays.open)} to {hourLabel(weekdays.close)}
          </p>
        </div>

        <button type="button" className="ft-up" onClick={toTop}>
          <svg viewBox="0 0 40 52" width="40" height="52" aria-hidden="true">
            <path className="ft-up-stem" d="M20 50 V16" fill="none" stroke="#79c46a" strokeWidth="5" strokeLinecap="round" />
            <path d="M20 30 C8 30 4 22 4 16 C14 16 20 22 20 30Z" fill="#5db35a" />
            <path d="M20 22 C32 22 36 14 36 8 C26 8 20 14 20 22Z" fill="#79c46a" />
            <circle cx="20" cy="8" r="6" fill="#ffb627" />
          </svg>
          <span>Back to the top</span>
        </button>
      </div>

      <div className="ft-bottom">
        <p>© {todayYear} Fulora. All rights reserved.</p>
        <p>Made with soil, sun and a little too much coffee.</p>
      </div>
    </footer>
  )
}
