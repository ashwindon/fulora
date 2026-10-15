import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PLANTS } from './plantData.js'
import { PlantArt } from './plants.jsx'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const REST = 0.5 // how tall a sleeping sprout is, as a share of the full plant

export default function Services() {
  const root = useRef(null)
  const list = useRef(null)
  const timelines = useRef({})
  const activeRef = useRef(null)
  const touched = useRef(false)
  const [active, setActive] = useState(null)

  // Build one paused grow-and-bloom timeline per plant.
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      PLANTS.forEach((p) => {
        const col = root.current.querySelector(`[data-id="${p.id}"]`)
        const grow = col.querySelector('.p-grow')
        const bloom = col.querySelector('.p-bloom')
        const leaves = gsap.utils.toArray('.p-leaf', col)
        const petals = gsap.utils.toArray('.p-petal', col)
        const H = 300 - p.top
        const [bx, by] = p.bloom

        gsap.set(grow, { svgOrigin: '100 300', scaleY: REST })
        gsap.set(bloom, { svgOrigin: `${bx} ${by}`, scale: 0.6, y: (1 - REST) * H })
        leaves.forEach((l) => {
          const { ax, ay, rest } = l.dataset
          const h = 300 - ay
          gsap.set(l, { svgOrigin: `${ax} ${ay}`, scale: +rest, y: +rest ? 0 : (1 - REST) * h })
        })
        petals.forEach((pt) => {
          gsap.set(pt, { svgOrigin: `${pt.dataset.ox} ${pt.dataset.oy}`, scale: 0.3, rotation: -25 })
        })

        const tl = gsap.timeline({ paused: true })
        tl.to(grow, { scaleY: 1, duration: 0.9, ease: 'power3.out' }, 0)
          .to(bloom, { y: 0, duration: 0.9, ease: 'power3.out' }, 0)
          .to(leaves, { scale: 1, y: 0, duration: 0.8, ease: 'back.out(2)', stagger: 0.07 }, 0.2)
          .to(bloom, { scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, 0.35)
          .to(petals, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.9)', stagger: { each: 0.025, from: 'center' } }, 0.45)
        timelines.current[p.id] = tl
      })

      if (reduce) return

      // Entrance: the sprouts rise out of the bed one after another,
      // then give a quick wave so people know they can be touched.
      gsap.set('.plant-btn', { y: 90, opacity: 0 })
      gsap.set('.sv-reveal', { y: 30, opacity: 0 })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          gsap.to('.sv-reveal', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
          gsap.to('.plant-btn', {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'back.out(1.6)',
            stagger: 0.12,
            delay: 0.25,
            onComplete: () => {
              PLANTS.forEach((p, i) => {
                gsap.delayedCall(i * 0.3, () => {
                  if (!touched.current) timelines.current[p.id].timeScale(1).play()
                })
                gsap.delayedCall(i * 0.3 + 1.2, () => {
                  if (activeRef.current !== p.id) timelines.current[p.id].timeScale(1.5).reverse()
                })
              })
            },
          })
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Play the active plant, put the others back to sleep.
  useEffect(() => {
    activeRef.current = active
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    PLANTS.forEach((p) => {
      const tl = timelines.current[p.id]
      if (!tl) return
      if (reduce) {
        tl.progress(p.id === active ? 1 : 0)
      } else if (p.id === active) {
        tl.timeScale(1).play()
      } else if (tl.progress() > 0) {
        tl.timeScale(1.5).reverse()
      }
    })
  }, [active])

  // On touch screens the plant nearest the middle of the row blooms by itself.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 900px)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.dataset.id)
        })
      },
      { root: list.current, threshold: 0.7 },
    )
    list.current.querySelectorAll('.plant-col').forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  const mouse = (e) => e.pointerType === 'mouse'

  return (
    <section className="services" id="services" ref={root}>
      <svg className="services-edge" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 0H1440V26C1340 62 1240 12 1140 34S940 58 840 30 640 8 540 34 340 56 240 30 80 14 0 38Z"
          style={{ fill: 'var(--soil)' }}
        />
      </svg>

      <div className="services-inner">
        <header className="services-head">
          <p className="sv-kicker sv-reveal">hover a plant, go on</p>
          <h2 className="sv-reveal">
            What we <span>grow</span>
          </h2>
          <p className="sv-lede sv-reveal">
            Every garden starts as a tiny sprout. Wake each one up to see what we do and how we do it.
          </p>
        </header>

        <ul className="plants" ref={list}>
          {PLANTS.map((p) => (
            <li
              key={p.id}
              data-id={p.id}
              className={`plant-col${active === p.id ? ' active' : ''}`}
              style={{ '--plant': p.color }}
              onPointerEnter={(e) => {
                if (!mouse(e)) return
                touched.current = true
                setActive(p.id)
              }}
              onPointerLeave={(e) => mouse(e) && setActive((a) => (a === p.id ? null : a))}
            >
              <div className="bubble" id={`bubble-${p.id}`}>
                <h3>{p.name}</h3>
                <p>{p.line}</p>
                <ul className="tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="plant-btn"
                aria-label={p.name}
                aria-describedby={`bubble-${p.id}`}
                aria-expanded={active === p.id}
                onFocus={() => setActive(p.id)}
                onBlur={() => setActive((a) => (a === p.id ? null : a))}
                onClick={() => {
                  touched.current = true
                  setActive(p.id)
                }}
              >
                <PlantArt id={p.id} />
              </button>

              <div className="bed-seg" aria-hidden="true">
                <span className="stake">{p.name}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="services-cta sv-reveal">
          <p>Not sure what your garden needs?</p>
          <a className="btn" href="#contact">
            Tell us your garden mood
          </a>
        </div>
      </div>
    </section>
  )
}
