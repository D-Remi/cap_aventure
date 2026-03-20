import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

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
        <li><Link to="/calendrier" onClick={() => setMenuOpen(false)}>Calendrier</Link></li>
        <li><button onClick={() => scrollTo('clubs')}>Clubs</button></li>
        <li><button onClick={() => scrollTo('contact')}>Contact</button></li>
        <li className="navbar__links--divider" />
        <li><Link to="/login" className="navbar__btn-login" onClick={() => setMenuOpen(false)}>Connexion</Link></li>
        <li><Link to="/register" className="navbar__btn-register" onClick={() => setMenuOpen(false)}>S'inscrire</Link></li>
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
