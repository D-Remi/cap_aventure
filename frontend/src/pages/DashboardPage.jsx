import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import DocumentsTab from '../components/ui/DocumentUploader'
import PointsTab from '../components/ui/PointsTab'
import '../components/ui/DocumentUploader.css'
import '../components/ui/ImageUploader.css'
import '../components/ui/PointsTab.css'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [children, setChildren]         = useState([])
  const [registrations, setRegistrations] = useState([])
  const [activities, setActivities]     = useState([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState('overview') // overview | children | activities

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [c, r, a] = await Promise.all([
        axios.get('/api/children'),
        axios.get('/api/registrations/mine'),
        axios.get('/api/activities'),
      ])
      setChildren(c.data)
      setRegistrations(r.data)
      setActivities(a.data)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (loading) return <div className="dash-loading">Chargement...</div>

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">Cap<span>Aventure</span></Link>

        <nav className="dash-nav">
          <button className={tab === 'overview'    ? 'active' : ''} onClick={() => setTab('overview')}>🏠 Tableau de bord</button>
          <button className={tab === 'children'    ? 'active' : ''} onClick={() => setTab('children')}>👧 Mes enfants</button>
          <button className={tab === 'activities'  ? 'active' : ''} onClick={() => setTab('activities')}>🎿 Les activités</button>
          <button className={tab === 'bookings'    ? 'active' : ''} onClick={() => setTab('bookings')}>📋 Mes inscriptions</button>
          <button className={tab === 'points'      ? 'active' : ''} onClick={() => setTab('points')}>🏆 Mes points</button>
          <button className={tab === 'documents'   ? 'active' : ''} onClick={() => setTab('documents')}>📁 Mes documents</button>
        </nav>

        <div className="dash-nav" style={{ marginTop: 'auto', paddingBottom: '0.5rem', flex: 'none' }}>
          <Link to="/calendrier" className="admin-nav__item" style={{ color: 'rgba(247,250,248,0.65)', display:'flex', gap:'0.75rem', padding:'0.65rem 0.85rem', borderRadius:10, fontSize:'0.88rem', fontWeight:600 }}>
            📅 <span>Calendrier</span>
          </Link>
          <Link to="/profil" className="admin-nav__item" style={{ color: 'rgba(247,250,248,0.65)', display:'flex', gap:'0.75rem', padding:'0.65rem 0.85rem', borderRadius:10, fontSize:'0.88rem', fontWeight:600 }}>
            ⚙️ <span>Mon profil</span>
          </Link>
        </div>

        <div className="dash-user">
          <div className="dash-user__avatar">{user.prenom[0]}{user.nom[0]}</div>
          <div>
            <p className="dash-user__name">{user.prenom} {user.nom}</p>
            <p className="dash-user__role">Espace famille</p>
          </div>
          <button className="dash-logout" onClick={handleLogout} title="Déconnexion">⏏</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {tab === 'overview'   && <Overview user={user} children={children} registrations={registrations} setTab={setTab} />}
        {tab === 'children'   && <Children children={children} refresh={fetchAll} />}
        {tab === 'activities' && <Activities activities={activities} children={children} refresh={fetchAll} />}
        {tab === 'bookings'   && <Bookings registrations={registrations} refresh={fetchAll} />}
        {tab === 'points'     && <PointsTab children={children} />}
        {tab === 'documents'  && <DocumentsTab children={children} />}
      </main>
    </div>
  )
}

