/**
 * RollText — effet "roll" au hover : le texte glisse vers le haut,
 * remplacé par sa copie. Le hover se déclenche sur le parent portant
 * la classe `roll-hover` (lien, bouton…).
 *
 * Usage :
 *   <a className="nav__link roll-hover"><RollText>Accueil</RollText></a>
 */
export default function RollText({ children }) {
  return (
    <span className="roll">
      <span className="roll__stack">
        <span className="roll__copy">{children}</span>
        <span className="roll__copy" aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
