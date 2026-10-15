import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (import.meta.env.DEV) {
  import('gsap').then(({ default: gsap }) => {
    window.gsap = gsap
  })
  import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    window.ScrollTrigger = ScrollTrigger
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
