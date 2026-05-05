import PageTransition  from '../components/PageTransition/PageTransition'
import Hero            from '../sections/Hero/Hero'
import HomeProjectsRow from '../sections/Projects/HomeProjectsRow'
import Contact         from '../sections/Contact/Contact'
import { useLanguage } from '../i18n/LanguageContext'
import './HomePage.css'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <PageTransition>
      <div className="home-fold">
        <Hero />
        <HomeProjectsRow />
      </div>

      <Contact />

      <footer className="home-footer container">
        <img src="/logo.svg" alt="VB" style={{ height: 28, width: 'auto' }} />
        <span className="home-footer__copy">
          © 2025 Val B. — {t('footer_role')}
        </span>
        <div className="home-footer__links">
          <a href="/about">{t('footer_about')}</a>
          <a href="mailto:contact@vbdev.fr">contact@vbdev.fr</a>
        </div>
      </footer>
    </PageTransition>
  )
}
