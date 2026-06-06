import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import WeekCalendar from '../../components/ui/WeekCalendar'

const EMPTY = {
  date:'', periode:'journee', heure_debut:'09:00', heure_fin:'17:30',
  places_max:3, type_accueil:'mixte', titre:'', description:'',
  lieu:'Biganos', tarif:'25', statut:'ouvert', actif:true
}

export default function AdminPlanning() {
  const [slots,  setSlots]  = useState([])
  const [modal,  setModal]  = useState(null)
  const [form,   setForm]   = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [view,   setView]   = useState('calendar') // calendar | list

  useEffect(() => { fetch() }, [])

  const fetch = () =>
    axios.get('/api/slots?all=true').then(r => setSlots(r.data)).catch(() => {})

  const set = k => e =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit   = s  => {
    setForm({
      ...s,
      heure_debut: s.heure_debut?.slice(0,5) || '09:00',
      heure_fin:   s.heure_fin?.slice(0,5)   || '17:30',
      tarif:       String(s.tarif || 25),
    })
    setModal({ id: s.id })
  }

  const save = async () => {
    if (!form.date) return toast.error('Date obligatoire')
    setSaving(true)
    try {
      const payload = {
        ...form,
        places_max: Math.min(Number(form.places_max), 3),
        tarif: parseFloat(form.tarif),
      }
      if (modal === 'create') await axios.post('/api/slots', payload)
      else                    await axios.put(`/api/slots/${modal.id}`, payload)
      setModal(null); fetch(); toast.success('Créneau enregistré')
    } catch(e) { toast.error(e.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const del = async id => {
    if (!window.confirm('Supprimer ce créneau ?')) return
    await axios.delete(`/api/slots/${id}`)
    fetch(); toast.success('Créneau supprimé')
  }

  const fi = (label, key, type = 'text') => (
    <div style={{ marginBottom:'.75rem' }}>
      <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--nuit)', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'.5px' }}>{label}</label>
      <input type={type} value={form[key]} onChange={set(key)}
        style={{ width:'100%', padding:'.5rem', border:'1.5px solid var(--sable-dark)', borderRadius:8, fontFamily:'inherit', fontSize:'.9rem' }}/>
    </div>
  )

  const fs = (label, key, opts) => (
    <div style={{ marginBottom:'.75rem' }}>
      <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--nuit)', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'.5px' }}>{label}</label>
      <select value={form[key]} onChange={set(key)}
        style={{ width:'100%', padding:'.5rem', border:'1.5px solid var(--sable-dark)', borderRadius:8, fontFamily:'inherit', fontSize:'.9rem' }}>
        {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>📅 Créneaux & Planning</h1>
            <p className="admin-page__subtitle">{slots.length} créneau{slots.length > 1 ? 'x' : ''} · Max 3 enfants</p>
          </div>
          <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
            {/* Toggle vue */}
            <div style={{ display:'flex', background:'#f3f4f6', borderRadius:8, padding:2 }}>
              {[['calendar','📅 Calendrier'],['list','📋 Liste']].map(([v,l]) => (
                <button key={v} onClick={() => setView(v)}
                  style={{ padding:'.35rem .85rem', borderRadius:6, border:'none', cursor:'pointer',
                    fontFamily:'inherit', fontWeight:700, fontSize:'.82rem',
                    background: view===v ? 'white' : 'transparent',
                    color: view===v ? 'var(--nuit)' : '#6b7280',
                    boxShadow: view===v ? '0 1px 3px rgba(0,0,0,.1)' : 'none' }}>
                  {l}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={openCreate}>+ Nouveau créneau</button>
          </div>
        </div>

        {/* Vue calendrier */}
        {view === 'calendar' && (
          <WeekCalendar
            slots={slots}
            onSlotClick={openEdit}
            showEmpty={true}
            mode="admin"
          />
        )}

        {/* Vue liste */}
        {view === 'list' && (
          <div className="admin-table-wrap">
            {slots.length === 0 ? (
              <div className="admin-empty">
                <div style={{ fontSize:'2rem' }}>📅</div>
                <p>Aucun créneau. Créez-en un avec le bouton ci-dessus.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Créneau</th><th>Type</th>
                    <th>Places</th><th>Tarif</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight:700, whiteSpace:'nowrap' }}>
                        {new Date(s.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}
                      </td>
                      <td>
                        <div style={{ fontWeight:700, color:'var(--nuit)', fontSize:'.9rem' }}>{s.titre || '—'}</div>
                        <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{s.heure_debut?.slice(0,5)}–{s.heure_fin?.slice(0,5)}</div>
                      </td>
                      <td style={{ fontSize:'.82rem' }}>
                        {s.type_accueil==='adapte'?'🌿 Adapté':s.type_accueil==='mixte'?'👥 Mixte':'🏠 Standard'}
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                          <div style={{ width:52, height:7, background:'#e0e0e0', borderRadius:4, overflow:'hidden' }}>
                            <div style={{ width:`${(s.places_prises/s.places_max)*100}%`, height:'100%',
                              background: s.places_prises>=s.places_max ? '#ef4444' : 'var(--sauge)', borderRadius:4 }}/>
                          </div>
                          <span style={{ fontSize:'.8rem', fontWeight:700 }}>{s.places_prises}/{s.places_max}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:700, color:'var(--sauge)' }}>{parseFloat(s.tarif).toFixed(0)}€</td>
                      <td>
                        <span style={{
                          background: {ouvert:'#e8f5e9',complet:'#fee2e2',annule:'#f3f4f6',passe:'#f9fafb'}[s.statut],
                          color: {ouvert:'#2e7d32',complet:'#991b1b',annule:'#6b7280',passe:'#9ca3af'}[s.statut],
                          padding:'3px 10px', borderRadius:50, fontSize:'.75rem', fontWeight:700
                        }}>{s.statut}</span>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:'.4rem' }}>
                          <button className="btn-icon btn-icon--edit" onClick={() => openEdit(s)}>✏️</button>
                          <button className="btn-icon btn-icon--delete" onClick={() => del(s.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Modal créer/modifier */}
        {modal && (
          <div className="admin-modal-overlay" onClick={() => !saving && setModal(null)}>
            <div className="admin-modal" style={{ maxWidth:560 }} onClick={e => e.stopPropagation()}>
              <h2>{modal === 'create' ? '➕ Nouveau créneau' : '✏️ Modifier le créneau'}</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                <div style={{ gridColumn:'1/-1' }}>{fi('Date *', 'date', 'date')}</div>
                {fs('Période', 'periode', [['matin','🌅 Matin'],['apres_midi','☀️ Après-midi'],['journee','📅 Journée']])}
                {fs('Type d\'accueil', 'type_accueil', [['standard','🏠 Garde standard'],['adapte','🌿 Adapté TSA/TDAH'],['mixte','👥 Mixte']])}
                {fi('Heure début', 'heure_debut', 'time')}
                {fi('Heure fin',   'heure_fin',   'time')}
                {fi('Places max (≤3)', 'places_max', 'number')}
                {fi('Tarif (€)',       'tarif',      'number')}
                {fs('Statut', 'statut', [['ouvert','✅ Ouvert'],['complet','🔴 Complet'],['annule','❌ Annulé']])}
              </div>
              {fi('Titre / Programme', 'titre')}
              <div style={{ marginBottom:'.75rem' }}>
                <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--nuit)', display:'block', marginBottom:4, textTransform:'uppercase' }}>Description</label>
                <textarea value={form.description} onChange={set('description')} rows={2}
                  style={{ width:'100%', padding:'.5rem', border:'1.5px solid var(--sable-dark)', borderRadius:8, fontFamily:'inherit', resize:'vertical' }}/>
              </div>
              {fi('Lieu', 'lieu')}
              <div className="admin-modal__actions">
                <button className="btn-secondary" onClick={() => setModal(null)} disabled={saving}>Annuler</button>
                <button className="btn-primary" onClick={save} disabled={saving || !form.date}>
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}