import PageTransition from '../components/PageTransition/PageTransition'
import About   from '../sections/About/About'
import SEO, { SITE } from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import './AboutPage.css'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'About — Valentin Bedague',
  url: `${SITE}/about`,
  mainEntity: {
    '@type': 'Person',
    name: 'Valentin Bedague',
    jobTitle: 'Web Designer & Full Stack Developer',
    url: SITE,
  },
}

export default function AboutPage() {
  const { t, lang } = useLanguage()

  return (
    <PageTransition>
      <SEO
        title={t('seo_about_title')}
        description={t('seo_about_desc')}
        url="/about"
        lang={lang}
        jsonLd={JSON_LD}
      />
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
