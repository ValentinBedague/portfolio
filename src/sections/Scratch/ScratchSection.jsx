import { useRef, useEffect, useState, useCallback } from 'react'
import { useContactDrawer } from '../../components/ContactDrawer/ContactDrawerContext'
import { useLanguage } from '../../i18n/LanguageContext'
import './ScratchSection.css'

const GOLD = '#c8a84b'

function drawOverlay(canvas, t) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  // Silver gradient background
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0,    '#5a5a5a')
  grad.addColorStop(0.25, '#a8a8a8')
  grad.addColorStop(0.5,  '#d0d0d0')
  grad.addColorStop(0.75, '#a8a8a8')
  grad.addColorStop(1,    '#5a5a5a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Cross-hatch texture
  ctx.save()
  ctx.globalAlpha = 0.1
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  for (let i = -h; i < w + h; i += 7) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - h, h); ctx.stroke()
  }
  ctx.restore()

  // Dashed border
  ctx.save()
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 2
  ctx.setLineDash([10, 5])
  ctx.strokeRect(24, 24, w - 48, h - 48)
  ctx.restore()

  // Corner stars
  const corners = [[50, 50], [w - 50, 50], [50, h - 50], [w - 50, h - 50]]
  ctx.fillStyle = 'rgba(0,0,0,0.22)'
  ctx.font = '18px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  corners.forEach(([x, y]) => ctx.fillText('★', x, y))

  // Stars row top & bottom
  const stars = 7
  for (let i = 0; i < stars; i++) {
    const x = w * 0.15 + (i * w * 0.7) / (stars - 1)
    ctx.fillText('✦', x, 56)
    ctx.fillText('✦', x, h - 56)
  }

  // Main text — line 1
  const fs1 = Math.min(w / 8, 64)
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${fs1}px "IBM Plex Sans", sans-serif`
  ctx.fillText(t('scratch_overlay_1'), w / 2, h / 2 - fs1 * 0.6)
  ctx.fillText(t('scratch_overlay_2'), w / 2, h / 2 + fs1 * 0.55)
  ctx.restore()

  // Instruction
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.38)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `13px "IBM Plex Mono", monospace`
  ctx.fillText(t('scratch_instruction'), w / 2, h - 44)
  ctx.restore()
}

export default function ScratchSection() {
  const canvasRef    = useRef(null)
  const scratchingRef = useRef(false)
  const [revealed, setRevealed]   = useState(false)
  const [fading,   setFading]     = useState(false)
  const { openDrawer } = useContactDrawer()
  const { t } = useLanguage()

  // Init / resize canvas
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
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    const src  = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * dpr,
      y: (src.clientY - rect.top)  * dpr,
    }
  }

  const doScratch = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas || fading || revealed) return

    const ctx = canvas.getContext('2d')
    const { x, y } = getXY(e)
    const dpr = window.devicePixelRatio || 1
    const base = 72 * dpr

    ctx.globalCompositeOperation = 'destination-out'

    // Irregular shape: central blob + random satellite blobs
    const blobs = [
      { dx: 0,              dy: 0,              r: base },
      { dx:  base * 0.55,   dy: -base * 0.35,   r: base * 0.75 },
      { dx: -base * 0.5,    dy:  base * 0.4,    r: base * 0.7  },
      { dx:  base * 0.3,    dy:  base * 0.6,    r: base * 0.65 },
      { dx: -base * 0.65,   dy: -base * 0.25,   r: base * 0.6  },
      { dx:  base * 0.7,    dy:  base * 0.2,    r: base * 0.5  },
      { dx: -base * 0.2,    dy:  base * 0.72,   r: base * 0.45 },
      { dx:  base * 0.15,   dy: -base * 0.7,    r: base * 0.5  },
    ]

    blobs.forEach(({ dx, dy, r }) => {
      ctx.beginPath()
      ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.globalCompositeOperation = 'source-over'

    // Sample every 20th pixel to keep perf smooth
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

  const onTouchMove = (e) => { e.preventDefault(); doScratch(e) }

  const prizes = [
    { num: '01', title: t('scratch_p1_title'), desc: t('scratch_p1_desc') },
    { num: '02', title: t('scratch_p2_title'), desc: t('scratch_p2_desc') },
    { num: '03', title: t('scratch_p3_title'), desc: t('scratch_p3_desc') },
  ]

  return (
    <section className="scratch-section">

      {/* ── Revealed content ──────────────────────────────────── */}
      <div className="scratch-content container">
        <div className="scratch-content__header">
          <span className="scratch-eyebrow">{t('scratch_eyebrow')}</span>
          <h2 className="scratch-title">
            {t('scratch_title_1')}<br />
            <span className="scratch-title__accent">{t('scratch_title_2')}</span>
          </h2>
          <p className="scratch-sub">{t('scratch_sub')}</p>
        </div>

        <div className="scratch-prizes">
          {prizes.map((p) => (
            <div key={p.num} className="scratch-prize">
              <span className="scratch-prize__num">{p.num}</span>
              <div className="scratch-prize__stars">★★★★★</div>
              <h3 className="scratch-prize__title">{p.title}</h3>
              <p className="scratch-prize__desc">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="scratch-actions">
          <button onClick={openDrawer} className="btn-primary">
            {t('scratch_cta')}
          </button>
          <span className="scratch-note">{t('scratch_note')}</span>
        </div>
      </div>

      {/* ── Canvas overlay ────────────────────────────────────── */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className={`scratch-canvas${fading ? ' scratch-canvas--out' : ''}`}
          onMouseMove={doScratch}
          onTouchStart={() => { scratchingRef.current = true }}
          onTouchEnd={()   => { scratchingRef.current = false }}
          onTouchMove={onTouchMove}
        />
      )}
    </section>
  )
}
