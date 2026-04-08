import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">Cap<span>Aventure</span></Link>
          <p>Activités outdoor encadrées pour les 6–14 ans à Thonon-les-Bains et dans le Chablais.</p>
        </div>

        <div className="footer__links">
          <h4>Navigation</h4>
          <ul>
            <li><button onClick={() => scrollTo('projet')}>Le projet</button></li>
            <li><button onClick={() => scrollTo('activites')}>Activités</button></li>
            <li><Link to="/calendrier">Calendrier</Link></li>
            <li><button onClick={() => scrollTo('clubs')}>Clubs</button></li>
            <li><button onClick={() => scrollTo('contact')}>Contact</button></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Mon espace</h4>
          <ul>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register">Créer un compte</Link></li>
            <li><Link to="/dashboard">Mon tableau de bord</Link></li>
          </ul>
        </div>

        <div className="footer__info">
          <h4>Infos</h4>
          <p>📍 Thonon-les-Bains (74200)</p>
          <p>📅 Mercredis, week-ends & vacances</p>
          <p>🎒 6 à 14 ans</p>
          <p>✅ Encadrement certifié BAFA</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} <strong>CapAventure</strong> — Projet en cours de lancement · Thonon-les-Bains</p>
      </div>
    </footer>
  )
}
