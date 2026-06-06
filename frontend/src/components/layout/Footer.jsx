import { Link } from 'react-router-dom'
import './Footer.css'
export default function Footer() {
  return (
    <>
      <div className="footer-wave"><svg viewBox="0 0 1200 60"><path d="M0,20 C200,55 400,0 600,30 C800,58 1000,5 1200,25 L1200,60 L0,60 Z" fill="#2d3a6b"/></svg></div>
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <div className="footer__logo">Cap<span>Aventure</span></div>
              <p>Garde, répit et animation pour enfants à Biganos et sur le Bassin d'Arcachon. Animateur diplômé BAFA, spécialisé TSA/TDAH. CESU accepté.</p>
            </div>
            <div className="footer__col"><h4>Services</h4>
              <a href="#services">Garde & sorties</a>
              <a href="#repit">Répit TSA/TDAH</a>
              <a href="#services">Animation événements</a>
              <a href="#tarifs">Tarifs</a>
            </div>
            <div className="footer__col"><h4>Espace</h4>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Créer un compte</Link>
              <Link to="/dashboard">Mon tableau de bord</Link>
              <a href="#contact">Contact</a>
              <Link to="/documentation">Aide & FAQ</Link>
            </div>
          </div>
          <div className="footer__bottom">© 2025 CapAventure — Biganos · Bassin d'Arcachon (33) · Animateur BAFA · CESU accepté</div>
        </div>
      </footer>
    </>
  )
}