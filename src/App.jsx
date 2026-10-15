import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { scroller } from './scroller.js'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import GardenBuilder from './components/GardenBuilder.jsx'
import MeetGrower from './components/MeetGrower.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  // Smooth, weighty scrolling that stays in step with the GSAP animations.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1 })
    scroller.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // In-page links glide to their section. The Services reel is told so it lets go first
    // and does not grab the page again while the glide passes through it.
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')
      const target = hash === '#top' || hash === '#' ? 0 : document.querySelector(hash)
      if (target == null) return
      e.preventDefault()
      window.dispatchEvent(new Event('fulora:navstart'))
      scroller.nav = true
      lenis.start()
      lenis.scrollTo(target, {
        duration: 1.5,
        onComplete: () => {
          scroller.nav = false
          window.dispatchEvent(new Event('fulora:navdone'))
        },
      })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
      scroller.lenis = null
    }
  }, [])

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Services />
        <GardenBuilder />
        <MeetGrower />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
