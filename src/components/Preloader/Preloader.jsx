import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Preloader.css'

const LINES = [
  { text: 'YOUR',      outline: false },
  { text: 'WEBSITE',   outline: false },
  { text: 'ICONIC &',  outline: true  },
  { text: 'EFFECTIVE', outline: false },
]

export default function Preloader({ onDone }) {
  const rootRef  = useRef(null)
  const linesRef = useRef([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline()

    /* ── 1. Lignes entrent depuis le bas ── */
    tl.from(linesRef.current, {
      y: '108%',
      duration: 1.0,
      stagger: 0.13,
      ease: 'power4.out',
    })

    /* ── 2. Pause ── */
    tl.to({}, { duration: 0.75 })

    /* ── 3. Lignes sortent vers le haut + overlay fond s'efface ── */
    tl.to(linesRef.current, {
      y: '-108%',
      duration: 0.65,
      stagger: 0.08,
      ease: 'power3.in',
      onStart: () => {
        /* Le contenu commence à apparaître dès que les lignes partent */
        onDone()
        document.body.style.overflow = ''
      },
    })

    tl.to(rootRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    }, '<0.25')

    return () => { tl.kill(); document.body.style.overflow = '' }
  }, [onDone])

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="preloader__inner">
        {LINES.map(({ text, outline }, i) => (
          <div key={i} className="preloader__mask">
            <div
              ref={el => linesRef.current[i] = el}
              className={`preloader__line${outline ? ' preloader__line--outline' : ''}`}
            >
              {text}
            </div>
          </div>
        ))}
      </div>

      {/* Compteur discret */}
      <span className="preloader__label">Loading</span>
    </div>
  )
}
