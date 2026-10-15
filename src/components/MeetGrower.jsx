import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { GROWER } from './growerData.js'
import { PhotoArt, Mascot, FactIcon } from './growerArt.jsx'
import './MeetGrower.css'

gsap.registerPlugin(ScrollTrigger, Draggable)

function Polaroid({ p, className = '' }) {
  return (
    <figure className={`gr-polaroid ${className}`} data-rot={p.rot}>
      <span className="gr-tape" style={{ background: p.tape }} />
      <div className="gr-photo">
        {p.src ? <img src={p.src} alt={p.alt} draggable="false" /> : <PhotoArt art={p.art} />}
        <span className="gr-develop" />
      </div>
      <figcaption>{p.caption}</figcaption>
    </figure>
  )
}

export default function MeetGrower() {
  const root = useRef(null)
  const [open, setOpen] = useState({})
  const [quip, setQuip] = useState(0)
  const [talked, setTalked] = useState(false)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const polaroids = gsap.utils.toArray('.gr-polaroid')
      polaroids.forEach((p) => gsap.set(p, { rotation: +p.dataset.rot }))

      // The polaroids can be picked up and moved around the board on larger screens.
      mm.add('(min-width: 861px)', () => {
        let z = 20
        const drags = Draggable.create(polaroids, {
          type: 'x,y',
          bounds: '.gr-board',
          zIndexBoost: false,
          onPress() {
            this.target.style.zIndex = ++z
            gsap.to(this.target, { scale: 1.06, rotation: +this.target.dataset.rot * 0.4, duration: 0.2, overwrite: 'auto' })
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, rotation: +this.target.dataset.rot, duration: 0.5, ease: 'back.out(2.4)', overwrite: 'auto' })
          },
        })
        return () => drags.forEach((d) => d.kill())
      })

      if (reduce) return

      gsap.from('.gr-head > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.gr-head', start: 'top 85%', once: true },
      })

      gsap.set(polaroids, { y: -240, opacity: 0, rotation: (i, el) => +el.dataset.rot + (i % 2 ? 28 : -28) })
      gsap.set('.gr-tape', { scaleX: 0 })
      gsap.set('.gr-develop', { opacity: 1 })
      gsap.set('.gr-photo > svg, .gr-photo > img', { filter: 'brightness(1.9) saturate(0) blur(7px)' })
      gsap.set('.gr-w', { opacity: 0, y: 8 })
      gsap.set('.gr-sign', { opacity: 0, y: 10 })
      gsap.set('.gr-packet', { scale: 0, rotation: -14 })
      gsap.set('.gr-stat', { y: 24, opacity: 0 })
      gsap.set('.gr-mascot', { y: 50, opacity: 0 })

      const tl = gsap.timeline({ scrollTrigger: { trigger: '.gr-board', start: 'top 72%', once: true } })
      tl.to(polaroids, { y: 0, opacity: 1, rotation: (i, el) => +el.dataset.rot, duration: 1.1, ease: 'bounce.out', stagger: 0.18 }, 0)
        .to('.gr-tape', { scaleX: 1, duration: 0.4, ease: 'power2.out', stagger: 0.18 }, 0.5)
        .to('.gr-develop', { opacity: 0, duration: 2.2, ease: 'power1.inOut', stagger: 0.25 }, 0.9)
        .to('.gr-photo > svg, .gr-photo > img', { filter: 'brightness(1) saturate(1) blur(0px)', duration: 2.2, ease: 'power1.inOut', stagger: 0.25 }, 0.9)
        .to('.gr-w', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.035 }, 0.7)
        .to('.gr-sign', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }, '>-0.2')
        .to('.gr-packet', { scale: 1, rotation: (i) => (i % 2 ? 2.5 : -2.5), duration: 0.6, ease: 'back.out(2.4)', stagger: 0.09 }, 1.4)
        .to('.gr-stat', { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12 }, 1.2)
        .to('.gr-mascot', { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(2)' }, 2.2)
        .add(() => setTalked(true), 2.8)

      gsap.utils.toArray('.gr-count').forEach((el) => {
        const to = +el.dataset.to
        const o = { v: 0 }
        tl.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v)) }, 1.3)
      })
    }, root)
    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }))
  const talk = () => {
    setTalked(true)
    setQuip((q) => (q + 1) % GROWER.quips.length)
    gsap.fromTo('.gr-mascot svg', { rotation: -6 }, { rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
  }

  const [main, small1, small2] = GROWER.photos

  return (
    <section className="grower" id="about" ref={root}>
      <div className="gr-head">
        <p className="gr-kicker">{GROWER.kicker}</p>
        <h2>{GROWER.title}</h2>
        <p className="gr-lede">{GROWER.lede}</p>
      </div>

      <div className="gr-board">
        <div className="gr-col-a">
          <Polaroid p={main} className="gr-main" />
          <Polaroid p={small2} className="gr-small gr-b" />
          <ul className="gr-stats">
            {GROWER.stats.map((s) => (
              <li className="gr-stat" key={s.label}>
                <strong>{s.to != null ? <span className="gr-count" data-to={s.to}>0</span> : s.text}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="gr-mascot">
            <p className={`gr-bubble${talked ? ' on' : ''}`} key={quip} aria-live="polite">
              {GROWER.quips[quip]}
            </p>
            <button type="button" className="gr-fern" onClick={talk} aria-label="Talk to the fern">
              <Mascot />
              <span>talk to me</span>
            </button>
          </div>
        </div>

        <div className="gr-col-b">
          <article className="gr-letter">
            <span className="gr-pin" />
            <Polaroid p={small1} className="gr-small gr-a" />
            {GROWER.letter.map((para, i) => (
              <p key={i} className={i === 0 ? 'gr-hello' : ''}>
                {para.split(' ').map((w, k) => (
                  <span className="gr-w" key={k}>
                    {w}{' '}
                  </span>
                ))}
              </p>
            ))}
            <p className="gr-sign">
              <svg viewBox="-14 -14 28 28" width="30" height="30" aria-hidden="true">
                <g fill="#e8426b">
                  <circle cy="-7" r="5.5" />
                  <circle cx="7" r="5.5" />
                  <circle cy="7" r="5.5" />
                  <circle cx="-7" r="5.5" />
                </g>
                <circle r="4.4" fill="#ffb627" />
              </svg>
              {GROWER.sign}
            </p>
          </article>

          <ul className="gr-packets">
            {GROWER.facts.map((f, i) => (
              <li key={f.label}>
                <button type="button" className={`gr-packet${open[i] ? ' open' : ''}`} style={{ '--c': f.color, '--d': f.dark }} aria-pressed={!!open[i]} onClick={() => toggle(i)}>
                  <span className="gr-face gr-front">
                    <svg viewBox="-20 -20 40 40" width="46" height="46" aria-hidden="true">
                      <g fill="#fff">
                        <circle cy="-9" r="7.5" />
                        <circle cx="9" r="7.5" />
                        <circle cy="9" r="7.5" />
                        <circle cx="-9" r="7.5" />
                      </g>
                      <circle r="6" fill="var(--c)" stroke="#fff" strokeWidth="2" />
                    </svg>
                    <strong>{f.label}</strong>
                    <em>tap to open</em>
                  </span>
                  <span className="gr-face gr-back">
                    <span className="gr-badge">
                      <FactIcon name={f.icon} />
                    </span>
                    <small>{f.label}</small>
                    <span className="gr-answer">{f.answer}</span>
                    <span className="gr-no">No. {String(i + 1).padStart(2, '0')}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
