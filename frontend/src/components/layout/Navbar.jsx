import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location  = useLocation()
  const { user }  = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar__logo">
        Cap<span>Aventure</span>
      </Link>

      <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
        <li><button onClick={() => scrollTo('projet')}>Le projet</button></li>
        <li><button onClick={() => scrollTo('activites')}>Activités</button></li>
        <li><button onClick={() => { setMenuOpen(false); window.location.pathname !== '/calendrier' && (window.location.href = '/calendrier') }}>Calendrier</button></li>
        <li><button onClick={() => scrollTo('clubs')}>Clubs</button></li>
        <li><button onClick={() => scrollTo('contact')}>Contact</button></li>

        <li className="navbar__links--divider" />

        {user ? (
          /* ── Connecté ── */
          <>
            <li>
              <Link
                to="/dashboard"
                className="navbar__btn-dashboard"
                onClick={() => setMenuOpen(false)}
              >
                <span className="navbar__user-avatar">{user.prenom?.[0]}{user.nom?.[0]}</span>
                Mon espace
              </Link>
            </li>
            {(user.role === 'admin' || user.role === 'animateur') && (
              <li>
                <Link to="/admin" className="navbar__btn-admin" onClick={() => setMenuOpen(false)}>
                  ⚙️ Admin
                </Link>
              </li>
            )}
          </>
        ) : (
          /* ── Non connecté ── */
          <>
            <li><Link to="/login"    className="navbar__btn-login"    onClick={() => setMenuOpen(false)}>Connexion</Link></li>
            <li><Link to="/register" className="navbar__btn-register" onClick={() => setMenuOpen(false)}>S'inscrire</Link></li>
          </>
        )}
      </ul>

      <button
        className={`navbar__burger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
