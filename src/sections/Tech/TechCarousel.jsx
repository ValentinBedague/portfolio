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

/* ─── SVG logo components ──────────────────────────────────────── */

const Html5 = () => (
  <svg className="tc-icon" viewBox="0 0 48 54" fill="none">
    <path d="M6 2L2 46L24 52L46 46L42 2H6Z"
      stroke="currentColor" strokeWidth="1.5"
      fill="currentColor" fillOpacity="0.06"/>
    <text x="24" y="22" textAnchor="middle" fill="currentColor"
      fontSize="9" fontWeight="700" fontFamily="IBM Plex Mono,monospace"
      letterSpacing="1">HTML</text>
    <text x="24" y="39" textAnchor="middle" fill="currentColor"
      fontSize="19" fontWeight="800" fontFamily="IBM Plex Mono,monospace">5</text>
  </svg>
)

const Css = () => (
  <svg className="tc-icon" viewBox="0 0 64 36" fill="none">
    <text x="32" y="28" textAnchor="middle" fill="currentColor"
      fontSize="30" fontWeight="800" fontFamily="IBM Plex Mono,monospace">CSS</text>
  </svg>
)

const Js = () => (
  <svg className="tc-icon" viewBox="0 0 52 52" fill="none">
    <rect x="2" y="2" width="48" height="48" rx="3"
      stroke="currentColor" strokeWidth="1.5"
      fill="currentColor" fillOpacity="0.06"/>
    <text x="26" y="36" textAnchor="middle" fill="currentColor"
      fontSize="20" fontWeight="800" fontFamily="IBM Plex Mono,monospace">JS</text>
  </svg>
)

const WebflowLogo = () => (
  <svg className="tc-icon" viewBox="0 0 124 36" fill="none">
    <text x="62" y="27" textAnchor="middle" fill="currentColor"
      fontSize="22" fontWeight="700" fontFamily="IBM Plex Sans,sans-serif"
      letterSpacing="-0.5">Webflow</text>
  </svg>
)

const ShopifyLogo = () => (
  <svg className="tc-icon" viewBox="0 0 64 72" fill="none">
    <path d="M12 30L8 62H56L52 30H12Z"
      stroke="currentColor" strokeWidth="1.5"
      fill="currentColor" fillOpacity="0.06"/>
    <path d="M24 30C24 22.82 27.582 17 32 17C36.418 17 40 22.82 40 30"
      stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <text x="32" y="52" textAnchor="middle" fill="currentColor"
      fontSize="14" fontWeight="700" fontFamily="Georgia,serif" fontStyle="italic">S</text>
  </svg>
)

const IllustratorLogo = () => (
  <svg className="tc-icon" viewBox="0 0 52 52" fill="none">
    <rect x="2" y="2" width="48" height="48" rx="5"
      stroke="currentColor" strokeWidth="1.5"
      fill="currentColor" fillOpacity="0.06"/>
    <text x="26" y="36" textAnchor="middle" fill="currentColor"
      fontSize="20" fontWeight="700" fontFamily="Georgia,serif" fontStyle="italic">Ai</text>
  </svg>
)

const FigmaLogo = () => (
  <svg className="tc-icon" viewBox="0 0 76 57" fill="none">
    <rect x="20" y="1"  width="17" height="17" rx="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="39" y="1"  width="17" height="17" rx="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="20" y="20" width="17" height="17" rx="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="39" y="20" width="17" height="17" rx="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="20" y="39" width="17" height="17" rx="8.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const ReactLogo = () => (
  <svg className="tc-icon" viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="50" rx="46" ry="14.5" stroke="currentColor" strokeWidth="2.5"/>
    <ellipse cx="50" cy="50" rx="46" ry="14.5" stroke="currentColor" strokeWidth="2.5" transform="rotate(60 50 50)"/>
    <ellipse cx="50" cy="50" rx="46" ry="14.5" stroke="currentColor" strokeWidth="2.5" transform="rotate(-60 50 50)"/>
    <circle cx="50" cy="50" r="5.5" fill="currentColor"/>
  </svg>
)

const ViteLogo = () => (
  <svg className="tc-icon" viewBox="0 0 52 64" fill="none">
    <path d="M34 6L10 38H26L16 58L48 28H30L34 6Z"
      fill="currentColor" fillOpacity="0.1"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M30 16L16 40H26L20 54L44 30H32L30 16Z" fill="currentColor"/>
  </svg>
)

const NodeLogo = () => (
  <svg className="tc-icon" viewBox="0 0 66 58" fill="none">
    <path d="M33 2L63 18V40L33 56L3 40V18L33 2Z"
      stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06"/>
    <text x="33" y="37" textAnchor="middle" fill="currentColor"
      fontSize="13" fontWeight="700" fontFamily="IBM Plex Mono,monospace">Node</text>
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
  { id: 'html5',       Icon: Html5           },
  { id: 'css',         Icon: Css             },
  { id: 'js',          Icon: Js              },
  { id: 'webflow',     Icon: WebflowLogo     },
  { id: 'shopify',     Icon: ShopifyLogo     },
  { id: 'illustrator', Icon: IllustratorLogo },
  { id: 'figma',       Icon: FigmaLogo       },
  { id: 'react',       Icon: ReactLogo       },
  { id: 'vite',        Icon: ViteLogo        },
  { id: 'node',        Icon: NodeLogo        },
  { id: 'gsap',        Icon: GsapLogo        },
  { id: 'barba',       Icon: BarbaLogo       },
]

const SKEW = 15 // degrees

/* ─── Scrolling band ───────────────────────────────────────────── */
function TechBand() {
  const trackRef = useRef(null)
  const x        = useMotionValue(0)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 })
  const extraSpeed     = useTransform(smoothVelocity, [-2500, 0, 2500], [110, 0, -110])

  // Skew target: -SKEW = "/" parallelograms (default, rightward), +SKEW = "\" on scroll up
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
      trackRef.current.style.setProperty('--sk', `${SKEW}deg`)
      trackRef.current.style.setProperty('--sk-neg', `${-SKEW}deg`)
    }
    return unsub
  }, [skewSpring])

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return
    const oneWidth = trackRef.current.scrollWidth / 2
    if (!oneWidth) return

    const v = smoothVelocity.get()
    if (v >  20) skewTarget.set( SKEW)  // scroll down → "\" shape (rightward)
    if (v < -20) skewTarget.set(-SKEW)  // scroll up   → "/" shape (leftward)

    const velocity = 70 - extraSpeed.get()
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
