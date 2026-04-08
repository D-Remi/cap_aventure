import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import DocumentsTab from '../components/ui/DocumentUploader'
import PointsTab from '../components/ui/PointsTab'
import DatePickerModal from '../components/ui/DatePickerModal'
import MessagingTab from '../components/ui/MessagingTab'
import { exportPlanningPDF } from '../services/planningExport'
import '../components/ui/DocumentUploader.css'
import '../components/ui/ImageUploader.css'
import '../components/ui/PointsTab.css'
import '../components/ui/DatePickerModal.css'
import '../components/ui/MessagingTab.css'
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
          <button className={tab === 'messages'    ? 'active' : ''} onClick={() => setTab('messages')}>💬 Messages</button>
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
        {tab === 'bookings'   && <Bookings registrations={registrations} refresh={fetchAll} user={user} />}
        {tab === 'points'     && <PointsTab children={children} />}
        {tab === 'messages'   && <MessagingTab />}
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
  const [showForm, setShowForm]   = useState(false)
  const [editChild, setEditChild] = useState(null)
  const [form, setForm] = useState({
    prenom: '', nom: '', date_naissance: '',
    infos_medicales: '', allergie: '',
    medecin_nom: '', medecin_telephone: '',
    contact_urgence_nom: '', contact_urgence_telephone: '', contact_urgence_lien: '',
    niveau_natation: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const openAdd = () => {
    setEditChild(null)
    setForm({ prenom:'', nom:'', date_naissance:'', infos_medicales:'', allergie:'',
              medecin_nom:'', medecin_telephone:'', contact_urgence_nom:'', contact_urgence_telephone:'', contact_urgence_lien:'', niveau_natation:'' })
    setShowForm(true)
  }

  const openEdit = (child) => {
    setEditChild(child)
    setForm({
      prenom: child.prenom || '', nom: child.nom || '',
      date_naissance: child.date_naissance || '',
      infos_medicales: child.infos_medicales || '', allergie: child.allergie || '',
      medecin_nom: child.medecin_nom || '', medecin_telephone: child.medecin_telephone || '',
      contact_urgence_nom: child.contact_urgence_nom || '',
      contact_urgence_telephone: child.contact_urgence_telephone || '',
      contact_urgence_lien: child.contact_urgence_lien || '',
      niveau_natation: child.niveau_natation || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      if (editChild) {
        await axios.put(`/api/children/${editChild.id}`, form)
      } else {
        await axios.post('/api/children', form)
      }
      await refresh()
      setShowForm(false); setEditChild(null)
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
        <button className="btn-primary" onClick={showForm ? () => setShowForm(false) : openAdd}>
          {showForm ? '✕ Annuler' : '+ Ajouter'}
        </button>
      </div>

      {showForm && (
        <form className="dash-form-card" onSubmit={handleSubmit}>
          <h3>{editChild ? `✏️ Modifier ${editChild.prenom}` : '👧 Nouveau profil enfant'}</h3>

          <div style={{ fontWeight:700, fontSize:'0.78rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.5rem' }}>Identité</div>
          <div className="form-row">
            <div className="form-group"><label>Prénom *</label><input value={form.prenom} onChange={set('prenom')} required /></div>
            <div className="form-group"><label>Nom *</label><input value={form.nom} onChange={set('nom')} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Date de naissance *</label><input type="date" value={form.date_naissance} onChange={set('date_naissance')} required /></div>
            <div className="form-group">
              <label>Niveau natation</label>
              <select value={form.niveau_natation} onChange={set('niveau_natation')}>
                <option value="">-- Choisir --</option>
                <option value="non_nageur">🚫 Non nageur</option>
                <option value="nageur">🏊 Nageur</option>
                <option value="bon_nageur">🏅 Bon nageur</option>
              </select>
            </div>
          </div>

          <div style={{ fontWeight:700, fontSize:'0.78rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', margin:'1rem 0 0.5rem' }}>Santé</div>
          <div className="form-group"><label>Infos médicales (traitement, handicap...)</label><textarea value={form.infos_medicales} onChange={set('infos_medicales')} placeholder="Aucune" rows={2} /></div>
          <div className="form-group"><label>Allergie alimentaire</label><input value={form.allergie} onChange={set('allergie')} placeholder="Ex: arachides, lactose..." /></div>
          <div className="form-row">
            <div className="form-group"><label>Médecin traitant</label><input value={form.medecin_nom} onChange={set('medecin_nom')} placeholder="Dr Dupont" /></div>
            <div className="form-group"><label>Tél. médecin</label><input type="tel" value={form.medecin_telephone} onChange={set('medecin_telephone')} placeholder="04 50 XX XX XX" /></div>
          </div>

          <div style={{ fontWeight:700, fontSize:'0.78rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', margin:'1rem 0 0.5rem' }}>Contact d'urgence</div>
          <div className="form-row">
            <div className="form-group"><label>Nom</label><input value={form.contact_urgence_nom} onChange={set('contact_urgence_nom')} placeholder="Marie Dupont" /></div>
            <div className="form-group"><label>Lien</label><input value={form.contact_urgence_lien} onChange={set('contact_urgence_lien')} placeholder="Mère, père, grand-mère..." /></div>
          </div>
          <div className="form-group"><label>Téléphone d'urgence</label><input type="tel" value={form.contact_urgence_telephone} onChange={set('contact_urgence_telephone')} placeholder="06 XX XX XX XX" /></div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : editChild ? 'Mettre à jour' : 'Enregistrer'}
          </button>
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
              <span>{child.date_naissance ? new Date(child.date_naissance).toLocaleDateString('fr-FR') : '—'}</span>
              {child.allergie && <p style={{ color:'#dc2626', fontSize:'0.78rem', fontWeight:600 }}>⚠️ {child.allergie}</p>}
              {child.infos_medicales && <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{child.infos_medicales}</p>}
              {child.contact_urgence_nom && (
                <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
                  🆘 {child.contact_urgence_nom} ({child.contact_urgence_lien}) — {child.contact_urgence_telephone}
                </p>
              )}
            </div>
            <div style={{ display:'flex', gap:'0.4rem', flexDirection:'column' }}>
              <button className="btn-icon btn-icon--edit" onClick={() => openEdit(child)} title="Modifier">✏️</button>
              <button className="dash-child-card__delete" onClick={() => handleDelete(child.id)}>🗑</button>
            </div>
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
function Bookings({ registrations, refresh, user }) {
  const [pickerReg, setPickerReg]       = useState(null)   // inscription dont on choisit les dates
  const [regDates, setRegDates]         = useState({})     // { regId: [dates] }
  const [loadingDates, setLoadingDates] = useState(true)

  useEffect(() => {
    // Charger les dates déjà choisies pour toutes les inscriptions multi-dates
    const multiRegs = registrations.filter(r =>
      r.activity?.schedule_type === 'multi_dates' || r.activity?.schedule_type === 'recurrente'
    )
    if (multiRegs.length === 0) { setLoadingDates(false); return }

    Promise.all(
      multiRegs.map(r =>
        axios.get(`/api/registration-dates/${r.id}`)
          .then(res => ({ id: r.id, dates: res.data }))
          .catch(() => ({ id: r.id, dates: [] }))
      )
    ).then(results => {
      const map = {}
      results.forEach(({ id, dates }) => { map[id] = dates })
      setRegDates(map)
    }).finally(() => setLoadingDates(false))
  }, [registrations])

  const handleCancel = async (id) => {
    if (!window.confirm('Annuler cette inscription ?')) return
    await axios.delete(`/api/registrations/${id}`)
    refresh()
  }

  const statusLabel = { pending:'⏳ En attente', confirmed:'✅ Confirmée', cancelled:'❌ Annulée' }
  const statusClass = { pending:'pending', confirmed:'confirmed', cancelled:'cancelled' }

  const SUB_LABELS = {
    essai:'Journée d\'essai', seance:'À la séance',
    mensuel:'Mensuel', trimestriel:'Trimestriel',
    semestriel:'Semestriel', annuel:'Annuel',
  }

  const needsDates = (r) =>
    (r.activity?.schedule_type === 'multi_dates' || r.activity?.schedule_type === 'recurrente') &&
    r.status !== 'cancelled'

  const hasDates = (r) => regDates[r.id]?.length > 0

  return (
    <div className="dash-section">
      <div className="dash-section__header">
        <div>
          <h1>Mes inscriptions</h1>
          <p className="dash-section__sub">Suivez les réservations de vos enfants</p>
        </div>
        {registrations.length > 0 && (
          <button className="btn-secondary" onClick={async () => {
            // Charger les dates pour toutes les inscriptions
            const withDates = await Promise.all(
              registrations.map(async r => {
                try {
                  const { data: dates } = await axios.get(`/api/registration-dates/${r.id}`)
                  return { registration: r, dates }
                } catch { return { registration: r, dates: [] } }
              })
            )
            exportPlanningPDF(withDates, `${user?.prenom} ${user?.nom}`)
          }}>
            📄 Exporter mon planning
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <div className="dash-empty">Aucune inscription pour le moment.</div>
      ) : (
        <div className="dash-bookings-list">
          {registrations.map(r => (
            <div key={r.id} className={`dash-booking-card ${needsDates(r) && !hasDates(r) ? 'dash-booking-card--needs-dates' : ''}`}>
              <div className="dash-booking-card__info">
                <strong>{r.activity?.titre}</strong>
                <span>👤 {r.child?.prenom} {r.child?.nom}</span>

                {/* Affichage date selon le type */}
                {r.activity?.schedule_type === 'ponctuelle' && r.activity?.date && (
                  <span>📅 {new Date(r.activity.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</span>
                )}
                {needsDates(r) && (
                  <span>
                    🗓️ {SUB_LABELS[r.subscription_type] || 'Formule'} ·{' '}
                    {hasDates(r)
                      ? <strong style={{ color:'var(--vert-foret)' }}>{regDates[r.id].length} date{regDates[r.id].length > 1 ? 's' : ''} choisie{regDates[r.id].length > 1 ? 's' : ''}</strong>
                      : <strong style={{ color:'#f59e0b' }}>⚠️ Dates à choisir</strong>
                    }
                  </span>
                )}
                <span>💶 {r.activity?.prix}€</span>
              </div>

              <div className="dash-booking-card__right">
                <span className={`dash-status dash-status--${statusClass[r.status]}`}>
                  {statusLabel[r.status]}
                </span>

                {/* Bouton choisir / modifier les dates */}
                {needsDates(r) && (
                  <button
                    className={`dash-dates-btn ${!hasDates(r) ? 'dash-dates-btn--urgent' : ''}`}
                    onClick={() => setPickerReg(r)}
                  >
                    {hasDates(r) ? '✏️ Modifier les dates' : '📅 Choisir mes dates'}
                  </button>
                )}

                {/* Mini-aperçu des dates */}
                {hasDates(r) && (
                  <div className="dash-booking-dates-preview">
                    {regDates[r.id].slice(0, 3).map(d => (
                      <span key={d.id}>
                        {new Date(d.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                      </span>
                    ))}
                    {regDates[r.id].length > 3 && <span>+{regDates[r.id].length - 3}</span>}
                  </div>
                )}

                {r.status !== 'cancelled' && (
                  <button className="dash-cancel-btn" onClick={() => handleCancel(r.id)}>Annuler</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale sélection de dates */}
      {pickerReg && (
        <DatePickerModal
          registration={pickerReg}
          onClose={() => setPickerReg(null)}
          onSaved={() => {
            // Recharger les dates de cette inscription
            axios.get(`/api/registration-dates/${pickerReg.id}`)
              .then(r => setRegDates(prev => ({ ...prev, [pickerReg.id]: r.data })))
              .catch(() => {})
          }}
        />
      )}
    </div>
  )
}
