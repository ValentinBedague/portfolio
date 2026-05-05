import PageTransition from '../components/PageTransition/PageTransition'
import About   from '../sections/About/About'
import Contact from '../sections/Contact/Contact'
import './AboutPage.css'

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="about-page">
        <div className="about-page__hero container">
          <span className="about-page__eyebrow">About</span>
          <h1 className="about-page__title">
            Turning your ideas
            <span className="about-page__title--dim">into exceptional websites.</span>
          </h1>
        </div>
        <About />
        <div id="contact">
          <Contact />
        </div>
      </div>
    </PageTransition>
  )
}
