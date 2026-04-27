import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const NAV_ITEMS = [
  { key: 'dashboard',    label: 'Tableau de bord',   icon: '📊', path: '/admin' },
  { key: 'stats',        label: 'Statistiques',       icon: '📈', path: '/admin/stats' },
  { key: 'activities',   label: 'Activités',          icon: '🎿', path: '/admin/activities' },
  { key: 'registrations',label: 'Inscriptions',       icon: '📋', path: '/admin/registrations' },
  { key: 'points',       label: 'Points',             icon: '🏆', path: '/admin/points' },
  { key: 'users',        label: 'Parents & Enfants',  icon: '👨‍👩‍👧', path: '/admin/users' },
  { key: 'documents',    label: 'Documents',          icon: '📁', path: '/admin/documents' },
  { key: 'messages',     label: 'Messages',           icon: '💬', path: '/admin/messages' },
  { key: 'interest',     label: 'Demandes contact',   icon: '📩', path: '/admin/interest' },
  { key: 'planning',     label: 'Planning',           icon: '📅', path: '/admin/planning' },
  { key: 'attendance',   label: 'Présences',          icon: '✅', path: '/admin/attendance' },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className={`admin-layout ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__top">
          <Link to="/" className="admin-logo">
            {collapsed ? 'CA' : <><span className="admin-logo__cap">Cap</span>Aventure</>}
          </Link>
          <button className="admin-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <div className="admin-sidebar__label">{!collapsed && 'BACK-OFFICE'}</div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`admin-nav__item ${active ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span className="admin-nav__icon">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && <span className="admin-nav__dot" />}
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar__bottom">
          <Link to="/dashboard" className="admin-nav__item">
            <span className="admin-nav__icon">👤</span>
            {!collapsed && <span>Espace parent</span>}
          </Link>
          <div className="admin-user">
            <div className="admin-user__avatar">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            {!collapsed && (
              <div className="admin-user__info">
                <span className="admin-user__name">{user?.prenom} {user?.nom}</span>
                <span className="admin-user__role">Administrateur</span>
              </div>
            )}
            <button className="admin-logout-btn" onClick={handleLogout} title="Déconnexion">⏏</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
