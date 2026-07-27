import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar({ onContact }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else navigate('/#' + id)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar__logo">Éduc<span> &amp; Vous</span></Link>

      <div className={`navbar__links ${open ? 'open' : ''}`}>
        <button onClick={() => go('repit')}>Le relais</button>
        <button onClick={() => go('accompagnement')}>Accompagnement</button>
        <button onClick={() => go('methode')}>Ma méthode</button>
        <button onClick={() => go('qui')}>Qui je suis</button>
        {user && <Link to="/dashboard" onClick={() => setOpen(false)}>Mon espace</Link>}
        {user?.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}
      </div>

      <div className="navbar__actions">
        {user ? (
          <>
            <Link to="/dashboard" className="navbar__btn">Mon espace</Link>
            <button className="navbar__out" onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__login">Connexion</Link>
            <button className="navbar__btn" onClick={() => onContact ? onContact() : go('contact')}>Prendre contact</button>
          </>
        )}
        <button className="navbar__burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
