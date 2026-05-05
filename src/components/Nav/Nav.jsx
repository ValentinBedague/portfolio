import { useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import LangSwitcher from '../LangSwitcher/LangSwitcher'
import './Nav.css'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleWork = (e) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname === '/') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <header className="nav">
      <div className="nav__inner">

        <Link to="/" className="nav__logo" aria-label="Valentin Bedague — Home">
          <img src="/logo.svg" alt="VB" className="nav__logo-img" />
        </Link>

        <nav className="nav__links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}>
            {t('nav_home')}
          </NavLink>
          <a href="/#projects" onClick={handleWork} className="nav__link">
            {t('nav_work')}
          </a>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}>
            {t('nav_about')}
          </NavLink>
        </nav>

        <div className="nav__actions">
          <LangSwitcher />
          <Link to="/about#contact" className="nav__cta btn-ghost">
            {t('nav_contact')}
          </Link>
        </div>

        <button
          className={`nav__burger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="nav__drawer">
          <Link    to="/"      className="nav__drawer-link" onClick={() => setOpen(false)}>{t('nav_home')}</Link>
          <a href="/#projects" className="nav__drawer-link" onClick={handleWork}>{t('nav_work')}</a>
          <Link    to="/about" className="nav__drawer-link" onClick={() => setOpen(false)}>{t('nav_about')}</Link>
          <Link    to="/about#contact" className="btn-primary" style={{ marginTop: 16 }} onClick={() => setOpen(false)}>
            {t('nav_contact')}
          </Link>
        </div>
      )}
    </header>
  )
}
