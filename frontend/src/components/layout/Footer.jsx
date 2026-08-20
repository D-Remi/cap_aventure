import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer({ onContact }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">Éduc<span> &amp; Vous</span></div>
            <p>
              Service de garde d'enfant de confiance,
              par un accompagnant éducatif. Haute-Savoie (74).
            </p>
          </div>

          <div className="footer__col">
            <h5>Les services</h5>
            <button onClick={() => go('repit')}>La garde d'enfant</button>
            <button onClick={() => go('methode')}>Ma méthode</button>
          </div>

          <div className="footer__col">
            <h5>Me joindre</h5>
            <a href="https://wa.me/33752096698" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button onClick={() => onContact ? onContact() : go('contact')}>Formulaire de contact</button>
            <Link to="/services">Nos services</Link>
            <Link to="/documentation">Aide et questions</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </div>

          <div className="footer__col">
            <h5>Espace famille</h5>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Créer un compte</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Éduc &amp; Vous · Accompagnant éducatif</span>
          <span>Haute-Savoie (74)</span>
        </div>
      </div>
    </footer>
  )
}
