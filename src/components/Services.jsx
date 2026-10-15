import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES } from './serviceData.js'
import { SCENES } from './sceneMap.js'
import { BUILDERS } from './sceneBuilders.js'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const N = SERVICES.length
const pad = (n) => String(n).padStart(2, '0')
// Scrolling snaps to the middle of each service's stretch of the page.
const CENTERS = SERVICES.map((_, i) => (i + 0.5) / N)
// How long each scene plays once its service arrives, in seconds.
const SECONDS = { design: 9, planting: 8, lawn: 8, seasonal: 9, water: 9, care: 8 }

export default function Services() {
  const root = useRef(null)
  const trigger = useRef(null)
  const [step, setStep] = useState(0)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.sv-panel')
      const scenes = SERVICES.map((s, i) => {
        const tl = BUILDERS[s.id](panels[i].querySelector('.sv-frame'))
        tl.timeScale(tl.duration() / SECONDS[s.id])
        tl.pause(0)
        return tl
      })

      if (reduce) {
        scenes.forEach((tl) => tl.progress(1))
        return
      }

      const parts = panels.map((p) => ({
        panel: p,
        items: p.querySelectorAll('.sv-in'),
        frame: p.querySelector('.sv-frame'),
      }))
      gsap.set(panels, { autoAlpha: 0 })

      let current = -1
      const timers = []

      // A service arrives: its panel fades in and its scene plays from the start to the end.
      const show = (i) => {
        if (i === current) return
        const prev = current
        current = i
        setStep(i)
        timers.forEach((t) => t.kill())
        timers.length = 0

        if (prev >= 0) {
          const o = parts[prev]
          gsap.to(o.items, { y: -20, opacity: 0, duration: 0.3, stagger: 0.02, overwrite: true })
          gsap.to(o.frame, { y: -24, scale: 0.95, opacity: 0, duration: 0.35, overwrite: true })
          gsap.to(o.panel, { autoAlpha: 0, duration: 0.4, overwrite: true })
          scenes.forEach((tl, k) => {
            if (k !== i) timers.push(gsap.delayedCall(0.45, () => tl.pause(0)))
          })
        }

        const n = parts[i]
        scenes[i].pause(0)
        gsap.to(n.panel, { autoAlpha: 1, duration: 0.5, overwrite: true })
        gsap.fromTo(n.items, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: 0.15, overwrite: true })
        gsap.fromTo(n.frame, { y: 40, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1, overwrite: true })
        timers.push(gsap.delayedCall(0.7, () => scenes[i].play()))
      }

      trigger.current = ScrollTrigger.create({
        trigger: '.sv-pin',
        start: 'top top',
        end: `+=${N * 100}%`,
        pin: true,
        anticipatePin: 1,
        snap: { snapTo: [0, ...CENTERS, 1], duration: { min: 0.2, max: 0.6 }, delay: 0.08, ease: 'power1.inOut' },
        onUpdate: (self) => show(Math.min(N - 1, Math.floor(self.progress * N))),
      })

      // Show the first service as soon as the section is coming into view.
      ScrollTrigger.create({
        trigger: '.sv-pin',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          if (current < 0) show(Math.min(N - 1, Math.floor(trigger.current.progress * N)))
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const goTo = (i) => {
    const st = trigger.current
    if (!st) return
    window.scrollTo({ top: st.start + CENTERS[i] * (st.end - st.start), behavior: 'smooth' })
  }

  return (
    <section className="services" id="services" ref={root}>
      <svg className="services-edge" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 0H1440V26C1340 62 1240 12 1140 34S940 58 840 30 640 8 540 34 340 56 240 30 80 14 0 38Z"
          style={{ fill: 'var(--soil)' }}
        />
      </svg>

      <div className="sv-pin">
        <h2 className="sr-only">What we grow</h2>

        {SERVICES.map((s, i) => {
          const Scene = SCENES[s.id]
          return (
            <article className={`sv-panel ${s.theme}`} key={s.id} aria-label={s.name}>
              <div className="sv-bg" style={{ background: s.bg }} />

              <div className="sv-text">
                <p className="sv-count sv-in">
                  what we grow · {pad(i + 1)} <span>/ {pad(N)}</span>
                </p>
                <h3 className="sv-in">{s.name}</h3>
                <p className="sv-line sv-in">{s.line}</p>
                <p className="sv-body sv-in">{s.body}</p>
                <ul className="sv-tags sv-in">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a className="sv-link sv-in" href="#contact">
                  Ask about this
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M4 12H19M13 6L19 12L13 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="sv-scene">
                <div className="sv-frame" role="img" aria-label={`Animation: ${s.scene}`}>
                  <Scene />
                  <span className="sv-cap">{s.scene}</span>
                </div>
              </div>
            </article>
          )
        })}

        <div className={`sv-dots ${SERVICES[step].theme}`} role="group" aria-label="Services">
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === step ? 'on' : ''}
              aria-label={`Show ${s.name}`}
              aria-current={i === step}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
