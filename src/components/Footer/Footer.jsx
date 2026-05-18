import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { useTheme }    from '../../i18n/ThemeContext'
import { useContactDrawer } from '../ContactDrawer/ContactDrawerContext'
import { ArrowUpRight, ArrowRight } from '../ArrowIcon'
import './Footer.css'

const SOCIAL = {
  instagram: 'https://www.instagram.com/valentinbedague',
  linkedin:  'https://www.linkedin.com/in/valentinbedague',
}

function useBiarritzTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   false,
    }).format(new Date())

  const getHour = () =>
    parseInt(
      new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour:     '2-digit',
        hour12:   false,
      }).format(new Date()),
      10
    )

  const [time, setTime]       = useState(fmt)
  const [isSleeping, setSleep] = useState(() => { const h = getHour(); return h >= 23 || h < 7 })

  useEffect(() => {
    const tick = () => {
      setTime(fmt())
      const h = getHour()
      setSleep(h >= 23 || h < 7)
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return { time, isSleeping }
}

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.6" cy="6.4" r="0.9" fill="currentColor" stroke="none"/>
  </svg>
)

const IconLinkedin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

export default function Footer() {
  const { t }           = useLanguage()
  const { theme }       = useTheme()
  const { openDrawer }  = useContactDrawer()
  const { pathname }    = useLocation()
  const year            = new Date().getFullYear()
  const { time, isSleeping } = useBiarritzTime()

  // Footer is always the inverse of the page theme
  const footerDark = theme === 'light'   // dark footer on light page, light footer on dark page
  const logoSrc      = footerDark ? '/logo.svg' : '/logo-dark.svg'
  const watermarkSrc = footerDark ? '/logo.svg' : '/logo-dark.svg'

  const links = [
    { to: '/',      label: t('nav_home'),  num: '01', end: true  },
    { to: '/work',  label: t('nav_work'),  num: '02', end: false },
    { to: '/about', label: t('nav_about'), num: '03', end: false },
  ]

  return (
    <footer className={`site-footer${footerDark ? ' site-footer--dark' : ' site-footer--light'}`}>
      {/* ── 3-column Nordic blocks ───────────────────────────────── */}
      <div className="footer-blocks container">

        {/* Block 1 — Brand */}
        <div className="footer-block footer-block--brand">
          <span className="footer-block__label">{t('footer_lbl_brand')}</span>
          <div className="footer-brand-text">VB.</div>
          <p className="footer-brand-role">{t('footer_role')}</p>
          <p className="footer-brand-loc">{t('footer_location')}</p>
          <div className="footer-socials">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social__link"
              aria-label="Instagram"
            >
              <IconInstagram />
              <span>Instagram</span>
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social__link"
              aria-label="LinkedIn"
            >
              <IconLinkedin />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Block 2 — Navigation */}
        <div className="footer-block footer-block--nav">
          <span className="footer-block__label">{t('footer_lbl_nav')}</span>
          <nav className="footer-nav" aria-label="Footer navigation">
            {links.map(({ to, label, num, end }) => (
              <Link
                key={to}
                to={to}
                end={end ? 'true' : undefined}
                className="footer-nav__row"
              >
                <span className="footer-nav__num">{num}</span>
                <span className="footer-nav__label">{label}</span>
                <ArrowUpRight className="footer-nav__arrow" />
              </Link>
            ))}
            <button className="footer-nav__row footer-nav__row--cta" onClick={openDrawer}>
              <ArrowRight className="footer-nav__num" />
              <span className="footer-nav__label">{t('nav_contact')}</span>
              <ArrowUpRight className="footer-nav__arrow" />
            </button>
          </nav>
        </div>

        {/* Block 3 — Status */}
        <div className="footer-block footer-block--status">
          <span className="footer-block__label">{t('footer_lbl_status')}</span>
          <div className="footer-avail">
            <span className={`footer-avail__dot${isSleeping ? ' footer-avail__dot--sleeping' : ''}`} />
            <span className="footer-avail__text">
              {isSleeping ? t('footer_sleeping') : t('footer_available')}
            </span>
          </div>
          <div className="footer-localtime">
            <span className="footer-localtime__label">{t('footer_local_time')}</span>
            <span className="footer-localtime__value">{time}</span>
          </div>
          <p className="footer-status-loc">{t('footer_location')}</p>
          <p className="footer-status-copy">© {year}</p>
        </div>

      </div>

      {/* ── Giant logo watermark ─────────────────────────────────── */}
      <div className="footer-watermark">
        <img
          src={watermarkSrc}
          alt=""
          aria-hidden="true"
          className="footer-watermark__img"
        />
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <div className="footer-bar container">
        <img src={logoSrc} alt="VB" className="footer-bar__logo" />
        <span className="footer-bar__credit">{t('footer_made')}</span>
        <div className="footer-bar__right">
          <span className="footer-bar__name">Valentin Bedague</span>
          <Link to="/legal" className="footer-bar__legal">{t('footer_legal')}</Link>
        </div>
      </div>

    </footer>
  )
}
