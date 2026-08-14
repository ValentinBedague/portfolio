/**
 * SEO — injecte dynamiquement tous les tags <head> SEO.
 * Gère : title, meta description, Open Graph, Twitter Cards,
 * canonical, og:locale, et JSON-LD structured data.
 *
 * Usage :
 *   <SEO title="Mon titre" description="Ma description" url="/work" />
 */
import { useEffect } from 'react'

export const SITE = 'https://valentinbedague.com'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

/* ── DOM helpers ─────────────────────────────────────────────── */
const setMeta = (name, content) => {
  if (!content) return
  let el = document.querySelector(`meta[name="${CSS.escape(name)}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  el.content = content
}

const setProp = (property, content) => {
  if (!content) return
  let el = document.querySelector(`meta[property="${CSS.escape(property)}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const removeProp = (property) => {
  const el = document.querySelector(`meta[property="${CSS.escape(property)}"]`)
  if (el) el.remove()
}

const setCanonical = (href) => {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

export const setJsonLd = (id, schema) => {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(schema)
}

/* ── Component ───────────────────────────────────────────────── */
export default function SEO({
  title,
  description,
  image,       // chemin relatif ex. '/projects/myshampouineuse.png'
  url = '/',   // chemin relatif ex. '/work'
  type = 'website',
  lang = 'fr',
  jsonLd,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — Valentin Bedague`
      : 'Valentin Bedague — Web Designer & Développeur Full Stack'
    const fullUrl   = `${SITE}${url}`
    const fullImage = image ? `${SITE}${image}` : DEFAULT_IMAGE
    const locale    = lang === 'fr' ? 'fr_FR' : 'en_US'

    // ── Base
    document.title = fullTitle
    document.documentElement.lang = lang

    // ── Standard meta
    setMeta('description', description)
    setMeta('robots', 'index, follow')
    setMeta('author', 'Valentin Bedague')

    // ── Open Graph
    setProp('og:title',       fullTitle)
    setProp('og:description', description)
    setProp('og:image',       fullImage)
    setProp('og:image:alt',   fullTitle)
    setProp('og:image:type',  'image/png')
    // Dimensions connues uniquement pour l'OG image de marque (1200×630).
    // Les pages projet utilisent un screenshot d'un autre format → on retire
    // les dimensions plutôt que d'en annoncer de fausses.
    if (image) {
      removeProp('og:image:width')
      removeProp('og:image:height')
    } else {
      setProp('og:image:width',  '1200')
      setProp('og:image:height', '630')
    }
    setProp('og:url',         fullUrl)
    setProp('og:type',        type)
    setProp('og:site_name',   'Valentin Bedague')
    setProp('og:locale',      locale)
    setProp('og:locale:alternate', lang === 'fr' ? 'en_US' : 'fr_FR')

    // ── Twitter / X
    setMeta('twitter:card',        'summary_large_image')
    setMeta('twitter:site',        '@valentinbedague')
    setMeta('twitter:title',       fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image',       fullImage)
    setMeta('twitter:image:alt',   fullTitle)
    setMeta('twitter:creator',     '@valentinbedague')

    // ── Canonical
    setCanonical(fullUrl)

    // ── JSON-LD
    if (jsonLd) setJsonLd('json-ld-main', jsonLd)
  }, [title, description, image, url, type, lang, jsonLd])

  return null
}
