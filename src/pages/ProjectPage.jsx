import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { projects } from '../data/projects'
import PageTransition from '../components/PageTransition/PageTransition'
import SEO, { SITE } from '../components/SEO/SEO'
import { useLanguage } from '../i18n/LanguageContext'
import { ArrowRight, ArrowUpRight } from '../components/ArrowIcon'
import MagneticButton from '../components/MagneticButton'
import './ProjectPage.css'

const ease = [0.16, 1, 0.3, 1]

/* ── Word-by-word reveal ─────────────────────────────────────────── */
function AnimatedTitle({ title }) {
  const words = title.split(' ')
  const ref   = useRef(null)

  /* Auto-fit : réduit la taille seulement si le mot le plus long déborde */
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '' // reset → reprend le clamp CSS
      const wrap  = el.parentElement
      const ws    = getComputedStyle(wrap)
      const available = wrap.clientWidth
        - parseFloat(ws.paddingLeft) - parseFloat(ws.paddingRight)
      const widest = Math.max(
        ...[...el.children].map(c => c.getBoundingClientRect().width)
      )
      if (widest > available) {
        const current = parseFloat(getComputedStyle(el).fontSize)
        el.style.fontSize = `${Math.floor(current * (available / widest) * 0.98)}px`
      }
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [title])

  return (
    <h1 ref={ref} className="pp-hero__title" aria-label={title}>
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

/* ── Hero media — visuel principal, révélé en clip-path au scroll ── */
function HeroMedia({ project }) {
  const wrapRef  = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  /* Encadré arrondi → pleine largeur pendant le scroll */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.95', 'center 0.5'],
  })
  const smooth   = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.7 })
  const clipPath = useTransform(smooth, [0, 1], ['inset(0% 5% round 14px)', 'inset(0% 0% round 0px)'])
  const scale    = useTransform(smooth, [0, 1], [1.1, 1])

  /* Autoplay tactile — la vidéo joue quand elle est visible */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !window.matchMedia('(hover: none)').matches) return
    const io = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? video.play().catch(() => {}) : video.pause() },
      { threshold: 0.45 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  const enter = () => videoRef.current?.play().catch(() => {})
  const leave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }

  return (
    <section ref={wrapRef} className="pp-hmedia" aria-label={project.title}>
      <motion.div
        className="pp-hmedia__clip"
        style={{ clipPath }}
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.15, ease, delay: 0.6 }}
      >
        <div className="pp-hmedia__frame" onMouseEnter={enter} onMouseLeave={leave}>
          <motion.div className="pp-hmedia__layer" style={{ scale }}>
            {project.screenshot
              ? <img src={project.screenshot} alt={project.title} className="pp-hmedia__img" />
              : <div className="pp-hmedia__img" style={{ background: project.gradient }} />
            }
            {project.video && (
              <video
                ref={videoRef}
                src={project.video}
                className={`pp-hmedia__video${playing ? ' pp-hmedia__video--on' : ''}`}
                muted loop playsInline preload="metadata"
                style={{
                  ...(project.videoFit   ? { objectFit: project.videoFit } : {}),
                  ...(project.videoScale ? { transform: `scale(${project.videoScale})` } : {}),
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ── Section header with animated growing line ───────────────────── */
function SectionHead({ num, label }) {
  return (
    <motion.div
      className="pp-section-head"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease }}
    >
      <span className="pp-section-num">{num}</span>
      <span className="pp-section-label">{label}</span>
      <motion.span
        className="pp-section-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease, delay: 0.3 }}
      />
    </motion.div>
  )
}

/* ── Gallery slide — scroll-driven clip-path expansion ──────────── */
function GallerySlide({ item }) {
  const wrapRef  = useRef(null)
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  /* Scroll-driven clip-path: boxed → almost full-screen */
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.88', 'center 0.46'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.7 })
  const clipPath = useTransform(
    smooth,
    [0, 1],
    ['inset(2% 10% round 10px)', 'inset(0% 0% round 0px)']
  )

  /* Précharge la vidéo dès que le slide approche du viewport */
  useEffect(() => {
    if (!item.src) return
    const video = videoRef.current
    const wrap  = wrapRef.current
    if (!video || !wrap) return

    const ioLoad = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { video.load(); ioLoad.disconnect() } },
      { rootMargin: '300px', threshold: 0 }
    )
    ioLoad.observe(wrap)

    /* Autoplay touch */
    const isTouch = window.matchMedia('(hover: none)').matches
    if (!isTouch) return () => ioLoad.disconnect()

    const ioPlay = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? video.play().catch(() => {}) : video.pause() },
      { threshold: 0.5 }
    )
    ioPlay.observe(video)
    return () => { ioLoad.disconnect(); ioPlay.disconnect() }
  }, [item.src])

  const handleEnter = () => videoRef.current?.play().catch(() => {})
  const handleLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }

  return (
    <motion.div
      ref={wrapRef}
      className="pp-slide"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease }}
    >
      {/* Expander breaks out of container → clip-path drives the reveal */}
      <motion.div className="pp-slide__expander" style={{ clipPath }}>
        <div
          className="pp-slide__frame"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Corner bracket decorations */}
          <div className="pp-slide__corners" aria-hidden="true">
            <span /><span /><span /><span />
          </div>

          {item.poster && (
            <img src={item.poster} alt={item.label ?? ''} className="pp-slide__img" />
          )}
          {item.src && (
            <video
              ref={videoRef}
              src={item.src}
              className={`pp-slide__video${playing ? ' pp-slide__video--on' : ''}`}
              muted loop playsInline preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          )}
          {item.src && !playing && (
            <div className="pp-slide__play">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="27" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <circle cx="28" cy="28" r="27" stroke="var(--pp-accent,rgba(255,255,255,0.15))" strokeWidth="1" opacity="0.5"/>
                <path d="M23 18.5l18 9.5-18 9.5V18.5z" fill="white"/>
              </svg>
            </div>
          )}
        </div>
      </motion.div>
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
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
  const heroY       = useTransform(heroProgress, [0, 1], ['0%', '12%'])

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

  /* Le visuel principal vit dans le hero — la gallery ne montre que les clips */
  const gallery = (project.clips ?? []).map(c => ({ src: c.src, poster: c.poster, label: c.label }))

  const projectType = typeof project.projectType === 'object'
    ? project.projectType[lang] ?? project.projectType.en
    : project.projectType

  const metaItems = [
    { label: lang === 'fr' ? 'Année' : 'Year', value: project.year },
    ...(projectType ? [{ label: 'Type', value: projectType }] : []),
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

      {/* --pp-accent injected: each project colours its own page */}
      <div
        className="project-page"
        style={{ '--pp-accent': project.accentColor ?? '#ffffff' }}
      >

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section ref={heroRef} className="pp-hero">

          {/* Index fantôme — motif outline de l'identité */}
          <motion.span
            className="pp-hero__index"
            aria-hidden="true"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.45 }}
          >
            {String(idx + 1).padStart(2, '0')}
          </motion.span>

          {/* Top bar */}
          <motion.div
            className="pp-hero__top container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
          >
            <Link to="/work" className="pp-hero__back">
              <ArrowRight className="pp-hero__back-arrow" />
              <span>{lang === 'fr' ? 'Projets' : 'Work'}</span>
            </Link>
            <span className="pp-hero__counter">{numLabel}</span>
          </motion.div>

          {/* Eyebrow italique + titre géant */}
          <motion.div
            className="pp-hero__title-wrap"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <motion.span
              className="pp-hero__cat"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              {get('category')}
            </motion.span>
            <AnimatedTitle title={project.title} />
          </motion.div>

          {/* Méta-barre : année / type + CTA magnétique */}
          <motion.div
            className="pp-hero__meta container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
          >
            <div className="pp-hero__meta-cols">
              {metaItems.map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  className="pp-hero__meta-item"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.62 + i * 0.08 }}
                >
                  <span className="pp-hero__meta-label">{label}</span>
                  <span className="pp-hero__meta-value">{value}</span>
                </motion.div>
              ))}
            </div>

            <MagneticButton
              as="a"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pp-hero__cta"
              strength={0.2}
            >
              <span className="pp-hero__cta-dot" />
              {lang === 'fr' ? 'Voir le site' : 'View live'}
              <ArrowUpRight className="pp-hero__cta-arrow" />
            </MagneticButton>
          </motion.div>

        </section>

        {/* ── HERO MEDIA — visuel principal full-bleed ──────────── */}
        <HeroMedia project={project} />

        {/* ── ABOUT ─────────────────────────────────────────────── */}
        <section className="pp-about container">
          {/* Ambient accent orb */}
          <div className="pp-about__orb" aria-hidden="true" />

          <SectionHead
            num="— 01"
            label={lang === 'fr' ? 'À propos' : 'About'}
          />

          <motion.p
            className="pp-about__desc"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease, delay: 0.1 }}
          >
            {get('description')}
          </motion.p>

          {project.about && (
            <motion.p
              className="pp-about__detail"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease, delay: 0.22 }}
            >
              {project.about[lang] ?? project.about.en}
            </motion.p>
          )}

          {get('tags')?.length > 0 && (
            <div className="pp-about__tags">
              {get('tags').map((tag, i) => (
                <motion.span
                  key={i}
                  className="pp-about__tag"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease, delay: 0.3 + i * 0.07 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
        </section>

        {/* ── GALLERY ───────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <section className="pp-gallery">
            <SectionHead
              num="— 02"
              label={lang === 'fr' ? 'Aperçu' : 'Gallery'}
            />

            <div className="pp-gallery__list container">
              {gallery.map((item, i) => (
                <GallerySlide key={i} item={item} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── DETAILS ───────────────────────────────────────────── */}
        <section className="pp-details container">
          <SectionHead
            num="— 03"
            label={lang === 'fr' ? 'Infos' : 'Details'}
          />

          <motion.div
            className="pp-details__blocks"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Services & Stack — two columns */}
            {(project.services || project.stack) && (
              <div className="pp-breakdown__cols">
                {project.services && (
                  <div className="pp-breakdown__col">
                    <span className="pp-breakdown__col-title">
                      {lang === 'fr' ? 'Services' : 'Services'}
                    </span>
                    <div className="pp-service-list">
                      {(project.services[lang] ?? project.services.en).map((svc, i) => (
                        <motion.div
                          key={i}
                          className="pp-service-row"
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                        >
                          <span className="pp-service-row__num">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="pp-service-row__name">{svc}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {project.stack && (
                  <div className="pp-breakdown__col">
                    <span className="pp-breakdown__col-title">Stack</span>
                    <div className="pp-stack-list">
                      {project.stack.map((tech, i) => (
                        <motion.div
                          key={i}
                          className="pp-stack-item"
                          initial={{ opacity: 0, x: 16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                        >
                          <span className="pp-stack-item__dot" />
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Website + project type */}
            <div className="pp-details__foot">
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
              {project.projectType && (
                <span className="pp-breakdown__type">
                  {typeof project.projectType === 'object'
                    ? project.projectType[lang] ?? project.projectType.en
                    : project.projectType}
                </span>
              )}
            </div>
          </motion.div>
        </section>

        {/* ── NEXT PROJECT ──────────────────────────────────────── */}
        <div className="pp-next-wrap">

          {/* Prev — petit lien discret */}
          {prev && (
            <div className="pp-prev-row container">
              <Link to={`/work/${prev.slug}`} className="pp-prev">
                <ArrowRight className="pp-prev__arrow" />
                <span>{t('pp_prev')} — {prev.title}</span>
              </Link>
            </div>
          )}

          {/* Next — bloc typographique pleine largeur */}
          {next ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease }}
            >
              <Link
                to={`/work/${next.slug}`}
                className="pp-next"
                style={{ '--next-accent': next.accentColor ?? '#ffffff' }}
              >
                {/* Fond révélé au hover */}
                <div className="pp-next__bg" aria-hidden="true">
                  {next.screenshot && (
                    <img src={next.screenshot} alt="" className="pp-next__bg-img" />
                  )}
                  <div className="pp-next__bg-gradient" style={{ background: next.gradient }} />
                </div>

                <div className="pp-next__inner container">
                  <div className="pp-next__top">
                    <span className="pp-next__label">{t('pp_next')}</span>
                    <ArrowRight className="pp-next__arrow" />
                  </div>
                  <span className="pp-next__title">{next.title}</span>
                </div>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease }}
            >
              <Link to="/work" className="pp-next pp-next--all">
                <div className="pp-next__inner container">
                  <div className="pp-next__top">
                    <span className="pp-next__label">{t('pp_all')}</span>
                    <ArrowRight className="pp-next__arrow" />
                  </div>
                  <span className="pp-next__title">
                    {lang === 'fr' ? 'Tous les projets' : 'All projects'}
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

        </div>

      </div>
    </PageTransition>
  )
}
