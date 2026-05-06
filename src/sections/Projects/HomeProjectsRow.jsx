import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import './HomeProjectsRow.css'

/* ── Desktop card ──────────────────────────────────────────────── */
function Card({ project, index, onEnter, onLeave }) {
  const navigate  = useNavigate()
  const { lang }  = useLanguage()
  const videoRef  = useRef(null)

  const category = typeof project.category === 'object'
    ? project.category[lang] ?? project.category.en
    : project.category

  const go = () => navigate(`/work/${project.slug}`)

  const handleEnter = () => {
    onEnter()
    videoRef.current?.play().catch(() => {})
  }
  const handleLeave = () => {
    onLeave()
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }

  return (
    <article
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
          <video ref={videoRef} src={project.video} className="hpr-card__video" muted loop playsInline />
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

/* ── Mobile slider ─────────────────────────────────────────────── */
function MobileSlider() {
  const navigate    = useNavigate()
  const { lang }    = useLanguage()
  const sliderRef   = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress,  setProgress]  = useState(0)
  const total = projects.length

  // Track progress via scroll
  const onScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  // Track active slide via IntersectionObserver
  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    const slides = el.querySelectorAll('.hpr-slide')

    const io = new IntersectionObserver(
      (entries) => {
        let best = { ratio: 0, idx: 0 }
        entries.forEach(entry => {
          const idx = [...slides].indexOf(entry.target)
          if (entry.intersectionRatio > best.ratio) best = { ratio: entry.intersectionRatio, idx }
        })
        if (best.ratio > 0) setActiveIdx(best.idx)
      },
      { root: el, threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    )

    slides.forEach(s => io.observe(s))
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => { io.disconnect(); el.removeEventListener('scroll', onScroll) }
  }, [onScroll])

  // Snap to a slide programmatically
  const snapTo = (idx) => {
    const el = sliderRef.current
    if (!el) return
    const slide = el.querySelectorAll('.hpr-slide')[idx]
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <div className="hpr-mobile" id="projects">

      {/* ── Slider ─────────────────────────────────────────────── */}
      <div ref={sliderRef} className="hpr-mobile__slider">
        {projects.map((p, i) => {
          const category = typeof p.category === 'object'
            ? p.category[lang] ?? p.category.en
            : p.category

          return (
            <article
              key={p.id}
              className={`hpr-slide${activeIdx === i ? ' hpr-slide--active' : ''}`}
              onClick={() => navigate(`/work/${p.slug}`)}
              aria-label={p.title}
            >
              {/* Visual */}
              <div className="hpr-slide__visual">
                {p.screenshot
                  ? <img src={p.screenshot} alt={p.title} className="hpr-slide__img" />
                  : <div className="hpr-slide__bg" style={{ background: p.gradient }} />
                }
              </div>

              {/* Gradient overlays */}
              <div className="hpr-slide__gradient" />
              <div
                className="hpr-slide__accent"
                style={{ background: `linear-gradient(to top, ${p.accentColor}40 0%, transparent 55%)` }}
              />

              {/* Info */}
              <div className="hpr-slide__info">
                <div className="hpr-slide__meta">
                  <span className="hpr-slide__num">0{i + 1}</span>
                  <span className="hpr-slide__cat">{category}</span>
                </div>
                <div className="hpr-slide__bottom">
                  <p className="hpr-slide__title">{p.title}</p>
                  <span className="hpr-slide__arrow">↗</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* ── Controls ───────────────────────────────────────────── */}
      <div className="hpr-mobile__controls">

        {/* Progress line + counter */}
        <div className="hpr-mobile__progress">
          <span className="hpr-mobile__idx">
            {String(activeIdx + 1).padStart(2, '0')}
          </span>
          <div className="hpr-mobile__track">
            <div
              className="hpr-mobile__fill"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <span className="hpr-mobile__total">
            {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Dot navigation */}
        <div className="hpr-mobile__dots">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`hpr-mobile__dot${activeIdx === i ? ' active' : ''}`}
              onClick={() => snapTo(i)}
              aria-label={`Project ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

/* ── Main export ───────────────────────────────────────────────── */
export default function HomeProjectsRow() {
  const sectionRef = useRef(null)
  const { lang }   = useLanguage()
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 })

  const label  = lang === 'fr' ? 'Ouvrir le projet' : 'Open project'
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const onMove = (e) => setCursor(s => ({ ...s, x: e.clientX, y: e.clientY }))

  return (
    <>
      {/* ── Desktop grid ─────────────────────────────────────── */}
      <section
        ref={sectionRef}
        id="projects"
        className="hpr"
        onMouseMove={isTouch ? undefined : onMove}
        aria-label="Projects"
      >
        {projects.map((p, i) => (
          <Card
            key={p.id}
            project={p}
            index={i}
            onEnter={() => !isTouch && setCursor(s => ({ ...s, visible: true }))}
            onLeave={() => setCursor(s => ({ ...s, visible: false }))}
          />
        ))}

        {!isTouch && cursor.visible && (
          <div
            className="hpr__cursor"
            style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          >
            {label}
          </div>
        )}
      </section>

      {/* ── Mobile slider ────────────────────────────────────── */}
      <MobileSlider />
    </>
  )
}
