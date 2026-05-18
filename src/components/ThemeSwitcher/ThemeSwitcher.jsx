import { useTheme } from '../../i18n/ThemeContext'
import './ThemeSwitcher.css'

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2"     x2="12" y2="4.5"/>
    <line x1="12" y1="19.5"  x2="12" y2="22"/>
    <line x1="4.22" y1="4.22"   x2="5.88" y2="5.88"/>
    <line x1="18.12" y1="18.12" x2="19.78" y2="19.78"/>
    <line x1="2"  y1="12" x2="4.5" y2="12"/>
    <line x1="19.5" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.88" y2="18.12"/>
    <line x1="18.12" y1="5.88" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export default function ThemeSwitcher() {
  const { theme, switchTheme } = useTheme()
  const isLight = theme === 'light'

  const handleToggle = () => {
    const next = isLight ? 'dark' : 'light'
    const coverBg = next === 'light' ? '#f2f1ef' : '#0a0a0a'

    // Smooth cover-fade transition — avoids CSS conflict with Framer Motion
    const cover = document.createElement('div')
    cover.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'pointer-events:none',
      `background:${coverBg}`,
      'opacity:0',
      'transition:opacity 110ms ease',
    ].join(';')
    document.body.appendChild(cover)

    // Double rAF to ensure browser paints the initial opacity:0 first
    requestAnimationFrame(() => requestAnimationFrame(() => {
      cover.style.opacity = '0.88'

      setTimeout(() => {
        switchTheme(next)
        cover.style.transition = 'opacity 340ms ease'
        cover.style.opacity = '0'
        setTimeout(() => cover.remove(), 380)
      }, 130)
    }))
  }

  return (
    <button
      className={`theme-sw${isLight ? ' theme-sw--light' : ''}`}
      onClick={handleToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Mode sombre' : 'Mode clair'}
    >
      {/* Sun — visible in light mode */}
      <span className="theme-sw__icon theme-sw__icon--sun" aria-hidden="true">
        <SunIcon />
      </span>
      {/* Moon — visible in dark mode */}
      <span className="theme-sw__icon theme-sw__icon--moon" aria-hidden="true">
        <MoonIcon />
      </span>
    </button>
  )
}
