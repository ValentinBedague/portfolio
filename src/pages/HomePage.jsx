import PageTransition  from '../components/PageTransition/PageTransition'
import Hero            from '../sections/Hero/Hero'
import HomeProjectsRow from '../sections/Projects/HomeProjectsRow'
import ScratchSection  from '../sections/Scratch/ScratchSection'
import TechCarousel    from '../sections/Tech/TechCarousel'
import ContactCTA      from '../sections/ContactCTA/ContactCTA'
import SEO, { SITE } from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import './HomePage.css'

/* L'identité de marque (WebSite + Person + ProfessionalService, reliés par @id)
   est déclarée en JSON-LD statique dans index.html → présente sur toutes les
   pages et lue même sans exécution JS. La home référence ce graphe via une
   entité WebPage rattachée par @id. */
const JSON_LD_HOME = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE}/#webpage`,
  url: `${SITE}/`,
  name: 'Webdesigner & Développeur Web à Biarritz — Valentin Bedague',
  isPartOf: { '@id': `${SITE}/#website` },
  about: { '@id': `${SITE}/#business` },
  inLanguage: 'fr',
}

export default function HomePage() {
  const { t, lang } = useLanguage()

  return (
    <PageTransition>
      <SEO
        title={t('seo_home_title')}
        description={t('seo_home_desc')}
        url="/"
        lang={lang}
        jsonLd={JSON_LD_HOME}
      />
      <div className="home-fold">
        <Hero />
        <HomeProjectsRow />
      </div>
      {/* <ScratchSection /> */}
      <TechCarousel />
      <ContactCTA />
    </PageTransition>
  )
}
