import './Nav.css'

const links = [
  ['Services', '#services'],
  ['Garden builder', '#builder'],
  ['Plants', '#plants'],
  ['Meet the grower', '#about'],
]

export default function Nav() {
  return (
    <header className="nav">
      <a className="nav-logo" href="#top" aria-label="Fulora home">
        <svg viewBox="-16 -16 32 32" width="30" height="30" aria-hidden="true">
          <g fill="#ff6f4d">
            <circle cy="-7" r="6" />
            <circle cx="7" r="6" />
            <circle cy="7" r="6" />
            <circle cx="-7" r="6" />
          </g>
          <circle r="5" fill="#ffb627" />
        </svg>
        <span>Fulora</span>
      </a>
      <nav className="nav-links" aria-label="Main">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <a className="btn btn-small" href="#contact">
        Plant a seed
      </a>
    </header>
  )
}
