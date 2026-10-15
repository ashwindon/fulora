import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

// Each builder turns one scene's SVG into a scrubbable timeline.
// Rules that keep scrubbing in both directions clean:
//   - start states are set once with gsap.set
//   - motion uses .to() tweens
//   - things that switch on/off use tl.set() so they rewind correctly

const Q = (root) => (s) => gsap.utils.toArray(s, root)

function drawSetup(els) {
  els.forEach((el) => {
    const len = el.getTotalLength()
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
  })
}

/* 1. Garden design: draw the plan, wash it into a garden, bring it to life */
function design(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const lines = q('.dz-line')
  drawSetup(lines)
  gsap.set(q('.dz-clip'), { attr: { r: 0 } })
  gsap.set(q('.dz-furn, .dz-lav, .dz-veg, .dz-hedge, .dz-flower, .dz-tree, .dz-lily, .dz-koi, .dz-label'), { scale: 0 })
  gsap.set(q('.dz-label'), { y: 10 })
  gsap.set(q('.dz-dim, .dz-ripple'), { opacity: 0 })
  const koi = q('.dz-koi')

  tl.to(lines, { strokeDashoffset: 0, duration: 0.1, ease: 'power1.inOut', stagger: 0.22 / Math.max(1, lines.length - 1) }, 0)
    .to(q('.dz-dim'), { opacity: 1, duration: 0.04 }, 0.28)
    .to(q('.dz-clip'), { attr: { r: 430 }, duration: 0.3, ease: 'power2.inOut' }, 0.36)
    .to(q('.dz-furn'), { scale: 1, duration: 0.07, ease: 'back.out(2)', stagger: 0.012 }, 0.62)
    .to(q('.dz-hedge'), { scale: 1, duration: 0.06, ease: 'back.out(2)', stagger: 0.006 }, 0.64)
    .to(q('.dz-lav'), { scale: 1, duration: 0.05, ease: 'back.out(2)', stagger: 0.004 }, 0.66)
    .to(q('.dz-veg'), { scale: 1, duration: 0.05, ease: 'back.out(2)', stagger: 0.008 }, 0.68)
    .to(q('.dz-flower'), { scale: 1, duration: 0.06, ease: 'back.out(2.5)', stagger: 0.004 }, 0.68)
    .to(q('.dz-tree'), { scale: 1, duration: 0.1, ease: 'back.out(1.8)', stagger: 0.05 }, 0.72)
    .to(q('.dz-lily'), { scale: 1, duration: 0.07, ease: 'back.out(2)' }, 0.8)
    .to(koi, { scale: 1, duration: 0.05, ease: 'back.out(2)', stagger: 0.03 }, 0.82)
    .to(koi[0], { x: 16, y: -8, duration: 0.14, ease: 'sine.inOut' }, 0.84)
    .to(koi[1], { x: -14, y: 10, duration: 0.14, ease: 'sine.inOut' }, 0.84)
    .set(q('.dz-ripple'), { opacity: 0.9 }, 0.82)
    .to(q('.dz-ripple'), { attr: { rx: 56, ry: 34 }, opacity: 0, duration: 0.16 }, 0.82)
    .to(q('.dz-label'), { scale: 1, y: 0, duration: 0.06, ease: 'back.out(2)', stagger: 0.03 }, 0.88)
  return tl
}

