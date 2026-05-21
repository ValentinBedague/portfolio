import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../i18n/LanguageContext'
import './BtzHero.css'

const CW       = 2000
const BOX_SIZE = 110
const TAU      = Math.PI * 2

export default function BtzHero() {
  const { t } = useLanguage()
  const canvasRef    = useRef(null)
  const containerRef = useRef(null)
  const data = useRef({
    m:      { x: CW / 2, y: CW / 2, s: 1.5, x2: CW / 2, y2: CW / 2 },
    xTo:    null,
    yTo:    null,
    sTo:    null,
    ticker: null,
  })

  useEffect(() => {
    const c   = canvasRef.current
    const box = containerRef.current
    if (!c || !box) return

    const ctx = c.getContext('2d')
    c.width = c.height = CW
    ctx.fillStyle = 'rgba(255,255,255,0.85)'

    const d = data.current
    const m = d.m

    d.xTo = gsap.quickTo(m, 'x', { duration: 1,   ease: 'expo'   })
    d.yTo = gsap.quickTo(m, 'y', { duration: 1,   ease: 'expo'   })
    d.sTo = gsap.quickTo(m, 's', { duration: 2,   ease: 'power2' })

    const img = new Image()

    // onload doit être assigné AVANT src pour éviter le bug avec l'image en cache
    img.onload = () => {
      const boxes = []
      for (let x = 0; x <= CW; x += BOX_SIZE)
        for (let y = 0; y <= CW; y += BOX_SIZE)
          boxes.push({ x, y, s: 0 })

      const update = () => {
        d.sTo(Math.hypot(m.x - m.x2, m.y - m.y2) / CW * 2)

        ctx.clearRect(0, 0, CW, CW)
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, CW, CW)

        for (const b of boxes) {
          b.s = 1 - gsap.utils.clamp(0, 1, Math.hypot(b.x - m.x, b.y - m.y) / CW / m.s)
          if (b.s < 0.001) continue
          const sc = BOX_SIZE * b.s
          ctx.drawImage(img,
            (b.x + sc / 2) / CW * img.naturalWidth,
            (b.y + sc / 2) / CW * img.naturalHeight,
            (BOX_SIZE - sc)  / CW * img.naturalWidth,
            (BOX_SIZE - sc)  / CW * img.naturalHeight,
            b.x, b.y, BOX_SIZE, BOX_SIZE
          )
        }

        for (const b of boxes) {
          if (b.s < 0.001) continue
          ctx.beginPath()
          ctx.arc(b.x, b.y, BOX_SIZE * 0.15 * b.s, 0, TAU)
          ctx.fill()
        }
      }

      gsap.ticker.add(update)
      d.ticker = update
    }

    img.src = '/btz.avif'

    const onMove = (e) => {
      const r = c.getBoundingClientRect()
      m.x2 = (e.clientX - r.left) * (CW / r.width)
      m.y2 = (e.clientY - r.top)  * (CW / r.height)
      d.xTo(m.x2)
      d.yTo(m.y2)
    }

    box.addEventListener('pointermove', onMove)
    return () => {
      box.removeEventListener('pointermove', onMove)
      if (d.ticker) gsap.ticker.remove(d.ticker)
    }
  }, [])

  return (
    <div ref={containerRef} className="btz-hero">
      <canvas ref={canvasRef} className="btz-hero__canvas" aria-hidden="true" />
      <div className="btz-hero__overlay">
        <p className="btz-hero__tagline">{t('btz_tagline')}</p>
      </div>
    </div>
  )
}
