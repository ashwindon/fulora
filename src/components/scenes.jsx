import { petalPath, leafPath, seeded } from './botany.js'
import './waterScene.css'

const hand = { fontFamily: "'Caveat','Segoe Print',cursive", fontWeight: 700 }

/* ------------------------------------------------------------------ */
/* 1. Design: a blueprint that turns into a real, lived-in garden      */
/* ------------------------------------------------------------------ */

const DZ_MAIN = 'M150 440 C160 395 215 372 262 340 C312 306 332 280 360 245'
const DZ_BRANCH = 'M200 372 C180 320 172 270 168 212'
const DZ_POND = 'M336 190 C330 150 380 126 424 134 C476 142 490 190 464 220 C436 252 352 244 336 190Z'
const DZ_BEDA = 'M360 380 C350 330 400 306 460 314 C510 322 522 362 500 400 C470 430 380 428 360 380Z'
const DZ_POSTS = (() => {
  const p = []
  for (let x = 70; x <= 530; x += 46) p.push([x, 80], [x, 440])
  for (let y = 126; y < 440; y += 46) p.push([70, y], [530, y])
  return p
})()
const DZ_COLORS = ['#ff6f9c', '#ffd23f', '#ffffff', '#ff8f3d', '#ec3f86', '#c9a8ff']
const DZ_LABELS = [
  { t: 'Seating nook', x: 92, y: 228, w: 112 },
  { t: 'Pond and lotus', x: 372, y: 264, w: 128 },
  { t: 'Cutting flowers', x: 384, y: 450, w: 138 },
  { t: 'Veg patch', x: 244, y: 450, w: 96 },
]