/* 2. Planting: trowel digs, seedling drops in, roots and flowers grow */
function planting(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const trowel = q('.pl-trowel')[0]
  gsap.set(trowel, { svgOrigin: '0 0', x: -90, y: 120, rotation: 25 })

  ;[0, 1, 2].forEach((j) => {
    const t0 = j * 0.3
    const plant = q(`.pl-plant-${j}`)[0]
    const x = +plant.dataset.x
    const top = +plant.dataset.top
    const hole = q(`.pl-hole-${j}`)
    const seedling = q(`.pl-seedling-${j}`)
    const mound = q(`.pl-mound-${j}`)
    const crumbGroup = q(`.pl-crumbs-${j}`)
    const crumbs = q(`.pl-crumbs-${j} .pl-crumb`)
    const roots = q(`.pl-roots-${j} .pl-root`)
    const drops = q(`.pl-drop-${j}`)
    const stem = plant.querySelector('.pl-stem')
    const flower = plant.querySelector('.pl-flower')
    const leaves = gsap.utils.toArray('.pl-leaf', plant)

    gsap.set(hole, { scale: 0 })
    gsap.set(seedling, { y: -170, opacity: 0 })
    gsap.set(mound, { svgOrigin: `${x} 258`, scaleY: 0 })
    gsap.set(crumbGroup, { opacity: 0 })
    gsap.set(drops, { opacity: 0 })
    gsap.set(stem, { svgOrigin: `${x} 258`, scaleY: 0 })
    gsap.set(flower, { y: 258 - top, scale: 0 })
    gsap.set(leaves, { scale: 0 })
    drawSetup(roots)

    tl.to(trowel, { x: x - 4, y: 196, rotation: 14, duration: 0.07, ease: 'power2.inOut' }, t0)
      .to(trowel, { y: 262, duration: 0.035, ease: 'power2.in' }, t0 + 0.07)
      .to(hole, { scale: 1, duration: 0.05, ease: 'power2.out' }, t0 + 0.08)
      .set(crumbGroup, { opacity: 1 }, t0 + 0.09)
      .to(crumbs, { x: (i) => (i % 2 ? 1 : -1) * (14 + i * 6), y: (i) => -24 - i * 7, opacity: 0, duration: 0.07, ease: 'power2.out' }, t0 + 0.09)
      .to(trowel, { y: 150, rotation: 28, duration: 0.04, ease: 'power2.out' }, t0 + 0.12)
      .to(seedling, { y: 0, opacity: 1, duration: 0.06, ease: 'power1.in' }, t0 + 0.13)
      .to(mound, { scaleY: 1, duration: 0.04, ease: 'back.out(2)' }, t0 + 0.19)
      .to(seedling, { opacity: 0, duration: 0.015 }, t0 + 0.21)
      .to(roots, { strokeDashoffset: 0, duration: 0.08, stagger: 0.01, ease: 'power1.out' }, t0 + 0.23)
      .to(stem, { scaleY: 1, duration: 0.08, ease: 'power2.out' }, t0 + 0.22)
      .to(flower, { y: 0, duration: 0.08, ease: 'power2.out' }, t0 + 0.22)
      .to(leaves, { scale: 1, duration: 0.05, ease: 'back.out(2)', stagger: 0.015 }, t0 + 0.26)
      .to(flower, { scale: 1, duration: 0.05, ease: 'back.out(2)' }, t0 + 0.28)
    drops.forEach((d, i) => {
      const at = t0 + 0.2 + i * 0.008
      tl.set(d, { opacity: 1 }, at).to(d, { y: 150, duration: 0.05, ease: 'power1.in' }, at).to(d, { opacity: 0, duration: 0.01 }, at + 0.045)
    })
  })
  tl.to(trowel, { x: 720, y: 110, rotation: 40, duration: 0.05, ease: 'power2.in' }, 0.93)
  return tl
}

