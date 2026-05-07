import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

// Detect preferred language — no cookie, no consent needed (read-only browser API)
function detectLanguage() {
  const stored = localStorage.getItem('vb-lang')
  if (stored === 'fr' || stored === 'en') return stored

  const browser = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase()
  return browser.startsWith('fr') ? 'fr' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage)

  // t(key) — returns translated string, falls back to EN then to key itself
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

  const switchLang = (newLang) => {
    if (newLang !== 'fr' && newLang !== 'en') return
    setLang(newLang)
    // localStorage = strictly functional preference, no GDPR consent required
    localStorage.setItem('vb-lang', newLang)
  }

  // SEO: keep <html lang> in sync — title & meta sont gérés par le composant SEO
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, t, switchLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
