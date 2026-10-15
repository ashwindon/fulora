import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Bee.css'

// A bee that follows the cursor while it moves and loops around the flower when it rests.
export default function Bee({ flowerRef, active, visible = true }) {
  const root = useRef(null)
  const shown = useRef(visible)

  useEffect(() => {
    shown.current = visible
    if (active) gsap.to(root.current, { opacity: visible ? 1 : 0, duration: 0.8 })
  }, [visible, active])

  useEffect(() => {
    if (!active) return
    const el = root.current
    const pos = { x: -120, y: window.innerHeight * 0.3 }
    let mouse = { x: 0, y: 0, last: -1e9 }
    let facing = 1

    gsap.set(el, { opacity: 0 })
    gsap.to(el, { opacity: shown.current ? 1 : 0, duration: 0.6 })

    const onMove = (e) => {
      mouse = { x: e.clientX, y: e.clientY, last: performance.now() }
    }
    window.addEventListener('pointermove', onMove)

    const tick = (time) => {
      const now = performance.now()
      const following = now - mouse.last < 2500
      let tx
      let ty
      if (following) {
        tx = mouse.x + 46
        ty = mouse.y - 30 + Math.sin(time * 3) * 10
      } else {
        const box = flowerRef.current?.getBoundingClientRect()
        const cx = box ? box.left + box.width / 2 : window.innerWidth * 0.7
        const cy = box ? box.top + box.height / 2 : window.innerHeight * 0.4
        const r = box ? box.width * 0.85 : 160
        tx = cx + Math.cos(time * 0.9) * r
        ty = cy + Math.sin(time * 1.8) * r * 0.45 - 10
      }
      const dx = tx - pos.x
      pos.x += dx * 0.045
      pos.y += (ty - pos.y) * 0.045
      if (Math.abs(dx) > 4) facing = dx > 0 ? 1 : -1
      const tilt = gsap.utils.clamp(-16, 16, dx * 0.12) * facing
      gsap.set(el, {
        x: pos.x,
        y: pos.y + Math.sin(time * 14) * 2,
        scaleX: facing,
        rotation: tilt,
      })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
    }
  }, [active, flowerRef])

  return (
    <div className="bee" ref={root} aria-hidden="true">
      <svg viewBox="-26 -22 52 40" width="52" height="40">
        <ellipse className="wing wing-a" cx="-5" cy="-9" rx="9" ry="5.5" fill="#d9f0ff" stroke="#9ccbe8" strokeWidth="1" />
        <ellipse className="wing wing-b" cx="5" cy="-9" rx="9" ry="5.5" fill="#d9f0ff" stroke="#9ccbe8" strokeWidth="1" />
        <ellipse cx="0" cy="0" rx="15" ry="10" fill="#ffc93c" />
        <path d="M-6 -9.4 Q-9 0 -6 9.4" stroke="#2b2118" strokeWidth="4" fill="none" />
        <path d="M3 -9.8 Q0 0 3 9.8" stroke="#2b2118" strokeWidth="4" fill="none" />
        <circle cx="12" cy="-2" r="2.2" fill="#2b2118" />
        <path d="M12 -8 q4 -6 8 -6 M10 -8 q1 -7 5 -9" stroke="#2b2118" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M-15 0 l-5 2" stroke="#2b2118" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
