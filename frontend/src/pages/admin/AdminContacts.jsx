import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter,   setFilter]   = useState('tous')
  const [slotModal, setSlotModal] = useState(null) // { date, heure_debut, heure_fin, contact }

  useEffect(() => { fetch() }, [])

  const fetch = () =>
    axios.get('/api/contact')
      .then(r => setContacts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))

  const marquerTraite = async (id) => {
    await axios.patch(`/api/contact/${id}`, { traite: true })
    setContacts(c => c.map(x => x.id === id ? { ...x, traite: true } : x))
    if (selected?.id === id) setSelected(s => ({ ...s, traite: true }))
    toast.success('Marqué comme traité')
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    await axios.delete(`/api/contact/${id}`)
    setContacts(c => c.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success('Supprimé')
  }

  // Convertir "mercredi 10 juin" → date ISO
  const convertDate = (label) => {
    const MOIS = { janvier:1,février:2,mars:3,avril:4,mai:5,juin:6,
                   juillet:7,août:8,septembre:9,octobre:10,novembre:11,décembre:12 }
    const m = label.match(/(\d+)\s+(\w+)/)
    if (!m) return ''
    const day = m[1].padStart(2,'0')
    const mon = String(MOIS[m[2].toLowerCase()]||1).padStart(2,'0')
    const year = new Date().getFullYear()
    return `${year}-${mon}-${day}`
  }

  // Détecter demandes multi-dates
  const isMulti  = c => c.message?.includes('DEMANDE DE RÉSERVATION GROUPÉE')
  const getDates = c => {
    const m = c.message?.match(/Dates demandées \((\d+)\) :\n([\s\S]*?)\n\nMessage/)
    if (!m) return []
    return m[2].split('\n').filter(Boolean)
  }
  const getEnfant  = c => c.message?.match(/Enfant : (.+)/)?.[1] || c.enfant_prenom || '—'
  const getService = c => c.message?.match(/Service : (.+)/)?.[1] || c.service || '—'
  const getHoraire = c => c.message?.match(/Horaires : (.+)/)?.[1] || '—'
  const getMessage = c => c.message?.match(/Message : ([\s\S]*?)$/)?.[1]?.trim() || ''

  const filtered = contacts.filter(c => {
    if (filter === 'non_traites') return !c.traite
    if (filter === 'multi')       return isMulti(c)
    if (filter === 'traites')     return c.traite
    return true
  })

  const nonTraites = contacts.filter(c => !c.traite).length
  const multis     = contacts.filter(c => isMulti(c)).length

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>📩 Demandes de contact</h1>
            <p className="admin-page__subtitle">
              {nonTraites} non traité{nonTraites > 1 ? 's' : ''} · {multis} demande{multis > 1 ? 's' : ''} multi-dates
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ display:'flex', gap:'.6rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[
            { v:'tous',         l:'Toutes',               n: contacts.length },
            { v:'non_traites',  l:'⏳ Non traitées',      n: nonTraites },
            { v:'multi',        l:'📅 Demandes de dates', n: multis },
            { v:'traites',      l:'✅ Traitées',           n: contacts.length - nonTraites },
          ].map(({ v, l, n }) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`cal-filter-btn ${filter === v ? 'active' : ''}`}>
              {l} ({n})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div style={{ fontSize:'2rem' }}>📭</div>
            <p>Aucune demande</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'1.5rem', alignItems:'start' }}>

            {/* Liste */}
            <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
              {filtered.map(c => (
                <div key={c.id} onClick={() => setSelected(c)}
                  style={{
                    padding:'1rem 1.25rem',
                    background: selected?.id === c.id ? 'var(--sable-light)' : 'white',
                    borderRadius:'var(--radius-lg)',
                    border: `2px solid ${selected?.id === c.id ? 'var(--sauge)' : '#eef2ee'}`,
                    cursor:'pointer', transition:'all .18s',
                    opacity: c.traite ? .6 : 1,
                  }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.25rem' }}>
                    <span style={{ fontWeight:700, color:'var(--nuit)', fontSize:'.9rem' }}>
                      {isMulti(c) ? '📅 ' : ''}{c.prenom} {c.nom || ''}
                    </span>
                    <span style={{ fontSize:'.7rem', color:'var(--text-muted)', whiteSpace:'nowrap', marginLeft:'.5rem' }}>
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                    </span>
                  </div>
                  <div style={{ fontSize:'.78rem', color:'var(--text-muted)' }}>{c.email}</div>
                  <div style={{ display:'flex', gap:'.4rem', marginTop:'.35rem', flexWrap:'wrap' }}>
                    {isMulti(c) && (
                      <span style={{ background:'#e0f2fe', color:'#0369a1', fontSize:'.7rem', fontWeight:700, padding:'2px 7px', borderRadius:50 }}>
                        📅 {getDates(c).length} dates
                      </span>
                    )}
                    {c.service && (
                      <span style={{ background:'#f0fdf4', color:'#15803d', fontSize:'.7rem', fontWeight:700, padding:'2px 7px', borderRadius:50 }}>
                        {c.service}
                      </span>
                    )}
                    {c.traite && (
                      <span style={{ background:'#f3f4f6', color:'#6b7280', fontSize:'.7rem', fontWeight:700, padding:'2px 7px', borderRadius:50 }}>
                        ✅ Traité
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Détail */}
            {selected ? (
              <div style={{ background:'white', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                <div style={{ background:'var(--nuit)', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <h3 style={{ fontFamily:"'Baloo 2',cursive", color:'white', fontSize:'1.1rem', margin:0 }}>
                      {isMulti(selected) ? '📅 Demande de dates — ' : ''}{selected.prenom} {selected.nom || ''}
                    </h3>
                    <span style={{ fontSize:'.78rem', color:'rgba(210,225,255,.7)' }}>
                      {new Date(selected.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  {selected.traite && (
                    <span style={{ background:'rgba(255,255,255,.15)', color:'white', fontSize:'.78rem', fontWeight:700, padding:'3px 10px', borderRadius:50 }}>✅ Traité</span>
                  )}
                </div>

                <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>

                  {/* Infos contact */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                    <div>
                      <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'.25rem' }}>Contact</div>
                      <div style={{ fontSize:'.9rem', color:'var(--nuit)', fontWeight:600 }}>{selected.prenom} {selected.nom || ''}</div>
                      <a href={`mailto:${selected.email}`} style={{ fontSize:'.85rem', color:'var(--sauge)', textDecoration:'none' }}>{selected.email}</a>
                      {selected.telephone && <div style={{ fontSize:'.82rem', color:'var(--text-muted)', marginTop:2 }}>📞 {selected.telephone}</div>}
                    </div>
                    {(selected.enfant_prenom || getEnfant(selected) !== '—') && (
                      <div>
                        <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'.25rem' }}>Enfant</div>
                        <div style={{ fontSize:'.9rem', color:'var(--nuit)' }}>{isMulti(selected) ? getEnfant(selected) : selected.enfant_prenom}</div>
                        {(selected.enfant_age || isMulti(selected)) && (
                          <div style={{ fontSize:'.82rem', color:'var(--text-muted)' }}>
                            {isMulti(selected) ? getService(selected) : selected.enfant_age ? `${selected.enfant_age} ans` : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Demande multi-dates */}
                  {isMulti(selected) && getDates(selected).length > 0 && (
                    <div style={{ background:'#f0f9ff', borderRadius:12, padding:'1rem 1.25rem', border:'1px solid #bae6fd' }}>
                      <div style={{ fontWeight:700, color:'#0369a1', fontSize:'.88rem', marginBottom:'.75rem' }}>
                        📅 {getDates(selected).length} dates demandées · {getHoraire(selected)}
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
                        {getDates(selected).map((d, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                            <span style={{ background:'#0369a1', color:'white', fontSize:'.78rem', fontWeight:700, padding:'3px 10px', borderRadius:50 }}>
                              {d}
                            </span>
                            <button onClick={() => setSlotModal({
                              date: convertDate(d),
                              heure_debut: getHoraire(selected).split('→')[0]?.trim() || '09:00',
                              heure_fin:   getHoraire(selected).split('→')[1]?.trim() || '17:00',
                              enfant:      getEnfant(selected),
                              service:     getService(selected),
                              contact:     selected,
                            })} style={{ background:'#e0f2fe', color:'#0369a1', border:'none', borderRadius:6,
                              padding:'2px 8px', cursor:'pointer', fontSize:'.72rem', fontWeight:700, fontFamily:'inherit', whiteSpace:'nowrap' }}>
                              + Créer créneau
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {(isMulti(selected) ? getMessage(selected) : selected.message) && (
                    <div>
                      <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'.5rem' }}>Message</div>
                      <div style={{ background:'var(--sable-light)', borderRadius:10, padding:'1rem', fontSize:'.88rem', color:'var(--text-dark)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>
                        {isMulti(selected) ? getMessage(selected) : selected.message}
                      </div>
                    </div>
                  )}

                  {/* Besoins spécifiques */}
                  {selected.besoins_specifiques && (
                    <div style={{ background:'#e0f2fe', borderRadius:8, padding:'.75rem 1rem', fontSize:'.85rem', color:'#0369a1', fontWeight:600 }}>
                      🌿 Enfant avec besoins spécifiques (TSA/TDAH)
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display:'flex', gap:'.75rem', paddingTop:'.5rem', borderTop:'1px solid var(--sable-light)', flexWrap:'wrap' }}>
                    <a href={`mailto:${selected.email}`} className="btn-primary" style={{ textDecoration:'none', fontSize:'.88rem' }}>
                      ✉️ Répondre par email
                    </a>
                    {!selected.traite && (
                      <button className="btn-secondary" onClick={() => marquerTraite(selected.id)} style={{ fontSize:'.88rem' }}>
                        ✅ Marquer traité
                      </button>
                    )}
                    <button onClick={() => supprimer(selected.id)}
                      style={{ background:'#fee2e2', color:'#991b1b', border:'none', borderRadius:8, padding:'.5rem 1rem', fontWeight:700, fontSize:'.85rem', cursor:'pointer', fontFamily:'inherit' }}>
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'4rem', background:'white', borderRadius:'var(--radius-xl)', color:'var(--text-muted)' }}>
                ← Sélectionnez une demande
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal création créneau depuis demande */}
      {slotModal && (
        <SlotCreateModal
          prefill={slotModal}
          onClose={() => setSlotModal(null)}
          onCreated={(slot) => {
            setSlotModal(null)
            toast.success(`Créneau créé pour le ${slot.date} ✅`)
          }}
        />
      )}
    </AdminLayout>
  )
}

function SlotCreateModal({ prefill, onClose, onCreated }) {
  const TYPE = { garde:'standard', repit:'adapte', 'répit tsa/tdah':'adapte', evenement:'evenement', animation:'evenement' }
  const [form, setForm] = useState({
    date:         prefill.date || '',
    heure_debut:  prefill.heure_debut || '09:00',
    heure_fin:    prefill.heure_fin   || '17:00',
    type_accueil: TYPE[prefill.service?.toLowerCase()] || 'standard',
    titre:        prefill.enfant ? `Séance ${prefill.enfant}` : '',
    places_max:   1,
    tarif:        '',
    statut:       'ouvert',
    periode:      'journee',
    lieu:         'Biganos',
    description:  '',
  })
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    if (!form.date) return toast.error('Date obligatoire')
    if (!form.tarif) return toast.error('Tarif obligatoire')
    setSaving(true)
    try {
      const { data } = await axios.post('/api/slots', { ...form, places_max: +form.places_max, tarif: parseFloat(form.tarif) })
      onCreated(data)
    } catch(e) { toast.error(e.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const fi = (label, key, type='text') => (
    <div style={{ marginBottom:'.65rem' }}>
      <label style={{ fontSize:'.75rem', fontWeight:700, color:'var(--nuit)', display:'block', marginBottom:3, textTransform:'uppercase' }}>{label}</label>
      <input type={type} value={form[key]} onChange={set(key)}
        style={{ width:'100%', padding:'.5rem', border:'1.5px solid var(--sable-dark)', borderRadius:8, fontFamily:'inherit', fontSize:'.9rem' }}/>
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={onClose}>
      <div style={{ background:'white', borderRadius:'var(--radius-xl)', width:'100%', maxWidth:480, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ background:'var(--nuit)', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", color:'white', fontSize:'1.1rem', margin:0 }}>
            📅 Créer le créneau
          </h3>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.15)', border:'none', color:'white', width:30, height:30, borderRadius:'50%', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' }}>✕</button>
        </div>
        <div style={{ padding:'1.5rem' }}>
          <div style={{ background:'#e0f2fe', borderRadius:8, padding:'.75rem 1rem', marginBottom:'1rem', fontSize:'.82rem', color:'#0369a1' }}>
            📋 Pour : <strong>{prefill.enfant}</strong> · {prefill.service}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
            <div style={{ gridColumn:'1/-1' }}>{fi('Date *', 'date', 'date')}</div>
            {fi('Heure début', 'heure_debut', 'time')}
            {fi('Heure fin',   'heure_fin',   'time')}
            {fi('Tarif (€) *', 'tarif', 'number')}
            <div>
              <label style={{ fontSize:'.75rem', fontWeight:700, color:'var(--nuit)', display:'block', marginBottom:3, textTransform:'uppercase' }}>Type</label>
              <select value={form.type_accueil} onChange={set('type_accueil')}
                style={{ width:'100%', padding:'.5rem', border:'1.5px solid var(--sable-dark)', borderRadius:8, fontFamily:'inherit' }}>
                <option value="standard">🏠 Garde standard</option>
                <option value="adapte">🌿 Adapté TSA/TDAH</option>
                <option value="evenement">🎉 Événement</option>
              </select>
            </div>
          </div>
          {fi('Titre', 'titre')}
          <div style={{ display:'flex', gap:'.75rem', marginTop:'.5rem' }}>
            <button onClick={onClose} className="btn-secondary" style={{ flex:1 }}>Annuler</button>
            <button onClick={save} className="btn-primary" disabled={saving || !form.date || !form.tarif} style={{ flex:1, justifyContent:'center' }}>
              {saving ? 'Création…' : '✅ Créer le créneau'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
