import { petalPath, leafPath, seeded } from './botany.js'

const hand = { fontFamily: "'Caveat','Segoe Print',cursive", fontWeight: 700 }

/* ------------------------------------------------------------------ */
/* 1. Design: a blueprint that colours itself in                       */
/* ------------------------------------------------------------------ */

const DZ_LAWN =
  'M110 120 C200 100 330 130 420 110 C480 105 505 150 500 210 C495 300 505 380 440 410 C350 430 220 415 140 405 C95 395 90 300 100 230 C105 180 85 140 110 120Z'
const DZ_STONES = [
  [140, 385],
  [190, 362],
  [238, 344],
  [282, 316],
  [318, 284],
  [342, 252],
  [355, 222],
]
const DZ_BEDS = [
  { x: 170, y: 185, rx: 54, ry: 40, cols: ['#ff6f9c', '#ffd23f', '#ffffff'] },
  { x: 440, y: 345, rx: 52, ry: 34, cols: ['#8e6bd1', '#ff8f3d', '#ffffff'] },
  { x: 285, y: 135, rx: 50, ry: 24, cols: ['#ec3f86', '#ffe170', '#c9a8ff'] },
]

export function DesignScene() {
  const rnd = seeded(3)
  const flowers = DZ_BEDS.flatMap((b) =>
    Array.from({ length: 10 }, (_, i) => {
      const a = rnd() * Math.PI * 2
      const r = Math.sqrt(rnd())
      return { x: b.x + Math.cos(a) * b.rx * 0.78 * r, y: b.y + Math.sin(a) * b.ry * 0.78 * r, c: b.cols[i % 3] }
    }),
  )
  const line = { fill: 'none', stroke: '#cfe6ff', strokeWidth: 2.2, strokeLinecap: 'round' }
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <pattern id="dz-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="#fff" strokeOpacity="0.12" />
        </pattern>
        <clipPath id="dz-reveal">
          <circle className="dz-clip" cx="300" cy="260" r="0" />
        </clipPath>
      </defs>
      <rect width="600" height="520" fill="#1d4e89" />
      <rect width="600" height="520" fill="url(#dz-grid)" />

      <g>
        <rect className="dz-line" x="70" y="80" width="460" height="360" rx="24" {...line} />
        <path className="dz-line" d={DZ_LAWN} {...line} strokeDasharray="0" />
        {DZ_STONES.map(([x, y], i) => (
          <ellipse className="dz-line" key={i} cx={x} cy={y} rx="13" ry="9" {...line} />
        ))}
        <ellipse className="dz-line" cx="410" cy="200" rx="62" ry="40" {...line} />
        {DZ_BEDS.map((b, i) => (
          <ellipse className="dz-line" key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} {...line} />
        ))}
        <circle className="dz-line" cx="100" cy="300" r="32" {...line} />
        <path className="dz-line" d="M70 466H530M70 458V474M530 458V474" {...line} strokeWidth="1.6" />
        <path className="dz-line" d="M562 80V440M554 80H570M554 440H570" {...line} strokeWidth="1.6" />
        <text className="dz-dim" x="272" y="488" fill="#cfe6ff" fontSize="22" style={hand}>
          12 m
        </text>
        <text className="dz-dim" x="570" y="266" fill="#cfe6ff" fontSize="22" style={hand}>
          9 m
        </text>
      </g>

      <g clipPath="url(#dz-reveal)">
        <rect width="600" height="520" fill="#fff6df" />
        <rect x="70" y="80" width="460" height="360" rx="24" fill="#9fdc8d" stroke="#8a6238" strokeWidth="6" />
        <path d={DZ_LAWN} fill="#8fd18f" />
        {DZ_STONES.map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="13" ry="9" fill="#ead9b0" stroke="#cdb98b" strokeWidth="2" />
        ))}
        <ellipse cx="410" cy="200" rx="62" ry="40" fill="#6cc6ee" stroke="#4da3cf" strokeWidth="3" />
        <ellipse className="dz-ripple" cx="410" cy="200" rx="10" ry="6" fill="none" stroke="#fff" strokeWidth="2" opacity="0" />
        <ellipse cx="392" cy="196" rx="14" ry="7" fill="#5db35a" />
        <ellipse cx="430" cy="210" rx="11" ry="6" fill="#5db35a" />
        {DZ_BEDS.map((b, i) => (
          <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill="#7b4f2c" />
        ))}
        {flowers.map((f, i) => (
          <circle className="dz-flower" key={i} cx={f.x} cy={f.y} r="6" fill={f.c} />
        ))}
        <circle cx="100" cy="300" r="32" fill="#3f9a4a" />
        <circle className="dz-canopy" cx="100" cy="300" r="22" fill="#5db35a" />
        <circle cx="94" cy="292" r="7" fill="#79c46a" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Planting: dig, drop, grow (soil cutaway with roots)              */
