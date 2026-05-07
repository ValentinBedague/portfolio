/**
 * ArrowIcon — SVG arrow components to avoid emoji rendering on mobile.
 *
 * Usage:
 *   <ArrowRight className="my-class" />
 *   <ArrowUpRight className="my-class" />
 *
 * Both components inherit size from font-size (width/height = "1em")
 * and colour from `currentColor`, so existing CSS classes work as-is.
 */

export function ArrowRight({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      width="1em"
      height="1em"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9H15M10.5 4.5L15 9L10.5 13.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowUpRight({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      width="1em"
      height="1em"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 13.5L13.5 4.5M13.5 4.5H6M13.5 4.5V12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowLeft({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      width="1em"
      height="1em"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 9H3M7.5 4.5L3 9L7.5 13.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
