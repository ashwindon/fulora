const rad = (deg) => (deg * Math.PI) / 180

// Rotate a local (u along the shape, v across it) point around an origin.
const place = (ox, oy, angle, u, v) => {
  const a = rad(angle)
  const x = ox + u * Math.cos(a) - v * Math.sin(a)
  const y = oy + u * Math.sin(a) + v * Math.cos(a)
  return `${x.toFixed(1)} ${y.toFixed(1)}`
}

// A petal that starts at (cx, cy) and points outward at `angle` degrees.
export function petalPath(cx, cy, angle, length, width) {
  const p = (u, v) => place(cx, cy, angle, u, v)
  return (
    `M${p(0, 0)} ` +
    `C${p(length * 0.15, -width)} ${p(length * 0.85, -width * 0.9)} ${p(length, 0)} ` +
    `C${p(length * 0.85, width * 0.9)} ${p(length * 0.15, width)} ${p(0, 0)}Z`
  )
}

// A leaf that grows from (x, y) in the direction of `angle`.
export function leafPath(x, y, angle, length, width) {
  const p = (u, v) => place(x, y, angle, u, v)
  return {
    body:
      `M${p(0, 0)} ` +
      `C${p(length * 0.2, -width)} ${p(length * 0.7, -width * 1.1)} ${p(length, 0)} ` +
      `C${p(length * 0.7, width * 0.55)} ${p(length * 0.25, width * 0.7)} ${p(0, 0)}Z`,
    rib: `M${p(0, 0)} Q${p(length * 0.5, -width * 0.1)} ${p(length * 0.92, 0)}`,
  }
}

// Small deterministic random so the garden looks the same every visit.
export function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function grassBlades(count = 170) {
  const rand = seeded(42)
  const blades = []
  for (let i = 0; i < count; i++) {
    const x = (i / count) * 1440 + rand() * 14
    const h = 28 + rand() * 62
    const lean = (rand() - 0.5) * 30
    const w = 4 + rand() * 4
    blades.push({
      d:
        `M${(x - w).toFixed(1)} 120 ` +
        `Q${(x + lean * 0.3).toFixed(1)} ${(120 - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(120 - h).toFixed(1)} ` +
        `Q${(x + w + lean * 0.3).toFixed(1)} ${(120 - h * 0.55).toFixed(1)} ${(x + w).toFixed(1)} 120Z`,
      tier: Math.floor(rand() * 4),
      delay: (rand() * -4).toFixed(2),
      dur: (3 + rand() * 2.5).toFixed(2),
    })
  }
  return blades
}

export const GRASS_FLOWERS = [
  { x: 120, h: 62, color: '#ffffff', eye: '#ffb627' },
  { x: 330, h: 48, color: '#f2799f', eye: '#ffb627' },
  { x: 560, h: 70, color: '#8e6bd1', eye: '#ffe08a' },
  { x: 880, h: 54, color: '#ff8f3d', eye: '#7a2e0e' },
  { x: 1120, h: 66, color: '#ffffff', eye: '#ffb627' },
  { x: 1320, h: 50, color: '#f2799f', eye: '#ffe08a' },
]
