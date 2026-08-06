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
              Relais à la journée et accompagnement éducatif familial,
              par un accompagnant éducatif. Gironde (33).
            </p>
          </div>

          <div className="footer__col">
            <h5>Les services</h5>
            <button onClick={() => go('repit')}>Le relais à la journée</button>
            <button onClick={() => go('accompagnement')}>Accompagnement éducatif</button>
            <button onClick={() => go('methode')}>Ma méthode</button>
          </div>

          <div className="footer__col">
            <h5>Me joindre</h5>
            <a href="https://wa.me/33752096698" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button onClick={() => onContact ? onContact() : go('contact')}>Formulaire de contact</button>
            <Link to="/documentation">Aide et questions</Link>
          </div>

          <div className="footer__col">
            <h5>Espace famille</h5>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Créer un compte</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Éduc &amp; Vous · Accompagnant éducatif</span>
          <span>Gironde (33)</span>
        </div>
      </div>
    </footer>
  )
}
