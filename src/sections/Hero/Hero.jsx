import { useLanguage } from '../../i18n/LanguageContext'
import { useContactDrawer } from '../../components/ContactDrawer/ContactDrawerContext'
import './Hero.css'

export default function Hero() {
  const { t } = useLanguage()
  const { openDrawer } = useContactDrawer()

  return (
    <section className="hero">
      <div className="hero__inner container">

        {/* Left — headline (brand slogan stays English) */}
        <h1 className="hero__headline" aria-label="Your website, iconic and effective">
          <span className="line-mask"><span className="hero__line">YOUR</span></span>
          <span className="line-mask"><span className="hero__line">WEBSITE</span></span>
          <span className="line-mask">
            <span className="hero__line hero__line--outline">ICONIC &amp;</span>
          </span>
          <span className="line-mask"><span className="hero__line">EFFECTIVE</span></span>
        </h1>

        {/* Right — intro */}
        <div className="hero__right">
          <div className="hero__info">
            <span className="hero__available">
              <span className="hero__dot" />
              {t('hero_available')}
            </span>
            <p className="hero__intro">
              Hi, I'm <strong>{t('hero_intro_name')}</strong>, {t('hero_intro_role')}<br />
              <span className="hero__location">{t('hero_location')}</span>
            </p>
            <p className="hero__body">{t('hero_body')}</p>
          </div>

          <div className="hero__cta">
            <a
              href="#projects"
              className="btn-primary"
              onClick={e => {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t('hero_cta_work')}
            </a>
            <button onClick={openDrawer} className="btn-ghost">{t('hero_cta_contact')}</button>
          </div>
        </div>

      </div>
    </section>
  )
}
