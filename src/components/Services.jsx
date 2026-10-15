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
// Where each service "rests" on the scroll track: scene finished, text fully visible.
const REST = SERVICES.map((_, i) => (i + 0.84) / N)

export default function Services() {
  const root = useRef(null)
  const trigger = useRef(null)
  const [step, setStep] = useState(0)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.sv-panel')
      const scenes = SERVICES.map((s, i) => BUILDERS[s.id](panels[i].querySelector('.sv-frame')))

      if (reduce) {
        scenes.forEach((tl) => tl.progress(1))
        return
      }

      // Panel 0 greets the visitor as the section arrives; the rest wait their turn.
      const first = panels[0].querySelectorAll('.sv-text, .sv-scene')
      gsap.from(first, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.sv-pin', start: 'top 75%', once: true },
      })
      panels.slice(1).forEach((p) => {
        gsap.set(p, { autoAlpha: 0 })
        gsap.set(p.querySelectorAll('.sv-in'), { y: 34, opacity: 0 })
        gsap.set(p.querySelector('.sv-frame'), { y: 40, scale: 0.9, opacity: 0 })
      })

      const master = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.sv-pin',
          start: 'top top',
          end: `+=${N * 100}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          snap: { snapTo: [0, ...REST, 1], duration: { min: 0.25, max: 0.7 }, delay: 0.12, ease: 'power1.inOut' },
          onUpdate: (self) => setStep(Math.min(N - 1, Math.floor(self.progress * N))),
        },
      })
      trigger.current = master.scrollTrigger

      panels.forEach((p, i) => {
        const items = p.querySelectorAll('.sv-in')
        const frame = p.querySelector('.sv-frame')
        if (i > 0) {
          master
            .to(p, { autoAlpha: 1, duration: 0.12 }, i - 0.12)
            .to(items, { y: 0, opacity: 1, duration: 0.16, ease: 'power2.out', stagger: 0.025 }, i - 0.1)
            .to(frame, { y: 0, scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' }, i - 0.1)
        }
        if (i < N - 1) {
          master
            .to(items, { y: -26, opacity: 0, duration: 0.1, stagger: 0.01 }, i + 0.86)
            .to(frame, { y: -30, scale: 0.94, opacity: 0, duration: 0.12 }, i + 0.86)
            .to(p, { autoAlpha: 0, duration: 0.12 }, i + 0.88)
        }
        const tl = scenes[i]
        tl.timeScale(tl.duration() / 0.7)
        master.add(tl, i + 0.05)
      })
      // Make the track exactly N long so REST positions line up with each service.
      master.to({}, { duration: 0.0001 }, N - 0.0001)
    }, root)
    return () => ctx.revert()
  }, [])

  const goTo = (i) => {
    const st = trigger.current
    if (!st) return
    window.scrollTo({ top: st.start + REST[i] * (st.end - st.start), behavior: 'smooth' })
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
            <article className={`sv-panel ${s.theme}${i % 2 ? ' flip' : ''}`} key={s.id} aria-label={s.name}>
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
