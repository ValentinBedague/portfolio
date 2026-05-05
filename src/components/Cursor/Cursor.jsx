import { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const rafRef  = useRef(null)
  const hovering = useRef(false)

  useEffect(() => {
    const dot  = dotRef.current
    const ringEl = ringRef.current

    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const loop = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.11)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.11)
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      rafRef.current = requestAnimationFrame(loop)
    }

    /* Event delegation — works even for dynamically rendered elements */
    const onOver = (e) => {
      if (e.target.closest('a, button, [data-hover]') && !hovering.current) {
        hovering.current = true
        dot.classList.add('dot--hover')
        ringEl.classList.add('ring--hover')
      }
    }
    const onOut = (e) => {
      if (hovering.current && !e.relatedTarget?.closest('a, button, [data-hover]')) {
        hovering.current = false
        dot.classList.remove('dot--hover')
        ringEl.classList.remove('ring--hover')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
