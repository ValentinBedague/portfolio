import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import './LangSwitcher.css'

export default function LangSwitcher() {
  const { lang, switchLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const other = lang === 'en' ? 'fr' : 'en'

  return (
    <div className={`lang-sw ${open ? 'lang-sw--open' : ''}`} ref={ref}>
      <button
        className="lang-sw__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
      >
        {lang.toUpperCase()}
        <svg className="lang-sw__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="lang-sw__dropdown" role="listbox" aria-label="Language">
        <button
          className="lang-sw__option"
          role="option"
          aria-selected={false}
          onClick={() => { switchLang(other); setOpen(false) }}
        >
          {other.toUpperCase()}
        </button>
      </div>
    </div>
  )
}