/* 3. Lawn: serpentine mowing stripes, then sprinkler and rainbow */
function lawn(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const bands = q('.lw-band')
  const mower = q('.lw-mower')[0]
  const flecks = q('.lw-fleck')
  const top = 60
  const rowH = 66
  const x0 = 70
  const x1 = 530
  const rowDur = 0.1
  const step = 0.125

  gsap.set(mower, { svgOrigin: '0 0', x: -70, y: top + rowH / 2, scaleX: 1 })
  bands.forEach((b, k) => gsap.set(b, { svgOrigin: `${k % 2 ? 560 : 40} ${top + k * rowH}`, scaleX: 0 }))
  gsap.set(flecks, { opacity: 0 })
  gsap.set(q('.lw-spk'), { svgOrigin: '300 258', scale: 0 })
  gsap.set(q('.lw-jets'), { svgOrigin: '300 252', opacity: 0 })
  const arcs = q('.lw-arc')
  drawSetup(arcs)

  let fleck = 0
  bands.forEach((b, k) => {
    const t = k * step
    const dir = k % 2 ? -1 : 1
    const y = top + k * rowH + rowH / 2
    if (k > 0) tl.set(mower, { scaleX: dir }, t)
    if (k === 0) {
      tl.to(mower, { x: x1, duration: rowDur }, t)
      tl.to(b, { scaleX: 1, duration: rowDur * (460 / 600) }, t + rowDur * (140 / 600))
    } else {
      tl.to(mower, { x: dir > 0 ? x1 : x0, duration: rowDur }, t)
      tl.to(b, { scaleX: 1, duration: rowDur }, t)
    }
    if (k < bands.length - 1) tl.to(mower, { y: y + rowH, duration: step - rowDur, ease: 'power1.inOut' }, t + rowDur)
    for (let i = 0; i < 3 && fleck < flecks.length; i++, fleck++) {
      const f = 0.2 + i * 0.3
      const at = t + rowDur * f
      const px = dir > 0 ? x0 + 460 * f : x1 - 460 * f
      tl.set(flecks[fleck], { x: px, y, opacity: 1, rotation: 0 }, at).to(
        flecks[fleck],
        { x: px - dir * 22, y: y - 26 - i * 6, rotation: 140, opacity: 0, duration: 0.03, ease: 'power1.out' },
        at,
      )
    }
  })
  const last = (bands.length - 1) * step + rowDur
  tl.to(mower, { x: -90, duration: 0.035, ease: 'power1.in' }, last)
    .to(q('.lw-spk'), { scale: 1, duration: 0.03, ease: 'back.out(2)' }, 0.76)
    .to(q('.lw-jets'), { opacity: 1, duration: 0.03 }, 0.79)
    .to(q('.lw-jets'), { rotation: 900, duration: 0.21 }, 0.79)
    .to(arcs, { strokeDashoffset: 0, duration: 0.1, stagger: 0.012, ease: 'power1.out' }, 0.86)
  return tl
}

/* 4. Seasonal colour: sky and ground change as a marker walks the year */
function seasonal(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const bounds = [0.16, 0.41, 0.65, 0.9]

  gsap.set(q('.se-sky-1, .se-sky-2, .se-sky-3, .se-sky-4'), { opacity: 0 })
  gsap.set(q('.se-lbl'), { opacity: 0 })
  gsap.set(q('.se-lbl-0'), { opacity: 1 })
  gsap.set(q('.se-grass'), { fill: '#b4c9bd' })
  const sun = q('.se-sun')[0]
  gsap.set(sun, { fill: '#fdf3d0' })
  gsap.set(q('.se-marker'), { x: 0 })

  bounds.forEach((b, i) => {
    tl.to(q(`.se-sky-${i + 1}`), { opacity: 1, duration: 0.06 }, b - 0.03)
      .to(q(`.se-lbl-${i}`), { opacity: 0, duration: 0.03 }, b - 0.03)
      .to(q(`.se-lbl-${i + 1}`), { opacity: 1, duration: 0.03 }, b - 0.01)
  })
  tl.to(q('.se-grass'), { fill: '#66bb6a', duration: 0.08 }, 0.13)
    .to(q('.se-grass'), { fill: '#3f9a4a', duration: 0.08 }, 0.38)
    .to(q('.se-grass'), { fill: '#c4a640', duration: 0.08 }, 0.62)
    .to(q('.se-grass'), { fill: '#b4c9bd', duration: 0.08 }, 0.88)
    .to(sun, { fill: '#ffe45c', duration: 0.1 }, 0.3)
    .to(sun, { fill: '#ffb347', duration: 0.1 }, 0.6)
    .to(sun, { fill: '#fdf3d0', duration: 0.08 }, 0.88)
    .to(sun, { motionPath: { path: q('#se-arc')[0], align: q('#se-arc')[0], alignOrigin: [0.5, 0.5], start: 0, end: 1 }, duration: 0.9 }, 0.04)
    .to(q('.se-marker'), { x: 484, duration: 0.9 }, 0.04)

  const stems = q('.se-stem')
  const rises = q('.se-rise')
  const blooms = q('.se-bloom')
  stems.forEach((st, i) => {
    const x = +st.dataset.x
    const r = rises[i]
    const y = +r.dataset.y
    const h = +r.dataset.h
    gsap.set(st, { svgOrigin: `${x} 400`, scaleY: 0 })
    gsap.set(r, { x, y: y + h })
    gsap.set(blooms[i], { scale: 0 })
    const t = 0.04 + (0.9 * i) / 11 - 0.02
    tl.to(st, { scaleY: 1, duration: 0.06, ease: 'power2.out' }, t)
      .to(r, { y, duration: 0.06, ease: 'power2.out' }, t)
      .to(blooms[i], { scale: 1, duration: 0.05, ease: 'back.out(2)' }, t + 0.035)
  })
  return tl
}

