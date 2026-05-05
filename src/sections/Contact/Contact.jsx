import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { motion, AnimatePresence } from 'framer-motion'
import './Contact.css'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const fields = [
  { name: 'from_name',  label: 'Name',    type: 'text',     placeholder: 'John Smith',              span: 1 },
  { name: 'from_email', label: 'Email',   type: 'email',    placeholder: 'john@example.com',        span: 1 },
  { name: 'subject',    label: 'Subject', type: 'text',     placeholder: 'Website project…',        span: 2 },
  { name: 'message',    label: 'Message', type: 'textarea', placeholder: 'Tell me about your project…', span: 2 },
]

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!SERVICE_ID) {
      alert('EmailJS not configured. See .env.example for instructions.')
      return
    }
    setStatus('loading')
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      setStatus('success')
      formRef.current.reset()
      setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">

        <div className="contact__grid">

          {/* Left — heading */}
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Contact</span>
            <h2 className="section-title contact__title">
              Let's talk about<br />
              <span className="contact__title-accent">your project</span>
            </h2>
            <p className="contact__sub">
              Have a project in mind? A question? Write to me and I'll get back to you within 24h.
            </p>

            <div className="contact__links">
              <a href="mailto:contact@vbdev.fr" className="contact__link">
                <span className="contact__link-icon">✉</span>
                contact@vbdev.fr
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact__link">
                <span className="contact__link-icon">in</span>
                LinkedIn
              </a>
            </div>

            {/* Decorative element */}
            <div className="contact__deco" aria-hidden="true">
              <div className="contact__deco-ring contact__deco-ring--1" />
              <div className="contact__deco-ring contact__deco-ring--2" />
              <span className="contact__deco-label">VB</span>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            className="contact__form-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="contact__form" noValidate>
              <div className="contact__fields">
                {fields.map((f) => (
                  <div
                    key={f.name}
                    className={`contact__field ${f.span === 2 ? 'contact__field--full' : ''}`}
                  >
                    <label htmlFor={f.name} className="contact__label">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        id={f.name}
                        name={f.name}
                        placeholder={f.placeholder}
                        required
                        rows={5}
                        className="contact__input contact__input--textarea"
                      />
                    ) : (
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.type}
                        placeholder={f.placeholder}
                        required
                        className="contact__input"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="contact__submit-row">
                <button
                  type="submit"
                  className={`contact__submit btn-primary ${status === 'loading' ? 'loading' : ''}`}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="contact__spinner" />
                      Sending…
                    </>
                  ) : 'Send message'}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p
                      className="contact__feedback contact__feedback--success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ✓ Message sent! I'll get back to you shortly.
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      className="contact__feedback contact__feedback--error"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ✕ Something went wrong. Try again or reach out directly.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
