import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { seeded } from './botany.js'

const MAX = 30

// Petals, leaves and snow share one pool of elements; only their look changes.
const SHAPES = {
  petal: { radius: '60% 40% 60% 40% / 70% 70% 30% 30%', w: [10, 22], tall: 1.5, fall: [9, 16], sway: [60, 140], spin: 360 },
  leaf: { radius: '0 100% 0 100%', w: [14, 24], tall: 1.1, fall: [8, 14], sway: [80, 170], spin: 540 },
  snow: { radius: '50%', w: [4, 10], tall: 1, fall: [10, 18], sway: [20, 50], spin: 0 },
}

export default function FallingPetals({ active, look }) {
  const box = useRef(null)
  const [shown, setShown] = useState(look)

  // When the season changes, fade the old particles out, then swap the look.
  useEffect(() => {
    if (look === shown) return
    const tween = gsap.to(box.current.children, {
      opacity: 0,
      duration: 0.45,
      onComplete: () => setShown(look),
    })
    return () => tween.kill()
  }, [look, shown])

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const shape = SHAPES[shown.shape]
    const ctx = gsap.context(() => {
      const rand = seeded(7)
      gsap.utils.toArray('.petal-fall').forEach((el, i) => {
        if (i >= shown.count) return
        const [fa, fb] = shape.fall
        const [sa, sb] = shape.sway
        gsap.set(el, { left: `${rand() * 100}%`, top: -40, opacity: 0, rotation: rand() * 360 })
        gsap.to(el, {
          y: () => window.innerHeight * 0.95,
          duration: fa + rand() * (fb - fa),
          ease: 'none',
          repeat: -1,
          delay: rand() * 8,
          onRepeat: () => gsap.set(el, { left: `${rand() * 100}%` }),
        })
        gsap.to(el, { opacity: shown.shape === 'snow' ? 0.9 : 0.92, duration: 1.2, delay: i * 0.12 })
        gsap.to(el, {
          x: sa + rand() * (sb - sa),
          rotation: shape.spin ? `+=${shape.spin * (rand() > 0.5 ? 1 : -1)}` : 0,
          duration: 3 + rand() * 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })
    }, box)
    return () => ctx.revert()
  }, [active, shown])

  const shape = SHAPES[shown.shape]
  const rand = seeded(11)
  return (
    <div className="petals-fall" ref={box} aria-hidden="true">
      {Array.from({ length: MAX }, (_, i) => {
        const [wa, wb] = shape.w
        const size = wa + rand() * (wb - wa)
        return (
          <span
            key={i}
            className="petal-fall"
            style={{
              width: size,
              height: size * shape.tall,
              borderRadius: shape.radius,
              background: shown.colors[i % shown.colors.length],
              display: i < shown.count ? 'block' : 'none',
            }}
          />
        )
      })}
    </div>
  )
}
