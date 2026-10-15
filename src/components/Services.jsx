import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scroller } from '../scroller.js'
import { SERVICES } from './serviceData.js'
import { SCENES } from './sceneMap.js'
import { BUILDERS } from './sceneBuilders.js'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const N = SERVICES.length
const pad = (n) => String(n).padStart(2, '0')
// How long each scene plays once its service arrives, in seconds.
const SECONDS = { design: 9, planting: 8, lawn: 8, seasonal: 9, water: 13, care: 8 }
// Phones and touch tablets get an ordinary scrolling list. Keep this in step with Services.css.
const LIST_QUERY = '(max-width: 900px), (hover: none) and (pointer: coarse)'

// Desktop: like scrolling reels. While this section is on screen, one scroll (or arrow key)
// slides to the next service and its animation plays by itself. Past either end the page scrolls on.
// Phones: nothing is held. Services are normal cards in the page and each animation plays as its
// card scrolls into view, so scrolling back up is instant.
export default function Services() {
  const root = useRef(null)
  const api = useRef(null)
  const [step, setStep] = useState(0)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.sv-panel')
      const scenes = SERVICES.map((s, i) => {
        const tl = BUILDERS[s.id](panels[i].querySelector('.sv-frame'))
        tl.timeScale(tl.duration() / SECONDS[s.id])
        tl.pause(0)
        return tl
      })
      const parts = panels.map((p) => ({
        panel: p,
        items: p.querySelectorAll('.sv-in'),
        frame: p.querySelector('.sv-frame'),
      }))
      const rewind = (tl) => {
        tl.pause(0)
        tl.data?.stop?.()
      }

      /* ---------------- phones: a normal list ---------------- */
      const runList = () => {
        const played = new Set()
        const timers = []
        const triggers = panels.flatMap((p, i) => {
          gsap.set(parts[i].items, { y: 28, opacity: 0 })
          return [
            // In view: reveal the text and play the animation once.
            ScrollTrigger.create({
              trigger: p,
              start: 'top 72%',
              end: 'bottom 14%',
              onToggle: (self) => {
                if (!self.isActive || played.has(i)) return
                played.add(i)
                gsap.to(parts[i].items, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, overwrite: true })
                rewind(scenes[i])
                timers.push(gsap.delayedCall(0.3, () => scenes[i].play()))
              },
            }),
            // Fully out of view: reset it, so it plays again the next time it arrives.
            ScrollTrigger.create({
              trigger: p,
              start: 'top bottom',
              end: 'bottom top',
              onToggle: (self) => {
                if (self.isActive) return
                played.delete(i)
                rewind(scenes[i])
                gsap.set(parts[i].items, { y: 28, opacity: 0 })
              },
            }),
          ]
        })
        return () => {
          timers.forEach((t) => t.kill())
          triggers.forEach((t) => t.kill())
          scenes.forEach(rewind)
          parts.forEach((x) => gsap.set(x.items, { clearProps: 'all' }))
        }
      }

      /* ---------------- desktop: the reel ---------------- */
      const runReel = () => {
        const pinEl = root.current.querySelector('.sv-pin')
        gsap.set(panels, { autoAlpha: 0 })

        let current = -1
        let busy = false
        let quiet = true
        let quietTimer = null
        const timers = []

        // Trackpads keep sending wheel events for a second after you stop. Wait until they stop
        // before accepting the next scroll, so one flick moves exactly one service.
        const settleSoon = (ms = 90) => {
          clearTimeout(quietTimer)
          quietTimer = setTimeout(() => (quiet = false), ms)
        }

        const go = (i, dir) => {
          if (i === current) return
          const prev = current
          current = i
          setStep(i)
          timers.forEach((t) => t.kill())
          timers.length = 0
          busy = true
          quiet = true
          settleSoon()

          const incoming = parts[i]
          gsap.set(incoming.panel, { zIndex: 2 })
          if (prev >= 0) {
            const outgoing = parts[prev]
            gsap.set(outgoing.panel, { zIndex: 1 })
            gsap.to(outgoing.panel, { yPercent: -dir * 24, autoAlpha: 0, duration: 0.9, ease: 'power3.inOut', overwrite: true })
          }
          gsap.fromTo(
            incoming.panel,
            { yPercent: prev >= 0 ? dir * 100 : 0, autoAlpha: prev >= 0 ? 1 : 0 },
            { yPercent: 0, autoAlpha: 1, duration: prev >= 0 ? 0.9 : 0.6, ease: 'power3.inOut', overwrite: true },
          )
          gsap.fromTo(incoming.items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: prev >= 0 ? 0.5 : 0.15, overwrite: true })
          gsap.fromTo(incoming.frame, { y: dir * 60, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', delay: prev >= 0 ? 0.35 : 0.1, overwrite: true })

          // The animation starts as the slide settles, then plays through on its own.
          scenes.forEach(rewind)
          timers.push(gsap.delayedCall(prev >= 0 ? 0.9 : 0.7, () => scenes[i].play()))
          timers.push(gsap.delayedCall(1, () => (busy = false)))
          timers.push(
            gsap.delayedCall(1.05, () => {
              panels.forEach((p, k) => k !== current && gsap.set(p, { autoAlpha: 0, yPercent: 0 }))
            }),
          )
        }

        const step1 = (dir) => {
          if (busy || quiet) return
          const next = current + dir
          if (next < 0 || next >= N) {
            // Past either end the reel lets go and the page glides on, so the scroll is never wasted.
            release()
            scroller.lenis?.scrollTo(next < 0 ? 0 : document.querySelector('#builder'), { duration: 1.2 })
            return
          }
          go(next, dir)
        }

        const onKey = (e) => {
          if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return
          if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
            e.preventDefault()
            step1(1)
          } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
            e.preventDefault()
            step1(-1)
          }
        }

        const obs = ScrollTrigger.observe({
          type: 'wheel,touch',
          wheelSpeed: -1,
          tolerance: 14,
          preventDefault: true,
          onUp: () => step1(1),
          onDown: () => step1(-1),
          onWheel: () => {
            if (quiet) settleSoon()
          },
        })
        obs.disable()

        const engage = () => {
          if (obs.isEnabled) return
          pinEl.setAttribute('data-lenis-prevent', '')
          quiet = true
          settleSoon(180)
          obs.enable()
          window.addEventListener('keydown', onKey)
          if (current < 0) go(0, 0)
        }
        function release() {
          if (!obs.isEnabled) return
          obs.disable()
          pinEl.removeAttribute('data-lenis-prevent')
          window.removeEventListener('keydown', onKey)
        }

        const jump = (pos) => {
          if (scroller.lenis) scroller.lenis.scrollTo(pos, { immediate: true, force: true })
          else window.scrollTo(0, pos)
        }

        const st = ScrollTrigger.create({
          trigger: pinEl,
          pin: true,
          start: 'top top',
          end: '+=2',
          anticipatePin: 1,
          onEnter: (self) => {
            if (obs.isEnabled || scroller.nav) return
            jump(self.start + 1)
            engage()
          },
          onEnterBack: (self) => {
            if (obs.isEnabled || scroller.nav) return
            jump(self.end - 1)
            engage()
          },
        })

        // If the page ends up somewhere else while the reel holds it (scrollbar drag, find-in-page),
        // let go instead of fighting it.
        const onScroll = () => {
          if (obs.isEnabled && Math.abs(window.scrollY - st.start) > 12) release()
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        // Show the first service as the section approaches, so it is already there on arrival.
        const first = ScrollTrigger.create({
          trigger: pinEl,
          start: 'top 85%',
          once: true,
          onEnter: () => current < 0 && go(0, 0),
        })

        const onNavStart = () => release()
        const onNavDone = () => {
          const y = window.scrollY
          if (y >= st.start - 3 && y <= st.end + 3) {
            jump(st.start + 1)
            engage()
          }
        }
        window.addEventListener('fulora:navstart', onNavStart)
        window.addEventListener('fulora:navdone', onNavDone)

        api.current = { go: (i) => i !== current && go(i, i > current ? 1 : -1) }

        return () => {
          // matchMedia may have killed the observer already, so don't rely on release() here.
          release()
          pinEl.removeAttribute('data-lenis-prevent')
          window.removeEventListener('keydown', onKey)
          clearTimeout(quietTimer)
          timers.forEach((t) => t.kill())
          st.kill()
          first.kill()
          obs.kill()
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('fulora:navstart', onNavStart)
          window.removeEventListener('fulora:navdone', onNavDone)
          api.current = null
          scenes.forEach(rewind)
          parts.forEach((x) => gsap.set([x.panel, x.items, x.frame], { clearProps: 'all' }))
          setStep(0)
        }
      }

      // `all` always matches: matchMedia only runs this when at least one condition does, and the
      // desktop reel is the case where neither of the other two applies.
      mm.add({ all: 'all', list: LIST_QUERY, reduce: '(prefers-reduced-motion: reduce)' }, (mctx) => {
        const { list, reduce } = mctx.conditions
        if (reduce) {
          scenes.forEach((tl) => tl.progress(1))
          return () => scenes.forEach(rewind)
        }
        return list ? runList() : runReel()
      })
    }, root)

    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  const dark = SERVICES[step].theme === 'dark'

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

        <div className={`sv-dots ${dark ? 'dark' : ''}`} role="group" aria-label="Services">
          {SERVICES.map((s, i) => (
            <button key={s.id} type="button" className={i === step ? 'on' : ''} aria-label={`Show ${s.name}`} aria-current={i === step} onClick={() => api.current?.go(i)} />
          ))}
        </div>

        <p className={`sv-hint${dark ? ' dark' : ''}`} aria-hidden="true">
          <span>{step === N - 1 ? 'keep scrolling' : 'scroll for the next one'}</span>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </div>
    </section>
  )
}
