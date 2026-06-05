import { Link } from 'react-router-dom'
import { useLanguage }       from '../../i18n/LanguageContext'
import { useTheme }          from '../../i18n/ThemeContext'
import { useContactDrawer }  from '../ContactDrawer/ContactDrawerContext'
import { ArrowUpRight }      from '../ArrowIcon'
import './Footer.css'

const SOCIAL = {
  instagram: 'https://www.instagram.com/valentinbedague',
  linkedin:  'https://www.linkedin.com/in/valentinbedague',
}

const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <circle cx="17.6" cy="6.4" r="0.9" fill="currentColor" stroke="none"/>
  </svg>
)

const IconLinkedin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

export default function Footer() {
  const { t }          = useLanguage()
  const { theme }      = useTheme()
  const { openDrawer } = useContactDrawer()
  const year           = new Date().getFullYear()

  // Footer is always the inverse of the page theme
  const footerDark = theme === 'light'
  const logoSrc    = footerDark ? '/logo.svg' : '/logo-dark.svg'

  const links = [
    { to: '/',      label: t('nav_home'),  end: true  },
    { to: '/work',  label: t('nav_work'),  end: false },
    { to: '/about', label: t('nav_about'), end: false },
  ]

  return (
    <footer className={`site-footer${footerDark ? ' site-footer--dark' : ' site-footer--light'}`}>
      <div className="footer-grid">

        {/* ── Q1 — Headline (top-left) ─────────────────────────── */}
        <div className="footer-q footer-q--headline">
          <div className="footer-headline">
            <span className="footer-headline__line">{t('footer_hl_1')}</span>
            <span className="footer-headline__line footer-headline__line--ghost">
              {t('footer_hl_2')}
            </span>
          </div>
          <div className="footer-socials">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
               className="footer-social" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer"
               className="footer-social" aria-label="LinkedIn">
              <IconLinkedin />
            </a>
          </div>
        </div>

        {/* ── Q2 — Contact CTA (top-right) ─────────────────────── */}
        {/* Toute la case est cliquable */}
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

        {/* ── Q3 — Sitemap + meta (bottom-left) ────────────────── */}
        <div className="footer-q footer-q--meta">

          <div className="footer-sitemap">
            <span className="footer-sitemap__label">Sitemap</span>
            <nav className="footer-sitemap__nav" aria-label="Footer navigation">
              {links.map(({ to, label }) => (
                <Link key={to} to={to} className="footer-sitemap__link">
                  {label}
                  <ArrowUpRight className="footer-sitemap__arrow" />
                </Link>
              ))}
              <button
                className="footer-sitemap__link footer-sitemap__link--contact"
                onClick={openDrawer}
              >
                {t('nav_contact')}
                <ArrowUpRight className="footer-sitemap__arrow" />
              </button>
            </nav>
          </div>

          <div className="footer-metabar">
            <span className="footer-credit">VALENTIN BEDAGUE © {year}</span>
            <span className="footer-made">Made by me :)</span>
            <Link to="/legal" className="footer-legal">{t('footer_legal')}</Link>
          </div>

        </div>

        {/* ── Q4 — Logo (bottom-right) ─────────────────────────── */}
        <div className="footer-q footer-q--logo">
          <img src={logoSrc} alt="VB" className="footer-logo-img" />
        </div>

      </div>
    </footer>
  )
}
