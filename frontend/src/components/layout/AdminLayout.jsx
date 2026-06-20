import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'
const NAV = [
  {path:'/admin',                label:'Tableau de bord'},
  {path:'/admin/slots',          label:'Créneaux'},
  {path:'/admin/bookings',       label:'Réservations'},
  {path:'/admin/contrats',       label:'Contrats répit'},
  {path:'/admin/children',       label:'Dossiers enfants'},
  {path:'/admin/planning',       label:'Planning'},
  {path:'/admin/users',          label:'Familles'},
  {path:'/admin/contacts',       label:'Contacts'},
  {path:'/admin/messages',       label:'Messages'},
  {path:'/admin/photos',         label:'Photos séances'},
  {path:'/admin/documents',      label:'Documents'},
  {path:'/admin/temoignages',    label:'Témoignages'},
  {path:'/admin/compta',         label:'Comptabilité'},
  {path:'/admin/stats',          label:'Statistiques'},
]
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link to="/" className="admin-sidebar__logo">Cap<span>Aventure</span></Link>
          <div className="admin-sidebar__role">Administration</div>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV.map(n=>(
            <Link key={n.path} to={n.path} className={`admin-nav-item ${pathname===n.path?'active':''}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <div className="admin-sidebar__user">{user?.prenom} {user?.nom}</div>
          <button onClick={logout} className="admin-sidebar__logout">Déconnexion</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}