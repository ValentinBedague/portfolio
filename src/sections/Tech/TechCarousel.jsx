import { useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'
import './TechCarousel.css'

/* ─── Icônes fichier (monochrome noir — filter CSS pour le thème) ── */
const Img = ({ src, alt }) => (
  <img src={src} alt={alt} className="tc-icon tc-icon--img" />
)

/* ─── Icônes inline (pas de fichier disponible) ────────────────── */
const Css = () => (
  <svg className="tc-icon" viewBox="0 0 64 36" fill="none">
    <text x="32" y="28" textAnchor="middle" fill="currentColor"
      fontSize="30" fontWeight="800" fontFamily="IBM Plex Mono,monospace">CSS</text>
  </svg>
)

const GsapLogo = () => (
  <svg className="tc-icon" viewBox="0 0 88 36" fill="none">
    <text x="44" y="28" textAnchor="middle" fill="currentColor"
      fontSize="28" fontWeight="800" fontFamily="IBM Plex Mono,monospace">GSAP</text>
  </svg>
)

const BarbaLogo = () => (
  <svg className="tc-icon" viewBox="0 0 100 36" fill="none">
    <text x="50" y="27" textAnchor="middle" fill="currentColor"
      fontSize="22" fontWeight="400" fontFamily="IBM Plex Mono,monospace">barba.js</text>
  </svg>
)

/* ─── Item list ────────────────────────────────────────────────── */
const ITEMS = [
  { id: 'html5',       Icon: () => <Img src="/icons/html5.svg"       alt="HTML5" />       },
  { id: 'css',         Icon: Css                                                           },
  { id: 'js',          Icon: () => <Img src="/icons/js.svg"          alt="JavaScript" />  },
  { id: 'webflow',     Icon: () => <Img src="/icons/webflow.svg"     alt="Webflow" />     },
  { id: 'shopify',     Icon: () => <Img src="/icons/shopify.svg"     alt="Shopify" />     },
  { id: 'illustrator', Icon: () => <Img src="/icons/illustrator.svg" alt="Illustrator" /> },
  { id: 'figma',       Icon: () => <Img src="/icons/figma.svg"       alt="Figma" />       },
  { id: 'react',       Icon: () => <Img src="/icons/react.svg"       alt="React" />       },
  { id: 'node',        Icon: () => <Img src="/icons/node.svg"        alt="Node.js" />     },
  { id: 'gsap',        Icon: GsapLogo                                                     },
  { id: 'barba',       Icon: BarbaLogo                                                    },
]

const SKEW = 15 // degrees

/* ─── Scrolling band ───────────────────────────────────────────── */
function TechBand() {
  const trackRef = useRef(null)
  const x        = useMotionValue(0)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 })

  const dirRef = useRef(1) // 1 = right (default), -1 = left

  // Skew target: -SKEW = "/" oriented right, +SKEW = "\" oriented left
  const skewTarget = useMotionValue(-SKEW)
  const skewSpring = useSpring(skewTarget, { stiffness: 80, damping: 25 })

  // Push skew value into CSS variables on the track element each frame
  useEffect(() => {
    const unsub = skewSpring.on('change', (sk) => {
      if (!trackRef.current) return
      trackRef.current.style.setProperty('--sk', `${sk}deg`)
      trackRef.current.style.setProperty('--sk-neg', `${-sk}deg`)
    })
    // Set initial values
    if (trackRef.current) {
      trackRef.current.style.setProperty('--sk', `${-SKEW}deg`)
      trackRef.current.style.setProperty('--sk-neg', `${SKEW}deg`)
    }
    return unsub
  }, [skewSpring])

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return
    const oneWidth = trackRef.current.scrollWidth / 2
    if (!oneWidth) return

    const v = smoothVelocity.get()
    if (v >  20) { dirRef.current =  1; skewTarget.set(-SKEW) }
    if (v < -20) { dirRef.current = -1; skewTarget.set( SKEW) }

    const boost    = Math.min(Math.abs(v) * 0.06, 130)
    const velocity = dirRef.current * (70 + boost)

    let newX = x.get() + velocity * (delta / 1000)
    if (newX < -oneWidth) newX += oneWidth
    if (newX > 0)         newX -= oneWidth
    x.set(newX)
  })

  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="tc-band">
      <div className="tc-viewport">
        <motion.div ref={trackRef} className="tc-track" style={{ x }}>
          {doubled.map((item, i) => (
            <div key={i} className="tc-cell">
              <div className="tc-cell-inner">
                <item.Icon />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Section ──────────────────────────────────────────────────── */
export default function TechCarousel() {
  const sectionRef = useRef(null)
  const { t }      = useLanguage()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.3'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.8 })

  const titleOpacity = useTransform(smooth, [0, 0.4], [0, 1])
  const titleY       = useTransform(smooth, [0, 0.4], [24, 0])
  const bandOpacity  = useTransform(smooth, [0.1, 0.7], [0, 1])
  const bandY        = useTransform(smooth, [0.1, 0.7], [32, 0])

  return (
    <section ref={sectionRef} className="tech-section">
      <motion.p
        className="tc-title"
        style={{ opacity: titleOpacity, y: titleY }}
      >
        {t('tech_title_1')} {t('tech_title_2')}
      </motion.p>

      <motion.div style={{ opacity: bandOpacity, y: bandY }}>
        <TechBand />
      </motion.div>
    </section>
  )
}
