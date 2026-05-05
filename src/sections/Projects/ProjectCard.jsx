import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null)

  /* 3-D tilt on mouse move */
  const handleMove = (e) => {
    const el   = cardRef.current
    const rect = el.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width  - 0.5
    const y    = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.setProperty('--tx', `${x * -14}deg`)
    el.style.setProperty('--ty', `${y *  14}deg`)
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const handleLeave = () => {
    const el = cardRef.current
    el.style.setProperty('--tx', '0deg')
    el.style.setProperty('--ty', '0deg')
  }

  return (
    <motion.article
      ref={cardRef}
      className="project-card"
      data-hover
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--accent-card': project.accentColor }}
    >
      {/* Visual area */}
      <div className="card__visual">
        {project.screenshot
          ? <img src={project.screenshot} alt={project.title} className="card__img" loading="lazy" />
          : (
            <div className="card__placeholder" style={{ background: project.gradient }}>
              <span className="card__placeholder-label">{project.title}</span>
              <div className="card__placeholder-grid" />
            </div>
          )
        }

        {/* Hover overlay */}
        <div className="card__overlay">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card__visit"
            aria-label={`Visiter ${project.title}`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M5 13L13 5M13 5H7M13 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Visiter le site
          </a>
        </div>

        {/* Shine */}
        <div className="card__shine" />
      </div>

      {/* Content area */}
      <div className="card__body">
        <div className="card__header">
          <div>
            <span className="card__category">{project.category}</span>
            <h3 className="card__title">{project.title}</h3>
          </div>
          <span className="card__num">0{index + 1}</span>
        </div>

        <p className="card__desc">{project.description}</p>

        <div className="card__footer">
          <div className="card__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="card__tag">{tag}</span>
            ))}
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card__link"
          >
            Voir →
          </a>
        </div>
      </div>
    </motion.article>
  )
}
