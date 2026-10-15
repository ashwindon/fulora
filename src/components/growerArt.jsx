import { petalPath } from './botany.js'

// Illustrated stand-ins for the owner's photos (300 x 300).

function Hat() {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true">
      <rect width="300" height="300" fill="#dff0d4" />
      <circle cx="238" cy="62" r="30" fill="#ffe45c" />
      <g stroke="#fff6b0" strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <path d="M238 14V24M238 100V110M190 62H200M276 62H286M204 28L211 35M265 89L272 96M204 96L211 89M265 35L272 28" />
      </g>
      <rect y="210" width="300" height="90" fill="#b5814a" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${222 + i * 22}H300`} stroke="#a06c3b" strokeWidth="3" />
      ))}
      <ellipse cx="150" cy="206" rx="104" ry="14" fill="rgba(0,0,0,0.18)" />
      <ellipse cx="150" cy="186" rx="104" ry="26" fill="#e8c47a" stroke="#c9a152" strokeWidth="3" />
      <path d="M92 184 C90 120 210 120 208 184 C190 200 110 200 92 184Z" fill="#f1d38e" stroke="#c9a152" strokeWidth="3" />
      <path d="M93 168 C120 184 180 184 207 168 L208 184 C190 200 110 200 92 184Z" fill="#e8426b" />
      <g transform="translate(176 176)">
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={petalPath(0, 0, i * 60, 15, 7)} fill="#ffffff" />
        ))}
        <circle r="5" fill="#ffc21a" />
      </g>
      <path d="M32 232 C26 210 44 196 56 206 L66 228 C70 246 44 254 32 232Z" fill="#5db35a" stroke="#3f9a4a" strokeWidth="3" />
      <path d="M70 244 C64 222 82 208 94 218 L104 240 C108 258 82 266 70 244Z" fill="#79c46a" stroke="#3f9a4a" strokeWidth="3" />
      <g transform="rotate(-24 230 236)">
        <rect x="204" y="226" width="64" height="12" rx="6" fill="#c28a52" stroke="#8a5d34" strokeWidth="2" />
        <path d="M268 226 L292 232 L268 238Z" fill="#c9d3da" stroke="#8796a1" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g transform="translate(252 262)">
        <path d="M-16 -4 H16 L12 22 H-12Z" fill="#c9714a" />
        <path d="M0 -4 V-24 M0 -14 C-10 -16 -12 -24 -10 -28 C-2 -26 0 -20 0 -14 M0 -18 C8 -20 12 -26 10 -30 C2 -28 0 -22 0 -18" fill="none" stroke="#3f9a4a" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Greenhouse() {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true">
      <rect width="300" height="300" fill="#cfeaf7" />
      <circle cx="244" cy="50" r="24" fill="#ffe45c" />
      <rect y="236" width="300" height="64" fill="#78c47a" />
      <path d="M30 236 V122 L150 52 L270 122 V236Z" fill="#e9f7fb" stroke="#9aa7ad" strokeWidth="5" strokeLinejoin="round" />
      <path d="M30 122 H270 M90 236 V87 M150 236 V52 M210 236 V87" stroke="#9aa7ad" strokeWidth="3" />
      <path d="M44 214 L96 150 M60 214 L112 150" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      <rect x="48" y="196" width="204" height="10" rx="3" fill="#b5814a" />
      <rect x="48" y="150" width="204" height="8" rx="3" fill="#b5814a" />
      {[
        [64, 196, '#ff6f9c'],
        [100, 196, '#ffd23f'],
        [136, 196, '#8e6bd1'],
        [172, 196, '#ff8f3d'],
        [208, 196, '#ec3f86'],
        [74, 150, '#ffd23f'],
        [116, 150, '#ffffff'],
        [158, 150, '#ff6f9c'],
        [200, 150, '#c9a8ff'],
      ].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M-9 0 H9 L6 14 H-6Z" fill="#c9714a" transform="translate(0 0)" />
          <path d="M0 0 V-14" stroke="#3f9a4a" strokeWidth="3" strokeLinecap="round" />
          <circle cy="-18" r="7" fill={c} />
          <circle cy="-18" r="2.6" fill="#ffc21a" />
        </g>
      ))}
      <rect x="128" y="206" width="44" height="30" rx="3" fill="#b5814a" stroke="#6f4a26" strokeWidth="2" />
    </svg>
  )
}

function Fern() {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true">
      <rect width="300" height="300" fill="#f6e9d2" />
      <rect y="232" width="300" height="68" fill="#d9b88a" />
      <ellipse cx="150" cy="238" rx="74" ry="10" fill="rgba(0,0,0,0.15)" />
      <path d="M98 170 H202 L188 238 H112Z" fill="#c9714a" stroke="#8f4f2e" strokeWidth="3" strokeLinejoin="round" />
      <rect x="92" y="160" width="116" height="16" rx="6" fill="#d9855c" stroke="#8f4f2e" strokeWidth="3" />
      {[-70, -48, -26, 26, 48, 70].map((a, i) => (
        <path key={i} d={`M150 160 C${150 + a * 1.3} ${100 - Math.abs(a) * 0.2} ${150 + a * 2.1} ${90 + Math.abs(a) * 0.9} ${150 + a * 2.2} ${150 + Math.abs(a) * 0.4}`} fill="none" stroke={i % 2 ? '#a3a85b' : '#8c9a4a'} strokeWidth="9" strokeLinecap="round" />
      ))}
      <path d="M150 160 C148 120 152 90 150 60" fill="none" stroke="#5db35a" strokeWidth="8" strokeLinecap="round" />
      <path d="M150 74 C132 70 122 56 124 44 C140 46 148 58 150 74Z M150 66 C168 62 178 48 176 36 C160 38 152 50 150 66Z" fill="#79c46a" stroke="#3f9a4a" strokeWidth="2" />
      <g transform="translate(206 120)">
        <path d="M0 0 V-42" stroke="#8a5d34" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 -42 L34 -34 L0 -22Z" fill="#e8426b" />
      </g>
      <g transform="translate(150 206)">
        <circle cx="-14" cy="0" r="3.4" fill="#3b2a1a" />
        <circle cx="14" cy="0" r="3.4" fill="#3b2a1a" />
        <path d="M-8 10 Q0 18 8 10" fill="none" stroke="#3b2a1a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <rect x="170" y="214" width="26" height="12" rx="2" fill="#fff" stroke="#e5d9c3" strokeWidth="1.5" transform="rotate(-8 183 220)" />
    </svg>
  )
}

const ART = { hat: Hat, greenhouse: Greenhouse, fern: Fern }

export function PhotoArt({ art }) {
  const Art = ART[art]
  return <Art />
}

export function Mascot() {
  return (
    <svg viewBox="0 0 160 190" aria-hidden="true">
      <ellipse cx="80" cy="176" rx="48" ry="8" fill="rgba(0,0,0,0.18)" />
      <g className="gr-fronds">
        {[-62, -38, -14, 14, 38, 62].map((a, i) => (
          <path key={i} d={`M80 110 C${80 + a * 0.9} ${50 - Math.abs(a) * 0.2} ${80 + a * 1.5} ${40 + Math.abs(a) * 0.6} ${80 + a * 1.6} ${96 + Math.abs(a) * 0.3}`} fill="none" stroke={i % 2 ? '#3f9a4a' : '#5db35a'} strokeWidth="9" strokeLinecap="round" />
        ))}
        <path d="M80 112 C78 80 82 56 80 30" fill="none" stroke="#4aa35c" strokeWidth="8" strokeLinecap="round" />
      </g>
      <path d="M36 112 H124 L112 172 H48Z" fill="#c9714a" stroke="#8f4f2e" strokeWidth="3" strokeLinejoin="round" />
      <rect x="30" y="104" width="100" height="14" rx="6" fill="#d9855c" stroke="#8f4f2e" strokeWidth="3" />
      <g>
        <circle cx="66" cy="140" r="4" fill="#3b2a1a" />
        <circle cx="94" cy="140" r="4" fill="#3b2a1a" />
        <path d="M70 152 Q80 162 90 152" fill="none" stroke="#3b2a1a" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="58" cy="150" r="5" fill="#ff8fbf" opacity="0.7" />
        <circle cx="102" cy="150" r="5" fill="#ff8fbf" opacity="0.7" />
      </g>
    </svg>
  )
}

// Little white line drawings that sit on the back of each seed packet.
export function FactIcon({ name }) {
  const line = { fill: 'none', stroke: '#fff', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      {name === 'peony' && (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={petalPath(32, 32, i * 45, 24, 10)} fill="rgba(255,255,255,0.28)" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={petalPath(32, 32, i * 60 + 20, 15, 7)} fill="rgba(255,255,255,0.4)" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
          ))}
          <circle cx="32" cy="32" r="4.5" fill="#fff" />
        </g>
      )}
      {name === 'pothos' && (
        <g {...line}>
          <path d="M32 54 C14 42 10 26 22 17 C28 13 32 17 32 22 C32 17 36 13 42 17 C54 26 50 42 32 54Z" fill="rgba(255,255,255,0.22)" />
          <path d="M32 54 V24 M32 40 L22 32 M32 34 L42 27 M32 46 L24 42 M32 44 L40 40" strokeWidth="2.4" />
        </g>
      )}
      {name === 'hydrangea' && (
        <g>
          {[
            [32, 14], [22, 20], [42, 20], [14, 28], [32, 26], [50, 28], [22, 34], [42, 34], [32, 40], [14, 40], [50, 40], [24, 47], [40, 47],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6.4" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2.2" />
          ))}
          <path d="M32 54 q-3 5 0 8" {...line} strokeWidth="2.6" />
        </g>
      )}
      {name === 'music' && (
        <g {...line}>
          <path d="M24 46 V16 L46 11 V41" />
          <ellipse cx="19" cy="47" rx="6.5" ry="5" fill="#fff" />
          <ellipse cx="41" cy="42" rx="6.5" ry="5" fill="#fff" />
          <path d="M52 22 q4 3 0 7 M56 19 q7 7 0 14" strokeWidth="2.4" />
        </g>
      )}
      {name === 'eye' && (
        <g {...line}>
          <path d="M5 32 C16 14 48 14 59 32 C48 50 16 50 5 32Z" fill="rgba(255,255,255,0.22)" />
          <circle cx="32" cy="32" r="9" fill="#fff" />
          <circle cx="32" cy="32" r="3.6" fill="rgba(0,0,0,0.55)" stroke="none" />
          <path d="M50 10 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z" fill="#fff" strokeWidth="1.5" />
        </g>
      )}
      {name === 'bench' && (
        <g {...line}>
          <path d="M8 56 V30 C8 14 56 14 56 30 V56" strokeWidth="2.6" />
          <rect x="18" y="38" width="28" height="7" rx="2" fill="rgba(255,255,255,0.3)" />
          <path d="M20 45 V54 M44 45 V54 M18 32 H46" />
          <circle cx="14" cy="24" r="2.4" fill="#fff" stroke="none" />
          <circle cx="50" cy="22" r="2.4" fill="#fff" stroke="none" />
          <circle cx="32" cy="17" r="2.4" fill="#fff" stroke="none" />
        </g>
      )}
    </svg>
  )
}
