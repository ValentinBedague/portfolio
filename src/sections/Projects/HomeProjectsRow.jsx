import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import './HomeProjectsRow.css'

function Card({ project, index, onEnter, onLeave }) {
  const navigate       = useNavigate()
  const { lang }       = useLanguage()
  const cardRef        = useRef(null)
  const videoRef       = useRef(null)

  const category = typeof project.category === 'object'
    ? project.category[lang] ?? project.category.en
    : project.category

  const go = () => navigate(`/work/${project.slug}`)

  const handleEnter = () => {
    onEnter()
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleLeave = () => {
    onLeave()
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <article
      ref={cardRef}
      className="hpr-card"
      onClick={go}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && go()}
      aria-label={project.title}
    >
      <div className="hpr-card__visual">
        {project.screenshot
          ? <img src={project.screenshot} alt={project.title} className="hpr-card__img" />
          : <div className="hpr-card__bg" style={{ background: project.gradient }} />
        }
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            className="hpr-card__video"
            muted
            loop
            playsInline
          />
        )}
      </div>

      <div className="hpr-card__info">
        <span className="hpr-card__num">0{index + 1}</span>
        <div>
          <p className="hpr-card__cat">{category}</p>
          <p className="hpr-card__title">{project.title}</p>
        </div>
      </div>
    </article>
  )
}

export default function HomeProjectsRow() {
  const { lang }    = useLanguage()
  const sectionRef  = useRef(null)
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 })

  const label = lang === 'fr' ? 'Ouvrir le projet' : 'Open project'

  const onMove = (e) => {
    setCursor(s => ({ ...s, x: e.clientX, y: e.clientY }))
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="hpr"
      onMouseMove={onMove}
    >
      {projects.map((p, i) => (
        <Card
          key={p.id}
          project={p}
          index={i}
          onEnter={() => setCursor(s => ({ ...s, visible: true }))}
          onLeave={() => setCursor(s => ({ ...s, visible: false }))}
        />
      ))}

      {cursor.visible && (
        <div
          className="hpr__cursor"
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        >
          {label}
        </div>
      )}
    </section>
  )
}
