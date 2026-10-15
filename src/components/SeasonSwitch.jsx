import { SEASON_ORDER, SEASONS } from './seasons.js'
import './SeasonSwitch.css'

function Icon({ name }) {
  const common = { width: 20, height: 20, viewBox: '-12 -12 24 24', 'aria-hidden': true, fill: 'none' }
  if (name === 'spring') {
    return (
      <svg {...common}>
        <g fill="currentColor">
          <circle cy="-5" r="3.6" />
          <circle cx="5" r="3.6" />
          <circle cy="5" r="3.6" />
          <circle cx="-5" r="3.6" />
        </g>
        <circle r="2.4" fill="#ffd23f" />
      </svg>
    )
  }
  if (name === 'summer') {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle r="4.5" fill="currentColor" />
        <path d="M0 -10V-7.5M0 10V7.5M-10 0H-7.5M10 0H7.5M-7 -7L-5.2 -5.2M7 7L5.2 5.2M-7 7L-5.2 5.2M7 -7L5.2 -5.2" />
      </svg>
    )
  }
  if (name === 'autumn') {
    return (
      <svg {...common}>
        <path d="M-8 8C-9 -2 -2 -9 8 -8C9 2 2 9 -8 8Z" fill="currentColor" />
        <path d="M-8 8L3 -3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    )
  }
  return (
    <svg {...common} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M0 -10V10M-8.7 -5L8.7 5M-8.7 5L8.7 -5" />
    </svg>
  )
}

export default function SeasonSwitch({ season, onChange, ready }) {
  return (
    <div className={`season-switch${ready ? ' ready' : ''}`} role="radiogroup" aria-label="Choose a season">
      {SEASON_ORDER.map((key) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={key === season}
          className={key === season ? 'on' : ''}
          onClick={() => onChange(key)}
        >
          <Icon name={key} />
          <span>{SEASONS[key].label}</span>
        </button>
      ))}
    </div>
  )
}
