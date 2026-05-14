import { useRef, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '../data/projects'
import PageTransition from '../components/PageTransition/PageTransition'
import SEO, { SITE } from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import { ArrowRight } from '../components/ArrowIcon'
import './ProjectPage.css'

const ease = [0.16, 1, 0.3, 1]

/* ── Word-by-word reveal ─────────────────────────────────────────── */
function AnimatedTitle({ title }) {
  const words = title.split(' ')
  return (
    <h1 className="pp-hero__title" aria-label={title}>
      {words.map((word, i) => (
        <span key={i} className="pp-word-clip">
          <motion.span
            className="pp-word-inner"
            initial={{ y: '110%', rotate: 2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1.05, ease, delay: 0.3 + i * 0.09 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}



/* ── Gallery slide (large format) ───────────────────────────────── */
function GallerySlide({ item, index }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!item.src) return
    const isTouch = window.matchMedia('(hover: none)').matches
    if (!isTouch) return
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? video.play().catch(() => {}) : video.pause() },
      { threshold: 0.5 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [item.src])

  const handleEnter = () => videoRef.current?.play().catch(() => {})
  const handleLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }

  return (
    <motion.div
      className={`pp-slide${index % 2 === 1 ? ' pp-slide--alt' : ''}`}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.95, ease }}
    >
      <div className="pp-slide__index">
        <span className="pp-slide__num">{String(index + 1).padStart(2, '0')}</span>
        {item.label && <span className="pp-slide__label">{item.label}</span>}
      </div>
      <div
        className="pp-slide__frame"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {item.poster && (
          <img src={item.poster} alt={item.label ?? ''} className="pp-slide__img" />
        )}
        {item.src && (
          <video
            ref={videoRef}
            src={item.src}
            className={`pp-slide__video${playing ? ' pp-slide__video--on' : ''}`}
            muted loop playsInline preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        )}
        {item.src && !playing && (
          <div className="pp-slide__play">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="27" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
              <path d="M23 18.5l18 9.5-18 9.5V18.5z" fill="white"/>
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Scroll progress bar (left side) ────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="pp-progress"
      style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
    />
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function ProjectPage() {
  const { slug }    = useParams()
  const { t, lang } = useLanguage()
  const project     = projects.find(p => p.slug === slug)
  const heroRef     = useRef(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgY          = useTransform(heroProgress, [0, 1], ['0%', '28%'])
  const titleY       = useTransform(heroProgress, [0, 1], ['0%', '30%'])
  const heroOpacity  = useTransform(heroProgress, [0, 0.75], [1, 0])

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
  const prev = projects[idx - 1] ?? null
  const next = projects[idx + 1] ?? null

  const get = (field) =>
    typeof project[field] === 'object'
      ? project[field][lang] ?? project[field].en
      : project[field]

  const gallery = [
    ...(project.screenshot ? [{ poster: project.screenshot, label: null }] : []),
    ...(project.clips ?? []).map(c => ({ src: c.src, poster: c.poster, label: c.label })),
  ]

  const numLabel = `${String(idx + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`

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

      <ScrollProgress />

      <div className="project-page">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section ref={heroRef} className="pp-hero">

          {/* Parallax background image */}
          {project.screenshot && (
            <motion.div className="pp-hero__bg" style={{ y: bgY }}>
              <img src={project.screenshot} alt="" className="pp-hero__bg-img" aria-hidden="true" />
            </motion.div>
          )}

          {/* Gradient overlay (project accent color) */}
          <div
            className="pp-hero__tint"
            style={{ background: project.gradient ?? 'linear-gradient(160deg,#080808 0%,#111 100%)' }}
          />
          {/* Dark vignette */}
          <div className="pp-hero__vignette" />

          {/* ── Top bar ───────────────────────────────────────── */}
          <motion.div
            className="pp-hero__top container"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
          >
            <Link to="/work" className="pp-hero__back">
              <ArrowRight className="pp-hero__back-arrow" />
              <span>{lang === 'fr' ? 'Tous les projets' : 'All work'}</span>
            </Link>
            <span className="pp-hero__counter">{numLabel}</span>
          </motion.div>

          {/* ── Bottom content (parallaxes out on scroll) ──────── */}
          <motion.div
            className="pp-hero__bottom container"
            style={{ y: titleY, opacity: heroOpacity }}
          >
            <motion.span
              className="pp-hero__cat"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.18 }}
            >
              {get('category')}
            </motion.span>

            <AnimatedTitle title={project.title} />

            <motion.div
              className="pp-hero__foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.75 }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pp-hero__cta"
              >
                <span className="pp-hero__cta-dot" />
                {lang === 'fr' ? 'Voir le site' : 'View live'}
                <ArrowRight className="pp-hero__cta-arrow" />
              </a>
              <span className="pp-hero__year">{project.year}</span>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="pp-hero__scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
          >
            <motion.span
              className="pp-hero__scroll-line"
              animate={{ scaleY: [0, 1, 0], y: ['0%', '40%', '40%'] }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.4 }}
            />
            <span className="pp-hero__scroll-txt">scroll</span>
          </motion.div>

        </section>

        {/* ── ABOUT ─────────────────────────────────────────────── */}
        <section className="pp-about container">
          <motion.div
            className="pp-section-head"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease }}
          >
            <span className="pp-section-num">— 01</span>
            <span className="pp-section-label">{lang === 'fr' ? 'À propos' : 'About'}</span>
          </motion.div>

          <motion.p
            className="pp-about__desc"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease, delay: 0.1 }}
          >
            {get('description')}
          </motion.p>
        </section>

        {/* ── GALLERY ───────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="pp-gallery">
            <motion.div
              className="pp-section-head container"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
            >
              <span className="pp-section-num">— 02</span>
              <span className="pp-section-label">{lang === 'fr' ? 'Aperçu' : 'Gallery'}</span>
            </motion.div>

            <div className="pp-gallery__list container">
              {gallery.map((item, i) => (
                <GallerySlide key={i} item={item} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── DETAILS ───────────────────────────────────────────── */}
        <section className="pp-details container">
          <motion.div
            className="pp-section-head"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease }}
          >
            <span className="pp-section-num">— 03</span>
            <span className="pp-section-label">{lang === 'fr' ? 'Infos' : 'Details'}</span>
          </motion.div>

          <div className="pp-details__body">
            {/* Oversized year */}
            <motion.div
              className="pp-details__year"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
            >
              {project.year}
            </motion.div>

            {/* Info blocks */}
            <motion.div
              className="pp-details__blocks"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              <div className="pp-details__block">
                <span className="pp-details__label">{t('pp_services')}</span>
                <div className="pp-details__tags">
                  {get('tags').map(tag => (
                    <span key={tag} className="pp-tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="pp-details__block">
                <span className="pp-details__label">{t('pp_website')}</span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-details__url"
                >
                  {project.url.replace(/https?:\/\//, '').replace(/\/$/, '')}
                  <ArrowRight className="pp-details__url-arrow" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── NEXT PROJECT ──────────────────────────────────────── */}
        <div className="pp-next-wrap container">
          {prev && (
            <Link to={`/work/${prev.slug}`} className="pp-prev">
              <ArrowRight className="pp-prev__arrow" />
              <span>{t('pp_prev')} — {prev.title}</span>
            </Link>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            {next ? (
              <Link to={`/work/${next.slug}`} className="pp-next">
                {next.screenshot && (
                  <img src={next.screenshot} alt={next.title} className="pp-next__img" />
                )}
                <div className="pp-next__gradient" style={{ background: next.gradient }} />
                <div className="pp-next__overlay" />
                <div className="pp-next__content">
                  <span className="pp-next__eyebrow">{t('pp_next')}</span>
                  <span className="pp-next__title">{next.title}</span>
                  <ArrowRight className="pp-next__arrow" />
                </div>
              </Link>
            ) : (
              <Link to="/work" className="pp-next pp-next--all">
                <div className="pp-next__overlay" />
                <div className="pp-next__content">
                  <span className="pp-next__eyebrow">{t('pp_all')}</span>
                  <span className="pp-next__title">
                    {lang === 'fr' ? 'Tous les projets' : 'All projects'} →
                  </span>
                </div>
              </Link>
            )}
          </motion.div>
        </div>

      </div>
    </PageTransition>
  )
}
