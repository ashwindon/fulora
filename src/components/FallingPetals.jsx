import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { seeded } from './botany.js'

const COLORS = ['#7048c6', '#e8426b', '#f0628a', '#ffffff', '#c9a8ff']
const COUNT = 16

export default function FallingPetals({ active }) {
  const box = useRef(null)

  useEffect(() => {
    if (!active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      const rand = seeded(7)
      gsap.utils.toArray('.petal-fall').forEach((el, i) => {
        const startX = rand() * 100
        gsap.set(el, { left: `${startX}%`, top: -40, opacity: 0 })
        gsap.to(el, {
          y: () => window.innerHeight * 0.95,
          duration: 9 + rand() * 7,
          ease: 'none',
          repeat: -1,
          delay: rand() * 8,
          onRepeat: () => gsap.set(el, { left: `${rand() * 100}%` }),
        })
        gsap.to(el, { opacity: 0.9, duration: 1.2, delay: i * 0.3 })
        gsap.to(el, {
          x: 60 + rand() * 80,
          rotation: 360 * (rand() > 0.5 ? 1 : -1),
          duration: 3 + rand() * 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    }, box)
    return () => ctx.revert()
  }, [active])

  const rand = seeded(11)
  return (
    <div className="petals-fall" ref={box} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const size = 10 + rand() * 12
        return (
          <span
            key={i}
            className="petal-fall"
            style={{
              width: size,
              height: size * 1.5,
              background: COLORS[i % COLORS.length],
            }}
          />
        )
      })}
    </div>
  )
}
