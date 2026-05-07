import { useEffect } from 'react'
import PageTransition  from '../components/PageTransition/PageTransition'
import Hero            from '../sections/Hero/Hero'
import HomeProjectsRow from '../sections/Projects/HomeProjectsRow'
import ScratchSection  from '../sections/Scratch/ScratchSection'
import TechCarousel    from '../sections/Tech/TechCarousel'
import ContactCTA      from '../sections/ContactCTA/ContactCTA'
import SEO, { SITE, setJsonLd } from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import './HomePage.css'

const JSON_LD_PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Valentin Bedague',
  jobTitle: 'Web Designer & Full Stack Developer',
  url: SITE,
  email: 'contact@valentinbedague.com',
  sameAs: [
    'https://www.linkedin.com/in/valentin-bedague/',
    'https://www.instagram.com/valentinbedague',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Biarritz',
    addressRegion: 'Pyrénées-Atlantiques',
    addressCountry: 'FR',
  },
  knowsAbout: ['Web Design', 'React', 'Full Stack Development', 'UI/UX', 'SEO', 'E-commerce'],
}

const JSON_LD_WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Valentin Bedague',
  url: SITE,
  description: 'Portfolio de Valentin Bedague — web designer & développeur full stack',
  inLanguage: ['fr', 'en'],
}

export default function HomePage() {
  const { t, lang } = useLanguage()

  // Injecte le second bloc JSON-LD (WebSite) une seule fois
  useEffect(() => { setJsonLd('json-ld-website', JSON_LD_WEBSITE) }, [])

  return (
    <PageTransition>
      <SEO
        title={t('seo_home_title')}
        description={t('seo_home_desc')}
        url="/"
        lang={lang}
        jsonLd={JSON_LD_PERSON}
      />
      <div className="home-fold">
        <Hero />
        <HomeProjectsRow />
      </div>
      <ScratchSection />
      <TechCarousel />
      <ContactCTA />
    </PageTransition>
  )
}
