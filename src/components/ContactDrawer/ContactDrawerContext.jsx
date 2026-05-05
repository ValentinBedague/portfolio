import { createContext, useContext, useState } from 'react'

const ContactDrawerContext = createContext(null)

export function ContactDrawerProvider({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <ContactDrawerContext.Provider value={{ open, openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false) }}>
      {children}
    </ContactDrawerContext.Provider>
  )
}

export function useContactDrawer() {
  return useContext(ContactDrawerContext)
}
