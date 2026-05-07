/**
 * MagneticButton — attire légèrement le curseur vers le centre du bouton.
 * Fonctionne avec n'importe quelle balise (button, a, div…) via la prop `as`.
 * Sur touch (hover:none) l'effet magnétique est désactivé, seul whileTap reste.
 *
 * Usage :
 *   <MagneticButton className="btn-primary" onClick={…}>Texte</MagneticButton>
 *   <MagneticButton as="a" href="…" className="btn-primary">Lien</MagneticButton>
 */
import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticButton({
  as: Tag = 'button',
  children,
  strength = 0.28,   // intensité de l'attraction (0 = off, 1 = curseur collé)
  className = '',
  style,
  ...props
}) {
  const ref  = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x    = useSpring(rawX, { stiffness: 280, damping: 20 })
  const y    = useSpring(rawY, { stiffness: 280, damping: 20 })

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    rawX.set((e.clientX - (r.left + r.width  / 2)) * strength)
    rawY.set((e.clientY - (r.top  + r.height / 2)) * strength)
  }, [rawX, rawY, strength])

  const onLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  const MotionTag = motion[Tag] ?? motion.button

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ ...style, x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