/* ── Overview ─────────────────────────────────────────────── */
function Overview({ user, children, registrations, setTab }) {
  return (
    <div className="dash-section">
      <h1>Bonjour, {user.prenom} 👋</h1>
      <p className="dash-section__sub">Bienvenue dans votre espace famille CapAventure</p>

      <div className="dash-stats">
        <div className="dash-stat-card">
          <span className="dash-stat-card__num">{children.length}</span>
          <span className="dash-stat-card__label">Enfant{children.length > 1 ? 's' : ''} enregistré{children.length > 1 ? 's' : ''}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-card__num">{registrations.filter(r => r.status === 'confirmed').length}</span>
          <span className="dash-stat-card__label">Inscription{registrations.length > 1 ? 's' : ''} confirmée{registrations.length > 1 ? 's' : ''}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-card__num">{registrations.filter(r => r.status === 'pending').length}</span>
          <span className="dash-stat-card__label">En attente</span>
        </div>
      </div>

      <div className="dash-quick">
        <h2>Actions rapides</h2>
        <div className="dash-quick__grid">
          <button className="dash-quick__card" onClick={() => setTab('children')}>
            <span>👧</span><strong>Ajouter un enfant</strong><p>Enregistrer un nouveau profil</p>
          </button>
          <button className="dash-quick__card" onClick={() => setTab('activities')}>
            <span>🎿</span><strong>Voir les activités</strong><p>S'inscrire à une sortie</p>
          </button>
          <button className="dash-quick__card" onClick={() => setTab('bookings')}>
            <span>📋</span><strong>Mes inscriptions</strong><p>Suivre les réservations</p>
          </button>
          <button className="dash-quick__card" onClick={() => setTab('points')}>
            <span>🏆</span><strong>Mes points</strong><p>Récompenses & classement</p>
          </button>
          <button className="dash-quick__card" onClick={() => setTab('documents')}>
            <span>📁</span><strong>Mes documents</strong><p>Fiches sanitaires, autorisations</p>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Children ─────────────────────────────────────────────── */
function Children({ children, refresh }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ prenom: '', nom: '', date_naissance: '', infos_medicales: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/children', form)
      await refresh()
      setShowForm(false)
      setForm({ prenom: '', nom: '', date_naissance: '', infos_medicales: '' })
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet enfant ?')) return
    await axios.delete(`/api/children/${id}`)
    refresh()
  }

  return (
    <div className="dash-section">
      <div className="dash-section__header">
        <div>
          <h1>Mes enfants</h1>
          <p className="dash-section__sub">Gérez les profils de vos enfants</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Annuler' : '+ Ajouter'}
        </button>
      </div>

      {showForm && (
        <form className="dash-form-card" onSubmit={handleAdd}>
          <h3>Nouveau profil enfant</h3>
          <div className="form-row">
            <div className="form-group"><label>Prénom *</label><input value={form.prenom} onChange={set('prenom')} required /></div>
            <div className="form-group"><label>Nom *</label><input value={form.nom} onChange={set('nom')} required /></div>
          </div>
          <div className="form-group"><label>Date de naissance *</label><input type="date" value={form.date_naissance} onChange={set('date_naissance')} required /></div>
          <div className="form-group"><label>Infos médicales (allergies, etc.)</label><textarea value={form.infos_medicales} onChange={set('infos_medicales')} placeholder="Aucune" /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
        </form>
      )}

      <div className="dash-children-grid">
        {children.length === 0 ? (
          <div className="dash-empty">Aucun enfant enregistré. Ajoutez-en un pour commencer !</div>
        ) : children.map(child => (
          <div key={child.id} className="dash-child-card">
            <div className="dash-child-card__avatar">{child.prenom[0]}</div>
            <div className="dash-child-card__info">
              <strong>{child.prenom} {child.nom}</strong>
              <span>{new Date(child.date_naissance).toLocaleDateString('fr-FR')}</span>
              {child.infos_medicales && <p>{child.infos_medicales}</p>}
            </div>
            <button className="dash-child-card__delete" onClick={() => handleDelete(child.id)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Activities ───────────────────────────────────────────── */
function Activities({ activities, children, refresh }) {
  const [selected, setSelected] = useState(null)
  const [childId, setChildId]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [msg, setMsg]           = useState('')

  const handleRegister = async () => {
    if (!childId) { setMsg('Sélectionnez un enfant.'); return }
    setLoading(true); setMsg('')
    try {
      await axios.post('/api/registrations', { activity_id: selected.id, child_id: childId })
      setMsg('Inscription enregistrée !')
      setSelected(null)
      refresh()
    } catch (e) {
      setMsg(e.response?.data?.message || 'Erreur lors de l\'inscription.')
    } finally { setLoading(false) }
  }

  return (
    <div className="dash-section">
      <h1>Les activités</h1>
      <p className="dash-section__sub">Inscrivez vos enfants aux prochaines sorties</p>

      {msg && <div className="dash-msg">{msg}</div>}

      <div className="dash-activities-grid">
        {activities.map(act => (
          <div key={act.id} className="dash-act-card">
            {act.image_url && <img src={act.image_url} alt={act.titre} />}
            <div className="dash-act-card__body">
              <h3>{act.titre}</h3>
              <p>{act.description}</p>
              <div className="dash-act-card__meta">
                <span>📅 {new Date(act.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}</span>
                <span>💶 {act.prix}€</span>
                <span>👥 {act.places_restantes} place{act.places_restantes > 1 ? 's' : ''} restante{act.places_restantes > 1 ? 's' : ''}</span>
              </div>
              <button
                className="btn-primary"
                disabled={act.places_restantes === 0}
                onClick={() => { setSelected(act); setMsg('') }}
              >
                {act.places_restantes === 0 ? 'Complet' : 'S\'inscrire'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal inscription */}
      {selected && (
        <div className="dash-modal-overlay" onClick={() => setSelected(null)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <h3>Inscription — {selected.titre}</h3>
            <p>📅 {new Date(selected.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}</p>
            <p>💶 {selected.prix}€ · {selected.places_restantes} place(s) restante(s)</p>
            <div className="form-group" style={{ marginTop: '1.2rem' }}>
              <label>Choisir l'enfant *</label>
              <select value={childId} onChange={e => setChildId(e.target.value)}>
                <option value="">-- Sélectionner --</option>
                {children.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            {msg && <p className="auth-error" style={{ marginTop: '0.75rem' }}>{msg}</p>}
            <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
              <button className="btn-primary" onClick={handleRegister} disabled={loading}>{loading ? '...' : 'Confirmer'}</button>
              <button className="btn-secondary" onClick={() => setSelected(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Bookings ─────────────────────────────────────────────── */
function Bookings({ registrations, refresh }) {
  const handleCancel = async (id) => {
    if (!window.confirm('Annuler cette inscription ?')) return
    await axios.delete(`/api/registrations/${id}`)
    refresh()
  }

  const statusLabel = { pending: '⏳ En attente', confirmed: '✅ Confirmée', cancelled: '❌ Annulée' }
  const statusClass = { pending: 'pending', confirmed: 'confirmed', cancelled: 'cancelled' }

  return (
    <div className="dash-section">
      <h1>Mes inscriptions</h1>
      <p className="dash-section__sub">Suivez les réservations de vos enfants</p>

      {registrations.length === 0 ? (
        <div className="dash-empty">Aucune inscription pour le moment.</div>
      ) : (
        <div className="dash-bookings-list">
          {registrations.map(r => (
            <div key={r.id} className="dash-booking-card">
              <div className="dash-booking-card__info">
                <strong>{r.activity?.titre}</strong>
                <span>👤 {r.child?.prenom} {r.child?.nom}</span>
                <span>📅 {r.activity?.date ? new Date(r.activity.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) : '—'}</span>
                <span>💶 {r.activity?.prix}€</span>
              </div>
              <div className="dash-booking-card__right">
                <span className={`dash-status dash-status--${statusClass[r.status]}`}>
                  {statusLabel[r.status]}
                </span>
                {r.status !== 'cancelled' && (
                  <button className="dash-cancel-btn" onClick={() => handleCancel(r.id)}>Annuler</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
