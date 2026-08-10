import { useState, useEffect, lazy, Suspense } from 'react'
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LanguageProvider } from './i18n/LanguageContext'
import { ThemeProvider }    from './i18n/ThemeContext'
import { ContactDrawerProvider } from './components/ContactDrawer/ContactDrawerContext'
import ContactDrawer from './components/ContactDrawer/ContactDrawer'
import Nav          from './components/Nav/Nav'
import Footer       from './components/Footer/Footer'
import Preloader    from './components/Preloader/Preloader'
import ContactFAB   from './components/ContactFAB/ContactFAB'
import SmoothScroll from './components/SmoothScroll'

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
  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])
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

  // La classe déclenche les animations d'entrée CSS (hero, etc.)
  useEffect(() => {
    if (loaded) document.body.classList.add('app-loaded')
  }, [loaded])

  return (
    <>
      <SmoothScroll />
      <ScrollToTop />

      {/* Skip link — accessibilité clavier / lecteurs d'écran */}
      <a href="#main" className="skip-link">Aller au contenu</a>

      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      {/* Nav & FAB hors du fade-in — visibles immédiatement après le preloader */}
      <Nav />
      <ContactFAB />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ pointerEvents: loaded ? 'auto' : 'none' }}
      >
        {!isProjectPage && <Footer />}
        <main id="main" className={`app-body${isProjectPage ? ' app-body--no-footer' : ''}`}>
          <AnimatedRoutes />
          <div className="footer-sentinel" aria-hidden="true" />
        </main>
      </motion.div>

      <ContactDrawer />

      {/* Texture film au-dessus de tout le contenu */}
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ContactDrawerProvider>
            <AppController />
          </ContactDrawerProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
