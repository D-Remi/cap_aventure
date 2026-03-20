import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import '../../components/ui/DocumentUploader.css'

const TYPE_ICONS = {
  fiche_sanitaire: '🏥',
  autorisation:    '✍️',
  assurance:       '🛡️',
  autre:           '📄',
}
const TYPE_LABELS = {
  fiche_sanitaire: 'Fiche sanitaire',
  autorisation:    'Autorisation parentale',
  assurance:       'Attestation assurance',
  autre:           'Autre',
}

export default function AdminDocuments() {
  const [docs, setDocs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    axios.get('/api/documents')
      .then(r => setDocs(r.data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return
    await axios.delete(`/api/documents/${id}`)
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  const filtered = docs.filter(d => {
    if (filterType !== 'all' && d.type !== filterType) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      d.original_name?.toLowerCase().includes(q) ||
      d.user?.prenom?.toLowerCase().includes(q) ||
      d.user?.nom?.toLowerCase().includes(q) ||
      d.child?.prenom?.toLowerCase().includes(q)
    )
  })

  const formatSize = (b) => b < 1024 * 1024 ? `${(b/1024).toFixed(0)} Ko` : `${(b/1024/1024).toFixed(1)} Mo`

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Documents</h1>
            <p>{docs.length} document{docs.length > 1 ? 's' : ''} déposé{docs.length > 1 ? 's' : ''} par les familles</p>
          </div>
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-wrap__header">
            <h2>Tous les documents</h2>
            <div className="admin-filters">
              <input className="admin-search" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="admin-search" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ minWidth: 180 }}>
                <option value="all">Tous les types</option>
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty"><span>📁</span>Aucun document</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Famille</th>
                  <th>Enfant</th>
                  <th>Taille</th>
                  <th>Déposé le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                        <span style={{ fontSize:'1.2rem' }}>{TYPE_ICONS[d.type] || '📄'}</span>
                        <span style={{ fontSize:'0.85rem', fontWeight:600 }}>{d.original_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--actif" style={{ fontSize:'0.72rem' }}>
                        {TYPE_LABELS[d.type] || d.type}
                      </span>
                    </td>
                    <td style={{ fontSize:'0.85rem' }}>
                      {d.user?.prenom} {d.user?.nom}
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{d.user?.email}</div>
                    </td>
                    <td style={{ fontSize:'0.85rem' }}>
                      {d.child ? `${d.child.prenom} ${d.child.nom}` : <span style={{ color:'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{formatSize(d.size)}</td>
                    <td style={{ fontSize:'0.82rem' }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div className="admin-actions">
                        <a href={d.url} target="_blank" rel="noreferrer" className="btn-icon btn-icon--view" title="Voir">👁</a>
                        <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(d.id)} title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
