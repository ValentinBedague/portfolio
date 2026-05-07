import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import PageTransition from '../components/PageTransition/PageTransition'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { useContactDrawer } from '../components/ContactDrawer/ContactDrawerContext'
import { ArrowRight } from '../components/ArrowIcon'
import './WorkPage.css'

/* ─── WorkStory: scroll-driven storytelling section ─────────── */
function WorkStory() {
  const storyRef = useRef(null)
  const { lang, t } = useLanguage()
  const { openDrawer } = useContactDrawer()

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start start', 'end end'],
  })

  // Scene 1 — 0 → 0.25
  const op1 = useTransform(scrollYProgress, [0, 0.05, 0.20, 0.25], [0, 1, 1, 0])
  const y1  = useTransform(scrollYProgress, [0, 0.07], [60, 0])

  // Scene 2 — 0.25 → 0.50
  const op2 = useTransform(scrollYProgress, [0.23, 0.28, 0.43, 0.48], [0, 1, 1, 0])
  const y2  = useTransform(scrollYProgress, [0.23, 0.30], [60, 0])

  // Scene 3 — 0.50 → 0.75
  const op3 = useTransform(scrollYProgress, [0.46, 0.51, 0.66, 0.71], [0, 1, 1, 0])
  const y3  = useTransform(scrollYProgress, [0.46, 0.53], [60, 0])

  // Scene 4 — 0.75 → 1.00 (stays)
  const op4 = useTransform(scrollYProgress, [0.69, 0.75], [0, 1])
  const y4  = useTransform(scrollYProgress, [0.69, 0.76], [60, 0])

  // Progress bar
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const scenes = [
    { op: op1, y: y1, num: '01', keys: ['story_1a', 'story_1b'] },
    { op: op2, y: y2, num: '02', keys: ['story_2a', 'story_2b'] },
    { op: op3, y: y3, num: '03', keys: ['story_3a', 'story_3b'] },
    { op: op4, y: y4, num: '04', keys: ['story_4q'], isCta: true },
  ]

  return (
    <section ref={storyRef} className="work-story">
      <div className="work-story__sticky">

        {scenes.map((scene, i) => (
          <motion.div
            key={i}
            className={`work-story__scene${scene.isCta ? ' work-story__scene--cta' : ''}`}
            style={{ opacity: scene.op, y: scene.y }}
          >
            {/* Ghost background number */}
            <span className="work-story__ghost" aria-hidden="true">{scene.num}</span>

            {/* Scene index */}
            <span className="work-story__index">{scene.num} / 04</span>

            {/* Text lines */}
            <div className="work-story__lines">
              {scene.keys.map((key, j) => (
                <span
                  key={j}
                  className={`work-story__line${j === 1 ? ' work-story__line--outline' : ''}`}
                >
                  {t(key)}
                </span>
              ))}
            </div>

            {/* CTA button (scene 4 only) */}
            {scene.isCta && (
              <button className="work-story__btn" onClick={openDrawer}>
                {t('story_cta')} <ArrowRight className="work-story__btn-arrow" />
              </button>
            )}
          </motion.div>
        ))}

        {/* Scroll progress bar */}
        <div className="work-story__bar">
          <motion.div className="work-story__bar-fill" style={{ width: progress }} />
        </div>

      </div>
    </section>
  )
}

const maskReveal = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: 0,
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.08 },
  }),
}

function ProjectRow({ project, index, lang }) {
  const navigate = useNavigate()

  const category = typeof project.category === 'object'
    ? project.category[lang] ?? project.category.en
    : project.category

  const tags = (typeof project.tags === 'object' && !Array.isArray(project.tags))
    ? (project.tags[lang] ?? project.tags.en ?? [])
    : (project.tags ?? [])

  return (
    <motion.div
      className="work-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.45 + index * 0.08 }}
      onClick={() => navigate(`/work/${project.slug}`)}
    >
      <span className="work-row__num">0{index + 1}</span>

      <div className="work-row__main">
        <h2 className="work-row__title">{project.title}</h2>
        <span className="work-row__cat">{category}</span>
      </div>

      <div className="work-row__tags">
        {tags.slice(0, 3).map(tag => (
          <span key={tag} className="work-row__tag">{tag}</span>
        ))}
      </div>

      <ArrowRight className="work-row__arrow" />
    </motion.div>
  )
}

export default function WorkPage() {
  const { lang }    = useLanguage()
  const [hovered, setHovered] = useState(null)
  const videoRef    = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 260, damping: 30 })
  const y = useSpring(rawY, { stiffness: 260, damping: 30 })

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [hovered])

  const onMouseMove = (e) => {
    rawX.set(e.clientX)
    rawY.set(e.clientY)
  }

  return (
    <PageTransition>
      <div className="work-page" onMouseMove={onMouseMove}>

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="work-header container">
          <motion.div
            className="work-header__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="work-header__count">({String(projects.length).padStart(2, '0')})</span>
            <span className="work-header__sep" />
            <span>Selected works — 2023 / 2025</span>
          </motion.div>

          <h1 className="work-header__title">
            {['SELECTED', 'WORKS'].map((word, i) => (
              <span key={word} className="work-header__mask">
                <motion.span
                  className={`work-header__word${i === 1 ? ' work-header__word--outline' : ''}`}
                  custom={i}
                  variants={maskReveal}
                  initial="hidden"
                  animate="visible"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </header>

        {/* ── Divider ────────────────────────────────────────── */}
        <motion.div
          className="work-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          style={{ originX: 0 }}
        />

        {/* ── Project list ───────────────────────────────────── */}
        <div className="work-list container">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="work-row-wrap"
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
            >
              <ProjectRow project={p} index={i} lang={lang} />
            </div>
          ))}
        </div>

        {/* ── Story scroll section ───────────────────────────── */}
        <WorkStory />

        {/* ── Floating preview ───────────────────────────────── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="work-preview"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.16 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {hovered.screenshot && (
                <img src={hovered.screenshot} alt={hovered.title} className="work-preview__img" />
              )}
              {!hovered.screenshot && (
                <div className="work-preview__gradient" style={{ background: hovered.gradient }} />
              )}
              {hovered.video && (
                <video
                  key={hovered.slug}
                  ref={videoRef}
                  src={hovered.video}
                  className="work-preview__video"
                  muted
                  loop
                  playsInline
                />
              )}
              <div
                className="work-preview__tint"
                style={{ background: `linear-gradient(to top, ${hovered.accentColor}33 0%, transparent 60%)` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  )
}
