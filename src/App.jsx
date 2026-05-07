import { useState, useEffect, lazy, Suspense } from 'react'
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LanguageProvider } from './i18n/LanguageContext'
import { ContactDrawerProvider } from './components/ContactDrawer/ContactDrawerContext'
import ContactDrawer from './components/ContactDrawer/ContactDrawer'
import Nav         from './components/Nav/Nav'
import Footer      from './components/Footer/Footer'
import Preloader   from './components/Preloader/Preloader'

// Code splitting — chaque page est un chunk séparé
const HomePage      = lazy(() => import('./pages/HomePage'))
const WorkPage      = lazy(() => import('./pages/WorkPage'))
const ProjectPage   = lazy(() => import('./pages/ProjectPage'))
const AboutPage     = lazy(() => import('./pages/AboutPage'))
const NotFoundPage  = lazy(() => import('./pages/NotFoundPage'))
const LegalPage     = lazy(() => import('./pages/LegalPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"            element={<HomePage />}    />
          <Route path="/work"        element={<WorkPage />}    />
          <Route path="/work/:slug"  element={<ProjectPage />} />
          <Route path="/about"       element={<AboutPage />}   />
          <Route path="/legal"       element={<LegalPage />}    />
          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function AppLayout({ loaded }) {
  const { pathname } = useLocation()
  const isProjectPage = /^\/work\/.+/.test(pathname)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{ pointerEvents: loaded ? 'auto' : 'none' }}
    >
      {!isProjectPage && <Footer />}
      <div className={`app-body${isProjectPage ? ' app-body--no-footer' : ''}`}>
        <Nav />
        <AnimatedRoutes />
        <div className="footer-sentinel" aria-hidden="true" />
      </div>
    </motion.div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <ContactDrawerProvider>
          {!loaded && <Preloader onDone={() => setLoaded(true)} />}

          <AppLayout loaded={loaded} />

          <ContactDrawer />
        </ContactDrawerProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
