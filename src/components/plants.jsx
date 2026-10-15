import { petalPath, leafPath } from './botany.js'

// Every plant is drawn in a 200 x 320 box with its roots at (100, 300).
// Parts the animation cares about:
//   .p-grow   the stem (and grass), scaled up from the soil
//   .p-leaf   leaves that unfurl (data-ax / data-ay is where they attach)
//   .p-bloom  the flower head that rides on top of the stem
//   .p-petal  individual petals that open (data-ox / data-oy is their pivot)

function Leaf({ x, y, angle, len, w, fill, rest = 0 }) {
  const { body, rib } = leafPath(x, y, angle, len, w)
  return (
    <g className="p-leaf" data-ax={x} data-ay={y} data-rest={rest}>
      <path d={body} fill={fill} />
      <path d={rib} fill="none" stroke="#1f5a2b" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
    </g>
  )
}

const Stem = ({ d, w = 5, color = '#3f9a4a' }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
)

function radial(cx, cy, n, len, w, colors, start = -90) {
  return Array.from({ length: n }, (_, i) => (
    <path
      className="p-petal"
      key={i}
      d={petalPath(cx, cy, start + (360 / n) * i, len, w)}
      fill={colors[i % colors.length]}
      data-ox={cx}
      data-oy={cy}
    />
  ))
}

function Lavender() {
  const florets = []
  for (let i = 0; i < 10; i++) {
    const y = 150 - i * 8
    const r = 6.2 - i * 0.3
    florets.push(
      <circle key={`l${i}`} cx={95} cy={y} r={r} fill={i % 2 ? '#8e6bd1' : '#a78bea'} />,
      <circle key={`r${i}`} cx={105} cy={y - 4} r={r} fill={i % 2 ? '#a78bea' : '#7a55c8'} />,
    )
  }
  return (
    <>
      <g className="p-grow">
        <Stem d="M100 300 C98 250 104 200 100 150" w={5} color="#4f9a5a" />
      </g>
      <Leaf x={100} y={278} angle={-142} len={84} w={11} fill="#5aa968" />
      <Leaf x={100} y={262} angle={-38} len={74} w={10} fill="#4f9a5a" />
      <g className="p-bloom">
        {florets}
        <circle cx="100" cy="66" r="3.4" fill="#c6b3f5" />
      </g>
    </>
  )
}

function Tulip() {
  return (
    <>
      <g className="p-grow">
        <Stem d="M100 300 C96 262 104 222 100 175" w={6} color="#3f9a4a" />
      </g>
      <Leaf x={100} y={288} angle={-116} len={118} w={17} fill="#4f9a5a" />
      <Leaf x={100} y={284} angle={-64} len={112} w={16} fill="#5db35a" />
      <g className="p-bloom">
        <path className="p-petal" d="M100 176 C74 172 70 142 92 120 C92 148 98 164 100 176Z" fill="#ff8f6a" data-ox="100" data-oy="176" />
        <path className="p-petal" d="M100 176 C126 172 130 142 108 120 C108 148 102 164 100 176Z" fill="#ff8f6a" data-ox="100" data-oy="176" />
        <path className="p-petal" d="M100 178 C80 172 78 138 100 112 C122 138 120 172 100 178Z" fill="#ff5a3d" data-ox="100" data-oy="178" />
        <path d="M100 160 C96 146 98 132 100 124" fill="none" stroke="#ffb09a" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      </g>
    </>
  )
}

function Lawn() {
  const blades = [
    [66, 78, -14],
    [74, 104, -8],
    [82, 88, 6],
    [90, 112, -4],
    [98, 96, 10],
    [106, 118, 4],
    [114, 90, -10],
    [124, 106, 12],
    [134, 80, 16],
    [142, 96, 8],
  ]
  return (
    <>
      <g className="p-grow">
        {blades.map(([x, h, lean], i) => (
          <path
            key={i}
            d={`M${x - 5} 300 Q${x + lean * 0.3} ${300 - h * 0.6} ${x + lean} ${300 - h} Q${x + 5 + lean * 0.3} ${300 - h * 0.55} ${x + 5} 300Z`}
            fill={['#2f7d3e', '#3f9a4a', '#5db35a', '#79c46a'][i % 4]}
          />
        ))}
        <Stem d="M118 300 C118 270 121 246 118 225" w={4} color="#3f9a4a" />
      </g>
      <g className="p-bloom">
        {radial(118, 212, 10, 22, 6.5, ['#ffffff', '#fff3f3'])}
        <circle cx="118" cy="212" r="7" fill="#ffc21a" />
      </g>
    </>
  )
}

function Cosmos() {
  return (
    <>
      <g className="p-grow">
        <Stem d="M100 300 C106 252 94 206 100 160" w={5} color="#3f9a4a" />
      </g>
      <Leaf x={100} y={256} angle={-158} len={60} w={11} fill="#5db35a" />
      <Leaf x={100} y={232} angle={-22} len={58} w={11} fill="#4f9a5a" />
      <Leaf x={100} y={204} angle={-150} len={44} w={9} fill="#5db35a" />
      <g className="p-bloom">
        {radial(100, 140, 8, 40, 19, ['#d946a8', '#ec6cc0'])}
        <circle cx="100" cy="140" r="9" fill="#ffc93c" />
        <circle cx="100" cy="140" r="4" fill="#f59e0b" />
      </g>
    </>
  )
}

function Aloe() {
  const leaves = [
    [-90, 98, 15],
    [-62, 90, 14],
    [-118, 90, 14],
    [-36, 74, 13],
    [-144, 74, 13],
    [-12, 56, 11],
    [-168, 56, 11],
  ]
  return (
    <>
      <g className="p-grow">
        <Stem d="M100 296 C100 252 110 206 104 160" w={4} color="#2f8f66" />
      </g>
      {leaves.map(([a, l, w], i) => (
        <Leaf key={i} x={100} y={296} angle={a} len={l} w={w} fill={i % 2 ? '#3fae84' : '#2f9a73'} rest={0.5} />
      ))}
      <g className="p-bloom">
        {[
          [104, 150],
          [95, 164],
          [114, 168],
          [102, 180],
          [111, 188],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="6.5" ry="10" fill="#ff7a59" />
            <ellipse cx={x} cy={y + 7} rx="4" ry="4" fill="#ffd166" />
          </g>
        ))}
      </g>
    </>
  )
}

const ART = { design: Lavender, planting: Tulip, lawn: Lawn, seasonal: Cosmos, care: Aloe }

export function PlantArt({ id }) {
  const Art = ART[id]
  return (
    <svg className="plant-svg" viewBox="0 0 200 320" aria-hidden="true">
      <Art />
    </svg>
  )
}
