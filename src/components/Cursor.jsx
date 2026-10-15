import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Cursor.css'

export default function Cursor() {
  const root = useRef(null)
  const petals = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    document.documentElement.classList.add('has-custom-cursor')

    const el = root.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3' })
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })

    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: 'auto' })
    }
    const over = (e) => {
      const hot = e.target.closest('a, button, [data-hover]')
      gsap.to(petals.current, {
        scale: hot ? 1 : 0.35,
        rotation: hot ? 45 : 0,
        duration: 0.45,
        ease: 'back.out(2.2)',
        overwrite: 'auto',
      })
    }
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 })

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    gsap.set(petals.current, { scale: 0.35 })

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <svg viewBox="-30 -30 60 60" width="60" height="60">
        <g ref={petals} fill="#ff6f4d">
          <circle cy="-14" r="10" />
          <circle cx="14" r="10" />
          <circle cy="14" r="10" />
          <circle cx="-14" r="10" />
        </g>
        <circle r="7" fill="#ffb627" />
      </svg>
    </div>
  )
}
