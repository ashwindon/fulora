import { petalPath, seeded } from './botany.js'

// Top-down drawings, each centred on (0, 0) inside a box of about 96 x 96.

const SHADOW = 'rgba(25,55,25,0.22)'

function Shadow({ rx = 34, ry = 28, dx = 6, dy = 8 }) {
  return <ellipse cx={dx} cy={dy} rx={rx} ry={ry} fill={SHADOW} />
}

function Bloom({ x = 0, y = 0, n = 8, len = 11, w = 4.5, c1, c2 = c1, core, cr = 4, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={petalPath(0, 0, (360 / n) * i, len, w)} fill={i % 2 ? c2 : c1} />
      ))}
      <circle r={cr} fill={core} />
    </g>
  )
}

function Rosette({ r = 36, c1 = '#3f9a4a', c2 = '#5db35a', n = 8 }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={petalPath(0, 0, (360 / n) * i + 10, r, r * 0.3)} fill={i % 2 ? c1 : c2} />
      ))}
    </>
  )
}

const ART = {
  daisy: () => (
    <>
      <Shadow rx={34} ry={26} />
      <Rosette r={38} />
      {[
        [-16, -10],
        [14, -16],
        [2, 12],
        [-24, 16],
        [26, 10],
      ].map(([x, y], i) => (
        <Bloom key={i} x={x} y={y} n={9} len={12} w={4.4} c1="#ffffff" c2="#f4f1e6" core="#ffc21a" cr={4.4} />
      ))}
    </>
  ),

  rose: () => (
    <>
      <Shadow rx={38} ry={32} />
      <circle r="35" fill="#2f7d3e" />
      {[
        [-16, -10],
        [14, -14],
        [-4, 16],
        [22, 12],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="17" fill="#3f9a4a" />
      ))}
      {[
        [-14, -12],
        [13, -16],
        [0, 4],
        [-22, 12],
        [22, 12],
        [4, -2],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="9" fill="#b5122e" />
          <circle r="6.6" fill={i % 2 ? '#f0476a' : '#e8264f'} />
          <circle cx="1" cy="-1" r="3.6" fill="#b5122e" />
          <circle cx="1" cy="-1" r="1.6" fill="#f0476a" />
        </g>
      ))}
    </>
  ),

  lavender: () => (
    <>
      <Shadow rx={38} ry={28} />
      <ellipse rx="40" ry="31" fill="#5aa968" />
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 5
        const r = Math.floor(i / 5)
        return (
          <g key={i} transform={`translate(${-28 + c * 14} ${-21 + r * 14})`}>
            <ellipse rx="4.4" ry="6.2" fill={i % 2 ? '#8e6bd1' : '#a78bea'} />
            <ellipse cy="-5" rx="3" ry="4" fill="#c6b3f5" />
          </g>
        )
      })}
    </>
  ),

  sunflower: () => (
    <>
      <Shadow rx={38} ry={30} />
      <Rosette r={40} c1="#2f7d3e" c2="#3f9a4a" n={7} />
      {[
        [-17, -12, 1],
        [17, -8, 0.88],
        [-1, 17, 1.05],
      ].map(([x, y, k], i) => (
        <Bloom key={i} x={x} y={y} k={k} n={14} len={19} w={6.5} c1="#ffc21a" c2="#ffd84a" core="#5a2e12" cr={9} />
      ))}
    </>
  ),

  tulips: () => (
    <>
      <Shadow rx={38} ry={24} />
      <ellipse rx="40" ry="26" fill="#5aa968" />
      {Array.from({ length: 8 }, (_, i) => {
        const c = i % 4
        const r = Math.floor(i / 4)
        const col = ['#ff5a3d', '#ffd23f', '#e8426b', '#ffb627'][(i + r) % 4]
        return (
          <g key={i} transform={`translate(${-27 + c * 18} ${-11 + r * 22})`}>
            <path d="M-7 4 C-8 -4 -4 -10 0 -12 C4 -10 8 -4 7 4 C3 8 -3 8 -7 4Z" fill={col} />
            <path d="M0 4 C-2 -2 -1 -7 0 -10 C1 -7 2 -2 0 4Z" fill="#fff" opacity="0.4" />
          </g>
        )
      })}
    </>
  ),

  fern: () => {
    const lines = Array.from({ length: 10 }, (_, i) => (360 / 10) * i)
    return (
      <>
        <Shadow rx={36} ry={30} />
        {lines.map((a, i) => (
          <g key={i}>
            <path d={petalPath(0, 0, a, 44, 8)} fill={i % 2 ? '#2f7d3e' : '#3f9a4a'} />
            <path d={petalPath(0, 0, a, 40, 0.4)} fill="none" stroke="#9bd88a" strokeWidth="1.2" opacity="0.7" />
          </g>
        ))}
        <circle r="5" fill="#79c46a" />
      </>
    )
  },

  oak: () => (
    <>
      <Shadow rx={62} ry={54} dx={12} dy={14} />
      <circle r="58" fill="#2a6f38" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 36} cy={Math.sin(a) * 36} r="26" fill={i % 2 ? '#2f7d3e' : '#3a8f48'} />
      })}
      {[
        [-12, -8, 26],
        [16, 6, 24],
        [-6, 22, 20],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#4aa35c" />
      ))}
      <circle cx="-14" cy="-18" r="14" fill="#79c46a" opacity="0.85" />
      <circle cx="4" cy="2" r="4.5" fill="#6f4a26" />
    </>
  ),

  blossom: () => {
    const rnd = seeded(12)
    return (
      <>
        <Shadow rx={48} ry={42} dx={10} dy={12} />
        <circle r="46" fill="#f58cbc" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          return <circle key={i} cx={Math.cos(a) * 26} cy={Math.sin(a) * 26} r="22" fill={i % 2 ? '#ffb3d1' : '#ff9ec7'} />
        })}
        <circle cx="-4" cy="-4" r="20" fill="#ffc7de" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={(rnd() - 0.5) * 80} cy={(rnd() - 0.5) * 80} r={2 + rnd() * 2} fill="#fff" opacity="0.85" />
        ))}
        <circle r="3.4" fill="#8a5a34" />
      </>
    )
  },

  shrub: () => (
    <>
      <Shadow rx={32} ry={28} />
      <circle r="32" fill="#3f9a4a" />
      <circle cx="-6" cy="-6" r="23" fill="#4aa35c" />
      <path d="M-24 -6 A26 26 0 0 1 -4 -24" fill="none" stroke="#9bd88a" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {[
        [10, 10],
        [-12, 14],
        [14, -10],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.8" fill="#79c46a" opacity="0.7" />
      ))}
    </>
  ),

  hedge: () => (
    <>
      <rect x="-46" y="-12" width="96" height="36" rx="18" fill={SHADOW} />
      <rect x="-48" y="-20" width="96" height="38" rx="19" fill="#2f7d3e" />
      {[-34, -17, 0, 17, 34].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="-4" r="14" fill={i % 2 ? '#3f9a4a' : '#4aa35c'} />
          <circle cx={x - 4} cy="-8" r="5" fill="#79c46a" opacity="0.6" />
        </g>
      ))}
    </>
  ),

  pond: () => (
    <>
      <path d="M-40 4 C-44 -24 -12 -40 14 -36 C42 -32 50 -6 36 16 C20 40 -36 34 -40 4Z" fill={SHADOW} transform="translate(6 8)" />
      <path d="M-40 0 C-44 -26 -12 -40 14 -36 C42 -32 50 -6 36 14 C20 36 -36 30 -40 0Z" fill="#5bbcf0" stroke="#9aa7ad" strokeWidth="8" strokeDasharray="10 3" strokeLinejoin="round" />
      <path d="M-30 -2 C-32 -20 -8 -30 12 -27 C32 -24 38 -6 28 8 C16 26 -28 22 -30 -2Z" fill="#7fd0f6" />
      <ellipse cx="-12" cy="-6" rx="11" ry="7" fill="#4aa35c" />
      <ellipse cx="14" cy="6" rx="10" ry="6.5" fill="#5db35a" />
      <circle cx="-12" cy="-8" r="4.4" fill="#ff9ec7" />
      <circle cx="14" cy="4" r="3.8" fill="#ffc2dc" />
      <ellipse cx="2" cy="-18" rx="7" ry="3" fill="#ff7a3d" />
      <path d="M-5 -18 L-11 -21 L-11 -15Z" fill="#ff9a63" />
    </>
  ),

  stones: () => (
    <>
      {[
        [-26, -14, 17, 12],
        [0, 2, 18, 13],
        [27, 17, 16, 11],
      ].map(([x, y, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={x + 4} cy={y + 5} rx={rx} ry={ry} fill={SHADOW} />
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#d0ccc4" stroke="#aaa598" strokeWidth="2" />
          <ellipse cx={x - 4} cy={y - 3} rx={rx * 0.5} ry={ry * 0.4} fill="#e6e2da" />
        </g>
      ))}
    </>
  ),

  bench: () => (
    <>
      <rect x="-44" y="-8" width="92" height="30" rx="5" fill={SHADOW} />
      <rect x="-46" y="-16" width="92" height="30" rx="5" fill="#b5814a" stroke="#6f4a26" strokeWidth="2" />
      {[-6, 4].map((y) => (
        <line key={y} x1="-44" y1={y} x2="44" y2={y} stroke="#8f6232" strokeWidth="2" />
      ))}
      <rect x="-46" y="-16" width="8" height="30" rx="3" fill="#8f6232" />
      <rect x="38" y="-16" width="8" height="30" rx="3" fill="#8f6232" />
      <rect x="-42" y="-24" width="84" height="8" rx="3" fill="#9a6a3c" stroke="#6f4a26" strokeWidth="1.5" />
    </>
  ),

  lantern: () => (
    <>
      <circle cx="3" cy="4" r="11" fill={SHADOW} />
      <circle r="11" fill="#8d949b" stroke="#5b646b" strokeWidth="2" />
      <circle r="6" fill="#ffd86b" />
      <circle r="3" fill="#fff6c8" />
    </>
  ),

  birdbath: () => (
    <>
      <circle cx="4" cy="6" r="28" fill={SHADOW} />
      <circle r="28" fill="#c8cdd1" stroke="#9aa2a8" strokeWidth="3" />
      <circle r="20" fill="#7fd0f6" />
      <circle cx="-6" cy="-6" r="6" fill="#bfe8fb" opacity="0.8" />
      <ellipse cx="6" cy="2" rx="6" ry="4" fill="#e8426b" />
      <circle cx="12" cy="0" r="3" fill="#e8426b" />
      <path d="M15 -1 L19 0 L15 1Z" fill="#ffb627" />
    </>
  ),

  vegbed: () => (
    <>
      <rect x="-44" y="-26" width="92" height="62" rx="5" fill={SHADOW} />
      <rect x="-48" y="-32" width="96" height="62" rx="5" fill="#b5814a" stroke="#6f4a26" strokeWidth="2.5" />
      <rect x="-42" y="-26" width="84" height="50" fill="#6e4425" />
      {Array.from({ length: 12 }, (_, i) => {
        const c = i % 4
        const r = Math.floor(i / 4)
        const tom = (i + r) % 3 === 0
        return (
          <g key={i} transform={`translate(${-30 + c * 20} ${-16 + r * 16})`}>
            <circle r={tom ? 6.5 : 7.5} fill={tom ? '#3f9a4a' : i % 2 ? '#79c46a' : '#5db35a'} />
            {tom && <circle cx="2" cy="-1" r="3" fill="#e53b3b" />}
          </g>
        )
      })}
    </>
  ),

  table: () => (
    <>
      <circle cx="8" cy="10" r="44" fill={SHADOW} />
      {[
        [-50, 0],
        [50, 0],
        [0, -50],
        [0, 50],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 8} y={y - 8} width="16" height="16" rx="6" fill="#5b646b" opacity="0.9" />
      ))}
      <circle r="42" fill="#fff" />
      {Array.from({ length: 8 }, (_, i) => {
        const a1 = (i / 8) * Math.PI * 2
        const a2 = ((i + 1) / 8) * Math.PI * 2
        return <path key={i} d={`M0 0 L${Math.cos(a1) * 42} ${Math.sin(a1) * 42} A42 42 0 0 1 ${Math.cos(a2) * 42} ${Math.sin(a2) * 42}Z`} fill={i % 2 ? '#fff' : '#e8426b'} />
      })}
      <circle r="4" fill="#a82a4b" />
    </>
  ),
}

export function ItemArt({ id }) {
  const Art = ART[id]
  return <Art />
}
