import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import { exportRegistrationsPDF } from '../../services/pdfExport'

const STATUS_LABEL = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée' }
const STATUS_CLASS = { pending: 'pending', confirmed: 'confirmed', cancelled: 'cancelled' }

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [activities, setActivities]       = useState([])
  const [loading, setLoading]             = useState(true)
  const [filterStatus, setFilterStatus]   = useState('all')
  const [filterActivity, setFilterActivity] = useState('all')
  const [search, setSearch]               = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [regs, acts] = await Promise.all([
        axios.get('/api/registrations'),
        axios.get('/api/activities?all=true'),
      ])
      setRegistrations(regs.data)
      setActivities(acts.data)
    } finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/registrations/${id}/status`, { status })
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const filtered = registrations.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false
    if (filterActivity !== 'all' && r.activity?.id !== parseInt(filterActivity)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.child?.prenom?.toLowerCase().includes(q) ||
        r.child?.nom?.toLowerCase().includes(q) ||
        r.activity?.titre?.toLowerCase().includes(q) ||
        r.child?.user?.prenom?.toLowerCase().includes(q) ||
        r.child?.user?.nom?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const exportCSV = () => {
    const rows = [
      ['Enfant', 'Parent', 'Email', 'Activité', 'Date activité', 'Prix', 'Statut', 'Date inscription'],
      ...filtered.map(r => [
        `${r.child?.prenom} ${r.child?.nom}`,
        `${r.child?.user?.prenom} ${r.child?.user?.nom}`,
        r.child?.user?.email || '',
        r.activity?.titre || '',
        r.activity?.date ? new Date(r.activity.date).toLocaleDateString('fr-FR') : '',
        r.activity?.prix ? `${r.activity.prix}€` : '',
        STATUS_LABEL[r.status],
        new Date(r.created_at).toLocaleDateString('fr-FR'),
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'inscriptions_capaventure.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Inscriptions</h1>
            <p>{filtered.length} inscription{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => {
              const mockActivity = { titre: 'Toutes les activités', date: null, prix: 0, places_max: '—', type: '—' }
              exportRegistrationsPDF(mockActivity, filtered)
            }}>📄 PDF</button>
            <button className="btn-primary" onClick={exportCSV}>📥 CSV</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="admin-search"
            placeholder="🔍 Chercher enfant, parent, activité..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="admin-search"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="cancelled">Annulées</option>
          </select>
          <select
            className="admin-search"
            value={filterActivity}
            onChange={e => setFilterActivity(e.target.value)}
            style={{ minWidth: 200 }}
          >
            <option value="all">Toutes les activités</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>{a.titre}</option>
            ))}
          </select>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'cancelled'].map(s => {
            const count = s === 'all' ? registrations.length : registrations.filter(r => r.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '0.35rem 1rem',
                  borderRadius: 50,
                  border: '2px solid',
                  borderColor: filterStatus === s ? 'var(--vert-clair)' : '#dde8e1',
                  background: filterStatus === s ? 'var(--vert-flash)' : 'transparent',
                  color: filterStatus === s ? 'var(--bleu-nuit)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {s === 'all' ? 'Tout' : STATUS_LABEL[s]} ({count})
              </button>
            )
          })}
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty"><span>📋</span>Aucune inscription trouvée</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Enfant</th>
                  <th>Parent</th>
                  <th>Activité</th>
                  <th>Date activité</th>
                  <th>Prix</th>
                  <th>Inscrit le</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.child?.prenom} {r.child?.nom}</strong></td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {r.child?.user?.prenom} {r.child?.user?.nom}
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{r.child?.user?.email}</div>
                      </div>
                    </td>
                    <td>{r.activity?.titre}</td>
                    <td style={{ fontSize: '0.83rem' }}>
                      {r.activity?.date
                        ? new Date(r.activity.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })
                        : '—'
                      }
                    </td>
                    <td>{r.activity?.prix ? `${parseFloat(r.activity.prix).toFixed(2)}€` : '—'}</td>
                    <td style={{ fontSize: '0.83rem' }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <select
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                        className={`status-select status-select--${STATUS_CLASS[r.status]}`}
                      >
                        <option value="pending">⏳ En attente</option>
                        <option value="confirmed">✅ Confirmée</option>
                        <option value="cancelled">❌ Annulée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .status-select {
          border-radius: 8px;
          padding: 0.3rem 0.6rem;
          font-size: 0.82rem;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          border: 1.5px solid transparent;
        }
        .status-select--pending   { background: #fef9c3; color: #92400e; border-color: #fde68a; }
        .status-select--confirmed { background: #dcfce7; color: #166534; border-color: #86efac; }
        .status-select--cancelled { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
      `}</style>
    </AdminLayout>
  )
}
