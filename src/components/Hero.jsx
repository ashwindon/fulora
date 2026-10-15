import { useLayoutEffect, useRef, useState } from 'react'
import SeasonSwitch from './SeasonSwitch.jsx'
import { SEASONS } from './seasons.js'
import gsap from 'gsap'
import Bee from './Bee.jsx'
import Landscape from './Landscape.jsx'
import FallingPetals from './FallingPetals.jsx'
import { petalPath, leafPath, grassBlades, GRASS_FLOWERS } from './botany.js'
import './Hero.css'

const STEM = 'M300 745 C284 650 348 565 324 470 C308 410 318 335 312 258'
const HEAD = { x: 312, y: 240 }
const BASE = { x: 300, y: 745 }

const LEAVES = [
  { t: 0.22, angle: -155, len: 120, w: 34, fill: '#3f9a4a' },
  { t: 0.4, angle: -25, len: 132, w: 36, fill: '#5db35a' },
  { t: 0.58, angle: -142, len: 96, w: 28, fill: '#5db35a' },
  { t: 0.72, angle: -38, len: 82, w: 24, fill: '#3f9a4a' },
]

const BACK_PETALS = Array.from({ length: 14 }, (_, i) => ({
  d: petalPath(HEAD.x, HEAD.y, (360 / 14) * i, 114, 27),
  fill: i % 2 ? '#d81b66' : '#ec3f86',
}))
const FRONT_PETALS = Array.from({ length: 14 }, (_, i) => ({
  d: petalPath(HEAD.x, HEAD.y, (360 / 14) * (i + 0.5), 86, 22),
  fill: i % 2 ? '#ffd23f' : '#ffe170',
}))
const SEEDS = Array.from({ length: 46 }, (_, n) => {
  const a = n * 137.508 * (Math.PI / 180)
  const r = Math.sqrt(n + 1) * 4.6
  return { x: HEAD.x + Math.cos(a) * r, y: HEAD.y + Math.sin(a) * r }
})

const WORDS = ["Let's", 'grow', 'something', 'wonderful.']
const BLADES = grassBlades()

