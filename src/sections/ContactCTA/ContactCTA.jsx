import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useContactDrawer } from '../../components/ContactDrawer/ContactDrawerContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { ArrowUpRight } from '../../components/ArrowIcon'
import './ContactCTA.css'

export default function ContactCTA() {
  const ref = useRef(null)
  const { openDrawer } = useContactDrawer()
  const { t } = useLanguage()

  /* ── Scroll-driven content animations ─────────────────────── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.1'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.8 })

  const q1Y  = useTransform(smooth, [0,    0.4 ], [56, 0])
  const q1O  = useTransform(smooth, [0,    0.4 ], [0,  1])
  const q2Y  = useTransform(smooth, [0.15, 0.55], [56, 0])
  const q2O  = useTransform(smooth, [0.15, 0.55], [0,  1])
  const q3Y  = useTransform(smooth, [0.3,  0.7 ], [56, 0])
  const q3O  = useTransform(smooth, [0.3,  0.7 ], [0,  1])
  const ctaY = useTransform(smooth, [0.5,  1   ], [72, 0])
  const ctaO = useTransform(smooth, [0.5,  1   ], [0,  1])

  return (
    <section ref={ref} className="ccta-section">
      <div className="container">

        {/* ── Eyebrow ────────────────────────────────────────── */}
        <div className="ccta-eyebrow">
          <span className="ccta-eyebrow__line" />
          <span className="ccta-eyebrow__text">{t('ccta_eyebrow')}</span>
        </div>

        {/* ── Staircase questions ────────────────────────────── */}
        <div className="ccta-questions">
          <div className="ccta-q-wrap">
            <motion.h2 className="ccta-q ccta-q--1" style={{ y: q1Y, opacity: q1O }}>
              {t('ccta_q1')}
            </motion.h2>
          </div>
          <div className="ccta-q-wrap">
            <motion.h2 className="ccta-q ccta-q--2" style={{ y: q2Y, opacity: q2O }}>
              {t('ccta_q2')}
            </motion.h2>
          </div>
          <div className="ccta-q-wrap">
            <motion.h2 className="ccta-q ccta-q--3" style={{ y: q3Y, opacity: q3O }}>
              {t('ccta_q3')}
            </motion.h2>
          </div>
        </div>

        {/* ── Giant CTA ──────────────────────────────────────── */}
        <motion.div className="ccta-main" style={{ y: ctaY, opacity: ctaO }}>
          <button
            className="ccta-main__btn"
            onClick={openDrawer}
            aria-label="Open contact"
          >
            <span className="ccta-main__word">{t('ccta_word')}</span>
            <ArrowUpRight className="ccta-main__arrow" />
          </button>
        </motion.div>

        {/* ── Bottom strip ───────────────────────────────────── */}
        <div className="ccta-strip">
          <span className="ccta-strip__avail">
            <span className="ccta-strip__dot" />
            {t('ccta_available')}
          </span>
          <span className="ccta-strip__reply">{t('ccta_reply')}</span>
        </div>

      </div>
    </section>
  )
}
