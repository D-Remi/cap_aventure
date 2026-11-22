import { waLink, IconeWhatsApp } from '../../data/contact'
import { ouvrirRendezVous } from '../../utils/rendezVous'
import './StickyContact.css'

// Barre de contact fixe, visible uniquement sur mobile.
// Bouton principal : réserver un appel ; le formulaire reste accessible par « Écrire ».
export default function StickyContact({ onContact, waTexte }) {
  return (
    <div className="ev-sticky">
      <button className="ev-sticky__main" onClick={ouvrirRendezVous}>
        Réserver un appel gratuit
      </button>
      {onContact && (
        <button className="ev-sticky__wa ev-sticky__ecrire" onClick={() => onContact()} aria-label="Écrire un message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16v12H5.2L4 17.2V4z" /><path d="M8 9h8M8 12h5" /></svg>
        </button>
      )}
      <a className="ev-sticky__wa" href={waLink(waTexte)} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp">
        <IconeWhatsApp />
      </a>
    </div>
  )
}
