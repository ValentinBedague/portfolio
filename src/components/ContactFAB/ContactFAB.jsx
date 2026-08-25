import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useContactDrawer } from '../ContactDrawer/ContactDrawerContext'
import './ContactFAB.css'

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
)

export default function ContactFAB() {
  const { openDrawer } = useContactDrawer()
  const { pathname }   = useLocation()
  const [hidden, setHidden] = useState(false)

  /* Masque le FAB dès que le footer commence à se révéler.
     Le .footer-sentinel (fin de .app-body) entre dans le viewport
     exactement au début de la révélation du footer fixed. */
  useEffect(() => {
    setHidden(false)

    // Pages sans footer (ex. pages projet) → FAB toujours visible
    if (!document.querySelector('.site-footer')) return

    const sentinel = document.querySelector('.footer-sentinel')
    if (!sentinel) return

    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [pathname])

  return (
    <button
      className={`contact-fab${hidden ? ' contact-fab--hide' : ''}`}
      onClick={openDrawer}
      aria-label="Ouvrir le formulaire de contact"
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
    >
      <IconMail />
    </button>
  )
}