/* ------------------------------------------------------------------ */

const PL_SPOTS = [
  { x: 130, top: 150, kind: 'tulip' },
  { x: 300, top: 128, kind: 'daisy' },
  { x: 470, top: 110, kind: 'sun' },
]

function PlantingSpot({ j, x, top, kind }) {
  const rnd = seeded(20 + j)
  const roots = [
    [-4, 300, -20, 335, -34, 392],
    [3, 300, 18, 340, 30, 400],
    [0, 310, -6, 350, -12, 430],
    [-2, 290, -38, 310, -62, 346],
    [2, 290, 40, 312, 64, 350],
  ]
  return (
    <g>
      <ellipse className={`pl-hole pl-hole-${j}`} cx={x} cy="262" rx="34" ry="12" fill="#24150a" />
      <g className={`pl-roots pl-roots-${j}`} fill="none" stroke="#f0dcb6" strokeWidth="3" strokeLinecap="round">
        {roots.map(([a, b, c, d, e, f], i) => (
          <path className="pl-root" key={i} d={`M${x} 264 C${x + a} ${b} ${x + c} ${d} ${x + e} ${f}`} />
        ))}
      </g>
      <g className={`pl-seedling pl-seedling-${j}`}>
        <ellipse cx={x} cy="266" rx="10" ry="8" fill="#8a5d34" />
        <path d={`M${x} 262 V232`} stroke="#4aa35c" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx={x - 7} cy="238" rx="7" ry="4" fill="#79c46a" transform={`rotate(-30 ${x - 7} 238)`} />
        <ellipse cx={x + 7} cy="234" rx="7" ry="4" fill="#79c46a" transform={`rotate(30 ${x + 7} 234)`} />
      </g>
      <path className={`pl-mound pl-mound-${j}`} d={`M${x - 44} 258 C${x - 30} 236 ${x + 30} 236 ${x + 44} 258Z`} fill="#6b4425" />
      <g className={`pl-crumbs pl-crumbs-${j}`}>
        {Array.from({ length: 7 }, (_, i) => (
          <circle className="pl-crumb" key={i} cx={x + (rnd() - 0.5) * 30} cy="258" r={2 + rnd() * 3} fill="#7a5230" />
        ))}
      </g>
      <g className={`pl-plant pl-plant-${j}`} data-x={x} data-top={top}>
        <path className="pl-stem" d={`M${x} 258 C${x - 6} ${(258 + top) / 2 + 10} ${x + 6} ${(258 + top) / 2 - 10} ${x} ${top}`} fill="none" stroke="#3f9a4a" strokeWidth="5" strokeLinecap="round" />
        {[
          [-150, 44, 11, 214],
          [-30, 40, 10, 188],
        ].map(([ang, len, w, y], i) => {
          const lp = leafPath(x, y, ang, len, w)
          return <path className="pl-leaf" key={i} d={lp.body} fill={i ? '#4f9a5a' : '#5db35a'} />
        })}
        <g className="pl-flower">
          {kind === 'tulip' && (
            <>
              <path d={`M${x} ${top + 4} C${x - 24} ${top} ${x - 28} ${top - 28} ${x - 8} ${top - 48} C${x - 8} ${top - 20} ${x - 2} ${top - 8} ${x} ${top + 4}Z`} fill="#ff8f6a" />
              <path d={`M${x} ${top + 4} C${x + 24} ${top} ${x + 28} ${top - 28} ${x + 8} ${top - 48} C${x + 8} ${top - 20} ${x + 2} ${top - 8} ${x} ${top + 4}Z`} fill="#ff8f6a" />
              <path d={`M${x} ${top + 6} C${x - 20} ${top} ${x - 22} ${top - 36} ${x} ${top - 62} C${x + 22} ${top - 36} ${x + 20} ${top} ${x} ${top + 6}Z`} fill="#ff5a3d" />
            </>
          )}
          {kind === 'daisy' && (
            <>
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d={petalPath(x, top - 14, (360 / 12) * i, 30, 8)} fill="#ffffff" stroke="#e7e1d5" strokeWidth="0.8" />
              ))}
              <circle cx={x} cy={top - 14} r="10" fill="#ffc21a" />
            </>
          )}
          {kind === 'sun' && (
            <>
              {Array.from({ length: 14 }, (_, i) => (
                <path key={i} d={petalPath(x, top - 20, (360 / 14) * i, 38, 11)} fill={i % 2 ? '#ffc21a' : '#ffd84a'} />
              ))}
              <circle cx={x} cy={top - 20} r="16" fill="#5a2e12" />
              <circle cx={x} cy={top - 20} r="8" fill="#7a4a22" />
            </>
          )}
        </g>
      </g>
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i} transform={`translate(${x - 24 + i * 16} ${96 + (i % 2) * 18})`}>
          <path className={`pl-drop pl-drop-${j}`} d="M0 -8 C6 0 6 7 0 8 C-6 7 -6 0 0 -8Z" fill="#6cc6ee" />
        </g>
      ))}
    </g>
  )
}

