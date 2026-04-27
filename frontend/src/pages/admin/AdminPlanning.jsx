import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

const STATUT_COLORS = {
  planifiee:  { bg:'#fff7ed', text:'#c2410c',  label:'📅 Planifiée' },
  confirmee:  { bg:'#dcfce7', text:'#166534',  label:'✅ Confirmée' },
  annulee:    { bg:'#fee2e2', text:'#991b1b',   label:'❌ Annulée' },
}

const EMPTY_SEANCE = {
  date:'', titre:'', description:'', lieu:'',
  notes_animateur:'', statut:'planifiee', activity_id:'',
}

export default function AdminPlanning() {
  const [seances,    setSeances]    = useState([])
  const [activities, setActivities] = useState([])
  const [modal,      setModal]      = useState(null)  // null | 'create' | {id}
  const [form,       setForm]       = useState(EMPTY_SEANCE)
  const [saving,     setSaving]     = useState(false)
  const [filterAct,  setFilterAct]  = useState('')

  useEffect(() => {
    fetchSeances()
    axios.get('/api/activities?all=true').then(r => setActivities(r.data)).catch(() => {})
  }, [])

  const fetchSeances = () => {
    axios.get('/api/planning').then(r => setSeances(r.data)).catch(() => setSeances([]))
  }

  const openCreate = () => { setForm(EMPTY_SEANCE); setModal('create') }
  const openEdit   = (s) => {
    setForm({
      date:             s.date ? new Date(s.date).toISOString().slice(0,16) : '',
      titre:            s.titre,
      description:      s.description || '',
      lieu:             s.lieu || '',
      notes_animateur:  s.notes_animateur || '',
      statut:           s.statut,
      activity_id:      s.activity_id || '',
    })
    setModal({ id: s.id })
  }

  const handleSave = async () => {
    if (!form.date || !form.titre) return
    setSaving(true)
    try {
      const payload = { ...form, activity_id: form.activity_id ? +form.activity_id : null }
      if (modal === 'create') await axios.post('/api/planning', payload)
      else                    await axios.put(`/api/planning/${modal.id}`, payload)
      setModal(null)
      fetchSeances()
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette séance ?')) return
    await axios.delete(`/api/planning/${id}`)
    fetchSeances()
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const filtered = seances.filter(s =>
    !filterAct || String(s.activity_id) === filterAct
  )

  // Grouper par activité pour affichage
  const grouped = filtered.reduce((acc, s) => {
    const key = s.activity?.titre || 'Sans activité'
    if (!acc[key]) acc[key] = { activity: s.activity, seances: [] }
    acc[key].seances.push(s)
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>📅 Planning des séances</h1>
            <p className="admin-page__subtitle">{seances.length} séance{seances.length > 1 ? 's' : ''} programmée{seances.length > 1 ? 's' : ''}</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>+ Nouvelle séance</button>
        </div>

        {/* Filtre par activité */}
        <div style={{ marginBottom:'1.5rem' }}>
          <select value={filterAct} onChange={e => setFilterAct(e.target.value)}
            style={{ padding:'0.5rem 1rem', borderRadius:8, border:'1.5px solid #d4e4d4', fontSize:'0.88rem', fontFamily:'inherit' }}>
            <option value="">Toutes les activités</option>
            {activities.map(a => <option key={a.id} value={String(a.id)}>{a.titre}</option>)}
          </select>
        </div>

        {/* Séances groupées par activité */}
        {Object.keys(grouped).length === 0 ? (
          <div className="admin-empty">
            <div style={{ fontSize:'2rem' }}>📅</div>
            <h3>Aucune séance planifiée</h3>
            <p>Créez des séances pour construire votre planning.</p>
            <button className="btn-primary" onClick={openCreate}>+ Créer une séance</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
            {Object.entries(grouped).map(([actTitre, { seances: ss }]) => (
              <div key={actTitre} style={{ background:'var(--blanc)', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
                <div style={{ padding:'1rem 1.5rem', background:'var(--bleu-nuit)', color:'var(--blanc)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'1rem', margin:0 }}>{actTitre}</h3>
                  <span style={{ opacity:0.7, fontSize:'0.82rem' }}>{ss.length} séance{ss.length > 1 ? 's' : ''}</span>
                </div>
                <table className="admin-table" style={{ margin:0 }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Titre / Programme</th>
                      <th>Lieu</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ss.map(s => {
                      const st = STATUT_COLORS[s.statut] || STATUT_COLORS.planifiee
                      return (
                        <tr key={s.id}>
                          <td style={{ whiteSpace:'nowrap', fontWeight:700 }}>
                            {new Date(s.date).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })}
                            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:400 }}>
                              {new Date(s.date).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight:600, color:'var(--bleu-nuit)' }}>{s.titre}</div>
                            {s.description && <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{s.description.slice(0,80)}{s.description.length > 80 ? '…' : ''}</div>}
                          </td>
                          <td style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>{s.lieu || '—'}</td>
                          <td>
                            <span style={{ background:st.bg, color:st.text, padding:'3px 10px', borderRadius:50, fontSize:'0.75rem', fontWeight:700, whiteSpace:'nowrap' }}>
                              {st.label}
                            </span>
                          </td>
                          <td>
                            <div style={{ display:'flex', gap:'0.4rem' }}>
                              <button className="btn-icon btn-icon--edit" onClick={() => openEdit(s)} title="Modifier">✏️</button>
                              <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(s.id)} title="Supprimer">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Modal créer/modifier */}
        {modal && (
          <div className="admin-modal-overlay" onClick={() => !saving && setModal(null)}>
            <div className="admin-modal" style={{ maxWidth:560 }} onClick={e => e.stopPropagation()}>
              <h2>{modal === 'create' ? '➕ Nouvelle séance' : '✏️ Modifier la séance'}</h2>

              <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>Date & heure *</label>
                    <input type="datetime-local" value={form.date} onChange={set('date')}
                      style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', boxSizing:'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>Activité</label>
                    <select value={form.activity_id} onChange={set('activity_id')}
                      style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', boxSizing:'border-box' }}>
                      <option value="">— Aucune —</option>
                      {activities.map(a => <option key={a.id} value={a.id}>{a.titre}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>Titre / Programme *</label>
                  <input value={form.titre} onChange={set('titre')} placeholder="Ex: Jeux en forêt — orientation"
                    style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', boxSizing:'border-box' }} />
                </div>

                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>Description</label>
                  <textarea value={form.description} onChange={set('description')} rows={2}
                    placeholder="Détails de la séance, matériel à apporter..."
                    style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', resize:'vertical', boxSizing:'border-box' }} />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>Lieu</label>
                    <input value={form.lieu} onChange={set('lieu')} placeholder="Ex: Forêt de Vongy"
                      style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', boxSizing:'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>Statut</label>
                    <select value={form.statut} onChange={set('statut')}
                      style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', boxSizing:'border-box' }}>
                      <option value="planifiee">📅 Planifiée</option>
                      <option value="confirmee">✅ Confirmée</option>
                      <option value="annulee">❌ Annulée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--bleu-nuit)', display:'block', marginBottom:4 }}>
                    Notes animateur <span style={{ fontWeight:400, color:'var(--text-muted)' }}>(non visible par les parents)</span>
                  </label>
                  <textarea value={form.notes_animateur} onChange={set('notes_animateur')} rows={2}
                    placeholder="Notes privées..."
                    style={{ width:'100%', padding:'0.5rem', border:'1.5px solid #d4e4d4', borderRadius:8, fontFamily:'inherit', resize:'vertical', boxSizing:'border-box' }} />
                </div>
              </div>

              <div className="admin-modal__actions">
                <button className="btn-secondary" onClick={() => setModal(null)} disabled={saving}>Annuler</button>
                <button className="btn-primary" onClick={handleSave} disabled={saving || !form.date || !form.titre}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
