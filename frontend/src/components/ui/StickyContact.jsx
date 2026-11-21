import { waLink, IconeWhatsApp } from '../../data/contact'
import './StickyContact.css'

// Barre de contact fixe, visible uniquement sur mobile.
export default function StickyContact({ onContact, waTexte }) {
  return (
    <div className="ev-sticky">
      <button className="ev-sticky__main" onClick={() => onContact && onContact()}>
        Premier échange gratuit
      </button>
      <a className="ev-sticky__wa" href={waLink(waTexte)} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp">
        <IconeWhatsApp />
      </a>
    </div>
  )
}
