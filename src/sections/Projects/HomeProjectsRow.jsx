import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import { ArrowUpRight } from '../../components/ArrowIcon'
import './HomeProjectsRow.css'

/* ── Desktop card ──────────────────────────────────────────────── */
function Card({ project, index, onEnter, onLeave }) {
  const { lang }  = useLanguage()
  const videoRef  = useRef(null)

  const category = typeof project.category === 'object'
    ? project.category[lang] ?? project.category.en
    : project.category

  const handleEnter = () => {
    onEnter()
    videoRef.current?.play().catch(() => {})
  }
  const handleLeave = () => {
    onLeave()
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }

  /* Vrai lien <a> (crawlable par les moteurs) plutôt qu'un onClick JS */
  return (
    <Link
      to={`/work/${project.slug}`}
      className="hpr-card"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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
            muted loop playsInline
            style={{
              ...(project.videoFit  ? { objectFit: project.videoFit } : {}),
              ...(project.videoScale ? { transform: `scale(${project.videoScale})` } : {}),
            }}
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
    </Link>
  )
}

/* ── Mobile slider ─────────────────────────────────────────────── */
function MobileSlider() {
  const { lang }      = useLanguage()
  const rootRef       = useRef(null)
  const sliderRef     = useRef(null)
  const fillRef       = useRef(null)   // progress bar fill — updated via DOM
  const idxLabelRef   = useRef(null)   // "01" counter — updated via DOM
  const dotRefs       = useRef([])     // dot buttons — updated via DOM
  const activeIdxRef  = useRef(0)      // current active index, no state
  const total = projects.length

  useEffect(() => {
    const el   = sliderRef.current
    const root = rootRef.current
    if (!el || !root) return
    const slides = Array.from(el.querySelectorAll('.hpr-slide'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Compteur autoplay (ms écoulées sur la slide courante) — déclaré ici
       car setActive le remet à zéro à chaque changement de slide */
    let elapsed = 0

    /* ── Direct DOM update — zero React re-renders during scroll ── */
    const setActive = (idx) => {
      if (idx === activeIdxRef.current) return
      // Slide classes
      slides[activeIdxRef.current]?.classList.remove('hpr-slide--active')
      slides[idx]?.classList.add('hpr-slide--active')
      // Dot classes
      dotRefs.current[activeIdxRef.current]?.classList.remove('active')
      dotRefs.current[idx]?.classList.add('active')
      // Counter label
      if (idxLabelRef.current)
        idxLabelRef.current.textContent = String(idx + 1).padStart(2, '0')
      activeIdxRef.current = idx
      elapsed = 0 // nouvelle slide → le minuteur repart de zéro
    }

    /* ── IntersectionObserver — single threshold, fires rarely ─── */
    const io = new IntersectionObserver(
      (entries) => {
        let best = { ratio: -1, idx: 0 }
        entries.forEach(entry => {
          if (entry.intersectionRatio > best.ratio) {
            best = { ratio: entry.intersectionRatio, idx: slides.indexOf(entry.target) }
          }
        })
        if (best.ratio > 0.4) setActive(best.idx)
      },
      { root: el, threshold: 0.5 }
    )
    slides.forEach(s => io.observe(s))

    /* ── prefers-reduced-motion : pas d'autoplay, la barre reflète
         la position de scroll (comportement d'origine) ──────────── */
    if (reduceMotion) {
      let rafId = null
      const onScroll = () => {
        if (rafId) return
        rafId = requestAnimationFrame(() => {
          rafId = null
          const max = el.scrollWidth - el.clientWidth
          const p   = max > 0 ? el.scrollLeft / max : 0
          if (fillRef.current)
            fillRef.current.style.transform = `scaleX(${p})`
        })
      }
      el.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        io.disconnect()
        el.removeEventListener('scroll', onScroll)
        if (rafId) cancelAnimationFrame(rafId)
      }
    }

    /* ── Autoplay — la barre se remplit en AUTOPLAY_MS puis passe à
         la slide suivante (boucle). Toute interaction remet le
         compteur à zéro : le défilement auto n'agit que si
         l'utilisateur ne touche à rien. ──────────────────────────── */
    const AUTOPLAY_MS = 5000
    let touching = false   // doigt posé sur le carrousel
    let inView   = false   // carrousel visible à l'écran (pause hors viewport / desktop)
    let lastTs   = null
    let rafId    = null

    const centerOn = (idx) => {
      const slide = slides[idx]
      if (!slide) return
      // Scroll horizontal du slider uniquement — jamais de scroll vertical
      // de la page (contrairement à scrollIntoView)
      const left = slide.getBoundingClientRect().left
        - el.getBoundingClientRect().left + el.scrollLeft
        - (el.clientWidth - slide.offsetWidth) / 2
      el.scrollTo({ left, behavior: 'smooth' })
    }

    const tick = (now) => {
      rafId = requestAnimationFrame(tick)
      const dt = lastTs === null ? 0 : Math.min(now - lastTs, 100) // cap : onglet caché, gros lags
      lastTs = now
      if (touching || !inView || document.hidden) return
      elapsed += dt
      const p = Math.min(elapsed / AUTOPLAY_MS, 1)
      if (fillRef.current)
        fillRef.current.style.transform = `scaleX(${p})`
      if (p >= 1) {
        elapsed = 0
        centerOn((activeIdxRef.current + 1) % slides.length)
      }
    }
    rafId = requestAnimationFrame(tick)

    // Interaction utilisateur (swipe, tap sur un dot…) → pause + reset
    const onPointerDown = () => {
      touching = true
      elapsed = 0
      if (fillRef.current) fillRef.current.style.transform = 'scaleX(0)'
    }
    const onPointerUp = () => { touching = false }
    root.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })

    // Pause quand le carrousel sort du viewport (ou display:none sur desktop)
    const visIo = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting },
      { threshold: 0.5 }
    )
    visIo.observe(root)

    return () => {
      io.disconnect()
      visIo.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      root.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  const snapTo = useCallback((idx) => {
    const el = sliderRef.current
    if (!el) return
    el.querySelectorAll('.hpr-slide')[idx]
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [])

  return (
    <div ref={rootRef} className="hpr-mobile" id="projects">

      {/* ── Slider ─────────────────────────────────────────────── */}
      <div ref={sliderRef} className="hpr-mobile__slider">
        {projects.map((p, i) => {
          const category = typeof p.category === 'object'
            ? p.category[lang] ?? p.category.en
            : p.category

          return (
            <Link
              key={p.id}
              to={`/work/${p.slug}`}
              className={`hpr-slide${i === 0 ? ' hpr-slide--active' : ''}`}
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
                  <ArrowUpRight className="hpr-slide__arrow" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Controls ───────────────────────────────────────────── */}
      <div className="hpr-mobile__controls">

        {/* Progress line + counter */}
        <div className="hpr-mobile__progress">
          <span ref={idxLabelRef} className="hpr-mobile__idx">01</span>
          <div className="hpr-mobile__track">
            <div ref={fillRef} className="hpr-mobile__fill" />
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
              ref={el => { dotRefs.current[i] = el }}
              className={`hpr-mobile__dot${i === 0 ? ' active' : ''}`}
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
