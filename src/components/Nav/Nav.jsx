import { useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import './Nav.css'

const links = [
  { label: 'Home',   to: '/',      end: true  },
  { label: 'Work',   to: '/#projects', work: true },
  { label: 'About',  to: '/about', end: false },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
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
            Home
          </NavLink>
          <a href="/#projects" onClick={handleWork} className="nav__link">
            Work
          </a>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav__link active' : 'nav__link'}>
            About
          </NavLink>
        </nav>

        <Link to="/about#contact" className="nav__cta btn-ghost">
          Contact
        </Link>

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
          <Link    to="/"      className="nav__drawer-link" onClick={() => setOpen(false)}>Home</Link>
          <a href="/#projects" className="nav__drawer-link" onClick={handleWork}>Work</a>
          <Link    to="/about" className="nav__drawer-link" onClick={() => setOpen(false)}>About</Link>
          <Link    to="/about#contact" className="btn-primary" style={{ marginTop: 16 }} onClick={() => setOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </header>
  )
}
