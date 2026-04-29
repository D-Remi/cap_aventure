import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchContacts() }, [])

  const fetchContacts = () => {
    axios.get('/api/interest')
      .then(r => setContacts(r.data))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette demande de contact ?')) return
    await axios.delete(`/api/interest/${id}`)
    setSelected(null)
    fetchContacts()
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>📩 Demandes de contact</h1>
            <p className="admin-page__subtitle">
              {contacts.length} demande{contacts.length > 1 ? 's' : ''} reçue{contacts.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>Chargement...</div>
        ) : contacts.length === 0 ? (
          <div className="admin-empty">
            <div style={{ fontSize:'2rem' }}>📭</div>
            <h3>Aucune demande de contact</h3>
            <p>Les messages du formulaire de contact apparaîtront ici.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start' }}>

            {/* Liste */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {contacts.map(c => (
                <div key={c.id}
                  onClick={() => setSelected(c)}
                  style={{
                    padding:'1rem 1.25rem',
                    background: selected?.id === c.id ? '#e8f5ed' : 'var(--blanc)',
                    borderRadius:'var(--radius-lg)',
                    border: `2px solid ${selected?.id === c.id ? 'var(--vert-clair)' : '#eef2ee'}`,
                    cursor:'pointer',
                    transition:'all 0.18s',
                  }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.25rem' }}>
                    <span style={{ fontWeight:700, color:'var(--bleu-nuit)', fontSize:'0.92rem' }}>
                      {c.prenom} {c.nom || ''}
                    </span>
                    <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>
                      {new Date(c.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}
                    </span>
                  </div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{c.email}</div>
                  {c.activite && (
                    <div style={{ marginTop:'0.3rem' }}>
                      <span style={{ fontSize:'0.72rem', background:'#e8f5ed', color:'var(--vert-foret)', padding:'2px 8px', borderRadius:50, fontWeight:700 }}>
                        {c.activite}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Détail */}
            {selected ? (
              <div style={{ background:'var(--blanc)', borderRadius:'var(--radius-xl)', padding:'1.75rem', boxShadow:'var(--shadow-sm)', position:'sticky', top:'5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
                  <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'1.1rem', color:'var(--bleu-nuit)', margin:0 }}>
                    {selected.prenom} {selected.nom || ''}
                  </h2>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    style={{ background:'#fee2e2', color:'#991b1b', border:'none', borderRadius:8, padding:'0.35rem 0.85rem', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', fontFamily:'inherit' }}>
                    🗑️ Supprimer
                  </button>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  <Row icon="📧" label="Email" value={<a href={`mailto:${selected.email}`} style={{ color:'var(--vert-foret)', fontWeight:700 }}>{selected.email}</a>} />
                  {selected.enfant && <Row icon="👶" label="Enfant" value={selected.enfant} />}
                  {selected.age    && <Row icon="🎂" label="Âge" value={selected.age} />}
                  {selected.activite && <Row icon="🎯" label="Activité" value={selected.activite} />}
                  {selected.message && (
                    <div style={{ marginTop:'0.5rem', padding:'1rem', background:'#f9fbf9', borderRadius:10, border:'1px solid #eef2ee' }}>
                      <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'0.5rem' }}>Message</div>
                      <p style={{ fontSize:'0.88rem', color:'var(--bleu-nuit)', lineHeight:1.6, margin:0 }}>{selected.message}</p>
                    </div>
                  )}
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>
                    Reçu le {new Date(selected.created_at).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--text-muted)', fontSize:'0.88rem' }}>
                ← Sélectionne une demande pour voir le détail
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function Row({ icon, label, value }) {
  return (
    <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
      <span style={{ fontSize:'1rem', flexShrink:0 }}>{icon}</span>
      <div>
        <div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>{label}</div>
        <div style={{ fontSize:'0.88rem', color:'var(--bleu-nuit)', fontWeight:600 }}>{value}</div>
      </div>
    </div>
  )
}
