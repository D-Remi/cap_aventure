import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">Cap<span>Aventure</span></div>
            <p>
              Répit pour parents aidants et accompagnement éducatif familial,
              par un éducateur en lieu de vie. Gironde (33).
            </p>
          </div>

          <div className="footer__col">
            <h5>Les services</h5>
            <button onClick={() => go('repit')}>Répit handicap</button>
            <button onClick={() => go('accompagnement')}>Accompagnement éducatif</button>
            <button onClick={() => go('methode')}>Ma méthode</button>
          </div>

          <div className="footer__col">
            <h5>Me joindre</h5>
            <a href="https://wa.me/33752096698" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button onClick={() => go('contact')}>Formulaire de contact</button>
            <Link to="/documentation">Aide et questions</Link>
          </div>

          <div className="footer__col">
            <h5>Espace famille</h5>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Créer un compte</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} CapAventure · Éducateur en lieu de vie</span>
          <span>Gironde (33)</span>
        </div>
      </div>
    </footer>
  )
}
