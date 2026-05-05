import { useState } from 'react'
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LanguageProvider } from './i18n/LanguageContext'
import Nav         from './components/Nav/Nav'
import Preloader   from './components/Preloader/Preloader'
import HomePage    from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import AboutPage   from './pages/AboutPage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"            element={<HomePage />}    />
        <Route path="/work/:slug"  element={<ProjectPage />} />
        <Route path="/about"       element={<AboutPage />}   />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <BrowserRouter>
      <LanguageProvider>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ pointerEvents: loaded ? 'auto' : 'none' }}
        >
          <Nav />
          <AnimatedRoutes />
        </motion.div>
      </LanguageProvider>
    </BrowserRouter>
  )
}
