import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner container">

        {/* Gauche — headline */}
        <h1 className="hero__headline" aria-label="Your website, iconic and effective">
          <span className="line-mask"><span className="hero__line">YOUR</span></span>
          <span className="line-mask"><span className="hero__line">WEBSITE</span></span>
          <span className="line-mask">
            <span className="hero__line hero__line--outline">ICONIC &amp;</span>
          </span>
          <span className="line-mask"><span className="hero__line">EFFECTIVE</span></span>
        </h1>

        {/* Droite — présentation */}
        <div className="hero__right">
          <div className="hero__info">
            <span className="hero__available">
              <span className="hero__dot" />
              Available for new projects
            </span>
            <p className="hero__intro">
              Hi, I'm <strong>Val</strong>, web designer<br />
              &amp; full stack developer.<br />
              <span className="hero__location">
                Based in Biarritz, France — Often elsewhere.
              </span>
            </p>
            <p className="hero__body">
              I work with businesses, founders<br />
              and creatives to bring their best ideas to life.
            </p>
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
              View my work
            </a>
            <a href="/about" className="btn-ghost">Get in touch</a>
          </div>
        </div>

      </div>
    </section>
  )
}
