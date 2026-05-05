import PageTransition from '../components/PageTransition/PageTransition'
import About   from '../sections/About/About'
import { useLanguage } from '../i18n/LanguageContext'
import './AboutPage.css'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <PageTransition>
      <div className="about-page">
        <div className="about-page__hero container">
          <span className="about-page__eyebrow">{t('about_page_eyebrow')}</span>
          <h1 className="about-page__title">
            {t('about_page_title_1')}
            <span className="about-page__title--dim">{t('about_page_title_2')}</span>
          </h1>
        </div>
        <About />
      </div>
    </PageTransition>
  )
}
