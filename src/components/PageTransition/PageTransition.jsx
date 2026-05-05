import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
