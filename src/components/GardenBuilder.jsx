import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATS, ITEMS, ITEM_BY_ID, PRESETS, moodOf } from './gardenData.js'
import { ItemArt } from './gardenArt.jsx'
import QuoteForm from './QuoteForm.jsx'
import { exportPng } from './exportPng.js'
import './GardenBuilder.css'

gsap.registerPlugin(ScrollTrigger)

const B = { x0: 44, x1: 756, y0: 100, y1: 480 } // where item centres may sit on the 800 x 520 plot
const STORE = 'fulora-garden-v1'
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const uid = () => Math.random().toString(36).slice(2, 9)
const clean = (it) => {
  const c = { ...it }
  delete c.delay
  delete c.leaving
  return c
}
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function loadSaved() {
  try {
    const j = JSON.parse(localStorage.getItem(STORE))
    if (j && Array.isArray(j.items)) return { items: j.items.filter((i) => ITEM_BY_ID[i.type]), dusk: !!j.dusk }
  } catch {
    /* no saved garden */
  }
  return { items: [], dusk: false }
}

const ICONS = {
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  clear: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
  shuffle: 'M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5',
  moon: 'M21 13.5A8.5 8.5 0 1 1 10.5 3 6.5 6.5 0 0 0 21 13.5z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9a1 1 0 1 0 0 .01',
  left: 'M4 12a8 8 0 1 0 3-6.2M4 4v4h4',
  right: 'M20 12a8 8 0 1 1-3-6.2M20 4v4h-4',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  )
}

function ItemView({ it, selected, onDown, onFocus }) {
  const def = ITEM_BY_ID[it.type]
  const k = (it.s * def.size) / (def.view * 2)
  const inner = useRef(null)
  const dirt = useRef(null)

  // Planting: the item drops in with a bounce and a puff of soil.
  useLayoutEffect(() => {
    if (reduced()) return
    const tl = gsap.timeline({ delay: it.delay || 0 })
    gsap.set(inner.current, { scale: 0, y: -26, opacity: 0 })
    tl.to(inner.current, { scale: 1, y: 0, opacity: 1, duration: 0.55, ease: 'back.out(2.2)' }).fromTo(
      dirt.current.children,
      { scale: 0.3, opacity: 0.9, x: 0, y: 0 },
      { scale: 1, opacity: 0, x: (i) => (i % 2 ? 1 : -1) * (10 + i * 5), y: (i) => -6 - (i % 3) * 5, duration: 0.55, ease: 'power2.out', stagger: 0.02 },
      0.2,
    )
    return () => tl.kill()
  }, [it.delay])

  useEffect(() => {
    if (it.leaving) gsap.to(inner.current, { scale: 0, opacity: 0, duration: 0.22, ease: 'power2.in' })
  }, [it.leaving])

  return (
    <g
      className="gb-item"
      transform={`translate(${it.x} ${it.y})`}
      onPointerDown={(e) => onDown(e, it.id)}
      onFocus={() => onFocus(it.id)}
      tabIndex={0}
      role="button"
      aria-label={`${def.name}. Use the arrow keys to move it.`}
    >
      {selected && <circle className="gb-ring" data-export-hide r={(def.size * it.s) / 2 + 8} />}
      <g ref={dirt} data-export-hide transform={`translate(0 ${def.size * it.s * 0.22})`}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} r={3 + (i % 3)} fill="#7a5230" />
        ))}
      </g>
      <g transform={`rotate(${it.r}) scale(${k})`}>
        <g className={`gb-sway${def.cat === 'features' ? ' still' : ''}`}>
          <g ref={inner}>
            <ItemArt id={it.type} />
          </g>
        </g>
      </g>
    </g>
  )
}