export function PlantingScene() {
  const rnd = seeded(9)
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6fb" />
          <stop offset="1" stopColor="#fff1de" />
        </linearGradient>
        <linearGradient id="pl-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4e2d" />
          <stop offset="1" stopColor="#3d2414" />
        </linearGradient>
      </defs>
      <rect width="600" height="260" fill="url(#pl-sky)" />
      <circle cx="520" cy="70" r="30" fill="#ffe45c" />
      <rect y="252" width="600" height="268" fill="url(#pl-soil)" />
      {Array.from({ length: 36 }, (_, i) => (
        <circle key={i} cx={rnd() * 600} cy={290 + rnd() * 220} r={1.5 + rnd() * 3.5} fill="#2e1a0c" opacity="0.5" />
      ))}
      {[
        [60, 470, 20],
        [250, 490, 26],
        [520, 440, 22],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#8d8279" opacity="0.7" />
      ))}
      <path d="M0 252 C60 240 120 258 200 250 S340 240 400 252 S540 246 600 250 V264 H0Z" fill="#5db35a" />
      {PL_SPOTS.map((s, j) => (
        <PlantingSpot key={j} j={j} {...s} />
      ))}
      <g className="pl-trowel">
        <path d="M0 0 L-13 -30 C-10 -46 10 -46 13 -30Z" fill="#c9d3da" stroke="#8796a1" strokeWidth="2" strokeLinejoin="round" />
        <rect x="-3" y="-62" width="6" height="30" fill="#8796a1" />
        <rect x="-8" y="-112" width="16" height="54" rx="8" fill="#c28a52" stroke="#8a5d34" strokeWidth="2" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Lawn: mowing stripes, sprinkler, rainbow                         */
/* ------------------------------------------------------------------ */

export function LawnScene() {
  const rnd = seeded(14)
  const rainbow = ['#ff5a5a', '#ff9f43', '#ffd93b', '#5ecb6b', '#4aa8ff', '#8e6bd1']
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <clipPath id="lw-clip">
          <rect x="40" y="60" width="520" height="396" rx="28" />
        </clipPath>
      </defs>
      <rect width="600" height="520" fill="#dff3d3" />
      <rect x="40" y="60" width="520" height="396" rx="28" fill="#6fbf73" />
      <g clipPath="url(#lw-clip)">
        {Array.from({ length: 6 }, (_, k) => (
          <rect className="lw-band" key={k} x="40" y={60 + k * 66} width="520" height="66" fill={k % 2 ? '#5fae66' : '#8adb8e'} />
        ))}
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx={60 + rnd() * 480} cy={80 + rnd() * 360} r="3.2" fill="#fff" opacity="0.8" />
        ))}
      </g>
      <rect x="40" y="60" width="520" height="396" rx="28" fill="none" stroke="#4f9a5a" strokeWidth="6" />

      {Array.from({ length: 18 }, (_, i) => (
        <rect className="lw-fleck" key={i} x="-3" y="-2" width="7" height="3.5" rx="1.5" fill="#3f9a4a" />
      ))}

      <g className="lw-rainbow" fill="none" strokeLinecap="round" strokeWidth="9" opacity="0.88">
        {rainbow.map((c, i) => (
          <path key={c} className="lw-arc" d={`M${300 - (150 - i * 10)} 262 A${150 - i * 10} ${150 - i * 10} 0 0 1 ${300 + (150 - i * 10)} 262`} stroke={c} />
        ))}
      </g>

      <g className="lw-jets" fill="none" stroke="#9adfff" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M300 252 Q335 232 372 252" transform={`rotate(${i * 45} 300 252)`} />
        ))}
      </g>

      <g className="lw-spk">
        <ellipse cx="300" cy="262" rx="14" ry="6" fill="#5b6b78" />
        <rect x="294" y="244" width="12" height="18" rx="4" fill="#e8426b" />
        <circle cx="300" cy="242" r="7" fill="#ff7f9d" />
      </g>

      <g className="lw-mower">
        <path d="M-18 -4 L-44 -34" stroke="#3b4a56" strokeWidth="4" strokeLinecap="round" />
        <path d="M-52 -34 H-36" stroke="#3b4a56" strokeWidth="6" strokeLinecap="round" />
        <rect x="-26" y="-18" width="56" height="34" rx="9" fill="#e8426b" />
        <rect x="-18" y="-14" width="30" height="10" rx="5" fill="#ff7f9d" />
        <circle cx="-16" cy="-20" r="6" fill="#222" />
        <circle cx="22" cy="-20" r="6" fill="#222" />
        <circle cx="-16" cy="18" r="6" fill="#222" />
        <circle cx="22" cy="18" r="6" fill="#222" />
        <circle cx="34" cy="0" r="5" fill="#ffd93b" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Seasonal colour: a marker walks the year, the bed fills with bloom */
