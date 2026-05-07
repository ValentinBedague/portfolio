import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'
import PageTransition from '../components/PageTransition/PageTransition'
import SEO, { SITE } from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import './ProjectPage.css'

export default function ProjectPage() {
  const { slug }   = useParams()
  const { t, lang } = useLanguage()
  const project    = projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <PageTransition>
        <div className="project-page project-page--404 container">
          <p>{t('pp_not_found')}</p>
          <Link to="/">{t('pp_back_home')}</Link>
        </div>
      </PageTransition>
    )
  }

  const idx  = projects.findIndex(p => p.slug === slug)
  const prev = projects[idx - 1]
  const next = projects[idx + 1]

  // Support bilingual fields (object) or plain strings
  const get = (field) =>
    typeof project[field] === 'object' ? project[field][lang] ?? project[field].en : project[field]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: get('description'),
    url: project.url,
    image: project.screenshot ? `${SITE}${project.screenshot}` : undefined,
    creator: { '@type': 'Person', name: 'Valentin Bedague', url: SITE },
    keywords: get('tags').join(', '),
  }

  return (
    <PageTransition>
      <SEO
        title={project.title}
        description={get('description')}
        image={project.screenshot}
        url={`/work/${project.slug}`}
        type="article"
        lang={lang}
        jsonLd={jsonLd}
      />
      <div className="project-page">

        {/* Hero visuel */}
        <div className="pp-hero" style={{ background: project.gradient }}>
          {project.screenshot && (
            <img
              src={project.screenshot}
              alt={`${project.title} — aperçu du projet`}
              className="pp-hero__img"
              fetchpriority="high"
              loading="eager"
            />
          )}
          <div className="pp-hero__overlay" />
          <div className="pp-hero__content container">
            <nav className="pp-breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="pp-breadcrumb__link">{t('nav_home')}</Link>
              <span className="pp-breadcrumb__sep" aria-hidden="true">/</span>
              <Link to="/work" className="pp-breadcrumb__link">{t('nav_work')}</Link>
            </nav>
            <span className="pp-hero__cat">{get('category')}</span>
            <h1 className="pp-hero__title">{project.title}</h1>
          </div>
        </div>

        {/* Contenu */}
        <div className="pp-body container">
          <div className="pp-grid">
            <div className="pp-desc">
              <h2 className="pp-desc__heading">{t('pp_about')}</h2>
              <p className="pp-desc__text">{get('description')}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary pp-link"
              >
                {t('pp_view_live')}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            <div className="pp-meta">
              <div className="pp-meta__block">
                <span className="pp-meta__label">{t('pp_services')}</span>
                <div className="pp-meta__tags">
                  {get('tags').map(tag => (
                    <span key={tag} className="pp-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="pp-meta__block">
                <span className="pp-meta__label">{t('pp_website')}</span>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="pp-meta__url">
                  {project.url.replace(/https?:\/\//, '')}
                </a>
              </div>
            </div>
          </div>

          {!project.screenshot && (
            <div className="pp-media-placeholder" style={{ background: project.gradient }}>
              <span>{t('pp_screenshots')}</span>
            </div>
          )}
        </div>

        {/* Navigation entre projets */}
        <nav className="pp-nav container" aria-label="Other projects">
          <div>
            {prev && (
              <Link to={`/work/${prev.slug}`} className="pp-nav__link pp-nav__link--prev">
                <span className="pp-nav__dir">{t('pp_prev')}</span>
                <span className="pp-nav__name">{prev.title}</span>
              </Link>
            )}
          </div>
          <Link to="/" className="pp-nav__all">{t('pp_all')}</Link>
          <div>
            {next && (
              <Link to={`/work/${next.slug}`} className="pp-nav__link pp-nav__link--next">
                <span className="pp-nav__dir">{t('pp_next')}</span>
                <span className="pp-nav__name">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>

      </div>
    </PageTransition>
  )
}
