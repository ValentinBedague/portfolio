import PageTransition  from '../components/PageTransition/PageTransition'
import Hero            from '../sections/Hero/Hero'
import HomeProjectsRow from '../sections/Projects/HomeProjectsRow'
import ScratchSection  from '../sections/Scratch/ScratchSection'
import TechCarousel    from '../sections/Tech/TechCarousel'
import ContactCTA      from '../sections/ContactCTA/ContactCTA'
import './HomePage.css'

export default function HomePage() {
  return (
    <PageTransition>
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
