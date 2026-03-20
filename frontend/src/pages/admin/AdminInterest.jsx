import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminInterest() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [detail, setDetail]   = useState(null)

  useEffect(() => {
    axios.get('/api/interest')
      .then(r => setItems(r.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return i.prenom?.toLowerCase().includes(q) ||
      i.nom?.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q) ||
      i.activite?.toLowerCase().includes(q)
  })

  const exportCSV = () => {
    const rows = [
      ['Prénom', 'Nom', 'Email', 'Enfant', 'Âge', 'Activité', 'Message', 'Date'],
      ...filtered.map(i => [
        i.prenom, i.nom || '', i.email, i.enfant || '', i.age || '',
        i.activite || '', i.message || '',
        new Date(i.created_at).toLocaleDateString('fr-FR'),
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = 'demandes_contact_capaventure.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Demandes de contact</h1>
            <p>{items.length} demande{items.length > 1 ? 's' : ''} reçue{items.length > 1 ? 's' : ''} via le formulaire vitrine</p>
          </div>
          <button className="btn-primary" onClick={exportCSV}>📥 Export CSV</button>
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-wrap__header">
            <h2>Liste des demandes</h2>
            <input
              className="admin-search"
              placeholder="🔍 Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="admin-loading">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <span>📩</span>Aucune demande pour le moment
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Enfant</th>
                  <th>Âge</th>
                  <th>Activité souhaitée</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id} style={{ cursor: 'pointer' }} onClick={() => setDetail(i)}>
                    <td><strong>{i.prenom} {i.nom}</strong></td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <a href={`mailto:${i.email}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--bleu-ciel)' }}>
                        {i.email}
                      </a>
                    </td>
                    <td>{i.enfant || '—'}</td>
                    <td>{i.age || '—'}</td>
                    <td>
                      {i.activite ? (
                        <span className="badge badge--actif">{i.activite}</span>
                      ) : '—'}
                    </td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      {i.message || '—'}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {new Date(i.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>📩 Demande de {detail.prenom} {detail.nom}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
              {[
                ['📧 Email', <a href={`mailto:${detail.email}`} style={{ color: 'var(--bleu-ciel)' }}>{detail.email}</a>],
                ['👶 Enfant', detail.enfant || '—'],
                ['🎂 Âge', detail.age || '—'],
                ['🎿 Activité', detail.activite || '—'],
                ['📅 Date', new Date(detail.created_at).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })],
              ].map(([label, value]) => (
                <div key={label} style={{ display:'flex', gap:'0.75rem' }}>
                  <span style={{ fontWeight:700, color:'var(--text-muted)', minWidth:110, fontSize:'0.85rem' }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
              {detail.message && (
                <div>
                  <div style={{ fontWeight:700, color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'0.4rem' }}>💬 Message</div>
                  <div style={{ background:'#f8faf9', borderRadius:10, padding:'0.9rem', lineHeight:1.7, color:'var(--text-dark)' }}>
                    {detail.message}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '1.5rem', display:'flex', gap:'0.75rem' }}>
              <a href={`mailto:${detail.email}?subject=CapAventure — Réponse à votre demande`} className="btn-primary" style={{ textDecoration:'none' }}>
                ✉️ Répondre par email
              </a>
              <button className="btn-secondary" onClick={() => setDetail(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
