import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

const TYPES = {
  repit:          { label: 'Relais',          color: '#0e6b6b', bg: '#e6f2f2' },
  accompagnement: { label: 'Accompagnement',  color: '#136f5b', bg: '#e7f2ee' },
  guidance:       { label: 'Guidance parent', color: '#5b4b8a', bg: '#eeeaf5' },
}
const STATUTS = {
  planifiee: { label: 'Planifiée', color: '#92660e', bg: '#fff8e1' },
  realisee:  { label: 'Réalisée',  color: '#15803d', bg: '#f0fdf4' },
  annulee:   { label: 'Annulée',   color: '#991b1b', bg: '#fee2e2' },
}
const DOMAINES = ['cadre', 'communication', 'autonomie', 'emotions', 'relations', 'autre']
const OBJ_STATUTS = {
  a_travailler: { label: 'À travailler', color: '#6e7480' },
  en_cours:     { label: 'En cours',     color: '#0369a1' },
  atteint:      { label: 'Atteint',      color: '#15803d' },
  suspendu:     { label: 'Suspendu',     color: '#92660e' },
}

const EMPTY_SEANCE = {
  user_id: '', child_id: '', type: 'accompagnement',
  date: new Date().toISOString().slice(0, 10),
  heure_debut: '14:00', heure_fin: '16:00',
  lieu: '', compte_rendu: '', notes_privees: '',
  objectifs_travailles: '', statut: 'planifiee',
  cr_partage: false, montant: '',
}
const EMPTY_OBJ = {
  user_id: '', child_id: '', titre: '', description: '',
  domaine: 'cadre', statut: 'a_travailler', progression: 0,
  date_debut: new Date().toISOString().slice(0, 10),
  date_cible: '', visible_famille: true,
}

