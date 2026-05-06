import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useContactDrawer } from '../../components/ContactDrawer/ContactDrawerContext'
import { useLanguage } from '../../i18n/LanguageContext'
import './ScratchSection.css'

function drawOverlay(canvas, t) {
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  // canvas.width/height are in physical pixels; after ctx.scale(dpr) the drawing
  // context expects logical (CSS) pixels, so divide back here.
  const w = canvas.width  / dpr
  const h = canvas.height / dpr

  ctx.clearRect(0, 0, w, h)

  // Silver gradient
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0,    '#5a5a5a')
  grad.addColorStop(0.3,  '#b0b0b0')
  grad.addColorStop(0.5,  '#d4d4d4')
  grad.addColorStop(0.7,  '#b0b0b0')
  grad.addColorStop(1,    '#5a5a5a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Cross-hatch texture
  ctx.save()
  ctx.globalAlpha = 0.09
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  for (let i = -h; i < w + h; i += 7) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - h, h); ctx.stroke()
  }
  ctx.restore()

  // Dashed border inset
  ctx.save()
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([8, 5])
  ctx.strokeRect(16, 16, w - 32, h - 32)
  ctx.restore()

  // Corner stars
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.font = '16px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ;[[36, 36], [w - 36, 36], [36, h - 36], [w - 36, h - 36]].forEach(([x, y]) =>
    ctx.fillText('★', x, y)
  )

  // Main overlay text
  const fs = Math.min(w / 7, 56)
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${fs}px "IBM Plex Sans", sans-serif`
  ctx.fillText(t('scratch_overlay_1'), w / 2, h / 2 - fs * 0.55)
  ctx.fillText(t('scratch_overlay_2'), w / 2, h / 2 + fs * 0.55)
  ctx.restore()

  // Instruction
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `12px "IBM Plex Mono", monospace`
  ctx.fillText(t('scratch_instruction'), w / 2, h - 28)
  ctx.restore()
}

export default function ScratchSection() {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [fading,   setFading]   = useState(false)
  const { openDrawer } = useContactDrawer()
  const { t } = useLanguage()

  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.1'],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.8 })

  const titleY       = useTransform(smooth, [0, 0.45], [80, 0])
  const titleOpacity = useTransform(smooth, [0, 0.45], [0, 1])
  const ticketY      = useTransform(smooth, [0.4, 0.85], [80, 0])
  const ticketOpacity = useTransform(smooth, [0.4, 0.85], [0, 1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1

    const sync = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width  * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      drawOverlay(canvas, t)
    }

    const ro = new ResizeObserver(sync)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [t])

  const getXY = (e) => {
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const src    = e.touches ? e.touches[0] : e
    // Return logical (CSS) pixels — the context is already scale(dpr) so
    // drawing commands must use logical coords, not physical ones.
    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top,
    }
  }

  const doScratch = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas || fading || revealed) return

    const ctx  = canvas.getContext('2d')
    const { x, y } = getXY(e)
    const base = 64 // logical pixels (matches the scaled context)

    ctx.globalCompositeOperation = 'destination-out'
    const blobs = [
      { dx: 0,            dy: 0,            r: base        },
      { dx:  base * 0.55, dy: -base * 0.35, r: base * 0.75 },
      { dx: -base * 0.5,  dy:  base * 0.4,  r: base * 0.7  },
      { dx:  base * 0.3,  dy:  base * 0.6,  r: base * 0.65 },
      { dx: -base * 0.65, dy: -base * 0.25, r: base * 0.6  },
      { dx:  base * 0.7,  dy:  base * 0.2,  r: base * 0.5  },
      { dx: -base * 0.2,  dy:  base * 0.72, r: base * 0.45 },
      { dx:  base * 0.15, dy: -base * 0.7,  r: base * 0.5  },
    ]
    blobs.forEach(({ dx, dy, r }) => {
      ctx.beginPath()
      ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalCompositeOperation = 'source-over'

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 80) {
      if (data[i] < 128) transparent++
    }
    if ((transparent / (data.length / 80)) > 0.45) {
      setFading(true)
      setTimeout(() => setRevealed(true), 900)
    }
  }, [fading, revealed])

  // Non-passive touch listener — React's onTouchMove is passive, so
  // e.preventDefault() has no effect there and the page scrolls instead of scratching.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handle = (e) => { e.preventDefault(); doScratch(e) }
    canvas.addEventListener('touchstart', handle, { passive: false })
    canvas.addEventListener('touchmove',  handle, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', handle)
      canvas.removeEventListener('touchmove',  handle)
    }
  }, [doScratch])

  const prizes = [
    { num: '01', title: t('scratch_p1_title'), desc: t('scratch_p1_desc') },
    { num: '02', title: t('scratch_p2_title'), desc: t('scratch_p2_desc') },
    { num: '03', title: t('scratch_p3_title'), desc: t('scratch_p3_desc') },
  ]

  return (
    <section ref={sectionRef} className="scratch-section">
      <div className="container">

        {/* ── Always-visible header ────────────────────────────── */}
        <motion.div
          className="scratch-header"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          <span className="scratch-header__label">{t('scratch_header_label')}</span>
          <h2 className="scratch-header__title">{t('scratch_header_title')}</h2>
        </motion.div>

        {/* ── Ticket card ──────────────────────────────────────── */}
        <motion.div
          className="scratch-ticket-wrap"
          style={{ y: ticketY, opacity: ticketOpacity }}
        >

          {/* Content inside ticket */}
          <div className="scratch-ticket">
            <div className="scratch-ticket__top">
              <span className="scratch-ticket__won">{t('scratch_won')}</span>
              <span className="scratch-ticket__num">N° {new Date().getFullYear()}-001</span>
            </div>

            <div className="scratch-ticket__headline">
              <p className="scratch-ticket__an">{t('scratch_an')}</p>
              <p className="scratch-ticket__experience">{t('scratch_experience')}</p>
            </div>

            <div className="scratch-ticket__divider" />

            <div className="scratch-ticket__prizes">
              {prizes.map((p) => (
                <div key={p.num} className="scratch-ticket__prize">
                  <span className="scratch-ticket__prize-num">{p.num}</span>
                  <span className="scratch-ticket__prize-stars">★★★★★</span>
                  <strong className="scratch-ticket__prize-title">{p.title}</strong>
                  <span className="scratch-ticket__prize-desc">{p.desc}</span>
                </div>
              ))}
            </div>

            <div className="scratch-ticket__footer">
              <button onClick={openDrawer} className="btn-primary">
                {t('scratch_cta')}
              </button>
              <span className="scratch-ticket__note">{t('scratch_note')}</span>
            </div>
          </div>

          {/* Canvas overlay — only on the ticket */}
          {!revealed && (
            <canvas
              ref={canvasRef}
              className={`scratch-canvas${fading ? ' scratch-canvas--out' : ''}`}
              onMouseMove={doScratch}
            />
          )}
        </motion.div>

      </div>
    </section>
  )
}