export function DesignScene() {
  const rnd = seeded(3)
  const flowers = Array.from({ length: 30 }, (_, i) => {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd())
    return { x: 436 + Math.cos(a) * 66 * r, y: 366 + Math.sin(a) * 36 * r, c: DZ_COLORS[i % 6], r: 5 + rnd() * 3 }
  })
  const lav = Array.from({ length: 18 }, (_, i) => ({ x: 94 + (i % 3) * 18 + rnd() * 4, y: 268 + Math.floor(i / 3) * 21 + rnd() * 4 }))
  const veg = Array.from({ length: 10 }, (_, i) => ({ x: 258 + (i % 5) * 16, y: 404 + Math.floor(i / 5) * 16, tom: i % 3 === 0 }))
  const hedge = Array.from({ length: 13 }, (_, i) => 250 + i * 18)
  const line = { fill: 'none', stroke: '#cfe6ff', strokeWidth: 2.2, strokeLinecap: 'round' }
  const shadow = 'rgba(30,60,30,0.2)'
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <pattern id="dz-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="#fff" strokeOpacity="0.12" />
        </pattern>
        <clipPath id="dz-reveal">
          <circle className="dz-clip" cx="300" cy="260" r="0" />
        </clipPath>
        <clipPath id="dz-plot">
          <rect x="70" y="80" width="460" height="360" rx="24" />
        </clipPath>
      </defs>
      <rect width="600" height="520" fill="#1d4e89" />
      <rect width="600" height="520" fill="url(#dz-grid)" />

      <g>
        <rect className="dz-line" x="70" y="80" width="460" height="360" rx="24" {...line} />
        <rect className="dz-line" x="92" y="100" width="140" height="112" rx="10" {...line} />
        <circle className="dz-line" cx="150" cy="156" r="20" {...line} />
        <path className="dz-line" d={DZ_POND} {...line} />
        <path className="dz-line" d={DZ_BEDA} {...line} />
        <ellipse className="dz-line" cx="112" cy="326" rx="36" ry="70" {...line} />
        <rect className="dz-line" x="240" y="392" width="110" height="38" rx="4" {...line} />
        <circle className="dz-line" cx="498" cy="118" r="32" {...line} />
        <circle className="dz-line" cx="285" cy="168" r="28" {...line} />
        <path className="dz-line" d="M250 96H468" {...line} />
        <path className="dz-line" d={DZ_MAIN} {...line} />
        <path className="dz-line" d={DZ_BRANCH} {...line} />
        <path className="dz-line" d="M70 466H530M70 458V474M530 458V474" {...line} strokeWidth="1.6" />
        <path className="dz-line" d="M562 80V440M554 80H570M554 440H570" {...line} strokeWidth="1.6" />
        <text className="dz-dim" x="278" y="494" fill="#cfe6ff" fontSize="22" style={hand}>
          12 m
        </text>
        <text className="dz-dim" x="572" y="266" fill="#cfe6ff" fontSize="22" style={hand}>
          9 m
        </text>
      </g>

      <g clipPath="url(#dz-reveal)">
        <rect width="600" height="520" fill="#e2f1d2" />
        <rect x="70" y="80" width="460" height="360" rx="24" fill="#8fd18f" />
        <g clipPath="url(#dz-plot)">
          {Array.from({ length: 10 }, (_, k) => (
            <rect key={k} x={70 + k * 46} y="80" width="23" height="360" fill="#9de29e" opacity="0.7" />
          ))}
        </g>
        <rect x="70" y="80" width="460" height="360" rx="24" fill="none" stroke="#8a6238" strokeWidth="7" />
        {DZ_POSTS.map(([x, y], i) => (
          <rect key={i} x={x - 4} y={y - 6} width="8" height="12" rx="2" fill="#6f4a26" />
        ))}

        <path d={DZ_MAIN} fill="none" stroke="#cdb98b" strokeWidth="34" strokeLinecap="round" />
        <path d={DZ_BRANCH} fill="none" stroke="#cdb98b" strokeWidth="30" strokeLinecap="round" />
        <path d={DZ_MAIN} fill="none" stroke="#ecdcb4" strokeWidth="27" strokeLinecap="round" />
        <path d={DZ_BRANCH} fill="none" stroke="#ecdcb4" strokeWidth="23" strokeLinecap="round" />
        <path d={DZ_MAIN} fill="none" stroke="#d3be8c" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 11" />
        <rect x="132" y="430" width="36" height="14" rx="3" fill="#b5814a" stroke="#6f4a26" strokeWidth="2" />

        <rect x="92" y="100" width="140" height="112" rx="10" fill="#dccfbb" stroke="#bfae93" strokeWidth="2" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${92 + k * 35} 100V212`} stroke="#c4b6a0" strokeWidth="1.5" />
        ))}
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M92 ${100 + k * 37}H232`} stroke="#c4b6a0" strokeWidth="1.5" />
        ))}

        <ellipse cx="410" cy="196" rx="86" ry="62" fill={shadow} transform="translate(5 7)" />
        <path d={DZ_POND} fill="#5bbcf0" stroke="#9aa7ad" strokeWidth="9" strokeDasharray="11 4" strokeLinejoin="round" />
        <path d="M352 190 C350 160 388 142 424 148 C464 154 474 190 454 210 C432 232 366 228 352 190Z" fill="#7fd0f6" />
        <ellipse className="dz-ripple" cx="408" cy="188" rx="10" ry="6" fill="none" stroke="#fff" strokeWidth="2" opacity="0" />

        <path d={DZ_BEDA} fill="#7b4f2c" stroke="#5c3a1d" strokeWidth="3" />
        <ellipse cx="112" cy="326" rx="36" ry="70" fill="#7b4f2c" stroke="#5c3a1d" strokeWidth="3" />
        <rect x="240" y="392" width="110" height="38" rx="4" fill="#b5814a" stroke="#6f4a26" strokeWidth="3" />
        <rect x="246" y="398" width="98" height="26" fill="#6e4425" />

        {hedge.map((x, i) => (
          <circle className="dz-hedge" key={i} cx={x} cy="96" r="13" fill={i % 2 ? '#2f7d3e' : '#3f9a4a'} />
        ))}

        <g className="dz-furn">
          <circle cx="156" cy="162" r="22" fill={shadow} />
          <circle cx="150" cy="156" r="20" fill="#9a6a3c" stroke="#6f4a26" strokeWidth="2" />
          <circle cx="150" cy="156" r="6" fill="#fff6df" />
        </g>
        {[
          [150, 124],
          [118, 176],
          [184, 176],
        ].map(([x, y], i) => (
          <rect className="dz-furn" key={i} x={x - 10} y={y - 10} width="20" height="20" rx="7" fill="#e8426b" stroke="#a82a4b" strokeWidth="2" />
        ))}
        {[
          [106, 114],
          [218, 114],
          [218, 198],
        ].map(([x, y], i) => (
          <g className="dz-furn" key={i}>
            <circle cx={x} cy={y} r="10" fill="#c9714a" />
            <circle cx={x} cy={y} r="6.5" fill="#4aa35c" />
          </g>
        ))}

        {lav.map((l, i) => (
          <circle className="dz-lav" key={i} cx={l.x + 8} cy={l.y} r="5" fill={i % 2 ? '#8e6bd1' : '#a78bea'} />
        ))}
        {veg.map((v, i) => (
          <circle className="dz-veg" key={i} cx={v.x} cy={v.y} r={v.tom ? 5 : 7} fill={v.tom ? '#e53b3b' : i % 2 ? '#79c46a' : '#5db35a'} />
        ))}
        {flowers.map((f, i) => (
          <circle className="dz-flower" key={i} cx={f.x} cy={f.y} r={f.r} fill={f.c} />
        ))}

        <g className="dz-tree">
          <ellipse cx="288" cy="190" rx="34" ry="30" fill={shadow} />
          <circle cx="285" cy="168" r="28" fill="#3f9a4a" />
          <circle cx="278" cy="160" r="16" fill="#5db35a" />
          <circle cx="294" cy="176" r="10" fill="#79c46a" />
        </g>
        <g className="dz-tree">
          <ellipse cx="506" cy="136" rx="38" ry="34" fill={shadow} />
          <circle cx="498" cy="118" r="32" fill="#2f7d3e" />
          <circle cx="488" cy="108" r="19" fill="#4aa35c" />
          <circle cx="506" cy="126" r="11" fill="#5db35a" />
        </g>

        <g className="dz-lily">
          <ellipse cx="380" cy="186" rx="14" ry="9" fill="#4aa35c" />
          <ellipse cx="438" cy="204" rx="12" ry="8" fill="#5db35a" />
          <ellipse cx="420" cy="166" rx="11" ry="7" fill="#4aa35c" />
          <circle cx="380" cy="184" r="5" fill="#ff9ec7" />
          <circle cx="438" cy="202" r="4.5" fill="#ffc2dc" />
        </g>
        <g className="dz-koi">
          <ellipse cx="400" cy="206" rx="9" ry="4" fill="#ff7a3d" />
          <path d="M391 206 L384 202 L384 210Z" fill="#ff9a63" />
        </g>
        <g className="dz-koi">
          <ellipse cx="448" cy="178" rx="8" ry="3.6" fill="#fff" />
          <path d="M456 178 L463 174 L463 182Z" fill="#ffd2b8" />
        </g>

        {DZ_LABELS.map((l, i) => (
          <g className="dz-label" key={i}>
            <rect x={l.x} y={l.y - 18} width={l.w} height="26" rx="13" fill="#fffbe8" stroke="#cdb98b" strokeWidth="2" />
            <circle cx={l.x + 12} cy={l.y - 5} r="4" fill="#e8426b" />
            <text x={l.x + 22} y={l.y + 1} fontSize="18" fill="#4a3320" style={hand}>
              {l.t}
            </text>
          </g>
        ))}
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
/* 5. Water and stone: a moonlit zen garden that wakes up piece by piece */
/* ------------------------------------------------------------------ */

const LOTUS = [
  { x: 270, y: 452, s: 1.05 },
  { x: 322, y: 488, s: 0.9 },
  { x: 214, y: 480, s: 0.85 },
  { x: 380, y: 466, s: 0.95 },
  { x: 452, y: 492, s: 0.8 },
]

