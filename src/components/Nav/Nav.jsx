import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'
import { useContactDrawer } from '../ContactDrawer/ContactDrawerContext'
import LangSwitcher  from '../LangSwitcher/LangSwitcher'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'
import { ArrowRight } from '../ArrowIcon'
import './Nav.css'

const overlayVariants = {
  hidden: {
    clipPath: 'inset(0 0 100% 0)',
    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
  },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
  },
}

const itemVariants = {
  hidden: { y: '115%' },
  visible: (i) => ({
    y: 0,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.08 + i * 0.07 },
  }),
}

const footerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.38 } },
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { t }          = useLanguage()
  const location       = useLocation()
  const { openDrawer } = useContactDrawer()
  const headerRef = useRef(null)

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Slide nav up in sync with footer reveal (scroll-driven, no CSS transition delay)
  useEffect(() => {
    const nav = headerRef.current
    if (!nav) return
    const update = () => {
      const appBody = document.querySelector('.app-body')
      if (!appBody) return
      const threshold = Math.max(0, appBody.offsetHeight - window.innerHeight)
      const reveal = Math.max(0, window.scrollY - threshold)
      nav.style.transform = reveal > 0 ? `translateY(${-reveal}px)` : ''
      nav.style.pointerEvents = reveal > 0 ? 'none' : ''
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  const links = [
    { to: '/',      label: t('nav_home'),  num: '01', end: true },
    { to: '/work',  label: t('nav_work'),  num: '02', end: false },
    { to: '/about', label: t('nav_about'), num: '03', end: false },
  ]

  return (
    <>
      <header ref={headerRef} className={`nav${open ? ' nav--open' : ''}`}>
        <div className="nav__inner">

          <Link to="/" className="nav__logo" aria-label="Valentin Bedague — Home" onClick={close}>
            <img src="/logo.svg" alt="VB" className="nav__logo-img" />
          </Link>

          <nav className="nav__links" aria-label="Main navigation">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <ThemeSwitcher />
            <LangSwitcher />
            <button onClick={openDrawer} className="nav__cta btn-ghost">
              {t('nav_contact')}
            </button>
          </div>

          {/* Burger — 2 lines that cross */}
          <button
            className={`nav__burger${open ? ' open' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="nav__burger-line nav__burger-line--top" />
            <span className="nav__burger-line nav__burger-line--bot" />
          </button>

        </div>
      </header>

      {/* ── Full-screen menu overlay ──────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-modal="true"
            role="dialog"
          >
            {/* Decorative background word */}
            <span className="nav__overlay-deco" aria-hidden="true">MENU</span>

            <div className="nav__overlay-inner">

              {/* ── Navigation links ─────────────────────────── */}
              <nav className="nav__overlay-links">
                {links.map(({ to, label, num, end }, i) => (
                  <div key={to} className="nav__overlay-row">
                    <div className="nav__overlay-mask">
                      <motion.div
                        className="nav__overlay-item"
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <span className="nav__overlay-num">{num}</span>
                        <NavLink
                          to={to}
                          end={end}
                          className={({ isActive }) =>
                            `nav__overlay-link${isActive ? ' active' : ''}`
                          }
                          onClick={close}
                        >
                          {label}
                          <ArrowRight className="nav__overlay-arrow" />
                        </NavLink>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </nav>

              {/* ── Footer row ───────────────────────────────── */}
              <motion.div
                className="nav__overlay-footer"
                variants={footerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="nav__overlay-switches">
                  <ThemeSwitcher />
                  <LangSwitcher />
                </div>
                <button
                  className="btn-primary"
                  onClick={() => { close(); openDrawer() }}
                >
                  {t('nav_contact')} <ArrowRight className="nav__contact-arrow" />
                </button>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
