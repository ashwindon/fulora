import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Cursor.css'

// What the pointer is over decides the cursor's shape, so the shape always says what will happen.
const LABELS = { grab: 'drag', move: 'move', flip: 'open', talk: 'say hi', plant: 'plant', mail: 'email', tel: 'call', external: 'open' }

function stateFor(t) {
  if (!t || !t.closest) return 'default'
  const custom = t.closest('[data-cursor]')
  if (custom) return custom.dataset.cursor
  if (t.closest('.gb-item')) return 'move'
  if (t.closest('.gr-polaroid') || t.closest('.gb-tile')) return 'grab'
  if (t.closest('.gr-packet')) return 'flip'
  if (t.closest('.gr-fern')) return 'talk'
  if (t.closest('.gb-plot.armed')) return 'plant'
  const a = t.closest('a[href]')
  if (a) {
    const h = a.getAttribute('href') || ''
    if (h.startsWith('mailto:')) return 'mail'
    if (h.startsWith('tel:')) return 'tel'
    if (a.target === '_blank' || /^https?:/.test(h)) return 'external'
    return 'link'
  }
  if (t.closest('input:not([type=checkbox]):not([type=radio]):not([type=submit]), textarea')) return 'text'
  if (t.closest('button, select, label, summary, [role=button], [role=radio], [role=tab]')) return 'press'
  return 'default'
}

const Svg = ({ cls, children }) => (
  <svg className={`ico ${cls}`} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export default function Cursor() {
  const root = useRef(null)
  const ring = useRef(null)
  const dot = useRef(null)
  const label = useRef(null)
  const burst = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return
    document.documentElement.classList.add('has-custom-cursor')

    const el = root.current
    gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3' })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })

    let state = 'default'
    const apply = (next) => {
      if (next === state) return
      state = next
      el.dataset.state = next
      const text = LABELS[next] || ''
      label.current.textContent = text
      el.classList.toggle('has-label', !!text)
    }

    let lastTarget = null
    const move = (e) => {
      if (e.target !== lastTarget) {
        lastTarget = e.target
        apply(stateFor(e.target))
      }
      if (!el.classList.contains('on')) {
        gsap.set([ring.current, dot.current], { x: e.clientX, y: e.clientY })
        el.classList.add('on')
      }
      rx(e.clientX)
      ry(e.clientY)
      dx(e.clientX)
      dy(e.clientY)
    }
    const down = (e) => {
      el.dataset.down = '1'
      if (e.button !== 0) return
      const s = stateFor(e.target)
      if (s === 'text' || s === 'grab' || s === 'move') return
      // A little puff of petals where you click.
      const petals = burst.current.children
      gsap.set(burst.current, { x: e.clientX, y: e.clientY })
      gsap.fromTo(
        petals,
        { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: 0 },
        {
          x: (i) => Math.cos((i / petals.length) * Math.PI * 2) * (30 + (i % 2) * 10),
          y: (i) => Math.sin((i / petals.length) * Math.PI * 2) * (30 + (i % 2) * 10),
          rotation: (i) => (i % 2 ? 140 : -140),
          scale: 1,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true,
        },
      )
    }
    const up = () => delete el.dataset.down
    const leave = () => el.classList.remove('on')
    const enter = () => el.classList.add('on')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', up, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div className="cu" ref={root} data-state="default" aria-hidden="true">
      <div className="cu-ring" ref={ring}>
        <Svg cls="ico-arrow">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </Svg>
        <Svg cls="ico-external">
          <path d="M7 17L17 7M9 7h8v8" />
        </Svg>
        <Svg cls="ico-mail">
          <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
        </Svg>
        <Svg cls="ico-tel">
          <path d="M6 4h3l2 5-2 1.5a10 10 0 0 0 4.500 4.500L15 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 4 6a2 2 0 0 1 2-2z" />
        </Svg>
        <Svg cls="ico-press">
          <circle cx="12" cy="12" r="2.600" fill="#fff" />
          <path d="M12 3.500v3.200M12 17.300v3.200M3.500 12h3.200M17.300 12h3.200M6 6l2.300 2.300M15.700 15.700L18 18M6 18l2.300-2.300M15.700 8.300L18 6" />
        </Svg>
        <Svg cls="ico-grab">
          <path d="M8 12V6.500a1.500 1.500 0 0 1 3 0V11M11 10V5a1.500 1.500 0 0 1 3 0v5.500M14 10V6.500a1.500 1.500 0 0 1 3 0V13M8 12l-1.200-1.800a1.500 1.500 0 0 0-2.500 1.600L7 17c1 2 2.500 3 5 3 3.500 0 5-2 5-5v-2" />
        </Svg>
        <Svg cls="ico-fist">
          <path d="M7 12.500v-1a1.500 1.500 0 0 1 3 0M10 11.500v-1.500a1.500 1.500 0 0 1 3 0v1M13 11v-1a1.500 1.500 0 0 1 3 0v3.500c0 4-2 6-5 6s-4.500-1.500-5.500-4L5 12.500" />
        </Svg>
        <Svg cls="ico-move">
          <path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3" />
        </Svg>
        <Svg cls="ico-flip">
          <path d="M20 7v4h-4M4 17v-4h4M5.500 9A7 7 0 0 1 18 7.500L20 11M18.500 15A7 7 0 0 1 6 16.500L4 13" />
        </Svg>
        <Svg cls="ico-talk">
          <path d="M4 5h16v11H10l-5 4v-4H4zM8 10h8M8 13h5" />
        </Svg>
        <Svg cls="ico-plant">
          <path d="M12 5v14M5 12h14" />
        </Svg>
        <span className="cu-label" ref={label} />
      </div>
      <div className="cu-dot" ref={dot} />
      <div className="cu-burst" ref={burst}>
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="cu-p" style={{ background: ['#ff6f4d', '#ffb627', '#ec3f86', '#8e6bd1', '#5db35a', '#ffd23f', '#ff8fbf'][i] }} />
        ))}
      </div>
    </div>
  )
}
