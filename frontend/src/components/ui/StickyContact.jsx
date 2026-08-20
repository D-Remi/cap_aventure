import './StickyContact.css'

// Bouton de contact fixe, visible uniquement sur mobile.
// Reste en bas de l'écran quand on fait défiler la page.
export default function StickyContact({ onContact }) {
  return (
    <button
      className="sticky-contact"
      onClick={() => onContact && onContact()}
      aria-label="Prendre contact"
    >
      Prendre contact — échange gratuit
    </button>
  )
}