export default function AdminSeances() {
  const [familles, setFamilles] = useState([])
  const [enfants,  setEnfants]  = useState([])
  const [seances,  setSeances]  = useState([])
  const [objectifs, setObjectifs] = useState([])
  const [selected, setSelected] = useState(null)   // famille sélectionnée
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('seances')
  const [modal,    setModal]    = useState(null)   // 'seance' | 'objectif'
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(EMPTY_SEANCE)
  const [objForm,  setObjForm]  = useState(EMPTY_OBJ)

  useEffect(() => {
    Promise.all([
      axios.get('/api/users'),
      axios.get('/api/children'),
    ]).then(([u, c]) => {
      setFamilles(u.data.filter(x => x.role !== 'admin'))
      setEnfants(c.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const loadFamille = async (f) => {
    setSelected(f)
    setTab('seances')
    const [s, o, st] = await Promise.all([
      axios.get(`/api/seances/famille/${f.id}`),
      axios.get(`/api/seances/famille/${f.id}/objectifs`),
      axios.get(`/api/seances/famille/${f.id}/stats`),
    ])
    setSeances(s.data); setObjectifs(o.data); setStats(st.data)
  }

  const enfantsFamille = () => enfants.filter(e => e.user_id === selected?.id)

  // ═══ SÉANCES ═══
  const openSeance = (s = null) => {
    if (s) {
      setForm({
        ...s,
        user_id: String(s.user_id),
        child_id: s.child_id ? String(s.child_id) : '',
        heure_debut: s.heure_debut?.slice(0, 5) || '14:00',
        heure_fin: s.heure_fin?.slice(0, 5) || '16:00',
        montant: s.montant ? String(s.montant) : '',
      })
      setEditing(s.id)
    } else {
      setForm({ ...EMPTY_SEANCE, user_id: String(selected.id) })
      setEditing(null)
    }
    setModal('seance')
  }

  const saveSeance = async () => {
    if (!form.date) { toast.error('La date est obligatoire'); return }
    const payload = {
      ...form,
      user_id: +form.user_id,
      child_id: form.child_id ? +form.child_id : null,
      montant: form.montant ? parseFloat(form.montant) : null,
    }
    try {
      if (editing) {
        const { data } = await axios.put(`/api/seances/${editing}`, payload)
        setSeances(l => l.map(x => x.id === editing ? data : x))
        toast.success('Séance mise à jour')
      } else {
        const { data } = await axios.post('/api/seances', payload)
        setSeances(l => [data, ...l])
        toast.success('Séance ajoutée')
      }
      setModal(null)
      const st = await axios.get(`/api/seances/famille/${selected.id}/stats`)
      setStats(st.data)
    } catch { toast.error('Erreur lors de l\'enregistrement') }
  }

  const delSeance = async (id) => {
    if (!window.confirm('Supprimer cette séance ?')) return
    await axios.delete(`/api/seances/${id}`)
    setSeances(l => l.filter(x => x.id !== id))
    toast.success('Séance supprimée')
  }

  // ═══ OBJECTIFS ═══
  const openObjectif = (o = null) => {
    if (o) {
      setObjForm({
        ...o,
        user_id: String(o.user_id),
        child_id: o.child_id ? String(o.child_id) : '',
      })
      setEditing(o.id)
    } else {
      setObjForm({ ...EMPTY_OBJ, user_id: String(selected.id) })
      setEditing(null)
    }
    setModal('objectif')
  }

  const saveObjectif = async () => {
    if (!objForm.titre) { toast.error('Le titre est obligatoire'); return }
    const payload = {
      ...objForm,
      user_id: +objForm.user_id,
      child_id: objForm.child_id ? +objForm.child_id : null,
      progression: +objForm.progression,
    }
    try {
      if (editing) {
        const { data } = await axios.put(`/api/seances/objectifs/${editing}`, payload)
        setObjectifs(l => l.map(x => x.id === editing ? data : x))
        toast.success('Objectif mis à jour')
      } else {
        const { data } = await axios.post('/api/seances/objectifs', payload)
        setObjectifs(l => [data, ...l])
        toast.success('Objectif ajouté')
      }
      setModal(null)
    } catch { toast.error('Erreur') }
  }

  const delObjectif = async (id) => {
    if (!window.confirm('Supprimer cet objectif ?')) return
    await axios.delete(`/api/seances/objectifs/${id}`)
    setObjectifs(l => l.filter(x => x.id !== id))
    toast.success('Objectif supprimé')
  }

  const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''

  const fld = (label, key, type = 'text', state = form, setState = setForm) => (
    <div style={{ marginBottom: '.85rem' }}>
      <label style={lbl}>{label}</label>
      <input type={type} value={state[key] ?? ''} onChange={e => setState(f => ({ ...f, [key]: e.target.value }))} style={inp} />
    </div>
  )
  const sel = (label, key, opts, state = form, setState = setForm) => (
    <div style={{ marginBottom: '.85rem' }}>
      <label style={lbl}>{label}</label>
      <select value={state[key] ?? ''} onChange={e => setState(f => ({ ...f, [key]: e.target.value }))} style={inp}>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
  const txt = (label, key, rows = 3, state = form, setState = setForm) => (
    <div style={{ marginBottom: '.85rem' }}>
      <label style={lbl}>{label}</label>
      <textarea rows={rows} value={state[key] ?? ''} onChange={e => setState(f => ({ ...f, [key]: e.target.value }))}
        style={{ ...inp, resize: 'vertical' }} />
    </div>
  )

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Suivi des accompagnements</h1>
            <p className="admin-page__subtitle">
              {selected ? `Famille ${selected.prenom} ${selected.nom}` : `${familles.length} famille(s) suivie(s)`}
            </p>
          </div>
          {selected && (
            <div style={{ display: 'flex', gap: '.7rem' }}>
              <button className="btn-secondary" onClick={() => openObjectif()}>+ Objectif</button>
              <button className="btn-primary" onClick={() => openSeance()}>+ Séance</button>
            </div>
          )}
        </div>

        {loading ? <div className="admin-loading">Chargement…</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* Liste familles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
              {familles.map(f => {
                const nbEnf = enfants.filter(e => e.user_id === f.id).length
                return (
                  <button key={f.id} onClick={() => loadFamille(f)} style={{
                    textAlign: 'left', padding: '.9rem 1.1rem',
                    background: selected?.id === f.id ? 'var(--s2-light)' : '#fff',
                    border: `1.5px solid ${selected?.id === f.id ? 'var(--s2)' : 'var(--line)'}`,
                    borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '.93rem', color: 'var(--ink)' }}>{f.prenom} {f.nom}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--soft)' }}>
                      {nbEnf} enfant{nbEnf > 1 ? 's' : ''} · {f.email}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Détail */}
            {!selected ? (
              <div style={{ background: 'var(--gray)', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center', color: 'var(--soft)' }}>
                Sélectionnez une famille pour voir son suivi
              </div>
            ) : (
              <div>
                {/* Stats */}
                {stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.9rem', marginBottom: '1.3rem' }}>
                    {[
                      { l: 'Séances réalisées', v: stats.nb_seances },
                      { l: 'Heures cumulées',   v: `${stats.total_heures} h` },
                      { l: 'Dernière séance',   v: stats.derniere ? new Date(stats.derniere + 'T00:00:00').toLocaleDateString('fr-FR') : '—' },
                    ].map(({ l, v }) => (
                      <div key={l} style={{ background: 'var(--gray)', borderRadius: 12, padding: '1.1rem 1.3rem' }}>
                        <div style={{ fontSize: '.75rem', color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginBottom: '.3rem' }}>{l}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--s2)', letterSpacing: '-.02em' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Onglets */}
                <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.2rem', background: 'var(--gray)', padding: 3, borderRadius: 10, width: 'fit-content' }}>
                  {[['seances', `Séances (${seances.length})`], ['objectifs', `Objectifs (${objectifs.length})`]].map(([v, l]) => (
                    <button key={v} onClick={() => setTab(v)} style={{
                      padding: '.5rem 1.1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600, fontSize: '.88rem',
                      background: tab === v ? '#fff' : 'transparent',
                      color: tab === v ? 'var(--ink)' : 'var(--soft)',
                      boxShadow: tab === v ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                    }}>{l}</button>
                  ))}
                </div>

                {/* SÉANCES */}
                {tab === 'seances' && (
                  seances.length === 0 ? (
                    <div style={{ background: 'var(--gray)', borderRadius: 14, padding: '3rem', textAlign: 'center', color: 'var(--soft)' }}>
                      Aucune séance enregistrée pour cette famille.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                      {seances.map(s => {
                        const T = TYPES[s.type] || TYPES.accompagnement
                        const S = STATUTS[s.statut] || STATUTS.planifiee
                        return (
                          <div key={s.id} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 14, padding: '1.2rem 1.4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '.6rem', flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '.98rem', marginBottom: '.2rem' }}>{fmt(s.date)}</div>
                                <div style={{ fontSize: '.83rem', color: 'var(--soft)' }}>
                                  {s.heure_debut?.slice(0,5)}–{s.heure_fin?.slice(0,5)}
                                  {s.duree_heures ? ` · ${s.duree_heures} h` : ''}
                                  {s.child ? ` · ${s.child.prenom}` : ''}
                                  {s.lieu ? ` · ${s.lieu}` : ''}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ background: T.bg, color: T.color, padding: '3px 10px', borderRadius: 50, fontSize: '.74rem', fontWeight: 700 }}>{T.label}</span>
                                <span style={{ background: S.bg, color: S.color, padding: '3px 10px', borderRadius: 50, fontSize: '.74rem', fontWeight: 700 }}>{S.label}</span>
                                {s.montant && <span style={{ fontWeight: 700, color: 'var(--s2)', fontSize: '.9rem' }}>{parseFloat(s.montant).toFixed(2)} €</span>}
                              </div>
                            </div>

                            {s.compte_rendu && (
                              <div style={{ background: 'var(--gray)', borderRadius: 8, padding: '.75rem .9rem', fontSize: '.88rem', marginBottom: '.5rem', lineHeight: 1.6 }}>
                                <b style={{ fontSize: '.75rem', textTransform: 'uppercase', color: 'var(--soft)', letterSpacing: '.04em', display: 'block', marginBottom: '.3rem' }}>
                                  Compte-rendu {s.cr_partage ? '· partagé avec la famille' : '· non partagé'}
                                </b>
                                {s.compte_rendu}
                              </div>
                            )}
                            {s.notes_privees && (
                              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '.75rem .9rem', fontSize: '.88rem', marginBottom: '.5rem', lineHeight: 1.6 }}>
                                <b style={{ fontSize: '.75rem', textTransform: 'uppercase', color: '#92660e', letterSpacing: '.04em', display: 'block', marginBottom: '.3rem' }}>
                                  Notes privées · jamais visibles par la famille
                                </b>
                                {s.notes_privees}
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '.5rem', marginTop: '.6rem' }}>
                              <button onClick={() => openSeance(s)} className="btn-secondary" style={{ padding: '.35rem .9rem', fontSize: '.82rem' }}>Modifier</button>
                              <button onClick={() => delSeance(s.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 100, padding: '.35rem .9rem', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Supprimer</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                )}

                {/* OBJECTIFS */}
                {tab === 'objectifs' && (
                  objectifs.length === 0 ? (
                    <div style={{ background: 'var(--gray)', borderRadius: 14, padding: '3rem', textAlign: 'center', color: 'var(--soft)' }}>
                      Aucun objectif défini. Les objectifs structurent l'accompagnement dans la durée.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                      {objectifs.map(o => {
                        const S = OBJ_STATUTS[o.statut] || OBJ_STATUTS.a_travailler
                        return (
                          <div key={o.id} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 14, padding: '1.2rem 1.4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '.5rem' }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{o.titre}</div>
                                <div style={{ fontSize: '.8rem', color: 'var(--soft)', textTransform: 'capitalize' }}>
                                  {o.domaine}{o.child ? ` · ${o.child.prenom}` : ''}
                                  {!o.visible_famille && ' · non visible par la famille'}
                                </div>
                              </div>
                              <span style={{ color: S.color, fontWeight: 700, fontSize: '.8rem' }}>{S.label}</span>
                            </div>
                            {o.description && <p style={{ fontSize: '.9rem', color: 'var(--soft)', marginBottom: '.7rem', lineHeight: 1.6 }}>{o.description}</p>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.7rem' }}>
                              <div style={{ flex: 1, height: 7, background: 'var(--gray2)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ width: `${o.progression}%`, height: '100%', background: 'var(--s2)', borderRadius: 4, transition: 'width .4s' }} />
                              </div>
                              <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--s2)', minWidth: 38, textAlign: 'right' }}>{o.progression}%</span>
                            </div>
                            <div style={{ display: 'flex', gap: '.5rem' }}>
                              <button onClick={() => openObjectif(o)} className="btn-secondary" style={{ padding: '.35rem .9rem', fontSize: '.82rem' }}>Modifier</button>
                              <button onClick={() => delObjectif(o.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 100, padding: '.35rem .9rem', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Supprimer</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* MODAL SÉANCE */}
        {modal === 'seance' && (
          <div style={overlay} onClick={() => setModal(null)}>
            <div style={{ ...box, maxWidth: 620 }} onClick={e => e.stopPropagation()}>
              <div style={head}>
                <h3 style={headTitle}>{editing ? 'Modifier la séance' : 'Nouvelle séance'}</h3>
                <button onClick={() => setModal(null)} style={closeBtn}></button>
              </div>
              <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {sel('Type de séance', 'type', Object.entries(TYPES).map(([v, o]) => [v, o.label]))}
                  {sel('Enfant concerné', 'child_id', [['', '— Aucun / la famille —'], ...enfantsFamille().map(e => [String(e.id), `${e.prenom} ${e.nom}`])])}
                  {fld('Date', 'date', 'date')}
                  {sel('Statut', 'statut', Object.entries(STATUTS).map(([v, o]) => [v, o.label]))}
                  {fld('Heure de début', 'heure_debut', 'time')}
                  {fld('Heure de fin', 'heure_fin', 'time')}
                  {fld('Lieu', 'lieu')}
                  {fld('Montant (€)', 'montant', 'number')}
                </div>
                {txt('Objectifs travaillés pendant la séance', 'objectifs_travailles', 2)}
                {txt('Compte-rendu', 'compte_rendu', 4)}
                <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.85rem', fontSize: '.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.cr_partage} onChange={e => setForm(f => ({ ...f, cr_partage: e.target.checked }))} />
                  Partager ce compte-rendu avec la famille
                </label>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '1rem' }}>
                  {txt('Notes privées (jamais visibles par la famille)', 'notes_privees', 3)}
                </div>
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>Annuler</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={saveSeance}>Enregistrer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL OBJECTIF */}
        {modal === 'objectif' && (
          <div style={overlay} onClick={() => setModal(null)}>
            <div style={{ ...box, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
              <div style={head}>
                <h3 style={headTitle}>{editing ? 'Modifier l\'objectif' : 'Nouvel objectif'}</h3>
                <button onClick={() => setModal(null)} style={closeBtn}></button>
              </div>
              <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                {fld('Titre de l\'objectif', 'titre', 'text', objForm, setObjForm)}
                {txt('Description', 'description', 3, objForm, setObjForm)}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {sel('Domaine', 'domaine', DOMAINES.map(d => [d, d.charAt(0).toUpperCase() + d.slice(1)]), objForm, setObjForm)}
                  {sel('Enfant', 'child_id', [['', '— La famille —'], ...enfantsFamille().map(e => [String(e.id), e.prenom])], objForm, setObjForm)}
                  {sel('Statut', 'statut', Object.entries(OBJ_STATUTS).map(([v, o]) => [v, o.label]), objForm, setObjForm)}
                  {fld('Progression (%)', 'progression', 'number', objForm, setObjForm)}
                  {fld('Date de début', 'date_debut', 'date', objForm, setObjForm)}
                  {fld('Date cible', 'date_cible', 'date', objForm, setObjForm)}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.85rem', fontSize: '.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={objForm.visible_famille} onChange={e => setObjForm(f => ({ ...f, visible_famille: e.target.checked }))} />
                  Visible par la famille
                </label>
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '1rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>Annuler</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={saveObjectif}>Enregistrer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

const lbl = { fontSize: '.76rem', fontWeight: 700, color: 'var(--soft)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }
const inp = { width: '100%', padding: '.6rem .8rem', border: '1.5px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', fontSize: '.92rem', outline: 'none' }
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }
const box = { background: '#fff', borderRadius: 18, width: '100%', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }
const head = { background: 'var(--ink)', padding: '1.15rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const headTitle = { color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }
const closeBtn = { background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }
