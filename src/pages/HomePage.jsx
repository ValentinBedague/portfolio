import PageTransition  from '../components/PageTransition/PageTransition'
import Hero            from '../sections/Hero/Hero'
import HomeProjectsRow from '../sections/Projects/HomeProjectsRow'
import ScratchSection  from '../sections/Scratch/ScratchSection'
import './HomePage.css'

export default function HomePage() {
  return (
    <PageTransition>
      <div className="home-fold">
        <Hero />
        <HomeProjectsRow />
      </div>
      <ScratchSection />
    </PageTransition>
  )
}
