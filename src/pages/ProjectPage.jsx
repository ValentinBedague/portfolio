import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'
import PageTransition from '../components/PageTransition/PageTransition'
import './ProjectPage.css'

export default function ProjectPage() {
  const { slug }  = useParams()
  const project   = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <PageTransition>
        <div className="project-page project-page--404 container">
          <p>Project not found.</p>
          <Link to="/">← Back to home</Link>
        </div>
      </PageTransition>
    )
  }

  const idx  = projects.findIndex(p => p.slug === slug)
  const prev = projects[idx - 1]
  const next = projects[idx + 1]

  return (
    <PageTransition>
      <div className="project-page">

        {/* Hero visuel */}
        <div className="pp-hero" style={{ background: project.gradient }}>
          {project.screenshot && (
            <img src={project.screenshot} alt={project.title} className="pp-hero__img" />
          )}
          <div className="pp-hero__overlay" />
          <div className="pp-hero__content container">
            <span className="pp-hero__cat">{project.category}</span>
            <h1 className="pp-hero__title">{project.title}</h1>
          </div>
        </div>

        {/* Contenu */}
        <div className="pp-body container">
          <div className="pp-grid">
            <div className="pp-desc">
              <h2 className="pp-desc__heading">About the project</h2>
              <p className="pp-desc__text">{project.description}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary pp-link"
              >
                View live site
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            <div className="pp-meta">
              <div className="pp-meta__block">
                <span className="pp-meta__label">Services</span>
                <div className="pp-meta__tags">
                  {project.tags.map(t => (
                    <span key={t} className="pp-tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="pp-meta__block">
                <span className="pp-meta__label">Website</span>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="pp-meta__url">
                  {project.url.replace(/https?:\/\//, '')}
                </a>
              </div>
            </div>
          </div>

          {!project.screenshot && (
            <div className="pp-media-placeholder" style={{ background: project.gradient }}>
              <span>Screenshots coming soon</span>
            </div>
          )}
        </div>

        {/* Navigation entre projets */}
        <nav className="pp-nav container" aria-label="Other projects">
          <div>
            {prev && (
              <Link to={`/work/${prev.slug}`} className="pp-nav__link pp-nav__link--prev">
                <span className="pp-nav__dir">← Previous</span>
                <span className="pp-nav__name">{prev.title}</span>
              </Link>
            )}
          </div>
          <Link to="/" className="pp-nav__all">All projects</Link>
          <div>
            {next && (
              <Link to={`/work/${next.slug}`} className="pp-nav__link pp-nav__link--next">
                <span className="pp-nav__dir">Next →</span>
                <span className="pp-nav__name">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>

      </div>
    </PageTransition>
  )
}
