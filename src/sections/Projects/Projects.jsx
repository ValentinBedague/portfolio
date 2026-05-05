import { motion } from 'framer-motion'
import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard'
import './Projects.css'

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="container">

        <motion.div
          className="projects__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Réalisations</span>
          <h2 className="section-title">
            Mes derniers<br />
            <span className="projects__title-accent">projets</span>
          </h2>
          <p className="projects__sub">
            De la conception au déploiement, chaque site est pensé pour convertir et durer.
          </p>
        </motion.div>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
