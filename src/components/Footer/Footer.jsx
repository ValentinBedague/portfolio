import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage }       from '../../i18n/LanguageContext'
import { useTheme }          from '../../i18n/ThemeContext'
import { useContactDrawer }  from '../ContactDrawer/ContactDrawerContext'
import { ArrowUpRight, ArrowRight } from '../ArrowIcon'
import RollText from '../RollText'
import './Footer.css'

const EMAIL = 'contact@valentinbedague.com'

const SOCIALS = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/valentinbedague' },
]

/* ── Heure locale Biarritz (Europe/Paris), mise à jour chaque seconde ── */
function useLocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ── Parallax de révélation — le contenu "rattrape" le scroll ────────── */
function useRevealParallax(ref) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    let rafId = null
    const update = () => {
      rafId = null
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      if (max <= window.innerHeight) {
        el.style.transform = ''
        el.style.opacity = ''
        return
      }
      const start = max - window.innerHeight // début de la révélation
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / window.innerHeight))
      el.style.transform = `translateY(${((1 - p) * -14).toFixed(2)}vh)`
      el.style.opacity   = (0.3 + p * 0.7).toFixed(3)
    }
    const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update) }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [ref])
}

export default function Footer() {
  const { t }          = useLanguage()
  const { theme }      = useTheme()
  const { openDrawer } = useContactDrawer()
  const year           = new Date().getFullYear()
  const time           = useLocalTime()
  const revealRef      = useRef(null)

  useRevealParallax(revealRef)

  // Footer is always the inverse of the page theme
  const footerDark = theme === 'light'
  const logoSrc    = footerDark ? '/logo.svg' : '/logo-dark.svg'

  const links = [
    { to: '/',      label: t('nav_home')  },
    { to: '/work',  label: t('nav_work')  },
    { to: '/about', label: t('nav_about') },
    { to: '/legal', label: t('footer_legal') },
  ]

  const scrollTop = () => {
    if (window.lenis) window.lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={`site-footer${footerDark ? ' site-footer--dark' : ' site-footer--light'}`}>
      <div className="footer-reveal" ref={revealRef}>
        <div className="footer-grid">

          {/* ── R1C1 — Headline + email ─────────────────────────── */}
          <div className="footer-q footer-q--headline">
            <div className="footer-headline">
              <span className="footer-headline__line">{t('footer_hl_1')}</span>
              <span className="footer-headline__line footer-headline__line--ghost">
                {t('footer_hl_2')}
              </span>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className="footer-email"
              onClick={e => { e.preventDefault(); openDrawer() }}
            >
              {EMAIL}
              <ArrowUpRight className="footer-email__arrow" />
            </a>
          </div>

          {/* ── R1C2 — Contact CTA (toute la case est cliquable) ── */}
          <div
            className="footer-q footer-q--cta"
            onClick={openDrawer}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openDrawer()}
            aria-label={t('nav_contact')}
          >
            <span className="footer-cta__eyebrow">{t('footer_cta_eyebrow')}</span>
            <div className="footer-cta__btn" aria-hidden="true">
              <span className="footer-cta__word">{t('footer_cta_word')}</span>
              <ArrowUpRight className="footer-cta__arrow" />
            </div>
          </div>

          {/* ── R2C1 — Colonnes : sitemap / réseaux / infos ─────── */}
          <div className="footer-q footer-q--cols">

            <div className="footer-col">
              <span className="footer-col__label">{t('footer_lbl_nav')}</span>
              <nav className="footer-col__list" aria-label="Footer navigation">
                {links.map(({ to, label }) => (
                  <Link key={to} to={to} className="footer-link roll-hover">
                    <RollText>{label}</RollText>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="footer-col">
              <span className="footer-col__label">{t('footer_lbl_socials')}</span>
              <div className="footer-col__list">
                {SOCIALS.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                     className="footer-link roll-hover">
                    <RollText>{label}</RollText>
                    <ArrowUpRight className="footer-link__arrow" />
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <span className="footer-col__label">{t('footer_lbl_status')}</span>
              <div className="footer-col__list">
                <span className="footer-info">
                  <span className="footer-info__dot" />
                  {t('footer_available')}
                </span>
                <span className="footer-info">{t('footer_location')}</span>
                <span className="footer-info footer-info--time">
                  {t('footer_local_time')} — <span className="footer-time">{time}</span>
                </span>
              </div>
            </div>

          </div>

          {/* ── R2C2 — Logo ─────────────────────────────────────── */}
          <div className="footer-q footer-q--logo">
            <img src={logoSrc} alt="VB" className="footer-logo-img" />
          </div>

          {/* ── R3 — Metabar pleine largeur ─────────────────────── */}
          <div className="footer-metabar">
            <span className="footer-credit">VALENTIN BEDAGUE © {year}</span>
            <span className="footer-made">{t('footer_made')}</span>
            <button className="footer-top roll-hover" onClick={scrollTop}>
              <RollText>{t('footer_top')}</RollText>
              <ArrowRight className="footer-top__arrow" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}
