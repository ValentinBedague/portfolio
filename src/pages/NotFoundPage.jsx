import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './NotFoundPage.css'

/* ── Couleurs du logo à chaque rebond ────────────────────────── */
const COLORS = [
  '#ffffff',
  '#60a5fa', // bleu
  '#f472b6', // rose
  '#34d399', // vert
  '#fbbf24', // jaune
  '#a78bfa', // violet
  '#fb923c', // orange
]

const LOGO_SIZE = 96
const SPEED     = 1.8

export default function NotFoundPage() {
  const { t } = useLanguage()
  const logoRef     = useRef(null)
  const posRef      = useRef(null)   // initialisé après mount (besoin des dims)
  const velRef      = useRef({ x: SPEED, y: SPEED * 0.75 })
  const colorIdxRef = useRef(0)
  const rafRef      = useRef(null)
  const [cornerHit, setCornerHit] = useState(false) // easter egg : coin exact

  const animate = useCallback(() => {
    const el = logoRef.current
    if (!el || !posRef.current) return

    const pos  = posRef.current
    const vel  = velRef.current
    const maxX = window.innerWidth  - LOGO_SIZE
    const maxY = window.innerHeight - LOGO_SIZE

    pos.x += vel.x
    pos.y += vel.y

    let hitX = false
    let hitY = false

    if (pos.x <= 0)    { pos.x = 0;    vel.x =  Math.abs(vel.x); hitX = true }
    if (pos.x >= maxX) { pos.x = maxX; vel.x = -Math.abs(vel.x); hitX = true }
    if (pos.y <= 0)    { pos.y = 0;    vel.y =  Math.abs(vel.y); hitY = true }
    if (pos.y >= maxY) { pos.y = maxY; vel.y = -Math.abs(vel.y); hitY = true }

    if (hitX || hitY) {
      colorIdxRef.current = (colorIdxRef.current + 1) % COLORS.length
      el.style.backgroundColor = COLORS[colorIdxRef.current]

      // Easter egg : coin exact ?
      if (hitX && hitY) setCornerHit(true)
    }

    el.style.transform = `translate(${pos.x}px, ${pos.y}px)`
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Position de départ aléatoire mais visible
    posRef.current = {
      x: Math.random() * (window.innerWidth  - LOGO_SIZE * 4) + LOGO_SIZE,
      y: Math.random() * (window.innerHeight - LOGO_SIZE * 4) + LOGO_SIZE,
    }
    // Direction aléatoire (évite les angles trop droits)
    const angle = (Math.random() * 0.6 + 0.2) * Math.PI / 2
    velRef.current = {
      x: SPEED * (Math.random() > 0.5 ? 1 : -1) * Math.cos(angle),
      y: SPEED * (Math.random() > 0.5 ? 1 : -1) * Math.sin(angle),
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  return (
    <div className="nf-page">

      {/* ── Logo DVD ────────────────────────────────────────── */}
      <div className="nf-dvd-wrap" aria-hidden="true">
        <div ref={logoRef} className="nf-dvd-logo" />
      </div>

      {/* ── Easter egg coin ─────────────────────────────────── */}
      {cornerHit && (
        <div className="nf-corner-toast" onAnimationEnd={() => setCornerHit(false)}>
          CORNER! 🎯
        </div>
      )}

      {/* ── Contenu ─────────────────────────────────────────── */}
      <div className="nf-content">

        <p className="nf-eyebrow">— Error</p>

        <h1 className="nf-code">
          <span className="nf-code__digit">4</span>
          <span className="nf-code__digit nf-code__digit--outline">0</span>
          <span className="nf-code__digit">4</span>
        </h1>

        <p className="nf-msg">
          {t('nf_message')}
        </p>

        <Link to="/" className="nf-btn">
          {t('nf_cta')}
          <span className="nf-btn__arrow">→</span>
        </Link>

      </div>

      {/* ── Hint discret ────────────────────────────────────── */}
      <p className="nf-hint" aria-hidden="true">{t('nf_hint')}</p>

    </div>
  )
}
