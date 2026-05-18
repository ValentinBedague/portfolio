import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

function detectTheme() {
  const stored = localStorage.getItem('vb-theme')
  if (stored === 'dark' || stored === 'light') return stored
  // Respect system preference as fallback
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(detectTheme)

  const switchTheme = (newTheme) => {
    if (newTheme !== 'dark' && newTheme !== 'light') return
    setTheme(newTheme)
    localStorage.setItem('vb-theme', newTheme)
  }

  const toggleTheme = () => switchTheme(theme === 'dark' ? 'light' : 'dark')

  // Keep body class in sync with state
  useEffect(() => {
    document.body.classList.toggle('site-light', theme === 'light')
  }, [theme])

  // Apply on mount (before paint) — prevents flash of wrong theme
  useEffect(() => {
    const stored = localStorage.getItem('vb-theme')
    if (stored === 'light') document.body.classList.add('site-light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, switchTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
