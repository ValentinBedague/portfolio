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

// Routes connues — la 404 n'a pas de preloader
function isKnownRoute(pathname) {
  return (
    pathname === '/' ||
    pathname === '/work' ||
    pathname === '/about' ||
    pathname === '/legal' ||
    /^\/work\/.+/.test(pathname)
  )
}

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

// Composant intérieur : a accès à useLocation() pour décider du preloader
function AppController() {
  const { pathname } = useLocation()
  const isProjectPage = /^\/work\/.+/.test(pathname)

  // Si on atterrit directement sur une 404, on passe loaded à true d'emblée
  const [loaded, setLoaded] = useState(() => !isKnownRoute(pathname))

  return (
    <>
      <ScrollToTop />

      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

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

      <ContactDrawer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ContactDrawerProvider>
          <AppController />
        </ContactDrawerProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