/* ------------------------------------------------------------------ */

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const SE_PLANTS = [
  { kind: 'bell', h: 70, c: '#ffffff' },
  { kind: 'cup', h: 80, c: '#8e6bd1', s: 0.7 },
  { kind: 'daffodil', h: 96, c: '#ffd23f' },
  { kind: 'cup', h: 112, c: '#e8426b', s: 1 },
  { kind: 'radial', h: 102, n: 10, len: 22, w: 11, c: '#f58cbc', c2: '#ffc4dd', core: '#ffd23f' },
  { kind: 'rose', h: 106, c: '#d81b3a' },
  { kind: 'radial', h: 132, n: 14, len: 26, w: 9, c: '#ffc21a', c2: '#ffd84a', core: '#5a2e12', cr: 11 },
  { kind: 'radial', h: 120, n: 16, len: 24, w: 10, c: '#d946a8', c2: '#ec6cc0', core: '#ffc93c' },
  { kind: 'radial', h: 108, n: 18, len: 20, w: 5, c: '#9a7bea', c2: '#b9a2f5', core: '#ffd23f' },
  { kind: 'radial', h: 98, n: 18, len: 22, w: 7, c: '#ff8a1f', c2: '#ffb347', core: '#c4570a' },
  { kind: 'berries', h: 86, c: '#e53b3b' },
  { kind: 'radial', h: 76, n: 5, len: 18, w: 11, c: '#a86a8a', c2: '#c48aa8', core: '#e8d27a' },
]

function SeBloom({ p }) {
  if (p.kind === 'bell')
    return (
      <>
        <path d="M0 4 C2 -2 6 -4 8 2" fill="none" stroke="#4aa35c" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="8" cy="9" rx="5.5" ry="9" fill="#fff" stroke="#dfe6ee" strokeWidth="1" />
        <circle cx="8" cy="18" r="2.4" fill="#9ccf8a" />
      </>
    )
  if (p.kind === 'cup') {
    const s = p.s || 1
    return (
      <g transform={`scale(${s})`}>
        <path d="M-12 4 C-14 -16 -6 -28 0 -34 C6 -28 14 -16 12 4 C6 8 -6 8 -12 4Z" fill={p.c} />
        <path d="M0 4 C-4 -10 -2 -22 0 -30 C2 -22 4 -10 0 4Z" fill="#fff" opacity="0.35" />
      </g>
    )
  }
  if (p.kind === 'daffodil')
    return (
      <>
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={petalPath(0, -8, (360 / 6) * i - 90, 20, 8)} fill="#ffe170" />
        ))}
        <ellipse cx="0" cy="-8" rx="8" ry="6" fill="#ff9a2e" />
      </>
    )
  if (p.kind === 'rose')
    return (
      <>
        <circle cx="0" cy="-10" r="17" fill="#b5122e" />
        <circle cx="0" cy="-10" r="12" fill={p.c} />
        <circle cx="1" cy="-11" r="7" fill="#b5122e" />
        <circle cx="1" cy="-11" r="3.4" fill={p.c} />
      </>
    )
  if (p.kind === 'berries')
    return (
      <>
        {[
          [-8, -4],
          [6, -10],
          [0, 4],
          [-4, -16],
          [10, 2],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill={p.c} />
        ))}
        <ellipse cx="-14" cy="6" rx="12" ry="5" fill="#2f7d3e" transform="rotate(-20 -14 6)" />
        <ellipse cx="14" cy="8" rx="12" ry="5" fill="#2f7d3e" transform="rotate(20 14 8)" />
      </>
    )
  return (
    <>
      {Array.from({ length: p.n }, (_, i) => (
        <path key={i} d={petalPath(0, -p.len * 0.4, (360 / p.n) * i - 90, p.len, p.w)} fill={i % 2 ? p.c2 : p.c} />
      ))}
      <circle cx="0" cy={-p.len * 0.4} r={p.cr || 7} fill={p.core} />
    </>
  )
}

