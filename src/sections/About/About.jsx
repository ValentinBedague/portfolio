import { motion } from 'framer-motion'
import './About.css'

const services = [
  { icon: '◈', label: 'Design & Integration', desc: 'Refined UI, typography, responsive design' },
  { icon: '◉', label: 'Custom Development', desc: 'React, Vite, high-performance architectures' },
  { icon: '◎', label: 'SEO & Performance', desc: 'Core Web Vitals optimization, organic visibility' },
  { icon: '◇', label: 'E-commerce', desc: 'Online stores, optimized conversion funnels' },
  { icon: '◈', label: 'Digital Branding', desc: 'Visual identity adapted for the web' },
  { icon: '◉', label: 'Maintenance & Support', desc: 'Long-term partnership, fast iterations' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">

        <div className="about__grid">

          {/* Left — bio */}
          <motion.div
            className="about__bio"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">About</span>
            <h2 className="section-title about__title">
              Design, code,<br />
              <span className="about__title-accent">ship.</span>
            </h2>

            <p className="about__text">
              Passionate web designer &amp; full stack developer, I build
              websites that are <strong>iconic and effective</strong> — experiences
              that stick in people's minds and convert.
            </p>
            <p className="about__text">
              I collaborate with entrepreneurs, founders and creatives
              to bring their best ideas to life, from the first brief
              to the last pixel.
            </p>

            <div className="about__stats">
              {[
                { val: '4+',  label: 'Projects delivered' },
                { val: '100%', label: 'Custom-built' },
                { val: '∞',   label: 'Coffee consumed' },
              ].map(({ val, label }) => (
                <div key={label} className="about__stat">
                  <span className="about__stat-val">{val}</span>
                  <span className="about__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — services */}
          <motion.div
            className="about__services"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <span className="section-label">Services</span>
            <div className="about__services-grid">
              {services.map((s) => (
                <motion.div key={s.label} className="service-item" variants={item}>
                  <span className="service-icon" aria-hidden="true">{s.icon}</span>
                  <div>
                    <p className="service-label">{s.label}</p>
                    <p className="service-desc">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
