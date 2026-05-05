import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'
import './About.css'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  const { t } = useLanguage()

  const services = [
    { icon: '◈', labelKey: 'svc_1_label', descKey: 'svc_1_desc' },
    { icon: '◉', labelKey: 'svc_2_label', descKey: 'svc_2_desc' },
    { icon: '◎', labelKey: 'svc_3_label', descKey: 'svc_3_desc' },
    { icon: '◇', labelKey: 'svc_4_label', descKey: 'svc_4_desc' },
    { icon: '◈', labelKey: 'svc_5_label', descKey: 'svc_5_desc' },
    { icon: '◉', labelKey: 'svc_6_label', descKey: 'svc_6_desc' },
  ]

  const stats = [
    { valKey: 'stat_1_val', labelKey: 'stat_1_label' },
    { valKey: 'stat_2_val', labelKey: 'stat_2_label' },
    { valKey: 'stat_3_val', labelKey: 'stat_3_label' },
  ]

  return (
    <section id="about" className="section about">
      <div className="container">

        <div className="about__grid">

          {/* Left — bio */}
          <motion.div
            className="about__bio"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">{t('about_label')}</span>
            <h2 className="section-title about__title">
              {t('about_title_1')}<br />
              <span className="about__title-accent">{t('about_title_2')}</span>
            </h2>

            <p className="about__text">{t('about_text_1')}</p>
            <p className="about__text">{t('about_text_2')}</p>

            <div className="about__stats">
              {stats.map(({ valKey, labelKey }) => (
                <div key={labelKey} className="about__stat">
                  <span className="about__stat-val">{t(valKey)}</span>
                  <span className="about__stat-label">{t(labelKey)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — services */}
          <motion.div
            className="about__services"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className="section-label">{t('services_label')}</span>
            <div className="about__services-grid">
              {services.map((s) => (
                <motion.div key={s.labelKey} className="service-item" variants={item}>
                  <span className="service-icon" aria-hidden="true">{s.icon}</span>
                  <div>
                    <p className="service-label">{t(s.labelKey)}</p>
                    <p className="service-desc">{t(s.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