export function SeasonalScene() {
  const skies = [
    ['w', '#b8cde4', '#eef3fa'],
    ['sp', '#a8dcf5', '#fdf0f6'],
    ['su', '#4fb4f0', '#d9f2ff'],
    ['au', '#8fb7e0', '#fde4c4'],
  ]
  const labels = ['Winter', 'Spring', 'Summer', 'Autumn', 'Winter']
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        {skies.map(([id, a, b]) => (
          <linearGradient key={id} id={`se-g-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
        <path id="se-arc" d="M50 150 Q300 -10 550 150" fill="none" />
      </defs>
      <rect className="se-sky se-sky-0" width="600" height="520" fill="url(#se-g-w)" />
      <rect className="se-sky se-sky-1" width="600" height="520" fill="url(#se-g-sp)" />
      <rect className="se-sky se-sky-2" width="600" height="520" fill="url(#se-g-su)" />
      <rect className="se-sky se-sky-3" width="600" height="520" fill="url(#se-g-au)" />
      <rect className="se-sky se-sky-4" width="600" height="520" fill="url(#se-g-w)" />

      {labels.map((t, i) => (
        <text className={`se-lbl se-lbl-${i}`} key={i} x="36" y="74" fontSize="46" fill="#24405a" style={hand}>
          {t}
        </text>
      ))}

      <circle className="se-sun" cx="0" cy="0" r="20" fill="#fdf3d0" />

      <path d="M0 398 C80 386 160 404 250 394 S430 384 520 396 S580 392 600 394 V520 H0Z" fill="#6a4528" />
      <path className="se-grass" d="M0 398 C80 386 160 404 250 394 S430 384 520 396 S580 392 600 394 V404 C520 410 440 398 340 406 S160 408 0 404Z" fill="#9db8a8" />

      {SE_PLANTS.map((p, i) => {
        const x = 56 + i * 44
        return (
          <g key={i}>
            <path className="se-stem" d={`M${x} 400 C${x + 4} ${400 - p.h * 0.4} ${x - 4} ${400 - p.h * 0.7} ${x} ${400 - p.h}`} fill="none" stroke="#3f9a4a" strokeWidth="4" strokeLinecap="round" data-x={x} />
            <g className="se-rise" data-x={x} data-y={400 - p.h} data-h={p.h}>
              <g className="se-bloom">
                <SeBloom p={p} />
              </g>
            </g>
          </g>
        )
      })}

      <rect x="24" y="418" width="552" height="42" rx="21" fill="#000" opacity="0.2" />
      {MONTHS.map((m, i) => (
        <text key={i} x={56 + i * 44} y="446" textAnchor="middle" fontSize="22" fill="#fff" style={hand}>
          {m}
        </text>
      ))}
      <circle className="se-marker" cx="56" cy="439" r="15" fill="none" stroke="#fff" strokeWidth="3" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Water and stone: a night by the waterfall (dark scene)           */
/* ------------------------------------------------------------------ */

const LOTUS = [
  { x: 300, y: 452, s: 1 },
  { x: 372, y: 482, s: 0.85 },
  { x: 236, y: 488, s: 0.8 },
]

export function WaterScene() {
  const rnd = seeded(31)
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <linearGradient id="wt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06182a" />
          <stop offset="1" stopColor="#15485a" />
        </linearGradient>
        <linearGradient id="wt-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e6b7d" />
          <stop offset="1" stopColor="#0a2e3c" />
        </linearGradient>
        <linearGradient id="wt-fall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9fbff" />
          <stop offset="1" stopColor="#8fd3e6" />
        </linearGradient>
        <radialGradient id="wt-glow">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <path id="wt-koi-path" d="M520 452 A150 26 0 1 1 220 452 A150 26 0 1 1 520 452" fill="none" />
      </defs>
      <rect width="600" height="520" fill="url(#wt-sky)" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle className="wt-star" key={i} cx={rnd() * 600} cy={rnd() * 200} r={0.8 + rnd() * 1.4} fill="#fff" style={{ animationDelay: `${(rnd() * 4).toFixed(2)}s` }} />
      ))}
      <g className="wt-moon">
        <circle cx="480" cy="92" r="88" fill="url(#wt-glow)" opacity="0.4" />
        <circle cx="480" cy="92" r="32" fill="#fff6d6" />
        <circle cx="470" cy="86" r="6" fill="#f1e2b4" />
        <circle cx="490" cy="102" r="4" fill="#f1e2b4" />
      </g>
      <path d="M0 300 L70 250 L130 280 L210 220 L300 285 L390 240 L470 290 L540 255 L600 285 V400 H0Z" fill="#0d3040" />

      <g className="wt-bamboo">
        {[548, 566, 584].map((x, i) => (
          <g key={x} style={{ animationDelay: `${i * 0.7}s` }}>
            <rect x={x - 4} y={110 + i * 26} width="8" height={300 - i * 26} rx="4" fill="#2f6b4a" />
            {[170, 230, 290, 350].map((y) => (
              <rect key={y} x={x - 5} y={y + i * 12} width="10" height="4" rx="2" fill="#1d4f36" />
            ))}
            <path d={`M${x} ${150 + i * 26} q-34 -10 -50 14 q30 6 50 -14Z`} fill="#3d8a5c" />
            <path d={`M${x} ${200 + i * 20} q30 -12 48 10 q-28 8 -48 -10Z`} fill="#3d8a5c" />
          </g>
        ))}
      </g>

      <path d="M0 150 C60 140 120 152 170 160 L210 168 C230 190 232 330 250 392 L0 392Z" fill="#244654" />
      <path d="M0 200 C50 190 100 200 140 214 C130 260 110 300 90 392 H0Z" fill="#2f5666" />
      <path d="M30 230 C80 240 120 250 150 300 C120 330 80 340 40 392 H0V250Z" fill="#35606f" opacity="0.7" />

      <g className="wt-fallwrap">
        <path d="M168 164 C168 240 162 330 158 392 L214 392 C208 330 204 240 198 170Z" fill="url(#wt-fall)" opacity="0.92" />
        {[176, 187, 198].map((x, i) => (
          <path className="wt-flow" key={x} d={`M${x} 170 C${x - 2} 250 ${x - 4} 320 ${x - 5} 392`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: `${i * -0.5}s` }} />
        ))}
      </g>

      <path d="M0 386 C100 378 200 392 300 384 S500 390 600 384 V520 H0Z" fill="url(#wt-water)" />
      <g className="wt-ripples" fill="none" stroke="#e9fbff" strokeWidth="1.6">
        {[0, 1, 2].map((i) => (
          <ellipse className="wt-ripple" key={i} cx="186" cy="396" rx="30" ry="7" style={{ animationDelay: `${i * -1.1}s` }} />
        ))}
      </g>
      <g className="wt-mist" fill="#d8f4ff">
        <ellipse className="wt-mist-a" cx="186" cy="388" rx="64" ry="18" opacity="0.28" />
        <ellipse className="wt-mist-b" cx="150" cy="380" rx="46" ry="12" opacity="0.22" />
        <ellipse className="wt-mist-c" cx="230" cy="382" rx="42" ry="11" opacity="0.2" />
      </g>
      <ellipse cx="470" cy="470" rx="26" ry="5" fill="#fff6d6" opacity="0.16" />
      <ellipse cx="470" cy="486" rx="14" ry="3" fill="#fff6d6" opacity="0.12" />

      <path d="M306 346 C340 334 520 332 540 350 L552 392 L300 392Z" fill="#2f5666" />
      <path d="M318 346 C350 338 510 338 530 350 L520 360 L326 360Z" fill="#3d6c7c" />

      <g transform="translate(425 342)">
        <g className="wt-buddha">
        <g className="wt-halo">
          <circle cx="0" cy="-136" r="74" fill="url(#wt-glow)" />
          <circle className="wt-halo-ring" cx="0" cy="-136" r="40" fill="none" stroke="#ffe9a8" strokeWidth="2" opacity="0.8" />
          <g className="wt-rays" stroke="#ffe9a8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
            {Array.from({ length: 16 }, (_, i) => (
              <line key={i} x1="0" y1="-182" x2="0" y2="-166" transform={`rotate(${i * 22.5} 0 -136)`} />
            ))}
          </g>
        </g>
        <ellipse cx="0" cy="4" rx="66" ry="12" fill="#5b7f8b" />
        <path d="M-60 0 C-60 -22 -30 -34 0 -34 C30 -34 60 -22 60 0 C40 9 -40 9 -60 0Z" fill="#9fb0b8" />
        <path d="M-30 -30 C-36 -72 -26 -106 0 -114 C26 -106 36 -72 30 -30Z" fill="#adbdc4" />
        <path d="M-30 -96 C-48 -72 -46 -46 -20 -34 L0 -36 L20 -34 C46 -46 48 -72 30 -96 C26 -70 20 -52 0 -48 C-20 -52 -26 -70 -30 -96Z" fill="#a3b4bc" />
        <ellipse cx="0" cy="-40" rx="17" ry="8" fill="#b9c8ce" />
        <circle cx="0" cy="-134" r="21" fill="#b9c8ce" />
        <circle cx="0" cy="-156" r="8" fill="#b9c8ce" />
        <ellipse cx="-22" cy="-128" rx="4" ry="9" fill="#a9b9c0" />
        <ellipse cx="22" cy="-128" rx="4" ry="9" fill="#a9b9c0" />
        <path d="M-12 -136 q4 3 8 0 M4 -136 q4 3 8 0" fill="none" stroke="#5b6e77" strokeWidth="2" strokeLinecap="round" />
        <path d="M-5 -122 q5 4 10 0" fill="none" stroke="#7a8d96" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 -100 C34 -80 30 -60 12 -44" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.18" />
        </g>
      </g>

      {LOTUS.map((l, i) => (
        <g className="wt-lotus" key={i} data-x={l.x} data-y={l.y}>
          <ellipse className="wt-pad" cx={l.x} cy={l.y + 6} rx={30 * l.s} ry={9 * l.s} fill="#2f7d5a" />
          {Array.from({ length: 7 }, (_, k) => (
            <path className="wt-petal" key={k} d={petalPath(l.x, l.y, -160 + k * 23.3, 26 * l.s, 8 * l.s)} fill={k % 2 ? '#ff9ec7' : '#ffc2dc'} />
          ))}
          <circle cx={l.x} cy={l.y - 4} r={4 * l.s} fill="#ffe170" />
        </g>
      ))}

      {[0, 1].map((i) => (
        <g className="wt-koi" key={i}>
          <path d="M-14 0 C-8 -7 8 -7 14 0 C8 7 -8 7 -14 0Z" fill={i ? '#ffffff' : '#ff7a3d'} />
          <path d="M-14 0 L-24 -7 L-22 0 L-24 7Z" fill={i ? '#ffd2b8' : '#ff9a63'} />
          <circle cx="4" cy="-2" r="3" fill={i ? '#ff7a3d' : '#fff'} opacity="0.9" />
        </g>
      ))}

      {Array.from({ length: 14 }, (_, i) => (
        <circle className="wt-firefly" key={i} cx={40 + rnd() * 520} cy={230 + rnd() * 220} r="2.6" fill="#fff3a8" style={{ animationDelay: `${(rnd() * -6).toFixed(2)}s`, animationDuration: `${5 + rnd() * 4}s` }} />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Garden care: snip, shape, tidy                                   */
/* ------------------------------------------------------------------ */

const GREENS = ['#3f9a4a', '#4aa35c', '#5db35a', '#2f7d3e']
const WEEDS = [110, 168, 438, 498, 548]

export function CareScene() {
  const rnd = seeded(77)
  const blobs = Array.from({ length: 56 }, () => {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd()) * 118 * (0.7 + rnd() * 0.4)
    return { x: 300 + Math.cos(a) * r, y: 288 + Math.sin(a) * r * 0.95, r: 20 + rnd() * 20, c: GREENS[Math.floor(rnd() * 4)] }
  }).sort((a, b) => a.y - b.y)
  const twigs = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + rnd() * 0.3
    const r1 = 100 + rnd() * 20
    const r2 = r1 + 26 + rnd() * 22
    return { x1: 300 + Math.cos(a) * r1, y1: 288 + Math.sin(a) * r1, x2: 300 + Math.cos(a) * r2, y2: 288 + Math.sin(a) * r2 * 0.98 }
  }).filter((t) => t.y2 < 396)
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <clipPath id="cr-neat-clip">
          <rect className="cr-clip-neat" x="0" y="0" width="0" height="520" />
        </clipPath>
        <clipPath id="cr-shag-clip">
          <rect className="cr-clip-shag" x="0" y="0" width="600" height="520" />
        </clipPath>
      </defs>
      <rect width="600" height="520" fill="#e2eed8" />
      <ellipse cx="300" cy="170" rx="250" ry="90" fill="#ecf5e3" />
      <path d="M0 410 C100 398 200 412 300 404 S500 410 600 402 V520 H0Z" fill="#b6d4a2" />

      <g clipPath="url(#cr-shag-clip)">
        <g className="cr-shaggy">
          {twigs.map((t, i) => (
            <g key={i}>
              <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#4aa35c" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx={t.x2} cy={t.y2} r="7" fill="#79c46a" />
            </g>
          ))}
          {blobs.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} />
          ))}
        </g>
      </g>

      <g clipPath="url(#cr-neat-clip)">
        <g className="cr-neat">
          <circle cx="300" cy="340" r="62" fill="#3f9a4a" />
          <circle cx="300" cy="262" r="45" fill="#4aa35c" />
          <circle cx="300" cy="205" r="29" fill="#5db35a" />
          <path d="M262 318 A62 62 0 0 1 300 280" fill="none" stroke="#79c46a" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <path d="M274 246 A45 45 0 0 1 300 220" fill="none" stroke="#9bd88a" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        </g>
      </g>

      <path d="M246 392 H354 L342 438 H258Z" fill="#c9714a" />
      <rect x="240" y="384" width="120" height="14" rx="6" fill="#d9855c" />

      {WEEDS.map((x, i) => (
        <g className="cr-weed" key={x} data-x={x} style={{ '--i': i }}>
          <path d={`M${x} 430 q-14 -18 -22 -34 M${x} 430 q4 -22 2 -42 M${x} 430 q14 -16 24 -30`} fill="none" stroke="#6aa84f" strokeWidth="4" strokeLinecap="round" />
          <circle cx={x + 2} cy="386" r="6" fill="#ff8fbf" />
          <circle cx={x - 22} cy="394" r="4.5" fill="#6aa84f" />
          <circle cx={x + 24} cy="400" r="4.5" fill="#6aa84f" />
        </g>
      ))}

      {Array.from({ length: 16 }, (_, i) => (
        <path className="cr-leaf" key={i} d="M0 0 C6 -6 14 -6 16 0 C10 6 4 6 0 0Z" fill={GREENS[i % 4]} />
      ))}

      <g className="cr-shears">
        <g className="cr-blade-a">
          <path d="M-6 -2 L58 -8 L58 -3 L-6 4Z" fill="#dfe6ec" stroke="#8796a1" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M-6 0 L-34 -16" stroke="#8796a1" strokeWidth="5" strokeLinecap="round" />
          <circle cx="-42" cy="-20" r="10" fill="none" stroke="#e8426b" strokeWidth="5" />
        </g>
        <g className="cr-blade-b">
          <path d="M-6 2 L58 8 L58 3 L-6 -4Z" fill="#c4ced6" stroke="#8796a1" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M-6 0 L-34 16" stroke="#8796a1" strokeWidth="5" strokeLinecap="round" />
          <circle cx="-42" cy="20" r="10" fill="none" stroke="#e8426b" strokeWidth="5" />
        </g>
        <circle cx="-2" cy="0" r="4" fill="#5b6b78" />
      </g>

      {[
        [232, 210],
        [372, 250],
        [284, 150],
        [350, 330],
      ].map(([x, y], i) => (
        <path className="cr-sparkle" key={i} d={`M${x} ${y - 14} Q${x} ${y} ${x + 14} ${y} Q${x} ${y} ${x} ${y + 14} Q${x} ${y} ${x - 14} ${y} Q${x} ${y} ${x} ${y - 14}Z`} fill="#fff7c2" stroke="#ffd93b" strokeWidth="1.5" />
      ))}
    </svg>
  )
}
