import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import { exportRegistrationsPDF } from '../../services/pdfExport'
import ActivityForm from '../../components/ui/ActivityForm'
import '../../components/ui/ActivityForm.css'
import '../../components/ui/ImageUploader.css'

const SCHEDULE_LABELS = {
  ponctuelle:  '📅 Ponctuelle',
  multi_dates: '📆 Multi-dates',
  recurrente:  '🔄 Récurrente',
  saisonniere: '🌨️ Saisonnière',
}
const PAYMENT_ICONS = { especes:'💵', virement:'🏦', cesu:'🎫' }

// Formate la date / planning pour affichage
function formatSchedule(a) {
  if (a.schedule_type === 'ponctuelle' && a.date) {
    return new Date(a.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })
  }
  if (a.schedule_type === 'multi_dates' && a.dates?.length) {
    return `${a.dates.length} date${a.dates.length>1?'s':''}`
  }
  if (a.schedule_type === 'recurrente' || a.schedule_type === 'saisonniere') {
    return a.periode_label || `${a.recurrence_days?.join(', ')} · ${a.date_debut} → ${a.date_fin}`
  }
  return '—'
}

export default function AdminActivities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)   // null | 'create' | { type:'edit', id }
  const [editInitial, setEditInitial] = useState({})
  const [saving, setSaving]         = useState(false)
  const [search, setSearch]         = useState('')
  const [viewRegs, setViewRegs]     = useState(null)

  useEffect(() => { fetchActivities() }, [])

  const fetchActivities = async () => {
    try {
      const { data } = await axios.get('/api/activities?all=true')
      setActivities(data)
    } finally { setLoading(false) }
  }

  const openCreate = () => { setEditInitial({}); setModal('create') }
  const openEdit   = (a) => {
    setEditInitial({
      titre: a.titre, description: a.description, type: a.type,
      schedule_type: a.schedule_type || 'ponctuelle',
      date: a.date ? new Date(a.date).toISOString().slice(0,16) : '',
      dates: a.dates || [],
      recurrence_days: a.recurrence_days || [],
      recurrence_time: a.recurrence_time || '14:00',
      date_debut: a.date_debut || '', date_fin: a.date_fin || '',
      periode_label: a.periode_label || '',
      prix: a.prix, prix_seance: a.prix_seance || '',
      places_max: a.places_max,
      payment_methods: a.payment_methods || ['especes'],
      virement_info: a.virement_info || '', cesu_info: a.cesu_info || '',
      lieu: a.lieu || '', age_min: a.age_min || '', age_max: a.age_max || '',
      image_url: a.image_url || '', actif: a.actif,
    })
    setModal({ type:'edit', id: a.id })
  }

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (modal === 'create') await axios.post('/api/activities', form)
      else                    await axios.put(`/api/activities/${modal.id}`, form)
      setModal(null)
      fetchActivities()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette activité ?')) return
    await axios.delete(`/api/activities/${id}`)
    fetchActivities()
  }

  const filtered = activities.filter(a =>
    a.titre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Activités</h1>
            <p>Créez et gérez les sorties CapAventure</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>+ Nouvelle activité</button>
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-wrap__header">
            <h2>{filtered.length} activité{filtered.length > 1 ? 's' : ''}</h2>
            <input className="admin-search" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="admin-loading">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <span>🎿</span>
              <button onClick={openCreate} style={{ color:'var(--vert-clair)', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
                Créer la première activité →
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Planning</th>
                  <th>Prix</th>
                  <th>Places</th>
                  <th>Inscrits</th>
                  <th>Paiement</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.titre}</strong>
                      {a.lieu && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>📍 {a.lieu}</div>}
                    </td>
                    <td style={{ textTransform:'capitalize' }}>{a.type}</td>
                    <td>
                      <div style={{ fontSize:'0.78rem' }}>
                        <span className="badge badge--actif" style={{ fontSize:'0.68rem', marginBottom:'2px', display:'inline-block' }}>
                          {SCHEDULE_LABELS[a.schedule_type] || '📅'}
                        </span>
                        <div style={{ color:'var(--text-muted)', marginTop:'2px' }}>{formatSchedule(a)}</div>
                      </div>
                    </td>
                    <td>
                      <div>{parseFloat(a.prix).toFixed(2)}€</div>
                      {a.prix_seance && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{parseFloat(a.prix_seance).toFixed(2)}€/séance</div>}
                    </td>
                    <td>{a.places_max}</td>
                    <td>
                      <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--vert-clair)', fontWeight:700, fontSize:'0.85rem' }} onClick={() => setViewRegs(a)}>
                        {a.places_max - (a.places_restantes ?? a.places_max)} / {a.places_max}
                      </button>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:'3px' }}>
                        {(a.payment_methods || ['especes']).map(m => (
                          <span key={m} title={m} style={{ fontSize:'1rem' }}>{PAYMENT_ICONS[m] || '?'}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge--${a.actif ? 'actif' : 'inactif'}`}>
                        {a.actif ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="btn-icon btn-icon--edit" onClick={() => openEdit(a)} title="Modifier">✏️</button>
                        <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(a.id)} title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={() => !saving && setModal(null)}>
          <div className="admin-modal" style={{ maxWidth:640 }} onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? '➕ Nouvelle activité' : '✏️ Modifier l\'activité'}</h2>
            <ActivityForm
              initial={editInitial}
              onSave={handleSave}
              onCancel={() => setModal(null)}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* Inscrits modal */}
      {viewRegs && <RegisteredModal activity={viewRegs} onClose={() => { setViewRegs(null); fetchActivities() }} />}
    </AdminLayout>
  )
}

/* ── Inscrits par activité ── */
function RegisteredModal({ activity, onClose }) {
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/registrations/activity/${activity.id}`)
      .then(r => setRegs(r.data))
      .finally(() => setLoading(false))
  }, [activity.id])

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/registrations/${id}/status`, { status })
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const STATUS = ['pending','confirmed','cancelled']
  const STATUS_LABEL = { pending:'En attente', confirmed:'Confirmée', cancelled:'Annulée' }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth:640 }} onClick={e => e.stopPropagation()}>
        <h2>📋 Inscrits — {activity.titre}</h2>
        <p style={{ color:'var(--text-muted)', fontSize:'0.88rem', marginBottom:'1.25rem' }}>
          {formatSchedule(activity)} · {activity.places_max} places max
        </p>
        {loading ? <div className="admin-loading">Chargement...</div> :
          regs.length === 0 ? <div className="admin-empty"><span>📋</span>Aucun inscrit</div> : (
          <table className="admin-table">
            <thead><tr><th>Enfant</th><th>Parent</th><th>Inscrit le</th><th>Statut</th></tr></thead>
            <tbody>
              {regs.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.child?.prenom} {r.child?.nom}</strong></td>
                  <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{r.child?.user?.prenom} {r.child?.user?.nom}</td>
                  <td style={{ fontSize:'0.82rem' }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                      style={{ border:'1.5px solid #dde8e1', borderRadius:8, padding:'0.3rem 0.6rem', fontSize:'0.82rem', fontFamily:'inherit', cursor:'pointer' }}>
                      {STATUS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop:'1.5rem', display:'flex', gap:'0.75rem' }}>
          <button className="btn-primary" onClick={() => exportRegistrationsPDF(activity, regs)}>📄 PDF</button>
          <button className="btn-secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}
