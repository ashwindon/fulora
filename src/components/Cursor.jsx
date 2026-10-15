import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Cursor.css'

// Anything you can click, press, drag or type in.
const INTERACTIVE =
  'a[href], button, input, textarea, select, label, summary, [role=button], [role=radio], [role=tab], .gb-item, .gr-polaroid, .gb-tile, .gr-packet, .gr-fern'

export default function Cursor() {
  const root = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return
    document.documentElement.classList.add('has-custom-cursor')

    const el = root.current
    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.16, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.16, ease: 'power3' })

    let lastTarget = null
    const move = (e) => {
      if (!el.classList.contains('on')) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        el.classList.add('on')
      }
      xTo(e.clientX)
      yTo(e.clientY)
      if (e.target !== lastTarget) {
        lastTarget = e.target
        el.classList.toggle('hot', !!(e.target.closest && e.target.closest(INTERACTIVE)))
      }
    }
    const leave = () => el.classList.remove('on')
    const enter = () => el.classList.add('on')

    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div className="cu" ref={root} aria-hidden="true">
      <svg viewBox="-16 -16 32 32" width="26" height="26">
        <g fill="#ff6f4d" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cy="-8" r="6.5" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="5" fill="#ffb627" stroke="#fff" strokeWidth="1.6" />
      </svg>
    </div>
  )
}
