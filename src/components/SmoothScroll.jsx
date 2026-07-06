/**
 * SmoothScroll — inertie de scroll globale via Lenis.
 * - Désactivé si prefers-reduced-motion.
 * - Se met en pause quand le body est verrouillé (menu / drawer ouverts).
 * - Expose l'instance sur window.lenis pour les scrollTo programmatiques.
 */
import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.lenis = lenis

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Pause quand le scroll du body est verrouillé (preloader, menu, drawer)
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') {
        lenis.stop()
      } else {
        lenis.start()
        lenis.resize()
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    // Le footer est révélé via margin-bottom:100vh sur .app-body — les marges
    // n'affectent pas la taille du <html>, donc l'auto-resize de Lenis rate
    // ces changements. On re-mesure dès que le body change de hauteur.
    const ro = new ResizeObserver(() => lenis.resize())
    ro.observe(document.body)
    window.addEventListener('load', () => lenis.resize())

    return () => {
      observer.disconnect()
      ro.disconnect()
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  return null
}
