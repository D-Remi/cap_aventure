import { Link } from 'react-router-dom'
import { waLink, TEL_AFFICHE, TEL_LIEN, EMAIL } from '../../data/contact'
import './Footer.css'

export default function Footer({ onContact }) {
  return (
    <footer className="ev-foot">
      <div className="ev-foot__inner">
        <div className="ev-foot__grid">
          <div className="ev-foot__brand">
            <Link to="/" className="ev-foot__logo">Éduc<span> &amp; Vous</span></Link>
            <p>Garde et répit à domicile pour les familles d'enfants à besoins spécifiques, par un accompagnant éducatif. Thonon, Évian et le Chablais.</p>
            <a className="ev-foot__wa" href={waLink()} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
          </div>

          <div className="ev-foot__col">
            <h5>La garde</h5>
            <Link to="/#formules">Les formules</Link>
            <Link to="/tarifs">Tarifs et aides</Link>
            <Link to="/frontaliers-suisse">Frontaliers et Suisse</Link>
            <Link to="/#qui">Qui je suis</Link>
          </div>

          <div className="ev-foot__col">
            <h5>Me joindre</h5>
            <a href={TEL_LIEN}>{TEL_AFFICHE}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            {onContact
              ? <button onClick={() => onContact()}>Formulaire de contact</button>
              : <Link to="/#contact">Formulaire de contact</Link>}
            <Link to="/documentation">Aide et questions</Link>
          </div>

          <div className="ev-foot__col">
            <h5>Espace famille</h5>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Créer un compte</Link>
          </div>

          <div className="ev-foot__col">
            <h5>Informations légales</h5>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/cgv">Conditions générales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </div>
        </div>

        <div className="ev-foot__bottom">
          <span>© {new Date().getFullYear()} Éduc &amp; Vous · Rémi Delfosse, accompagnant éducatif</span>
          <span>Chablais · Haute-Savoie (74)</span>
        </div>
      </div>
    </footer>
  )
}