export default function Hero() {
  const root = useRef(null)
  const headRef = useRef(null)
  const [bloomed, setBloomed] = useState(false)
  const [season, setSeason] = useState('summer')
  const shownSeason = useRef('summer')
  const seasonTl = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wind = { v: 0, target: 0 }
    let tick
    let onMove

    const ctx = gsap.context(() => {
      const q = (s) => gsap.utils.toArray(s)
      const stem = q('.stem')[0]
      const stemLen = stem.getTotalLength()

      const leaves = q('.leaf')
      const attach = leaves.map((g, i) => {
        const c = LEAVES[i]
        const pt = stem.getPointAtLength(stemLen * c.t)
        const { body, rib } = leafPath(pt.x, pt.y, c.angle, c.len, c.w)
        g.querySelector('.leaf-body').setAttribute('d', body)
        g.querySelector('.leaf-rib').setAttribute('d', rib)
        return pt
      })

      const underline = q('.underline path')[0]
      const ulLen = underline.getTotalLength()
      const center = `${HEAD.x} ${HEAD.y}`

      gsap.set('.plant', { svgOrigin: `${BASE.x} ${BASE.y}` })
      gsap.set('.head', { svgOrigin: `${HEAD.x} ${HEAD.y + 20}` })
      leaves.forEach((g, i) => gsap.set(g, { svgOrigin: `${attach[i].x} ${attach[i].y}` }))

      if (reduce) {
        gsap.set(underline, { strokeDasharray: ulLen, strokeDashoffset: 0 })
        setBloomed(true)
        return
      }

      const bud = q('.bud')[0]
      gsap.set(stem, { strokeDasharray: stemLen, strokeDashoffset: stemLen })
      gsap.set(bud, { attr: { r: 0, cx: BASE.x, cy: BASE.y - 10 } })
      gsap.set(leaves, { scale: 0 })
      gsap.set('.petal', { scale: 0, rotation: -40, svgOrigin: center })
      gsap.set('.disc, .seeds', { scale: 0, svgOrigin: center })
      gsap.set('.word-in', { yPercent: 118 })
      gsap.set('.hello', { opacity: 0, y: 14 })
      gsap.set('.lede, .cta > *', { opacity: 0, y: 26 })
      gsap.set(underline, { strokeDasharray: ulLen, strokeDashoffset: ulLen })
      gsap.set('.grass-in', { scaleY: 0, svgOrigin: '720 120' })
      gsap.set('.layer', { y: 90, opacity: 0 })
      gsap.set('.hero-sun, .cloud', { opacity: 0 })
      gsap.set('.scroll-cue', { opacity: 0 })

      // The order matters: the stem grows from the soil first (a green bud rides its tip),
      // the leaves unfurl as the stem passes them, and only once the stem has arrived
      // does the flower open at the top.
      const STEM_AT = 0.8
      const STEM_DUR = 2.4
      const stemEase = gsap.parseEase('power2.inOut')
      const timeAt = (t) => {
        let lo = 0
        let hi = 1
        for (let i = 0; i < 24; i++) {
          const mid = (lo + hi) / 2
          if (stemEase(mid) < t) lo = mid
          else hi = mid
        }
        return STEM_AT + STEM_DUR * ((lo + hi) / 2)
      }
      const tip = { p: 0 }
      const FLOWER_AT = STEM_AT + STEM_DUR + 0.15

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to('.hero-sun', { opacity: 1, duration: 1.4 }, 0)
        .to('.cloud', { opacity: 0.95, duration: 1.6, stagger: 0.25 }, 0.2)
        .to('.layer', { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out', stagger: 0.2 }, 0)
        .to('.grass-in', { scaleY: 1, duration: 1.1, ease: 'back.out(1.5)' }, 0.5)
        .to('.hello', { opacity: 1, y: 0, duration: 0.7 }, 0.2)
        .to('.word-in', { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.09 }, 0.3)
        .to(stem, { strokeDashoffset: 0, duration: STEM_DUR, ease: 'power2.inOut' }, STEM_AT)
        .to(bud, { attr: { r: 8 }, duration: 0.5, ease: 'back.out(2)' }, STEM_AT)
        .to(
          tip,
          {
            p: 1,
            duration: STEM_DUR,
            ease: 'power2.inOut',
            onUpdate: () => {
              const pt = stem.getPointAtLength(stemLen * tip.p)
              bud.setAttribute('cx', pt.x)
              bud.setAttribute('cy', pt.y)
            },
          },
          STEM_AT,
        )
        .to('.lede, .cta > *', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.6)
        .to(underline, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 2)
        .to(bud, { attr: { r: 13 }, duration: 0.35, ease: 'power2.out' }, FLOWER_AT - 0.15)
        .to(bud, { attr: { r: 0 }, duration: 0.4, ease: 'power2.in' }, FLOWER_AT + 0.25)
        .to('.petal-back', { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.8)', stagger: 0.045 }, FLOWER_AT)
        .to('.petal-front', { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.8)', stagger: 0.045 }, FLOWER_AT + 0.3)
        .to('.disc', { scale: 1, duration: 0.8, ease: 'back.out(2)' }, FLOWER_AT + 0.6)
        .to('.seeds', { scale: 1, duration: 0.9, ease: 'back.out(2)' }, FLOWER_AT + 0.75)
        .to('.scroll-cue', { opacity: 1, duration: 0.8 }, FLOWER_AT + 1.1)
        .add(() => setBloomed(true), FLOWER_AT + 0.9)

      leaves.forEach((g, i) => {
        tl.to(g, { scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }, timeAt(LEAVES[i].t))
      })

      const sway = leaves.map((g) => (v) => gsap.set(g, { rotation: v }))
      tick = (time) => {
        wind.v += (wind.target - wind.v) * 0.04
        gsap.set('.layer-far', { x: wind.v * -10 })
        gsap.set('.layer-mid', { x: wind.v * -22 })
        gsap.set('.layer-near', { x: wind.v * -38 })
        gsap.set('.plant', { rotation: wind.v * 3 + Math.sin(time * 0.8) * 0.8 })
        gsap.set('.head', { rotation: wind.v * 5 + Math.sin(time * 1.1 + 1) * 1.6 })
        sway.forEach((set, i) =>
          set(wind.v * (7 + i * 2) * (i % 2 ? 1 : -1) + Math.sin(time * 1.3 + i * 1.7) * 2.4),
        )
      }
      gsap.ticker.add(tick)

      onMove = (e) => {
        wind.target = (e.clientX / window.innerWidth - 0.5) * 2
      }
      window.addEventListener('pointermove', onMove)
    }, root)

    return () => {
      if (tick) gsap.ticker.remove(tick)
      if (onMove) window.removeEventListener('pointermove', onMove)
      ctx.revert()
    }
  }, [])

  // Switching season: the flower ripples into its new colours while the sky, hills,
  // grass and falling bits all glide to the new palette on one shared clock.
  useLayoutEffect(() => {
    // Only react to a real change (React's dev double-run must not replay the transition on load).
    if (shownSeason.current === season) return
    shownSeason.current = season
    const cfg = SEASONS[season]
    const el = root.current
    const q = (s) => gsap.utils.toArray(s, el)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduce ? 0.01 : 1.7
    const f = cfg.flower

    seasonTl.current?.kill()
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    seasonTl.current = tl

    // Everything that changes colour shares one tween clock, so nothing lags behind.
    tl.to(el, { ...cfg.vars, duration: dur }, 0)
      .to(
        document.documentElement,
        {
          '--accent': cfg.accent,
          '--accent-dark': cfg.accentDark,
          '--soil': cfg.vars['--soil'],
          '--soil-dark': cfg.vars['--soil-dark'],
          duration: dur,
        },
        0,
      )
      .to(q('.stem'), { stroke: f.stem, duration: dur }, 0)
      .to(q('.gflower'), { opacity: cfg.grassFlowers, duration: dur }, 0)
    q('.leaf-body').forEach((p, i) => tl.to(p, { fill: f.leaves[[0, 1, 1, 0][i]], duration: dur }, 0))

    // The flower: colour spreads out from the centre while a soft pulse ripples through the petals.
    const wave = { each: 0.022, from: 'center' }
    tl.to(q('.petal-back'), { fill: (i) => f.back[i % 2], duration: 1.1, stagger: wave }, 0.1)
      .to(q('.petal-front'), { fill: (i) => f.front[i % 2], duration: 1.1, stagger: wave }, 0.18)
      .to(q('.disc'), { fill: f.disc, duration: 0.9 }, 0.2)
      .to(q('.seeds'), { fill: f.seeds, duration: 0.9 }, 0.3)
    if (!reduce) {
      tl.to(
        q('.petal'),
        { keyframes: [{ scale: 1.1, duration: 0.3, ease: 'power2.out' }, { scale: 1, duration: 0.6, ease: 'power2.inOut' }], stagger: { each: 0.014, from: 'center' } },
        0.1,
      )
        .fromTo(q('.layer'), { y: 8 }, { y: 0, duration: 1.2, ease: 'power2.out', stagger: 0.06 }, 0)
        .fromTo(q('.hello'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.25)
    }
  }, [season])

  return (
    <section className="hero" id="top" ref={root} data-season={season}>
      <Landscape />
      <div className="hero-copy">
        <p className="hello">{SEASONS[season].hello}</p>
        <h1 aria-label="Let's grow something wonderful.">
          {WORDS.map((w, i) =>
            i === WORDS.length - 1 ? (
              <span className="accent" key={w} aria-hidden="true">
                <span className="word">
                  <span className="word-in">{w}</span>
                </span>
                <svg className="underline" viewBox="0 0 250 24" preserveAspectRatio="none">
                  <path d="M4 14 Q40 2 80 12 T160 10 T246 12" fill="none" stroke="#ffb627" strokeWidth="7" strokeLinecap="round" />
                </svg>
              </span>
            ) : (
              <span key={w} aria-hidden="true">
                <span className="word">
                  <span className="word-in">{w}</span>
                </span>{' '}
              </span>
            ),
          )}
        </h1>
        <p className="lede">
          Gardens, flowers and every plant in between. Designed, planted and looked after by someone who
          genuinely can&rsquo;t stop talking about them.
        </p>
        <div className="cta">
          <a className="btn" href="#contact">
            Plant a seed
          </a>
          <a className="btn btn-ghost" href="#plants">
            Meet the plants
          </a>
        </div>
      </div>

      <div className="scene" aria-hidden="true">
        <svg viewBox="0 0 600 760">
          <g className="plant">
            <path className="stem" d={STEM} fill="none" stroke="#2f7d3e" strokeWidth="10" strokeLinecap="round" />
            <circle className="bud" cx="300" cy="735" r="0" fill="#4aa35c" />
            {LEAVES.map((l, i) => (
              <g className="leaf" key={i}>
                <path className="leaf-body" fill={l.fill} />
                <path className="leaf-rib" fill="none" stroke="#1f5a2b" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
              </g>
            ))}
            <g className="head" ref={headRef}>
              {BACK_PETALS.map((p, i) => (
                <path className="petal petal-back" key={i} d={p.d} fill={p.fill} />
              ))}
              {FRONT_PETALS.map((p, i) => (
                <path className="petal petal-front" key={i} d={p.d} fill={p.fill} />
              ))}
              <circle className="disc" cx={HEAD.x} cy={HEAD.y} r="36" fill="#2b1245" />
              <g className="seeds" fill="#ffb627">
                {SEEDS.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r="1.9" />
                ))}
              </g>
            </g>
          </g>
        </svg>
      </div>

      <FallingPetals active={bloomed} look={SEASONS[season].particles} />

      <svg className="grass" viewBox="0 0 1440 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <g className="grass-in">
          {GRASS_FLOWERS.map((f, i) => (
            <g key={i} className="gflower">
              <path d={`M${f.x} 120 V${120 - f.h}`} stroke="#2f7d3e" strokeWidth="3.5" strokeLinecap="round" />
              <g transform={`translate(${f.x} ${120 - f.h})`}>
                <g fill={f.color}>
                  <circle cy="-9" r="8" />
                  <circle cx="9" r="8" />
                  <circle cy="9" r="8" />
                  <circle cx="-9" r="8" />
                </g>
                <circle r="6" fill={f.eye} />
              </g>
            </g>
          ))}
          {[0, 1, 2, 3].map((t) => (
            <g key={t} style={{ fill: `var(--g${t})` }}>
              {BLADES.filter((b) => b.tier === t).map((b, i) => (
                <path className="blade" key={i} d={b.d} style={{ '--delay': `${b.delay}s`, '--dur': `${b.dur}s` }} />
              ))}
            </g>
          ))}
        </g>
      </svg>

      <svg className="soil" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 Q180 2 360 22 T720 22 T1080 18 T1440 24 V160 H0Z" style={{ fill: 'var(--soil)' }} />
        <g style={{ fill: 'var(--soil-dark)' }}>
          <ellipse cx="180" cy="90" rx="16" ry="8" />
          <ellipse cx="520" cy="120" rx="22" ry="9" />
          <ellipse cx="860" cy="84" rx="14" ry="7" />
          <ellipse cx="1180" cy="114" rx="20" ry="9" />
          <ellipse cx="1370" cy="80" rx="12" ry="6" />
        </g>
      </svg>

      <a className="scroll-cue" href="#services">
        scroll to grow
      </a>

      <SeasonSwitch season={season} onChange={setSeason} ready={bloomed} />

      <Bee flowerRef={headRef} active={bloomed} visible={SEASONS[season].bee} />
    </section>
  )
}