/* 5. Water and stone: a moonlit garden that wakes up piece by piece */
function water(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })

  const world = q('.wt-world')[0]
  const rocks = q('.wt-cliff .wt-rock')
  const islandRocks = q('.wt-isl-rock')
  const candles = q('.wt-candle')
  const lotuses = q('.wt-lotus')
  const koi = q('.wt-koi')
  const flames = q('.wt-flame')
  const wins = q('.wt-win')
  const steps = q('.wt-step')
  const rings = q('.wt-step-ring')

  /* ---- starting state: a dark, empty night ---- */
  gsap.set(world, { svgOrigin: '300 330', scale: 1 })
  gsap.set(q('.wt-dark'), { opacity: 0.68 })
  gsap.set(q('.wt-stars, .wt-aurora'), { opacity: 0 })
  gsap.set(q('.wt-moon'), { y: 90, opacity: 0, scale: 0.85, svgOrigin: '470 96' })
  gsap.set(q('.wt-shoot'), { x: 120, y: 30, opacity: 0 })
  gsap.set(q('.wt-far, .wt-mid, .wt-pagoda, .wt-mist'), { opacity: 0 })
  gsap.set(rocks, { y: -90, opacity: 0, scale: 0.8 })
  gsap.set(islandRocks, { y: -70, opacity: 0, scale: 0.8 })
  gsap.set(q('.wt-slab'), { scaleX: 0, transformOrigin: '50% 50%' })
  gsap.set(q('.wt-bonsai, .wt-moss'), { opacity: 0 })
  gsap.set(q('.wt-fall1'), { svgOrigin: '158 176', scaleY: 0, scaleX: 0.3, opacity: 0 })
  gsap.set(q('.wt-fall2'), { svgOrigin: '156 262', scaleY: 0, scaleX: 0.3, opacity: 0 })
  gsap.set(q('.wt-lips, .wt-spray, .wt-refl'), { opacity: 0 })
  gsap.set(steps, { scale: 0, opacity: 0 })
  gsap.set(rings, { scale: 0.3, opacity: 0, transformOrigin: '50% 50%' })
  gsap.set(q('.wt-bud-in'), { y: 26, opacity: 0 })
  gsap.set(q('.wt-pedestal'), { scale: 0, svgOrigin: '0 4' })
  gsap.set(q('.wt-halo'), { scale: 0.2, opacity: 0, svgOrigin: '0 -136' })
  gsap.set(wins, { opacity: 0 })
  gsap.set(q('.wt-win-glow, .wt-halo-glow, .wt-lant-glow, .wt-candle-glow, .wt-lotus-glow'), { opacity: 0 })
  gsap.set(q('.wt-lant'), { y: 18, opacity: 0 })
  gsap.set(candles, { opacity: 0 })
  flames.forEach((f) => gsap.set(f, { scale: 0, svgOrigin: `${f.dataset.x} ${f.dataset.y}` }))
  lotuses.forEach((l) => {
    gsap.set(l.querySelector('.wt-pad'), { scale: 0 })
    gsap.set(l.querySelectorAll('.wt-bp'), { scale: 0, svgOrigin: `${l.dataset.x} ${l.dataset.y}` })
  })
  gsap.set(koi, { opacity: 0 })
  gsap.set(q('.wt-reeds, .wt-bamboo, .wt-petals'), { opacity: 0 })
  gsap.set(q('.wt-fly'), { opacity: 0 })

  /* ---- koi swim forever once they arrive; the scene can switch them off again ---- */
  const lanes = [q('#wt-koi-a')[0], q('#wt-koi-a')[0], q('#wt-koi-b')[0]]
  const swims = koi.map((k, i) =>
    gsap.to(k, {
      motionPath: { path: lanes[i], align: lanes[i], alignOrigin: [0.5, 0.5], autoRotate: true, start: i === 1 ? 0.5 : 0, end: (i === 1 ? 0.5 : 0) + 1 },
      duration: 26 + i * 6,
      ease: 'none',
      repeat: -1,
      paused: true,
    }),
  )
  tl.data = { stop: () => swims.forEach((s) => s.pause(0)) }

  /* ---- the story ---- */
  // 0 - 0.2: the sky wakes up
  tl.to(q('.wt-stars'), { opacity: 1, duration: 0.14 }, 0.02)
    .to(q('.wt-aurora'), { opacity: 1, duration: 0.2 }, 0.05)
    .to(q('.wt-moon'), { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.05)
    .to(q('.wt-far, .wt-mid'), { opacity: 1, duration: 0.14 }, 0.1)
    .to(q('.wt-mist'), { opacity: 1, duration: 0.14 }, 0.14)
    .to(q('.wt-shoot'), { x: 330, y: 120, opacity: 1, duration: 0.07, ease: 'power1.in' }, 0.22)
    .to(q('.wt-shoot'), { opacity: 0, duration: 0.03 }, 0.28)

  // 0.12 - 0.42: stones fall into place to build the cliff, then the island
  tl.to(rocks, { y: 0, opacity: 1, scale: 1, duration: 0.07, ease: 'bounce.out', stagger: 0.011 }, 0.14)
    .to(q('.wt-bonsai'), { opacity: 1, duration: 0.08 }, 0.36)
    .to(islandRocks, { y: 0, opacity: 1, scale: 1, duration: 0.07, ease: 'bounce.out', stagger: 0.012 }, 0.28)
    .to(q('.wt-slab'), { scaleX: 1, duration: 0.07, ease: 'power2.out' }, 0.4)
    .to(q('.wt-moss'), { opacity: 1, duration: 0.05 }, 0.44)

  // 0.38 - 0.55: the water starts to move: a trickle, then the top fall, then the big one
  tl.to(q('.wt-lips'), { opacity: 1, duration: 0.04 }, 0.4)
    .to(q('.wt-fall1'), { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.09, ease: 'power2.in' }, 0.4)
    .to(q('.wt-fall2'), { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.1, ease: 'power2.in' }, 0.48)
    .to(q('.wt-spray'), { opacity: 1, duration: 0.08 }, 0.55)
    .to(q('.wt-refl'), { opacity: 1, duration: 0.1 }, 0.5)
    .to(q('.wt-dark'), { opacity: 0.5, duration: 0.15 }, 0.4)

  // 0.5 - 0.62: stepping stones pop up across the pond, each with a ripple
  steps.forEach((s, i) => {
    const at = 0.52 + i * 0.022
    tl.to(s, { scale: 1, opacity: 1, duration: 0.04, ease: 'back.out(2.4)' }, at).fromTo(rings[i], { scale: 0.3, opacity: 0.9 }, { scale: 1.8, opacity: 0, duration: 0.07, ease: 'power1.out' }, at)
  })

  // 0.56 - 0.72: the statue appears and its halo opens
  tl.to(q('.wt-pedestal'), { scale: 1, duration: 0.06, ease: 'back.out(2.4)' }, 0.58)
    .to(q('.wt-bud-in'), { y: 0, opacity: 1, duration: 0.09, ease: 'power2.out' }, 0.6)
    .to(q('.wt-halo'), { scale: 1, opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.66)
    .to(q('.wt-halo-glow'), { opacity: 1, duration: 0.12 }, 0.66)

  // 0.62 - 0.8: lights come on one by one: pagoda windows, candles, lanterns
  tl.to(q('.wt-pagoda'), { opacity: 1, duration: 0.05 }, 0.6)
  wins.forEach((w, i) => tl.to(w, { opacity: 1, duration: 0.03 }, 0.66 + i * 0.03))
  tl.to(q('.wt-win-glow'), { opacity: 1, duration: 0.08 }, 0.7)
    .to(candles, { opacity: 1, duration: 0.04, stagger: 0.03 }, 0.7)
    .to(flames, { scale: 1, duration: 0.05, ease: 'back.out(3)', stagger: 0.03 }, 0.73)
    .to(q('.wt-candle-glow'), { opacity: 1, duration: 0.06, stagger: 0.03 }, 0.73)
    .to(q('.wt-lant'), { y: 0, opacity: 1, duration: 0.06, ease: 'power2.out', stagger: 0.05 }, 0.74)
    .to(q('.wt-lant-glow'), { opacity: 1, duration: 0.08, stagger: 0.05 }, 0.77)
    .to(q('.wt-dark'), { opacity: 0.3, duration: 0.14 }, 0.66)

  // 0.7 - 0.86: lotuses bloom, each lighting the water around it
  lotuses.forEach((l, i) => {
    const at = 0.72 + i * 0.026
    tl.to(l.querySelector('.wt-pad'), { scale: 1, duration: 0.04, ease: 'back.out(2)' }, at)
      .to(l.querySelectorAll('.wt-bp'), { scale: 1, duration: 0.07, ease: 'back.out(1.8)', stagger: 0.006 }, at + 0.02)
  })
  tl.to(q('.wt-lotus-glow'), { opacity: 1, duration: 0.08, stagger: 0.026 }, 0.74)

  // 0.8 - 1: life arrives: koi, reeds, bamboo, fireflies, drifting blossom
  tl.to(koi, { opacity: 1, duration: 0.05, stagger: 0.03 }, 0.82)
    .add(() => swims.forEach((s) => s.play()), 0.82)
    .to(q('.wt-reeds, .wt-bamboo'), { opacity: 1, duration: 0.08 }, 0.8)
    .to(q('.wt-petals'), { opacity: 1, duration: 0.1 }, 0.86)
    .to(q('.wt-fly'), { opacity: 1, duration: 0.06, stagger: 0.008 }, 0.84)
    .to(q('.wt-dark'), { opacity: 0.14, duration: 0.12 }, 0.88)

  // the whole scene drifts forward slowly, like a camera easing in
  tl.to(world, { scale: 1.07, duration: 1, ease: 'sine.inOut' }, 0)
    .to(q('.wt-far'), { x: -10, duration: 1 }, 0)
    .to(q('.wt-mid'), { x: -18, duration: 1 }, 0)
  return tl
}

/* 6. Garden care: big shears sweep the row and the overgrowth shrinks away behind them */
function care(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const shears = q('.cr-shears')[0]
  const shrubs = q('.cr-shrub')
  const domes = q('.cr-dome')
  const leaves = q('.cr-leaf')
  const weeds = q('.cr-weed')
  const snips = q('.cr-snip')
  const sparkles = q('.cr-sparkle')
  const start = 0.1
  const span = 0.62
  const x0 = 18
  const x1 = 560
  const win = span / shrubs.length

  gsap.set(shears, { x: -170, y: 90 })
  gsap.set(q('.cr-blade-a'), { svgOrigin: '0 0', rotation: -2 })
  gsap.set(q('.cr-blade-b'), { svgOrigin: '0 0', rotation: 2 })
  domes.forEach((d) => gsap.set(d, { svgOrigin: `${d.dataset.cx} 392`, opacity: 0, scaleY: 0.85, scaleX: 0.95 }))
  gsap.set(q('.cr-heap'), { svgOrigin: '62 446', scale: 0.05 })
  gsap.set(leaves, { opacity: 0 })
  gsap.set(snips, { opacity: 0, scale: 0 })
  gsap.set(sparkles, { scale: 0 })

  // The shears fly in, then sweep the row left to right, bobbing between the tops and the bases.
  tl.to(shears, { x: x0, y: 345, duration: start, ease: 'power2.out' }, 0)
    .to(shears, { x: x1, duration: span }, start)
    .to(shears, { y: 225, duration: span / 10, repeat: 9, yoyo: true, ease: 'sine.inOut' }, start)
    .to(shears, { rotation: -8, duration: span / 10, repeat: 9, yoyo: true, ease: 'sine.inOut' }, start)
    .to(q('.cr-blade-a'), { rotation: -22, duration: span / 40, repeat: 39, yoyo: true }, start)
    .to(q('.cr-blade-b'), { rotation: 22, duration: span / 40, repeat: 39, yoyo: true }, start)
    .to(q('.cr-glint'), { scale: 1.9, duration: span / 40, repeat: 39, yoyo: true }, start)
    .to(shears, { x: 860, y: -30, rotation: 18, duration: 0.07, ease: 'power2.in' }, start + span)
    .to(q('.cr-bird'), { x: 170, y: -130, rotation: -25, opacity: 0, duration: 0.1, ease: 'power2.in' }, start + 0.02)
    .to(q('.cr-heap'), { scale: 1, duration: span, ease: 'power1.out' }, start)

  // Each shrub: shoots go first, then the leafy blobs shrink from the top down, then the neat dome is left.
  shrubs.forEach((sh, k) => {
    const w0 = start + win * k
    const blobs = gsap.utils.toArray('.cr-blob', sh)
    const ys = blobs.map((b) => +b.getAttribute('cy'))
    const minY = Math.min(...ys)
    const range = Math.max(...ys) - minY || 1
    blobs.forEach((b, i) => {
      const norm = (ys[i] - minY) / range
      tl.to(b, { scale: 0, duration: 0.045, ease: 'power2.in' }, w0 + win * (0.08 + 0.7 * norm) + (i % 3) * 0.004)
    })
    tl.to(gsap.utils.toArray('.cr-shoot', sh), { scale: 0, duration: 0.04, ease: 'power2.in', stagger: 0.006 }, w0 + win * 0.04)
      .to(domes[k], { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.06, ease: 'back.out(2)' }, w0 + win * 0.1)
      .to(sh.querySelector('.cr-base'), { scale: 0, duration: 0.05, ease: 'power2.in' }, w0 + win * 0.82)
    tl.to(snips[k], { scale: 1, opacity: 1, y: -14, duration: 0.025, ease: 'back.out(3)' }, w0 + win * 0.35).to(
      snips[k],
      { opacity: 0, y: -30, duration: 0.03 },
      w0 + win * 0.35 + 0.035,
    )
  })

  // Clippings tumble down as the shears pass.
  leaves.forEach((lf, i) => {
    const f = (i + 0.5) / leaves.length
    const at = start + span * f
    const px = x0 + (x1 - x0) * f
    const py = 300 + ((i % 3) - 1) * 50
    const dir = i % 2 ? 1 : -1
    tl.set(lf, { x: px, y: py, opacity: 1, rotation: 0 }, at)
      .to(lf, { y: 400 + (i % 4) * 6, x: px + dir * (18 + (i % 5) * 5), rotation: dir * (180 + (i % 4) * 40), duration: 0.06, ease: 'power1.in' }, at)
      .to(lf, { opacity: 0, duration: 0.03 }, at + 0.05)
  })

  weeds.forEach((w, i) => {
    const at = 0.78 + i * 0.03
    tl.to(w, { y: 8, duration: 0.015, ease: 'power1.out' }, at).to(w, { y: -170, rotation: i % 2 ? 24 : -24, opacity: 0, duration: 0.05, ease: 'power2.in' }, at + 0.015)
  })
  tl.to(sparkles, { scale: 1, rotation: 90, duration: 0.06, ease: 'back.out(3)', stagger: 0.02 }, 0.93)
  return tl
}

export const BUILDERS = { design, planting, lawn, seasonal, water, care }