const CLIFF_ROCKS = [
  [20, 384, 44], [78, 394, 40], [40, 330, 42], [100, 342, 36], [16, 278, 40], [82, 288, 36],
  [38, 232, 38], [94, 240, 32], [14, 190, 36], [68, 188, 32], [26, 150, 30], [96, 168, 24],
  [224, 390, 40], [252, 372, 34], [216, 336, 34], [248, 322, 30], [224, 290, 30], [252, 276, 26],
  [214, 238, 28], [238, 226, 24], [206, 198, 24], [192, 182, 20],
]
const ISLAND_ROCKS = [
  [356, 394, 36], [402, 398, 34], [448, 400, 36], [494, 396, 34], [534, 392, 30],
  [378, 368, 28], [428, 372, 30], [478, 372, 28], [520, 368, 26],
]
const ROCK_TONES = ['#33606f', '#3b6e82', '#2c5565', '#42798f', '#376477']
const PINES = [[250, 288, 1], [290, 300, 0.8], [330, 292, 0.9], [150, 296, 0.7], [520, 286, 1], [560, 296, 0.8]]
const REEDS = [[16, 440], [34, 452], [50, 444], [566, 470], [584, 456], [548, 478]]

function rockPath(cx, cy, rad, rnd) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + (rnd() - 0.5) * 0.4
    const rr = rad * (0.78 + rnd() * 0.3)
    return `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.82).toFixed(1)}`
  })
  return `M${pts.join('L')}Z`
}

function Rock({ x, y, r, rnd, cls }) {
  const fill = ROCK_TONES[Math.floor(rnd() * ROCK_TONES.length)]
  return (
    <g className={cls}>
      <path d={rockPath(x, y, r, rnd)} fill={fill} stroke={fill} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx={x - r * 0.25} cy={y - r * 0.32} rx={r * 0.46} ry={r * 0.22} fill="#8fc1d6" opacity="0.3" transform={`rotate(-18 ${x} ${y})`} />
      <ellipse cx={x + r * 0.28} cy={y + r * 0.34} rx={r * 0.55} ry={r * 0.2} fill="#04121b" opacity="0.28" />
    </g>
  )
}

function Koi({ i }) {
  const body = ['#ff7a3d', '#f6f1e6', '#ff9a63'][i]
  const spot = ['#fff', '#ff6a2f', '#2b2b2b'][i]
  return (
    <g className="wt-koi">
      <path d="M-20 0 L-34 -9 Q-29 0 -34 9Z" fill={body} opacity="0.85" />
      <path d="M-20 0 C-12 -9 9 -9 18 0 C9 9 -12 9 -20 0Z" fill={body} />
      <ellipse cx="2" cy="-8" rx="7" ry="3" fill={body} opacity="0.7" transform="rotate(-24 2 -8)" />
      <ellipse cx="2" cy="8" rx="7" ry="3" fill={body} opacity="0.7" transform="rotate(24 2 8)" />
      <circle cx="-4" cy="-1.5" r="3.4" fill={spot} opacity="0.9" />
      <circle cx="6" cy="2" r="2.4" fill={spot} opacity="0.9" />
      <circle cx="13" cy="-2" r="1.5" fill="#102030" />
    </g>
  )
}

