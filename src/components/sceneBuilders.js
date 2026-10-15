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

/* 5. Water and stone: moonrise, waterfall, a glowing statue, lotus and koi */
function water(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const koiPath = q('#wt-koi-path')[0]
  const koi = q('.wt-koi')

  gsap.set(q('.wt-moon'), { y: 60, opacity: 0 })
  gsap.set(q('.wt-fallwrap'), { svgOrigin: '186 168', scaleY: 0 })
  gsap.set(q('.wt-ripples, .wt-mist'), { opacity: 0 })
  gsap.set(q('.wt-buddha'), { y: 18, opacity: 0 })
  gsap.set(q('.wt-halo'), { svgOrigin: '0 -136', scale: 0.3, opacity: 0 })
  gsap.set(koi, { opacity: 0 })
  gsap.set(q('.wt-firefly'), { opacity: 0 })
  q('.wt-lotus').forEach((l) => {
    gsap.set(l.querySelectorAll('.wt-petal'), { svgOrigin: `${l.dataset.x} ${l.dataset.y}`, scale: 0 })
    gsap.set(l.querySelector('.wt-pad'), { scale: 0 })
  })

  tl.to(q('.wt-moon'), { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
    .to(q('.wt-fallwrap'), { scaleY: 1, duration: 0.22, ease: 'power1.in' }, 0.1)
    .to(q('.wt-ripples, .wt-mist'), { opacity: 1, duration: 0.15 }, 0.26)
    .to(q('.wt-buddha'), { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0.3)
    .to(q('.wt-halo'), { scale: 1, opacity: 1, duration: 0.26, ease: 'power2.out' }, 0.4)
    .to(q('.wt-pad'), { scale: 1, duration: 0.1, ease: 'back.out(2)', stagger: 0.06 }, 0.5)
    .to(q('.wt-petal'), { scale: 1, duration: 0.12, ease: 'back.out(2)', stagger: 0.008 }, 0.56)
    .to(koi, { opacity: 1, duration: 0.04 }, 0.62)
    .to(koi[0], { motionPath: { path: koiPath, align: koiPath, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 0.9 }, duration: 0.38 }, 0.62)
    .to(koi[1], { motionPath: { path: koiPath, align: koiPath, alignOrigin: [0.5, 0.5], autoRotate: true, start: 0.5, end: 1.4 }, duration: 0.38 }, 0.62)
    .to(q('.wt-firefly'), { opacity: 1, duration: 0.08, stagger: 0.01 }, 0.76)
  return tl
}

/* 6. Garden care: shears sweep the shaggy bush into shape, weeds pop out */
function care(root) {
  const q = Q(root)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  const shears = q('.cr-shears')[0]
  const leaves = q('.cr-leaf')
  const weeds = q('.cr-weed')
  const sparkles = q('.cr-sparkle')
  const start = 0.12
  const span = 0.58

  gsap.set(q('.cr-clip-neat'), { attr: { width: 0 } })
  gsap.set(q('.cr-clip-shag'), { attr: { x: 0, width: 600 } })
  gsap.set(shears, { x: -70, y: 250 })
  gsap.set(q('.cr-blade-a'), { svgOrigin: '0 0', rotation: -2 })
  gsap.set(q('.cr-blade-b'), { svgOrigin: '0 0', rotation: 2 })
  gsap.set(leaves, { opacity: 0 })
  gsap.set(sparkles, { scale: 0 })

  tl.to(q('.cr-clip-neat'), { attr: { width: 600 }, duration: span }, start)
    .to(q('.cr-clip-shag'), { attr: { x: 600, width: 0 }, duration: span }, start)
    .to(shears, { x: 542, duration: span }, start)
    .to(shears, { y: 330, duration: span / 6, repeat: 5, yoyo: true, ease: 'sine.inOut' }, start)
    .to(q('.cr-blade-a'), { rotation: -22, duration: span / 16, repeat: 15, yoyo: true }, start)
    .to(q('.cr-blade-b'), { rotation: 22, duration: span / 16, repeat: 15, yoyo: true }, start)
    .to(shears, { x: 700, y: 200, duration: 0.06, ease: 'power2.in' }, start + span)

  leaves.forEach((lf, i) => {
    const f = (i + 0.5) / leaves.length
    const at = start + span * f
    const px = f * 600
    const py = 270 + (i % 2 ? 36 : -30)
    tl.set(lf, { x: px, y: py, opacity: 1, rotation: 0 }, at).to(
      lf,
      { y: py + 130 + (i % 3) * 16, x: px + (i % 2 ? 26 : -26), rotation: (i % 2 ? 1 : -1) * 240, opacity: 0, duration: 0.07, ease: 'power1.in' },
      at,
    )
  })
  weeds.forEach((w, i) => {
    const at = 0.76 + i * 0.03
    tl.to(w, { y: 8, duration: 0.015, ease: 'power1.out' }, at).to(w, { y: -150, rotation: i % 2 ? 24 : -24, opacity: 0, duration: 0.05, ease: 'power2.in' }, at + 0.015)
  })
  tl.to(sparkles, { scale: 1, rotation: 90, duration: 0.06, ease: 'back.out(3)', stagger: 0.02 }, 0.9)
  return tl
}

export const BUILDERS = { design, planting, lawn, seasonal, water, care }
