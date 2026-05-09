import { useContactDrawer } from '../ContactDrawer/ContactDrawerContext'
import './ContactFAB.css'

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
)

export default function ContactFAB() {
  const { openDrawer } = useContactDrawer()

  return (
    <button
      className="contact-fab"
      onClick={openDrawer}
      aria-label="Ouvrir le formulaire de contact"
    >
      <IconMail />
    </button>
  )
}
