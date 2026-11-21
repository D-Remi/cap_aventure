import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

// overHero : la barre est transparente au-dessus d'un en-tête sombre, puis devient blanche au défilement.
export default function Navbar({ onContact, overHero = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const go = (id) => {
    setOpen(false)
    if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    else navigate('/#' + id)
  }

  const contact = () => {
    setOpen(false)
    if (onContact) onContact()
    else navigate('/#contact')
  }

  const light = overHero && !scrolled && !open

  return (
    <nav className={`ev-nav ${overHero ? 'ev-nav--over' : ''} ${light ? 'is-light' : 'is-solid'} ${open ? 'is-open' : ''}`}>
      <div className="ev-nav__inner">
        <Link to="/" className="ev-nav__logo">Éduc<span> &amp; Vous</span></Link>

        <div className="ev-nav__links" id="ev-menu">
          <button onClick={() => go('formules')}>La garde</button>
          <NavLink to="/tarifs">Tarifs</NavLink>
          <NavLink to="/frontaliers-suisse">Frontaliers &amp; Suisse</NavLink>
          <button onClick={() => go('qui')}>Qui je suis</button>
          <NavLink to="/documentation">Aide</NavLink>
          {user && <NavLink to="/dashboard" className="ev-nav__m">Mon espace</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className="ev-nav__m">Admin</NavLink>}
          {user
            ? <button className="ev-nav__m" onClick={logout}>Déconnexion</button>
            : <NavLink to="/login" className="ev-nav__m">Connexion espace famille</NavLink>}
        </div>

        <div className="ev-nav__actions">
          {user ? (
            <>
              <Link to="/dashboard" className="ev-nav__login">Mon espace</Link>
              {user.role === 'admin' && <Link to="/admin" className="ev-nav__login">Admin</Link>}
              <button className="ev-nav__login" onClick={logout}>Déconnexion</button>
            </>
          ) : (
            <Link to="/login" className="ev-nav__login">Connexion</Link>
          )}
          <button className="ev-nav__cta" onClick={contact}>Prendre contact</button>
          <button
            className="ev-nav__burger"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="ev-menu"
            onClick={() => setOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
