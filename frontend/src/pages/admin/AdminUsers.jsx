import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminUsers() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState(null) // userId expanded pour voir enfants

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users')
      // Charger les enfants de chaque user
      const withChildren = await Promise.all(
        data.map(async u => {
          try {
            const c = await axios.get(`/api/users/${u.id}`)
            return { ...u, children: c.data.children || [] }
          } catch { return { ...u, children: [] } }
        })
      )
      setUsers(withChildren)
    } finally { setLoading(false) }
  }

  const toggleRole = async (user) => {
    const roles = ['parent', 'animateur', 'admin']
    const currentIdx = roles.indexOf(user.role)
    const nextRole = roles[(currentIdx + 1) % roles.length]
    if (!window.confirm(`Passer ${user.prenom} en "${nextRole}" ?`)) return
    await axios.patch(`/api/users/${user.id}`, { role: nextRole })
    fetchUsers()
  }

  const toggleActif = async (user) => {
    await axios.patch(`/api/users/${user.id}`, { actif: !user.actif })
    fetchUsers()
  }

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.prenom?.toLowerCase().includes(q) ||
      u.nom?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Parents & Enfants</h1>
            <p>{users.length} famille{users.length > 1 ? 's' : ''} inscrite{users.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-wrap__header">
            <h2>Liste des comptes</h2>
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
            <div className="admin-empty"><span>👨‍👩‍👧</span>Aucun utilisateur trouvé</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Enfants</th>
                  <th>Inscrit le</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <>
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: 32, height: 32,
                            borderRadius: '50%',
                            background: u.role === 'admin'
                              ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                              : 'linear-gradient(135deg,var(--vert-clair),var(--bleu-ciel))',
                            color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Baloo 2',cursive",
                            fontWeight: 800, fontSize: '0.78rem',
                            flexShrink: 0,
                          }}>
                            {u.prenom?.[0]}{u.nom?.[0]}
                          </div>
                          <strong>{u.prenom} {u.nom}</strong>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                      <td style={{ fontSize: '0.85rem' }}>{u.telephone || '—'}</td>
                      <td>
                        <span className={`badge badge--${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        {u.children?.length > 0 ? (
                          <button
                            onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--vert-clair)', fontWeight:700, fontSize:'0.85rem' }}
                          >
                            {u.children.length} enfant{u.children.length > 1 ? 's' : ''} {expanded === u.id ? '▲' : '▼'}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Aucun</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <span className={`badge badge--${u.actif ? 'actif' : 'inactif'}`}>
                          {u.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="btn-icon btn-icon--edit"
                            onClick={() => toggleRole(u)}
                            title={u.role === 'admin' ? 'Passer en parent' : 'Passer en admin'}
                          >
                            {u.role === 'admin' ? '👤' : '⭐'}
                          </button>
                          <button
                            className="btn-icon"
                            style={{ background: u.actif ? '#fee2e2' : '#dcfce7', color: u.actif ? '#dc2626' : '#16a34a' }}
                            onClick={() => toggleActif(u)}
                            title={u.actif ? 'Désactiver' : 'Activer'}
                          >
                            {u.actif ? '🔒' : '🔓'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded children row */}
                    {expanded === u.id && u.children?.map(child => (
                      <tr key={`child-${child.id}`} style={{ background: '#f8fdf9' }}>
                        <td style={{ paddingLeft: '3.5rem' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>
                            <span>└ 👧</span>
                            <span>{child.prenom} {child.nom}</span>
                          </div>
                        </td>
                        <td colSpan={2} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Né(e) le {new Date(child.date_naissance).toLocaleDateString('fr-FR')}
                        </td>
                        <td colSpan={4} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {child.infos_medicales || 'Pas d\'infos médicales'}
                        </td>
                        <td />
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
