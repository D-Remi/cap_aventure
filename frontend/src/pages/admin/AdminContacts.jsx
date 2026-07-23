import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

const URGENCES = {
  info:    'Se renseigne',
  bientot: 'Dans les prochaines semaines',
  urgent:  'Situation urgente',
}

const SERVICES = {
  repit:          { label: 'Répit handicap',        color: '#0e6b6b', bg: '#e6f2f2' },
  accompagnement: { label: 'Accompagnement',        color: '#136f5b', bg: '#e7f2ee' },
  autre:          { label: 'Non précisé',           color: '#6e7480', bg: '#f6f7f9' },
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter,   setFilter]   = useState('non_traites')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { load() }, [])

  const load = () =>
    axios.get('/api/contact')
      .then(r => setContacts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))

  const marquerTraite = async (id) => {
    await axios.patch(`/api/contact/${id}`, { traite: true })
    setContacts(c => c.map(x => x.id === id ? { ...x, traite: true } : x))
    if (selected?.id === id) setSelected(s => ({ ...s, traite: true }))
    toast.success('Demande marquée comme traitée')
  }

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    await axios.delete(`/api/contact/${id}`)
    setContacts(c => c.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success('Demande supprimée')
  }

  const isUrgent = (c) => c.urgence === 'urgent'

  const filtered = contacts.filter(c => {
    if (filter === 'non_traites') return !c.traite
    if (filter === 'traites')     return c.traite
    if (filter === 'urgent')      return isUrgent(c) && !c.traite
    return true
  })

  const nonTraites = contacts.filter(c => !c.traite).length
  const urgents    = contacts.filter(c => isUrgent(c) && !c.traite).length

  const FILTERS = [
    { v: 'non_traites', l: 'À traiter',   n: nonTraites },
    { v: 'urgent',      l: 'Urgentes',    n: urgents },
    { v: 'traites',     l: 'Traitées',    n: contacts.length - nonTraites },
    { v: 'tous',        l: 'Toutes',      n: contacts.length },
  ]

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Demandes reçues</h1>
            <p className="admin-page__subtitle">
              {nonTraites} demande{nonTraites > 1 ? 's' : ''} en attente
              {urgents > 0 && ` · ${urgents} urgente${urgents > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
          {FILTERS.map(({ v, l, n }) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              padding: '.45rem 1.05rem', borderRadius: 100,
              border: `1.5px solid ${filter === v ? 'var(--s2)' : 'var(--line)'}`,
              background: filter === v ? 'var(--s2)' : '#fff',
              color: filter === v ? '#fff' : 'var(--ink)',
              fontWeight: 600, fontSize: '.86rem', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {l} ({n})
            </button>
          ))}
        </div>

        {loading ? <div className="admin-loading">Chargement…</div> :
         filtered.length === 0 ? (
           <div style={{ background: 'var(--gray)', borderRadius: 16, padding: '3rem', textAlign: 'center', color: 'var(--soft)' }}>
             Aucune demande dans cette catégorie.
           </div>
         ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* Liste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {filtered.map(c => {
                const S = SERVICES[c.service] || SERVICES.autre
                return (
                  <button key={c.id} onClick={() => setSelected(c)} style={{
                    textAlign: 'left', padding: '1rem 1.2rem',
                    background: selected?.id === c.id ? 'var(--s2-light)' : '#fff',
                    border: `1.5px solid ${selected?.id === c.id ? 'var(--s2)' : 'var(--line)'}`,
                    borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
                    opacity: c.traite ? .6 : 1, transition: 'all .18s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.3rem', gap: '.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '.94rem' }}>
                        {c.prenom} {c.nom || ''}
                      </span>
                      <span style={{ fontSize: '.72rem', color: 'var(--soft)', whiteSpace: 'nowrap' }}>
                        {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '.8rem', color: 'var(--soft)', marginBottom: '.4rem' }}>{c.email}</div>
                    <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
                      <span style={{ background: S.bg, color: S.color, fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>
                        {S.label}
                      </span>
                      {isUrgent(c) && !c.traite && (
                        <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>
                          Urgent
                        </span>
                      )}
                      {c.traite && (
                        <span style={{ background: 'var(--gray2)', color: 'var(--soft)', fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>
                          Traitée
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Détail */}
            {!selected ? (
              <div style={{ background: 'var(--gray)', borderRadius: 16, padding: '4rem 2rem', textAlign: 'center', color: 'var(--soft)' }}>
                Sélectionnez une demande pour la consulter
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ background: 'var(--ink)', padding: '1.3rem 1.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                      {selected.prenom} {selected.nom || ''}
                    </h3>
                    <span style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.55)' }}>
                      {new Date(selected.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  {selected.traite && (
                    <span style={{ background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: '.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>
                      Traitée
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={lbl}>Contact</div>
                      <a href={`mailto:${selected.email}`} style={{ color: 'var(--s2)', fontWeight: 500, fontSize: '.92rem' }}>{selected.email}</a>
                      {selected.telephone && (
                        <div style={{ fontSize: '.88rem', color: 'var(--soft)', marginTop: 2 }}>{selected.telephone}</div>
                      )}
                    </div>
                    <div>
                      <div style={lbl}>Service demandé</div>
                      <div style={{ fontSize: '.92rem', fontWeight: 500 }}>
                        {(SERVICES[selected.service] || SERVICES.autre).label}
                      </div>
                      {selected.urgence && (
                        <div style={{ fontSize: '.85rem', color: 'var(--soft)', marginTop: 4 }}>
                          {URGENCES[selected.urgence] || selected.urgence}
                        </div>
                      )}
                    </div>
                  </div>

                  {selected.message && (
                    <div>
                      <div style={lbl}>Sa demande</div>
                      <div style={{
                        background: 'var(--gray)', borderRadius: 10,
                        padding: '1.1rem 1.2rem', fontSize: '.92rem',
                        lineHeight: 1.7, whiteSpace: 'pre-wrap',
                      }}>
                        {selected.message}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '.7rem', paddingTop: '.5rem', borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
                    <a href={`mailto:${selected.email}`} className="btn-primary" style={{ fontSize: '.9rem', padding: '.75rem 1.5rem' }}>
                      Répondre par email
                    </a>
                    {selected.telephone && (
                      <a
                        href={`https://wa.me/${selected.telephone.replace(/[^0-9]/g, '').replace(/^0/, '33')}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ background: '#25D366', color: '#fff', padding: '.75rem 1.4rem', borderRadius: 100, fontWeight: 600, fontSize: '.9rem' }}
                      >
                        WhatsApp
                      </a>
                    )}
                    {!selected.traite && (
                      <button className="btn-secondary" onClick={() => marquerTraite(selected.id)} style={{ fontSize: '.9rem' }}>
                        Marquer traitée
                      </button>
                    )}
                    <button onClick={() => supprimer(selected.id)} style={{
                      background: '#fee2e2', color: '#991b1b', border: 'none',
                      borderRadius: 100, padding: '.75rem 1.3rem',
                      fontWeight: 600, fontSize: '.88rem', cursor: 'pointer', fontFamily: 'inherit',
                      marginLeft: 'auto',
                    }}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

const lbl = {
  fontSize: '.74rem', fontWeight: 700, color: 'var(--soft)',
  textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.4rem',
}
