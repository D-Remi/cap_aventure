import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import '../../components/layout/AdminLayout.css'

export default function AdminDashboard() {
  const [stats,      setStats]      = useState(null)
  const [recentBk,   setRecentBk]   = useState([])
  const [loading,    setLoading]     = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [users, children, slots, bookings, contacts] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/children'),
        axios.get('/api/slots?all=true'),
        axios.get('/api/bookings'),
        axios.get('/api/contact'),
      ])
      const bk = bookings.data
      setStats({
        familles:  users.data.length,
        enfants:   children.data.length,
        creneaux:  slots.data.filter(s => s.statut === 'ouvert').length,
        bookings:  bk.length,
        confirmed: bk.filter(r => r.status === 'confirmed').length,
        pending:   bk.filter(r => r.status === 'pending').length,
        contacts:  contacts.data.filter(c => !c.traite).length,
        revenue:   bk.filter(r => r.status === 'confirmed')
                     .reduce((s, r) => s + parseFloat(r.tarif_applique || 0), 0),
      })
      setRecentBk(bk.slice(0, 8))
    } finally { setLoading(false) }
  }

  const ST = {
    pending:   { bg:'#fff8e1', c:'#f57f17', l:'⏳ En attente' },
    confirmed: { bg:'#e8f5e9', c:'#2e7d32', l:'✅ Confirmée' },
    cancelled: { bg:'#fee2e2', c:'#991b1b', l:'❌ Annulée' },
    no_show:   { bg:'#f3f4f6', c:'#6b7280', l:'👻 Absent' },
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div><h1>Tableau de bord</h1><p>Vue d'ensemble de CapAventure</p></div>
          <span style={{fontSize:'.82rem',color:'var(--text-muted)'}}>
            {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </span>
        </div>

        {loading ? <div className="admin-loading">Chargement…</div> : (
          <>
            {/* Stats */}
            <div className="admin-stats-grid">
              {[
                { icon:'👨‍👩‍👧', bg:'#dbeafe', num:stats.familles,  label:'Familles inscrites'      },
                { icon:'🧒',      bg:'#dcfce7', num:stats.enfants,   label:'Enfants enregistrés'     },
                { icon:'📅',      bg:'#fef9c3', num:stats.creneaux,  label:'Créneaux disponibles'    },
                { icon:'💶',      bg:'#ede9fe', num:stats.revenue.toFixed(0)+'€', label:'Revenus confirmés' },
              ].map(c => (
                <div key={c.label} className="admin-stat-card">
                  <div className="admin-stat-card__icon" style={{background:c.bg}}>{c.icon}</div>
                  <div className="admin-stat-card__body">
                    <div className="admin-stat-card__num">{c.num}</div>
                    <div className="admin-stat-card__label">{c.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Réservations résumé */}
            <div className="dash-registrations-summary">
              <div className="reg-summary-card reg-summary-card--total">
                <span className="reg-summary-card__num">{stats.bookings}</span>
                <span className="reg-summary-card__label">Total réservations</span>
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
                <span className="reg-summary-card__num">{stats.contacts}</span>
                <span className="reg-summary-card__label">📩 Contacts non traités</span>
              </div>
            </div>

            {/* Raccourcis */}
            <div className="admin-quick-links">
              {[
                { to:'/admin/slots',    icon:'📅', label:'Gérer les créneaux',     color:'#fef9c3' },
                { to:'/admin/bookings', icon:'📋', label:'Voir les réservations',  color:'#dcfce7' },
                { to:'/admin/users',    icon:'👨‍👩‍👧', label:'Gérer les familles',    color:'#dbeafe' },
                { to:'/admin/contacts', icon:'📩', label:'Demandes de contact',    color:'#ede9fe' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="admin-quick-link">
                  <div className="admin-quick-link__icon" style={{background:item.color}}>{item.icon}</div>
                  <span>{item.label}</span>
                  <span className="admin-quick-link__arrow">→</span>
                </Link>
              ))}
            </div>

            {/* Dernières réservations */}
            <div className="admin-table-wrap" style={{marginTop:'1.5rem'}}>
              <div className="admin-table-wrap__header">
                <h2>Dernières réservations</h2>
                <Link to="/admin/bookings" style={{fontSize:'.85rem',color:'var(--sauge)',fontWeight:700}}>Voir tout →</Link>
              </div>
              {recentBk.length === 0 ? (
                <div className="admin-empty"><span>📋</span>Aucune réservation pour le moment</div>
              ) : (
                <table className="admin-table">
                  <thead><tr><th>Enfant</th><th>Créneau</th><th>Date demande</th><th>Statut</th></tr></thead>
                  <tbody>
                    {recentBk.map(r => {
                      const st = ST[r.status] || ST.pending
                      return (
                        <tr key={r.id}>
                          <td style={{fontWeight:700}}>{r.child?.prenom} {r.child?.nom}</td>
                          <td style={{color:'var(--text-muted)',fontSize:'.85rem'}}>
                            {r.slot?.date ? new Date(r.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) : '—'}
                            {r.slot?.titre ? ` · ${r.slot.titre}` : ''}
                          </td>
                          <td style={{color:'var(--text-muted)',fontSize:'.85rem'}}>
                            {new Date(r.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <span style={{background:st.bg,color:st.c,padding:'3px 10px',borderRadius:50,fontSize:'.75rem',fontWeight:700,whiteSpace:'nowrap'}}>
                              {st.l}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
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