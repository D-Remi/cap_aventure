import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const go = (id) => { setOpen(false); const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); else navigate('/#'+id) }
  return (
    <nav className={`navbar ${scrolled?'scrolled':''}`}>
      <Link to="/" className="navbar__logo">Cap<span>Aventure</span></Link>
      <div className={`navbar__links ${open?'open':''}`}>
        <button onClick={()=>go('services')}>Services</button>
        <button onClick={()=>go('repit')}>Répit</button>
        <button onClick={()=>go('comment')}>Comment</button>
        <button onClick={()=>go('tarifs')}>Tarifs</button>
        <button onClick={()=>go('contact')}>Contact</button>
        {user && <Link to="/dashboard" onClick={()=>setOpen(false)}>Mon espace</Link>}
        {user?.role==='admin' && <Link to="/admin" onClick={()=>setOpen(false)}>Admin</Link>}
      </div>
      <div className="navbar__actions">
        {user ? (
          <><Link to="/dashboard" className="navbar__btn">Mon espace</Link><button className="navbar__out" onClick={logout}>Déco</button></>
        ) : (
          <><Link to="/login" className="navbar__login">Connexion</Link><Link to="/register" className="navbar__btn">S'inscrire</Link></>
        )}
        <button className="navbar__burger" onClick={()=>setOpen(!open)}><span/><span/><span/></button>
      </div>
    </nav>
  )
}