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
  const rootRef    = useRef(null)
  const topRef     = useRef(null)
  const botRef     = useRef(null)
  const linesRef   = useRef([])
  const tagRef     = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (rootRef.current) rootRef.current.style.pointerEvents = 'none'
        },
      })

      /* ── 1. Tag fade in ─────────────────────────────────── */
      tl.fromTo(
        tagRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        0
      )

      /* ── 2. Counter 0 → 100 ─────────────────────────────── */
      const obj = { val: 0 }
      tl.to(
        obj,
        {
          val: 100,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate() {
            if (counterRef.current)
              counterRef.current.textContent = Math.round(obj.val)
          },
        },
        0
      )

      /* ── 3. Lines enter from bottom (masked) ────────────── */
      tl.from(
        linesRef.current,
        {
          y: '110%',
          duration: 1.05,
          stagger: 0.12,
          ease: 'power4.out',
        },
        0.1
      )

      /* ── 4. Pause while user reads ──────────────────────── */
      tl.to({}, { duration: 0.5 })

      /* ── 5. Lines exit fast upward ──────────────────────── */
      tl.to(linesRef.current, {
        y: '-110%',
        duration: 0.55,
        stagger: 0.06,
        ease: 'power3.in',
      })

      tl.to(
        [tagRef.current, counterRef.current],
        { opacity: 0, duration: 0.25, ease: 'power2.in' },
        '<'
      )

      /* ── 6. Split exit — screen opens in two ────────────── */
      tl.to(
        topRef.current,
        {
          yPercent: -100,
          duration: 1.0,
          ease: 'power4.inOut',
          onStart() {
            window.scrollTo(0, 0)
            document.body.style.overflow = ''
            onDone()
          },
        },
        '-=0.05'
      )
      tl.to(
        botRef.current,
        { yPercent: 100, duration: 1.0, ease: 'power4.inOut' },
        '<'
      )
    }, rootRef)

    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">

      {/* Two panels that form the black backdrop */}
      <div ref={topRef} className="preloader__panel preloader__panel--top" />
      <div ref={botRef} className="preloader__panel preloader__panel--bot" />

      {/* Text content — above panels */}
      <div className="preloader__inner">
        {LINES.map(({ text, outline }, i) => (
          <div key={i} className="preloader__mask">
            <div
              ref={el => (linesRef.current[i] = el)}
              className={`preloader__line${outline ? ' preloader__line--outline' : ''}`}
            >
              {text}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom meta */}
      <div className="preloader__meta">
        <span ref={tagRef} className="preloader__tag">
          Web Designer &amp; Developer
        </span>
      </div>

      {/* Counter */}
      <div ref={counterRef} className="preloader__counter">0</div>

      {/* Center seam line — visible just before split */}
      <div className="preloader__seam" />
    </div>
  )
}