export function WaterScene() {
  const rnd = seeded(31)
  const stars = Array.from({ length: 46 }, () => ({ x: rnd() * 600, y: rnd() * 200, r: 0.6 + rnd() * 1.5, d: (rnd() * 4).toFixed(2) }))
  const cliff = CLIFF_ROCKS.map(([x, y, r]) => ({ x, y, r, rnd: seeded(Math.floor(x * 7 + y * 3)) }))
  const island = ISLAND_ROCKS.map(([x, y, r]) => ({ x, y, r, rnd: seeded(Math.floor(x * 5 + y * 11)) }))
  const drops = Array.from({ length: 16 }, (_, i) => ({
    dx: (i % 2 ? 1 : -1) * (10 + rnd() * 46),
    h: 18 + rnd() * 34,
    dur: (1.3 + rnd() * 1.1).toFixed(2),
    del: (rnd() * -3).toFixed(2),
    r: (1.6 + rnd() * 1.6).toFixed(1),
  }))
  const petals = Array.from({ length: 18 }, () => ({ x: rnd() * 600, dur: (11 + rnd() * 9).toFixed(1), del: (rnd() * -18).toFixed(1), sway: (rnd() * 1.6 + 2.4).toFixed(1), s: (0.8 + rnd() * 0.8).toFixed(2) }))
  const flies = Array.from({ length: 20 }, () => ({ x: 20 + rnd() * 560, y: 220 + rnd() * 250, d: (rnd() * -7).toFixed(2), t: (5 + rnd() * 5).toFixed(1) }))
  const lotus = (l) => ({ ...l, petals: Array.from({ length: 8 }, (_, i) => petalPath(l.x, l.y, -165 + i * 21.4, 27 * l.s, 9 * l.s)), inner: Array.from({ length: 6 }, (_, i) => petalPath(l.x, l.y - 2, -152 + i * 24.8, 17 * l.s, 6.4 * l.s)) })

  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <linearGradient id="wt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030818" />
          <stop offset="0.5" stopColor="#0a2540" />
          <stop offset="1" stopColor="#1b5a6c" />
        </linearGradient>
        <linearGradient id="wt-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a6377" />
          <stop offset="0.35" stopColor="#0f4558" />
          <stop offset="1" stopColor="#04141d" />
        </linearGradient>
        <linearGradient id="wt-fall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4fdff" />
          <stop offset="1" stopColor="#8fd0e4" />
        </linearGradient>
        <linearGradient id="wt-aur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3de0b6" stopOpacity="0" />
          <stop offset="0.55" stopColor="#3de0b6" stopOpacity="0.42" />
          <stop offset="1" stopColor="#6a7cff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="wt-glow">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffd27a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wt-glowh">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#ffd27a" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wt-glowp">
          <stop offset="0" stopColor="#ff9ec7" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff9ec7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wt-glowm">
          <stop offset="0" stopColor="#fff2c4" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wt-vig" cx="0.5" cy="0.5" r="0.72">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
        <path id="wt-koi-a" d="M430 462 A130 24 0 1 1 170 462 A130 24 0 1 1 430 462" fill="none" />
        <path id="wt-koi-b" d="M520 478 A96 18 0 1 0 328 478 A96 18 0 1 0 520 478" fill="none" />
      </defs>

      <g className="wt-world">
        <rect width="600" height="340" fill="url(#wt-sky)" />

        <g className="wt-far">
          <path d="M-30 330 L30 262 L86 292 L146 226 L212 282 L276 244 L342 296 L420 226 L500 284 L562 244 L640 304 V340 H-30Z" fill="#0f3347" />
          <path d="M146 226 L212 282 M276 244 L342 296 M420 226 L500 284" stroke="#7fb8cf" strokeWidth="1.4" opacity="0.4" fill="none" />
        </g>

        <g className="wt-pagoda" fill="#06141f" transform="translate(-122 20)">
          <rect x="402" y="210" width="36" height="16" />
          <path d="M392 212 Q420 199 448 212 L441 216 H399Z" />
          <rect x="408" y="196" width="24" height="13" />
          <path d="M401 198 Q420 188 439 198 L434 201 H406Z" />
          <rect x="413" y="184" width="14" height="11" />
          <path d="M406 186 Q420 177 434 186 L430 189 H410Z" />
          <path d="M420 178 V162" stroke="#06141f" strokeWidth="2" />
          <circle cx="420" cy="170" r="2.2" />
          <g fill="#ffd27a" className="wt-wins">
            {[
              [408, 214, 6, 9], [426, 214, 6, 9], [412, 199, 5, 8], [423, 199, 5, 8], [417, 187, 6, 6],
            ].map(([x, y, w, h], i) => (
              <rect className="wt-win" key={i} x={x} y={y} width={w} height={h} rx="1" />
            ))}
          </g>
        </g>

        <g className="wt-mist">
          <ellipse className="wt-mist-a" cx="200" cy="296" rx="150" ry="14" fill="#cfeaf2" opacity="0.1" />
          <ellipse className="wt-mist-b" cx="430" cy="306" rx="170" ry="12" fill="#cfeaf2" opacity="0.09" />
          <ellipse className="wt-mist-c" cx="330" cy="278" rx="120" ry="9" fill="#cfeaf2" opacity="0.08" />
        </g>

        <g className="wt-mid">
          <path d="M-30 340 C40 300 110 318 190 300 S330 296 420 308 S560 296 640 312 V404 H-30Z" fill="#0a2433" />
          {PINES.map(([x, y, s], i) => (
            <path key={i} className="wt-pine" d={`M${x} ${y - 34 * s} l${-9 * s} ${18 * s} h${18 * s}z M${x} ${y - 22 * s} l${-12 * s} ${20 * s} h${24 * s}z M${x} ${y - 8 * s} l${-15 * s} ${22 * s} h${30 * s}z`} fill="#071d28" />
          ))}
        </g>

        <path d="M92 170 H214 V400 H88Z" fill="#0b2230" />
        <g className="wt-cliff">
          {cliff.map((k, i) => (
            <Rock key={i} x={k.x} y={k.y} r={k.r} rnd={k.rnd} cls="wt-rock" />
          ))}
          <g className="wt-rock wt-ledge">
            <ellipse cx="158" cy="180" rx="26" ry="5" fill="#2a4e60" />
            <ellipse cx="156" cy="265" rx="54" ry="7" fill="#27495a" />
          </g>
          <g className="wt-bonsai">
            <path d="M58 150 C56 136 62 128 70 120" fill="none" stroke="#10242c" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="62" cy="112" rx="28" ry="12" fill="#0d3a36" />
            <ellipse cx="86" cy="124" rx="18" ry="8" fill="#0f423c" />
            <ellipse cx="42" cy="126" rx="16" ry="7" fill="#0d3a36" />
            <ellipse cx="56" cy="108" rx="14" ry="5" fill="#2a8a72" opacity="0.5" />
          </g>
        </g>

        <g className="wt-falls">
          <g className="wt-fall1">
            <path d="M143 178 C142 214 138 240 135 264 L181 264 C178 240 175 214 173 178Z" fill="url(#wt-fall)" opacity="0.8" />
            <path d="M152 180 C151 214 149 240 148 264 L168 264 C167 240 165 214 164 180Z" fill="#fff" opacity="0.28" />
            {[148, 158, 168].map((x, i) => (
              <path className="wt-flow fast" key={x} d={`M${x} 178 C${x - 1} 210 ${x - 2} 240 ${x - 2} 264`} style={{ animationDelay: `${i * -0.35}s` }} />
            ))}
          </g>
          <g className="wt-fall2">
            <path d="M112 262 L202 262 C206 304 214 352 224 396 L92 396 C102 352 108 304 112 262Z" fill="url(#wt-fall)" opacity="0.78" />
            <path d="M132 264 C130 310 128 352 126 396 L186 396 C184 352 182 310 180 264Z" fill="#fff" opacity="0.22" />
            {[122, 134, 146, 158, 170, 182].map((x, i) => (
              <path className={`wt-flow${i % 2 ? '' : ' fast'}`} key={x} d={`M${x} 264 C${x - 2} 310 ${x - 3} 355 ${x - 4} 396`} style={{ animationDelay: `${i * -0.42}s` }} />
            ))}
          </g>
          <g className="wt-lips" fill="#fff">
            <path d="M140 178 Q158 186 176 178" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" opacity="0.85" />
            <path d="M118 263 Q158 273 198 263" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" opacity="0.85" />
            <circle cx="146" cy="182" r="3" opacity="0.7" />
            <circle cx="170" cy="183" r="2.4" opacity="0.7" />
            <circle cx="126" cy="268" r="3.2" opacity="0.7" />
            <circle cx="190" cy="268" r="3.2" opacity="0.7" />
          </g>
        </g>

        <path d="M0 394 C80 388 160 400 240 394 S420 388 520 396 S580 392 600 394 V520 H0Z" fill="url(#wt-water)" />
        <path d="M0 402 C100 398 200 408 300 402 S500 398 600 404" fill="none" stroke="#7fd0e0" strokeWidth="1.4" opacity="0.25" />

        <g className="wt-refl" fill="#fff6d6">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect className="wt-refl-bar" key={i} x={470 - (30 - i * 2.4)} y={406 + i * 11} width={(30 - i * 2.4) * 2} height="3.2" rx="1.6" style={{ animationDelay: `${i * -0.35}s` }} />
          ))}
        </g>

        <g className="wt-spray">
          <g className="wt-foam" fill="#eaf9ff">
            <ellipse cx="156" cy="398" rx="46" ry="8" opacity="0.7" />
            <ellipse cx="136" cy="402" rx="22" ry="5" opacity="0.6" />
            <ellipse cx="180" cy="403" rx="20" ry="4.5" opacity="0.55" />
          </g>
          <g fill="none" stroke="#e9fbff" strokeWidth="1.6">
            {[0, 1, 2].map((i) => (
              <ellipse className="wt-ripple" key={i} cx="156" cy="404" rx="34" ry="7" style={{ animationDelay: `${i * -1.1}s` }} />
            ))}
          </g>
          <g fill="#f4fdff">
            {drops.map((d, i) => (
              <circle className="wt-drop" key={i} cx="156" cy="396" r={d.r} style={{ '--dx': `${d.dx}px`, '--h': `${d.h}px`, animationDuration: `${d.dur}s`, animationDelay: `${d.del}s` }} />
            ))}
          </g>
          <g fill="#d8f4ff">
            <ellipse className="wt-plume wt-plume-a" cx="156" cy="388" rx="40" ry="16" />
            <ellipse className="wt-plume wt-plume-b" cx="140" cy="384" rx="30" ry="12" />
            <ellipse className="wt-plume wt-plume-c" cx="176" cy="386" rx="28" ry="11" />
          </g>
        </g>

        <g className="wt-island">
          <path d="M330 400 C330 362 352 342 384 340 L504 340 C536 344 556 366 556 400Z" fill="#1d4252" />
          {island.map((k, i) => (
            <Rock key={i} x={k.x} y={k.y} r={k.r} rnd={k.rnd} cls="wt-rock wt-isl-rock" />
          ))}
          <ellipse className="wt-slab" cx="445" cy="341" rx="100" ry="14" fill="#34647a" stroke="#4f8aa3" strokeWidth="2" />
          {[352, 380, 512, 540].map((x, i) => (
            <path key={x} className="wt-moss" d={`M${x} 346 l3 -9 l3 9 M${x + 8} 346 l2 -7 l3 7`} fill="none" stroke="#2f8a64" strokeWidth="2" strokeLinecap="round" opacity={0.7 - i * 0.05} />
          ))}
        </g>

        <g className="wt-buddha" transform="translate(445 340)">
          <g className="wt-bud-in">
            <g className="wt-pedestal">
              <ellipse cx="0" cy="4" rx="72" ry="13" fill="#4a6f7d" />
              {[-60, -44, -28, -12, 12, 28, 44, 60].map((x, i) => (
                <ellipse key={x} cx={x} cy={3 + Math.abs(x) * 0.04} rx="9" ry="6.5" fill={i % 2 ? '#7f9cac' : '#93b0be'} />
              ))}
            </g>
            <ellipse cx="0" cy="-2" rx="64" ry="11" fill="#6a8896" />
            <path d="M-60 -2 C-60 -24 -30 -36 0 -36 C30 -36 60 -24 60 -2 C40 8 -40 8 -60 -2Z" fill="#8c9fa9" />
            <path d="M8 -36 C34 -34 60 -24 60 -2 C46 6 22 8 8 8Z" fill="#0b2230" opacity="0.25" />
            <path d="M-46 -8 C-30 -18 -10 -20 6 -18 M10 -22 C28 -20 42 -14 52 -8" fill="none" stroke="#7a8e99" strokeWidth="2" strokeLinecap="round" />
            <path d="M-30 -32 C-36 -74 -26 -108 0 -116 C26 -108 36 -74 30 -32Z" fill="#9aadb7" />
            <path d="M6 -114 C28 -106 38 -74 30 -32 L8 -32Z" fill="#0b2230" opacity="0.26" />
            <path d="M-14 -96 C-10 -70 -8 -52 -10 -34 M8 -100 C12 -76 14 -54 12 -34 M0 -112 V-40" fill="none" stroke="#8ea2ad" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
            <path d="M-30 -98 C-50 -74 -48 -46 -22 -34 L0 -36 L22 -34 C48 -46 50 -74 30 -98 C26 -72 20 -54 0 -50 C-20 -54 -26 -72 -30 -98Z" fill="#a3b4bc" />
            <ellipse cx="0" cy="-40" rx="17" ry="8" fill="#bccbd2" />
            <path d="M-10 -42 q10 6 20 0" fill="none" stroke="#8ea2ad" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="0" cy="-134" r="21" fill="#aab9c0" />
            <path d="M8 -154 C26 -148 28 -122 14 -114 C20 -128 18 -142 8 -154Z" fill="#0b2230" opacity="0.2" />
            <path d="M-20 -140 C-22 -166 22 -166 20 -140 C10 -150 -10 -150 -20 -140Z" fill="#8c9fa9" />
            {[-14, -7, 0, 7, 14].map((x) => (
              <circle key={x} cx={x} cy={-150 + Math.abs(x) * 0.25} r="3.2" fill="#7b8f9a" />
            ))}
            <circle cx="0" cy="-163" r="6.5" fill="#bccad0" />
            <ellipse cx="-22" cy="-128" rx="4" ry="10" fill="#a9b9c0" />
            <ellipse cx="22" cy="-128" rx="4" ry="10" fill="#a9b9c0" />
            <path d="M-12 -135 q4 3 8 0 M4 -135 q4 3 8 0" fill="none" stroke="#56707c" strokeWidth="2" strokeLinecap="round" />
            <path d="M-4 -128 l-1 5 h4 M-5 -118 q5 4 10 0" fill="none" stroke="#6f8590" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="0" cy="-142" r="1.6" fill="#56707c" />
            <ellipse cx="6" cy="-148" rx="9" ry="5" fill="#e8f4f7" opacity="0.4" />
            <path d="M24 -100 C36 -80 32 -60 14 -44" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
          </g>
          <g className="wt-halo">
            <circle cx="0" cy="-136" r="48" fill="none" stroke="#ffe9a8" strokeWidth="2.2" opacity="0.85" />
            <circle className="wt-halo-ring" cx="0" cy="-136" r="38" fill="none" stroke="#ffe9a8" strokeWidth="1.4" opacity="0.6" />
            <g className="wt-rays" stroke="#ffe9a8" strokeWidth="2" strokeLinecap="round" opacity="0.75">
              {Array.from({ length: 20 }, (_, i) => (
                <line key={i} x1="0" y1={-194 - (i % 2) * 6} x2="0" y2="-176" transform={`rotate(${i * 18} 0 -136)`} />
              ))}
            </g>
          </g>
        </g>

        <g className="wt-candles">
          {[
            [398, 346],
            [494, 346],
          ].map(([x, y], i) => (
            <g className="wt-candle" key={i} data-x={x} data-y={y}>
              <rect x={x - 3} y={y - 12} width="6" height="12" rx="1.5" fill="#f4e8d0" />
              <path className="wt-smoke" d={`M${x} ${y - 20} c-6 -8 6 -14 0 -22 c-6 -8 6 -14 0 -22`} fill="none" stroke="#dfeaf0" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: `${i * -1.6}s` }} />
              <g className="wt-flame" data-x={x} data-y={y - 12}>
                <path className="wt-flame-in" d={`M${x} ${y - 24} C${x - 5} ${y - 18} ${x - 3} ${y - 13} ${x} ${y - 12} C${x + 3} ${y - 13} ${x + 5} ${y - 18} ${x} ${y - 24}Z`} fill="#ffd27a" />
              </g>
            </g>
          ))}
        </g>

        {[
          [66, 414],
          [556, 440],
        ].map(([x, y], i) => (
          <g className="wt-lant" key={i}>
            <ellipse cx={x} cy={y + 2} rx="16" ry="4" fill="#06141f" opacity="0.6" />
            <rect x={x - 11} y={y - 4} width="22" height="6" rx="1.5" fill="#6b838f" />
            <rect x={x - 4} y={y - 26} width="8" height="22" fill="#7d96a2" />
            <rect x={x - 14} y={y - 46} width="28" height="20" rx="2" fill="#5d7683" />
            <rect x={x - 9} y={y - 42} width="18" height="12" rx="1.5" fill="#ffd27a" className="wt-lant-lit" />
            <path d={`M${x - 20} ${y - 46} L${x} ${y - 62} L${x + 20} ${y - 46}Z`} fill="#4c6572" />
            <circle cx={x} cy={y - 65} r="3.4" fill="#8aa2ad" />
          </g>
        ))}

        <g className="wt-steps">
          {[
            [238, 494],
            [270, 470],
            [306, 450],
            [344, 432],
            [378, 416],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse className="wt-step-ring" cx={x} cy={y + 2} rx="26" ry="8" fill="none" stroke="#bfe8f2" strokeWidth="1.6" />
              <g className="wt-step">
                <ellipse cx={x + 3} cy={y + 5} rx="22" ry="8" fill="#03121b" opacity="0.5" />
                <ellipse cx={x} cy={y} rx="22" ry="8" fill="#5f7a89" />
                <ellipse cx={x - 3} cy={y - 2} rx="14" ry="4" fill="#8fb0c1" opacity="0.55" />
              </g>
            </g>
          ))}
        </g>

        {LOTUS.map(lotus).map((l, i) => (
          <g className="wt-lotus" key={i} data-x={l.x} data-y={l.y} style={{ animationDelay: `${i * -0.9}s` }}>
            <ellipse className="wt-pad" cx={l.x} cy={l.y + 7} rx={32 * l.s} ry={10 * l.s} fill="#20694f" />
            <ellipse cx={l.x - 8 * l.s} cy={l.y + 6} rx={10 * l.s} ry={3 * l.s} fill="#2f8f6a" opacity="0.7" />
            {l.petals.map((d, k) => (
              <path className="wt-bp" key={`o${k}`} d={d} fill={k % 2 ? '#ff8fbf' : '#ffb3d1'} stroke="#ffd6e7" strokeWidth="1" />
            ))}
            {l.inner.map((d, k) => (
              <path className="wt-bp" key={`i${k}`} d={d} fill={k % 2 ? '#ffd0e2' : '#fff0f6'} />
            ))}
            <circle className="wt-bp" cx={l.x} cy={l.y - 4} r={4.4 * l.s} fill="#ffe170" />
          </g>
        ))}

        <g className="wt-koi-g">
          <Koi i={0} />
          <Koi i={1} />
          <Koi i={2} />
        </g>

        <g className="wt-bamboo">
          {[540, 558, 576, 594].map((x, i) => (
            <g key={x} style={{ animationDelay: `${i * 0.7}s` }}>
              <rect x={x - 4} y={96 + i * 22} width="8" height={310 - i * 22} rx="4" fill="#2f6b4a" />
              <rect x={x - 4} y={96 + i * 22} width="3" height={310 - i * 22} rx="1.5" fill="#4f9a6e" opacity="0.45" />
              {[160, 220, 280, 340].map((y) => (
                <rect key={y} x={x - 5} y={y + i * 10} width="10" height="4" rx="2" fill="#1d4f36" />
              ))}
              <path d={`M${x} ${130 + i * 22} q-36 -10 -52 14 q32 6 52 -14Z`} fill="#3d8a5c" />
              <path d={`M${x} ${180 + i * 18} q32 -12 50 10 q-30 8 -50 -10Z`} fill="#3d8a5c" />
              <path d={`M${x} ${236 + i * 12} q-30 -8 -44 12 q28 6 44 -12Z`} fill="#357a52" />
            </g>
          ))}
        </g>

        <g className="wt-reeds" stroke="#0e3a3a" strokeWidth="3" strokeLinecap="round">
          {REEDS.map(([x, y], i) => (
            <g className="wt-reed" key={i} style={{ animationDelay: `${i * -0.8}s` }}>
              <path d={`M${x} ${y + 14} Q${x - 2} ${y} ${x + 2} ${y - 24}`} fill="none" />
              <ellipse cx={x + 2} cy={y - 28} rx="3.4" ry="9" fill="#4a2f1c" stroke="none" />
            </g>
          ))}
        </g>

        <rect className="wt-dark" width="600" height="520" fill="#020812" opacity="0.82" pointerEvents="none" />

        <g className="wt-sky-things">
          <g className="wt-aurora">
            <path className="wt-aur-a" d="M-30 70 C60 20 150 100 250 56 S420 14 520 66 S640 40 640 40 V0 H-30Z" fill="url(#wt-aur)" />
            <path className="wt-aur-b" d="M-30 96 C70 56 170 120 270 84 S440 50 560 92 V20 C440 10 300 50 160 26 S20 40 -30 30Z" fill="url(#wt-aur)" opacity="0.7" />
          </g>
          <g className="wt-stars" fill="#fff">
            {stars.map((s, i) => (
              <circle className="wt-star" key={i} cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: `${s.d}s` }} />
            ))}
          </g>
          <g className="wt-shoot">
            <path d="M0 0 L-70 26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
            <circle r="2.6" fill="#fff" />
          </g>
          <g className="wt-moon">
            <circle cx="470" cy="96" r="120" fill="url(#wt-glowm)" opacity="0.5" />
            <circle className="wt-moon-ring" cx="470" cy="96" r="58" fill="none" stroke="#fff2c4" strokeWidth="1.4" opacity="0.4" />
            <circle cx="470" cy="96" r="35" fill="#fff6d6" />
            <circle cx="459" cy="88" r="7" fill="#f0e2b4" />
            <circle cx="482" cy="106" r="5" fill="#f0e2b4" />
            <circle cx="476" cy="80" r="3.4" fill="#f0e2b4" />
          </g>
        </g>

        <g className="wt-glows" pointerEvents="none">
          <circle className="wt-win-glow" cx="298" cy="230" r="54" fill="url(#wt-glow)" />
          <circle className="wt-halo-glow" cx="445" cy="204" r="112" fill="url(#wt-glowh)" />
          {[
            [66, 372],
            [556, 398],
          ].map(([x, y], i) => (
            <circle className="wt-lant-glow" key={i} cx={x} cy={y} r="84" fill="url(#wt-glow)" />
          ))}
          {[
            [398, 332],
            [494, 332],
          ].map(([x, y], i) => (
            <circle className="wt-candle-glow" key={i} cx={x} cy={y} r="38" fill="url(#wt-glow)" />
          ))}
          {LOTUS.map((l, i) => (
            <circle className="wt-lotus-glow" key={i} cx={l.x} cy={l.y - 6} r={48 * l.s} fill="url(#wt-glowp)" />
          ))}
        </g>

        <g className="wt-flies">
          {flies.map((f, i) => (
            <g className="wt-fly" key={i}>
              <circle className="wt-fly-in" cx={f.x} cy={f.y} r="2.4" fill="#fff3a8" style={{ animationDelay: `${f.d}s`, animationDuration: `${f.t}s` }} />
              <circle className="wt-fly-in" cx={f.x} cy={f.y} r="8" fill="url(#wt-glow)" style={{ animationDelay: `${f.d}s`, animationDuration: `${f.t}s` }} />
            </g>
          ))}
        </g>

        <g className="wt-petals">
          {petals.map((p, i) => (
            <g className="wt-pf" key={i} style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.del}s`, '--x0': `${p.x}px` }}>
              <g transform={`scale(${p.s})`}>
                <path className="wt-pi" d="M0 0 C4 -6 10 -5 11 1 C8 7 2 8 0 0Z" fill="#ffb8d4" style={{ animationDuration: `${p.sway}s` }} />
              </g>
            </g>
          ))}
        </g>
      </g>

      <rect width="600" height="520" fill="url(#wt-vig)" pointerEvents="none" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Garden care: big shears trim a shaggy hedge row into one line    */
/* ------------------------------------------------------------------ */

const GREENS = ['#3f9a4a', '#4aa35c', '#5db35a', '#2f7d3e']
const ROW = [108, 204, 300, 396, 492]
const WEEDS = [210, 306, 402, 478, 542]

export function CareScene() {
  const rnd = seeded(77)
  const heights = [1.1, 0.82, 1.28, 0.95, 1.18]
  const shrubs = ROW.map((cx, k) => {
    const h = heights[k]
    const blobs = Array.from({ length: 22 }, () => {
      const y = 392 - 10 - rnd() * 150 * h
      return { x: cx + (rnd() - 0.5) * (116 + (392 - y) * 0.12), y, r: 17 + rnd() * 15, c: GREENS[Math.floor(rnd() * 4)] }
    }).sort((a, b) => a.y - b.y)
    const shoots = Array.from({ length: 4 }, () => {
      const x = cx + (rnd() - 0.5) * 96
      const y1 = 392 - (96 + rnd() * 44) * h
      return { x1: x, y1, x2: x + (rnd() - 0.5) * 26, y2: y1 - 26 - rnd() * 30 }
    })
    return { cx, h, blobs, shoots }
  })
  return (
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <linearGradient id="cr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6fb" />
          <stop offset="1" stopColor="#f4fbff" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#cr-sky)" />
      <circle cx="510" cy="64" r="26" fill="#ffe45c" />
      <g fill="#fff">
        <ellipse cx="120" cy="70" rx="46" ry="14" />
        <ellipse cx="148" cy="60" rx="30" ry="14" />
        <ellipse cx="330" cy="104" rx="40" ry="12" />
      </g>
      <path d="M0 250 C40 220 80 238 120 226 S210 214 250 232 S350 214 400 230 S520 216 600 236 V300 H0Z" fill="#a8d8b0" />

      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={i * 24} y="240" width="22" height="152" fill={i % 2 ? '#d6b184' : '#dcb98d'} />
      ))}
      <rect y="276" width="600" height="9" fill="#b88b5a" />
      <rect y="352" width="600" height="9" fill="#b88b5a" />

      <g className="cr-bird">
        <ellipse cx="556" cy="236" rx="11" ry="8" fill="#e8426b" />
        <circle cx="565" cy="230" r="6" fill="#e8426b" />
        <path d="M570 229 L578 231 L570 233Z" fill="#ffb627" />
        <path d="M546 238 L534 246 L548 242Z" fill="#a82a4b" />
        <circle cx="567" cy="228" r="1.6" fill="#222" />
      </g>

      <rect y="392" width="600" height="128" fill="#78c47a" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} y={392 + i * 22} width="600" height="11" fill="#86d088" opacity="0.7" />
      ))}
      <ellipse cx="300" cy="396" rx="286" ry="12" fill="rgba(20,50,20,0.25)" />

      <g className="cr-neat">
        {ROW.map((cx, k) => (
          <g className="cr-dome" key={cx} data-cx={cx}>
            <path d={`M${cx - 48} 392V312A48 48 0 0 1 ${cx + 48} 312V392Z`} fill={k % 2 ? '#4aa35c' : '#3f9a4a'} />
            <path d={`M${cx - 36} 322A38 38 0 0 1 ${cx - 10} 280`} fill="none" stroke="#9bd88a" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
            {[
              [-22, 350],
              [14, 336],
              [26, 366],
              [-30, 372],
              [2, 300],
            ].map(([dx, y], i) => (
              <circle key={i} cx={cx + dx} cy={y} r="3.4" fill="#79c46a" opacity="0.55" />
            ))}
          </g>
        ))}
      </g>

      <g className="cr-shaggy">
        {shrubs.map((s) => (
          <g className="cr-shrub" key={s.cx} data-cx={s.cx}>
            <ellipse className="cr-base" cx={s.cx} cy="352" rx="64" ry={44 * s.h} fill="#2f7d3e" />
            {s.shoots.map((t, i) => (
              <g className="cr-shoot" key={i}>
                <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#4aa35c" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx={t.x2} cy={t.y2} r="6.5" fill="#79c46a" />
              </g>
            ))}
            {s.blobs.map((b, i) => (
              <circle className="cr-blob" key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} />
            ))}
          </g>
        ))}
      </g>

      <g className="cr-barrow">
        <g className="cr-heap">
          <ellipse cx="62" cy="436" rx="34" ry="16" fill="#4aa35c" />
          <ellipse cx="82" cy="430" rx="26" ry="14" fill="#5db35a" />
          <ellipse cx="50" cy="428" rx="22" ry="12" fill="#3f9a4a" />
          <ellipse cx="70" cy="422" rx="18" ry="10" fill="#79c46a" />
        </g>
        <path d="M24 438 H104 L94 468 H36Z" fill="#c9714a" stroke="#8f4f2e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M104 440 L136 428 M36 452 L12 478" stroke="#8f4f2e" strokeWidth="5" strokeLinecap="round" />
        <circle cx="94" cy="478" r="13" fill="#3b3b3b" />
        <circle cx="94" cy="478" r="5" fill="#9aa5ae" />
      </g>

      {WEEDS.map((x, i) => (
        <g className="cr-weed" key={x} data-x={x} style={{ '--i': i }}>
          <path d={`M${x} 470 q-14 -18 -22 -34 M${x} 470 q4 -22 2 -42 M${x} 470 q14 -16 24 -30`} fill="none" stroke="#5f9f3f" strokeWidth="4" strokeLinecap="round" />
          <circle cx={x + 2} cy="426" r="6" fill="#ff8fbf" />
          <circle cx={x - 22} cy="434" r="4.5" fill="#5f9f3f" />
          <circle cx={x + 24} cy="440" r="4.5" fill="#5f9f3f" />
        </g>
      ))}

      {Array.from({ length: 26 }, (_, i) => (
        <path className="cr-leaf" key={i} d="M0 0 C8 -8 18 -8 21 0 C13 8 5 8 0 0Z" fill={GREENS[i % 4]} />
      ))}

      {[
        [150, 226],
        [250, 214],
        [352, 222],
        [452, 214],
        [528, 226],
      ].map(([x, y], i) => (
        <text className="cr-snip" key={i} x={x} y={y} fontSize="28" fill="#e8426b" style={hand}>
          snip!
        </text>
      ))}

      <g className="cr-shears">
        <ellipse cx="30" cy="62" rx="64" ry="9" fill="rgba(0,0,0,0.18)" />
        <g transform="scale(1.9)">
          <g className="cr-blade-a">
            <path d="M-6 -2 L58 -8 L58 -3 L-6 4Z" fill="#eef3f6" stroke="#6f7f8b" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M-6 0 L-34 -16" stroke="#6f7f8b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="-42" cy="-20" r="10" fill="none" stroke="#e8426b" strokeWidth="5" />
          </g>
          <g className="cr-blade-b">
            <path d="M-6 2 L58 8 L58 3 L-6 -4Z" fill="#cfd8de" stroke="#6f7f8b" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M-6 0 L-34 16" stroke="#6f7f8b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="-42" cy="20" r="10" fill="none" stroke="#e8426b" strokeWidth="5" />
          </g>
          <circle cx="-2" cy="0" r="4" fill="#4b5a66" />
        </g>
        <circle className="cr-glint" cx="106" cy="0" r="6" fill="#fff" />
      </g>

      {[
        [108, 244],
        [204, 276],
        [300, 244],
        [396, 276],
        [492, 244],
      ].map(([x, y], i) => (
        <path className="cr-sparkle" key={i} d={`M${x} ${y - 14} Q${x} ${y} ${x + 14} ${y} Q${x} ${y} ${x} ${y + 14} Q${x} ${y} ${x - 14} ${y} Q${x} ${y} ${x} ${y - 14}Z`} fill="#fff7c2" stroke="#ffd93b" strokeWidth="1.5" />
      ))}
    </svg>
  )
}
