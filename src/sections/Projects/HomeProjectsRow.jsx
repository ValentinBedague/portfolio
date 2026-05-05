import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../../data/projects'
import './HomeProjectsRow.css'

function Card({ project, index }) {
  const navigate = useNavigate()
  const cardRef  = useRef(null)

  const go = () => navigate(`/work/${project.slug}`)

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12
    cardRef.current.querySelector('.hpr-card__bg').style.transform =
      `translate(${x}px, ${y}px) scale(1.08)`
  }
  const onLeave = () => {
    cardRef.current.querySelector('.hpr-card__bg').style.transform = 'translate(0,0) scale(1.04)'
  }

  return (
    <article
      ref={cardRef}
      className="hpr-card"
      onClick={go}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && go()}
      aria-label={`Voir le projet ${project.title}`}
    >
      <div className="hpr-card__visual">
        {project.screenshot
          ? <img src={project.screenshot} alt={project.title} className="hpr-card__img" />
          : <div className="hpr-card__bg" style={{ background: project.gradient }} />
        }
        <div className="hpr-card__overlay">
          <span className="hpr-card__cta">Voir le projet →</span>
        </div>
      </div>

      <div className="hpr-card__info">
        <span className="hpr-card__num">0{index + 1}</span>
        <div>
          <p className="hpr-card__cat">{project.category}</p>
          <p className="hpr-card__title">{project.title}</p>
        </div>
      </div>
    </article>
  )
}

export default function HomeProjectsRow() {
  return (
    <section id="projects" className="hpr">
      {projects.map((p, i) => (
        <Card key={p.id} project={p} index={i} />
      ))}
    </section>
  )
}
