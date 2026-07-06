import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { useContactDrawer } from './ContactDrawerContext'
import { useLanguage } from '../../i18n/LanguageContext'
import './ContactDrawer.css'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function ContactDrawer() {
  const { open, closeDrawer } = useContactDrawer()
  const { t } = useLanguage()
  const formRef    = useRef(null)
  const openedAtRef = useRef(null)          // antibot: timestamp d'ouverture
  const [status,     setStatus]     = useState('idle')
  const [emailError, setEmailError] = useState('')

  // Lock body scroll + reset timestamp when drawer opens
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) openedAtRef.current = Date.now()
    return () => { document.body.style.overflow = '' }
  }, [open])

  const fields = [
    { name: 'from_name',  labelKey: 'field_name',    type: 'text',     phKey: 'ph_name',    span: 1 },
    { name: 'from_email', labelKey: 'field_email',   type: 'email',    phKey: 'ph_email',   span: 1 },
    { name: 'subject',    labelKey: 'field_subject',  type: 'text',     phKey: 'ph_subject', span: 2 },
    { name: 'message',    labelKey: 'field_message',  type: 'textarea', phKey: 'ph_message', span: 2 },
  ]

  const handleEmailBlur = (e) => {
    const val = e.target.value.trim()
    if (val && !EMAIL_RE.test(val)) {
      setEmailError(t('email_invalid'))
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!SERVICE_ID) { alert(t('emailjs_alert')); return }

    const form = formRef.current
    const data = new FormData(form)

    // ── Antibot 1 : honeypot — champ caché rempli = bot
    if (data.get('website')) return

    // ── Antibot 2 : soumission trop rapide (< 3 s)
    if (Date.now() - openedAtRef.current < 3000) return

    // ── Antibot 3 : validation email côté JS
    const email = data.get('from_email')?.trim() ?? ''
    if (!EMAIL_RE.test(email)) {
      setEmailError(t('email_invalid'))
      return
    }

    setStatus('loading')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('success')
      form.reset()
      setEmailError('')
      setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
          />

          {/* Panel */}
          <motion.aside
            className="cd-panel"
            data-lenis-prevent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="cd-header">
              <div>
                <p className="cd-header__label">{t('contact_label')}</p>
                <h2 className="cd-header__title">
                  {t('contact_title_1')}{' '}
                  <span className="cd-header__accent">{t('contact_title_2')}</span>
                </h2>
              </div>
              <button className="cd-close" onClick={closeDrawer} aria-label="Fermer">
                <span />
                <span />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="cd-form" noValidate>

              {/* Antibot — honeypot : invisible pour les humains, rempli par les bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
              />

              <div className="cd-fields">
                {fields.map((f) => (
                  <div key={f.name} className={`cd-field ${f.span === 2 ? 'cd-field--full' : ''}`}>
                    <label htmlFor={`cd-${f.name}`} className="cd-label">{t(f.labelKey)}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        id={`cd-${f.name}`}
                        name={f.name}
                        placeholder={t(f.phKey)}
                        required
                        rows={4}
                        className="cd-input cd-input--textarea"
                      />
                    ) : (
                      <input
                        id={`cd-${f.name}`}
                        name={f.name}
                        type={f.type}
                        placeholder={t(f.phKey)}
                        required
                        className={`cd-input${f.name === 'from_email' && emailError ? ' cd-input--error' : ''}`}
                        {...(f.name === 'from_email' ? { onBlur: handleEmailBlur } : {})}
                      />
                    )}
                    {f.name === 'from_email' && emailError && (
                      <span className="cd-field-error">{emailError}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className={`cd-submit btn-primary ${status === 'loading' ? 'loading' : ''}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <><span className="cd-spinner" />{t('btn_sending')}</>
                ) : t('btn_send')}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.p
                    className="cd-feedback cd-feedback--success"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >{t('feedback_success')}</motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    className="cd-feedback cd-feedback--error"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >{t('feedback_error')}</motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Contact links */}
            <div className="cd-links">
              <a href="mailto:contact@valentinbedague.com" className="cd-link">
                <span className="cd-link__icon">✉</span>
                contact@valentinbedague.com
              </a>
              <a href="https://www.linkedin.com/in/valentin-bedague/" target="_blank" rel="noopener noreferrer" className="cd-link">
                <span className="cd-link__icon">in</span>
                LinkedIn
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
