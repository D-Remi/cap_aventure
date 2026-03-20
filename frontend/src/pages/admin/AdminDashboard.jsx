import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import '../../components/layout/AdminLayout.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [users, children, activities, registrations, interest] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/children'),
        axios.get('/api/activities?all=true'),
        axios.get('/api/registrations'),
        axios.get('/api/interest'),
      ])
      setStats({
        users:         users.data.length,
        children:      children.data.length,
        activities:    activities.data.length,
        registrations: registrations.data.length,
        confirmed:     registrations.data.filter(r => r.status === 'confirmed').length,
        pending:       registrations.data.filter(r => r.status === 'pending').length,
        interest:      interest.data.length,
        revenue:       registrations.data
          .filter(r => r.status === 'confirmed')
          .reduce((sum, r) => sum + parseFloat(r.activity?.prix || 0), 0),
      })
      setRecentRegs(registrations.data.slice(0, 8))
    } finally {
      setLoading(false)
    }
  }

  const STATUS_LABEL = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée' }
  const STATUS_CLASS = { pending: 'pending', confirmed: 'confirmed', cancelled: 'cancelled' }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Vue d'ensemble de CapAventure</p>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </span>
        </div>

        {loading ? (
          <div className="admin-loading">Chargement des statistiques...</div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-card__icon" style={{ background: '#dbeafe' }}>👨‍👩‍👧</div>
                <div className="admin-stat-card__body">
                  <div className="admin-stat-card__num">{stats.users}</div>
                  <div className="admin-stat-card__label">Familles inscrites</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__icon" style={{ background: '#dcfce7' }}>🧒</div>
                <div className="admin-stat-card__body">
                  <div className="admin-stat-card__num">{stats.children}</div>
                  <div className="admin-stat-card__label">Enfants enregistrés</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__icon" style={{ background: '#fef9c3' }}>🎿</div>
                <div className="admin-stat-card__body">
                  <div className="admin-stat-card__num">{stats.activities}</div>
                  <div className="admin-stat-card__label">Activités créées</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__icon" style={{ background: '#ede9fe' }}>💶</div>
                <div className="admin-stat-card__body">
                  <div className="admin-stat-card__num">{stats.revenue.toFixed(0)}€</div>
                  <div className="admin-stat-card__label">Revenus confirmés</div>
                </div>
              </div>
            </div>

            {/* Inscriptions breakdown */}
            <div className="dash-registrations-summary">
              <div className="reg-summary-card reg-summary-card--total">
                <span className="reg-summary-card__num">{stats.registrations}</span>
                <span className="reg-summary-card__label">Total inscriptions</span>
              </div>
              <div className="reg-summary-card reg-summary-card--confirmed">
                <span className="reg-summary-card__num">{stats.confirmed}</span>
                <span className="reg-summary-card__label">✅ Confirmées</span>
              </div>
              <div className="reg-summary-card reg-summary-card--pending">
                <span className="reg-summary-card__num">{stats.pending}</span>
                <span className="reg-summary-card__label">⏳ En attente</span>
              </div>
              <div className="reg-summary-card reg-summary-card--interest">
                <span className="reg-summary-card__num">{stats.interest}</span>
                <span className="reg-summary-card__label">📩 Demandes contact</span>
              </div>
            </div>

            {/* Quick links */}
            <div className="admin-quick-links">
              {[
                { to: '/admin/activities', icon: '🎿', label: 'Gérer les activités', color: '#fef9c3' },
                { to: '/admin/registrations', icon: '📋', label: 'Voir les inscriptions', color: '#dcfce7' },
                { to: '/admin/users', icon: '👨‍👩‍👧', label: 'Gérer les familles', color: '#dbeafe' },
                { to: '/admin/interest', icon: '📩', label: 'Demandes contact', color: '#ede9fe' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="admin-quick-link">
                  <div className="admin-quick-link__icon" style={{ background: item.color }}>{item.icon}</div>
                  <span>{item.label}</span>
                  <span className="admin-quick-link__arrow">→</span>
                </Link>
              ))}
            </div>

            {/* Recent registrations */}
            <div className="admin-table-wrap" style={{ marginTop: '1.5rem' }}>
              <div className="admin-table-wrap__header">
                <h2>Dernières inscriptions</h2>
                <Link to="/admin/registrations" style={{ fontSize: '0.85rem', color: 'var(--vert-clair)', fontWeight: 700 }}>
                  Voir tout →
                </Link>
              </div>
              {recentRegs.length === 0 ? (
                <div className="admin-empty"><span>📋</span>Aucune inscription pour le moment</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Enfant</th>
                      <th>Activité</th>
                      <th>Date d'inscription</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRegs.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.child?.prenom} {r.child?.nom}</strong></td>
                        <td>{r.activity?.titre}</td>
                        <td>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                        <td>
                          <span className={`badge badge--${STATUS_CLASS[r.status]}`}>
                            {STATUS_LABEL[r.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