export default function GardenBuilder() {
  const root = useRef(null)
  const svgRef = useRef(null)
  const trayRef = useRef(null)
  const ghostRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const history = useRef([])
  const presetIdx = useRef(-1)

  const [saved] = useState(loadSaved)
  const [items, setItems] = useState(saved.items)
  const [dusk, setDusk] = useState(saved.dusk)
  const [cat, setCat] = useState('flowers')
  const [selected, setSelected] = useState(null)
  const [armed, setArmed] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [ghost, setGhost] = useState(null)
  const [canUndo, setCanUndo] = useState(false)
  const [saving, setSaving] = useState(false)

  const itemsRef = useRef(items)
  useLayoutEffect(() => {
    itemsRef.current = items
  })
  const nudge = useRef(0)
  const live = items.filter((i) => !i.leaving)

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ items: items.filter((i) => !i.leaving).map(clean), dusk }))
    } catch {
      /* storage unavailable */
    }
  }, [items, dusk])

  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.gb-reveal', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.gb-head', start: 'top 82%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const toSvg = (cx, cy) => {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = cx
    pt.y = cy
    const m = svg.getScreenCTM()
    return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 }
  }
  const over = (el, x, y) => {
    const r = el.getBoundingClientRect()
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }

  const snapshot = () => {
    history.current.push(itemsRef.current.filter((i) => !i.leaving).map(clean))
    if (history.current.length > 40) history.current.shift()
    setCanUndo(true)
  }

  const addItem = (type, x, y) => {
    const it = { id: uid(), type, x: clamp(x, B.x0, B.x1), y: clamp(y, B.y0, B.y1), s: 1, r: 0 }
    snapshot()
    setItems((p) => [...p.filter((i) => !i.leaving), it])
    setSelected(it.id)
    return it
  }

  const removeItem = (id) => {
    snapshot()
    setItems((p) => p.map((i) => (i.id === id ? { ...i, leaving: true } : i)))
    setSelected((s) => (s === id ? null : s))
    setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 260)
  }

  const tweak = (id, fn) => setItems((p) => p.map((i) => (i.id === id ? { ...i, ...fn(i) } : i)))

  const undo = () => {
    const prev = history.current.pop()
    if (!prev) return
    setItems(prev)
    setSelected(null)
    setCanUndo(history.current.length > 0)
  }

  const clear = () => {
    if (!live.length) return
    snapshot()
    setItems((p) => p.map((i) => ({ ...i, leaving: true })))
    setSelected(null)
    setTimeout(() => setItems([]), 260)
  }

  const surprise = () => {
    snapshot()
    let n = presetIdx.current
    while (n === presetIdx.current) n = Math.floor(Math.random() * PRESETS.length)
    presetIdx.current = n
    setItems(PRESETS[n].items.map(([type, x, y, s, r], i) => ({ id: uid(), type, x, y, s, r, delay: i * 0.07 })))
    setSelected(null)
  }

  const download = async () => {
    if (!live.length || saving) return
    setSaving(true)
    setSelected(null)
    await new Promise((r) => setTimeout(r, 60))
    try {
      await exportPng(svgRef.current)
    } finally {
      setSaving(false)
    }
  }

  /* ---- dragging from the shelf ---- */
  const onTrayDown = (e, type) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const start = { x: e.clientX, y: e.clientY }
    let moved = false
    pointer.current = start

    const move = (ev) => {
      pointer.current = { x: ev.clientX, y: ev.clientY }
      if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 7) {
        moved = true
        setArmed(null)
        setGhost(type)
      }
      if (moved && ghostRef.current) ghostRef.current.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px) translate(-50%, -50%)`
    }
    const up = (ev) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      setGhost(null)
      if (moved) {
        if (ev.type === 'pointerup' && over(svgRef.current, ev.clientX, ev.clientY)) {
          const p = toSvg(ev.clientX, ev.clientY)
          addItem(type, p.x, p.y)
        }
      } else {
        setArmed((a) => (a === type ? null : type))
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  useLayoutEffect(() => {
    if (!ghost || !ghostRef.current) return
    const def = ITEM_BY_ID[ghost]
    const unit = svgRef.current.getBoundingClientRect().width / 800
    ghostRef.current.style.width = `${def.size * unit}px`
    ghostRef.current.style.transform = `translate(${pointer.current.x}px, ${pointer.current.y}px) translate(-50%, -50%)`
  }, [ghost])

  // Keyboard users: pressing a shelf item plants it in the middle of the plot.
  const onTrayKey = (type) => {
    const n = nudge.current++
    addItem(type, 380 + ((n * 97) % 220) - 110, 290 + ((n * 53) % 120) - 60)
  }

  /* ---- moving things already on the plot ---- */
  const onItemDown = (e, id) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.stopPropagation()
    setSelected(id)
    setArmed(null)
    const it = itemsRef.current.find((i) => i.id === id)
    const p0 = toSvg(e.clientX, e.clientY)
    const off = { dx: it.x - p0.x, dy: it.y - p0.y }
    let moved = false

    const move = (ev) => {
      const q = toSvg(ev.clientX, ev.clientY)
      if (!moved) {
        moved = true
        snapshot()
        setDragging(true)
      }
      tweak(id, () => ({ x: clamp(q.x + off.dx, B.x0, B.x1), y: clamp(q.y + off.dy, B.y0, B.y1) }))
    }
    const up = (ev) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      setDragging(false)
      if (moved && trayRef.current && over(trayRef.current, ev.clientX, ev.clientY)) removeItem(id)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const onCanvasDown = (e) => {
    if (e.target.closest && e.target.closest('.gb-item')) return
    if (armed) {
      const p = toSvg(e.clientX, e.clientY)
      addItem(armed, p.x, p.y)
    } else {
      setSelected(null)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSelected(null)
      setArmed(null)
      return
    }
    const sel = live.find((i) => i.id === selected)
    if (!sel) return
    const step = e.shiftKey ? 24 : 8
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (move) {
      e.preventDefault()
      tweak(sel.id, (i) => ({ x: clamp(i.x + move[0], B.x0, B.x1), y: clamp(i.y + move[1], B.y0, B.y1) }))
    } else if (e.key === '+' || e.key === '=') tweak(sel.id, (i) => ({ s: clamp(i.s * 1.12, 0.5, 2.2) }))
    else if (e.key === '-') tweak(sel.id, (i) => ({ s: clamp(i.s / 1.12, 0.5, 2.2) }))
    else if (e.key.toLowerCase() === 'r') tweak(sel.id, (i) => ({ r: (i.r + 15) % 360 }))
    else if (e.key === 'Delete' || e.key === 'Backspace') removeItem(sel.id)
  }

  const ordered = [...items].sort((a, b) => ITEM_BY_ID[a.type].layer - ITEM_BY_ID[b.type].layer || a.y - b.y)
  const sel = live.find((i) => i.id === selected)
  const counts = {}
  live.forEach((i) => (counts[i.type] = (counts[i.type] || 0) + 1))
  const mood = moodOf(live)
  const formItems = live.map((i) => ({ ...i, name: ITEM_BY_ID[i.type].name }))

  return (
    <section className="builder" id="builder" ref={root}>
      <div className="gb-head">
        <p className="gb-kicker gb-reveal">your turn</p>
        <h2 className="gb-reveal">
          Dream it, drop it, <span>we’ll plant it</span>
        </h2>
        <p className="gb-lede gb-reveal">
          Drag plants and features onto the plot to sketch the garden you imagine. Then send it to us as a quote request and we’ll take it from there.
        </p>
      </div>

      <div className="gb-grid">
        <div className="gb-left">
          <div className={`gb-plot gb-reveal${armed ? ' armed' : ''}${ghost ? ' hot' : ''}`} onKeyDown={onKeyDown}>
            <svg ref={svgRef} viewBox="0 0 800 520" onPointerDown={onCanvasDown} role="application" aria-label="Your garden plot. Items you add can be moved with the arrow keys.">
              <defs>
                <clipPath id="gb-lawn">
                  <rect x="20" y="20" width="760" height="480" rx="30" />
                </clipPath>
                <radialGradient id="gb-glow">
                  <stop offset="0" stopColor="#ffd86b" stopOpacity="0.95" />
                  <stop offset="0.45" stopColor="#ffd86b" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#ffd86b" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="800" height="520" fill="#e6f1d6" />
              <g clipPath="url(#gb-lawn)">
                <rect x="20" y="20" width="760" height="480" fill="#8fd18f" />
                {Array.from({ length: 12 }, (_, k) => (
                  <rect key={k} x={20 + k * 64} y="20" width="32" height="480" fill="#9de29e" opacity="0.65" />
                ))}
                <rect x="20" y="20" width="760" height="74" fill="#dccfbb" />
                {Array.from({ length: 16 }, (_, k) => (
                  <path key={k} d={`M${20 + k * 48} 46V94`} stroke="#c9bba5" strokeWidth="1.5" />
                ))}
                <path d="M20 70H780" stroke="#c9bba5" strokeWidth="1.5" />
                <rect x="20" y="20" width="760" height="28" fill="#efe3cd" />
                {[90, 250, 530, 690].map((x) => (
                  <rect key={x} x={x} y="26" width="60" height="16" rx="3" fill="#bfe3f5" stroke="#a89878" strokeWidth="2" />
                ))}
                <rect x="372" y="22" width="56" height="26" rx="3" fill="#b5814a" stroke="#6f4a26" strokeWidth="2" />
                <path d="M20 94H780" stroke="#bfae93" strokeWidth="3" />
              </g>
              <rect x="20" y="20" width="760" height="480" rx="30" fill="none" stroke="#8a6238" strokeWidth="8" />

              <g>
                {ordered.map((it) => (
                  <ItemView key={it.id} it={it} selected={it.id === selected} onDown={onItemDown} onFocus={setSelected} />
                ))}
              </g>

              <rect x="20" y="20" width="760" height="480" rx="30" fill="#0b1f3a" style={{ opacity: dusk ? 0.5 : 0, transition: 'opacity 0.8s ease', pointerEvents: 'none' }} />
              <g style={{ opacity: dusk ? 1 : 0, transition: 'opacity 0.8s ease', pointerEvents: 'none' }}>
                {live
                  .filter((i) => i.type === 'lantern')
                  .map((i) => (
                    <circle key={i.id} cx={i.x} cy={i.y} r={78 * i.s} fill="url(#gb-glow)" />
                  ))}
              </g>

              {live.length === 0 && (
                <g className="gb-hint" data-export-hide pointerEvents="none">
                  <text x="400" y="270" textAnchor="middle" fontSize="40" fill="#3d6b3a" style={{ fontFamily: "'Caveat','Segoe Print',cursive", fontWeight: 700 }}>
                    Drag something onto the grass
                  </text>
                  <path d="M400 290 C 404 330 380 352 360 372" fill="none" stroke="#3d6b3a" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
                  <path d="M350 362 L360 376 L374 366" fill="none" stroke="#3d6b3a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </svg>
          </div>

          <div className="gb-bar gb-reveal">
            <button type="button" className="gb-btn" onClick={surprise}>
              <Icon name="shuffle" /> Surprise me
            </button>
            <button type="button" className="gb-btn" onClick={() => setDusk((d) => !d)} aria-pressed={dusk}>
              <Icon name={dusk ? 'sun' : 'moon'} /> {dusk ? 'Daylight' : 'Sunset'}
            </button>
            <button type="button" className="gb-btn" onClick={undo} aria-disabled={!canUndo}>
              <Icon name="undo" /> Undo
            </button>
            <button type="button" className="gb-btn" onClick={clear} aria-disabled={!live.length}>
              <Icon name="clear" /> Clear
            </button>
            <button type="button" className="gb-btn" onClick={download} aria-disabled={!live.length || saving}>
              <Icon name="image" /> {saving ? 'Saving…' : 'Save picture'}
            </button>
          </div>

          <div className={`gb-sel${sel ? ' on' : ''}`} aria-live="polite">
            {sel ? (
              <>
                <span className="gb-sel-name">{ITEM_BY_ID[sel.type].name}</span>
                <button type="button" className="gb-mini" aria-label="Turn left" onClick={() => tweak(sel.id, (i) => ({ r: (i.r - 15) % 360 }))}>
                  <Icon name="left" />
                </button>
                <button type="button" className="gb-mini" aria-label="Turn right" onClick={() => tweak(sel.id, (i) => ({ r: (i.r + 15) % 360 }))}>
                  <Icon name="right" />
                </button>
                <button type="button" className="gb-mini" aria-label="Smaller" onClick={() => tweak(sel.id, (i) => ({ s: clamp(i.s / 1.12, 0.5, 2.2) }))}>
                  <Icon name="minus" />
                </button>
                <button type="button" className="gb-mini" aria-label="Bigger" onClick={() => tweak(sel.id, (i) => ({ s: clamp(i.s * 1.12, 0.5, 2.2) }))}>
                  <Icon name="plus" />
                </button>
                <button type="button" className="gb-mini" aria-label="Duplicate" onClick={() => addItem(sel.type, sel.x + 36, sel.y + 28)}>
                  <Icon name="copy" />
                </button>
                <button type="button" className="gb-mini danger" aria-label="Remove" onClick={() => removeItem(sel.id)}>
                  <Icon name="trash" />
                </button>
              </>
            ) : (
              <span className="gb-sel-hint">{armed ? `Tap the grass to plant ${ITEM_BY_ID[armed].name.toLowerCase()}. Tap it again to stop.` : 'Click a plant on the plot to turn, resize or remove it.'}</span>
            )}
          </div>

          <div className={`gb-tray gb-reveal${dragging ? ' bin' : ''}`} ref={trayRef}>
            <div className="gb-tabs" role="tablist" aria-label="What to plant">
              {CATS.map((c) => (
                <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="gb-shelf">
              {ITEMS.filter((d) => d.cat === cat).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`gb-tile${armed === d.id ? ' armed' : ''}`}
                  onPointerDown={(e) => onTrayDown(e, d.id)}
                  onClick={(e) => e.detail === 0 && onTrayKey(d.id)}
                  aria-label={`Plant ${d.name}`}
                  aria-pressed={armed === d.id}
                >
                  <svg viewBox={`${-d.view} ${-d.view} ${d.view * 2} ${d.view * 2}`} width="64" height="64" aria-hidden="true">
                    <ItemArt id={d.id} />
                  </svg>
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
            <div className="gb-bin" aria-hidden="true">
              <Icon name="trash" /> Drop here to remove
            </div>
          </div>
        </div>

        <aside className="gb-side">
          <div className="gb-card gb-summary gb-reveal">
            <h3>Your garden so far</h3>
            {live.length === 0 ? (
              <p className="gb-empty">Nothing planted yet. Drag a plant onto the plot, or hit Surprise me.</p>
            ) : (
              <>
                <p className="gb-mood">
                  Shaping up as a <strong>{mood}</strong>
                </p>
                <ul className="gb-chips">
                  {ITEMS.filter((d) => counts[d.id]).map((d) => (
                    <li key={d.id}>
                      <svg viewBox={`${-d.view} ${-d.view} ${d.view * 2} ${d.view * 2}`} width="26" height="26" aria-hidden="true">
                        <ItemArt id={d.id} />
                      </svg>
                      {counts[d.id]} × {d.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="gb-reveal">
            <QuoteForm items={formItems} mood={mood} onEdit={() => root.current?.querySelector('.gb-plot')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
          </div>
        </aside>
      </div>

      {ghost && (
        <div className="gb-ghost" ref={ghostRef} aria-hidden="true">
          <svg viewBox={`${-ITEM_BY_ID[ghost].view} ${-ITEM_BY_ID[ghost].view} ${ITEM_BY_ID[ghost].view * 2} ${ITEM_BY_ID[ghost].view * 2}`}>
            <ItemArt id={ghost} />
          </svg>
        </div>
      )}
    </section>
  )
}
