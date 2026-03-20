import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

const REASON_LABELS = {
  inscription:        '📝 Inscription',
  presence:           '✅ Présence',
  parrainage:         '🤝 Parrainage',
  bonus_animateur:    '⭐ Bonus',
  echange_recompense: '🎁 Échange',
}

export default function AdminPoints() {
  const [leaderboard, setLeaderboard] = useState([])
  const [children, setChildren]       = useState([])
  const [stats, setStats]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [form, setForm]               = useState({ child_id:'', points:'', reason:'bonus_animateur', description:'' })
  const [saving, setSaving]           = useState(false)
  const [msg, setMsg]                 = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [lb, ch, st] = await Promise.all([
        axios.get('/api/points/leaderboard'),
        axios.get('/api/children'),
        axios.get('/api/points/admin/stats'),
      ])
      setLeaderboard(lb.data)
      setChildren(ch.data)
      setStats(st.data)
    } finally { setLoading(false) }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true); setMsg('')
    try {
      await axios.post('/api/points/add', {
        child_id:    parseInt(form.child_id),
        points:      parseInt(form.points),
        reason:      form.reason,
        description: form.description,
      })
      setMsg(`✅ ${form.points} points ajoutés !`)
      setForm({ child_id:'', points:'', reason:'bonus_animateur', description:'' })
      fetchAll()
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.message || 'Erreur'))
    } finally { setSaving(false) }
  }

  const MEDAL = ['🥇','🥈','🥉']

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>🏆 Points & Récompenses</h1>
            <p>Gérez les points des enfants et les demandes de récompenses</p>
          </div>
        </div>

        {/* Stats globales */}
        {stats && (
          <div className="admin-stats-grid" style={{ marginBottom:'2rem' }}>
            <div className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background:'#fef9c3' }}>🏆</div>
              <div className="admin-stat-card__body">
                <div className="admin-stat-card__num">{stats.totalDistributed}</div>
                <div className="admin-stat-card__label">Points distribués</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background:'#ede9fe' }}>🎁</div>
              <div className="admin-stat-card__body">
                <div className="admin-stat-card__num">{stats.totalRedeemed}</div>
                <div className="admin-stat-card__label">Points échangés</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background:'#dcfce7' }}>👧</div>
              <div className="admin-stat-card__body">
                <div className="admin-stat-card__num">{leaderboard.length}</div>
                <div className="admin-stat-card__label">Enfants avec points</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-card__icon" style={{ background:'#dbeafe' }}>⭐</div>
              <div className="admin-stat-card__body">
                <div className="admin-stat-card__num">{stats.totalDistributed - stats.totalRedeemed}</div>
                <div className="admin-stat-card__label">Points en circulation</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start' }}>

          {/* Ajouter des points */}
          <div className="admin-table-wrap">
            <div className="admin-table-wrap__header"><h2>➕ Attribuer des points</h2></div>
            <div style={{ padding:'1.5rem' }}>
              <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div className="form-group">
                  <label>Enfant *</label>
                  <select value={form.child_id} onChange={e => setForm(f=>({...f, child_id:e.target.value}))} required>
                    <option value="">-- Sélectionner --</option>
                    {children.map(c => (
                      <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Raison *</label>
                  <select value={form.reason} onChange={e => setForm(f=>({...f, reason:e.target.value}))}>
                    {Object.entries(REASON_LABELS).map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Points * (négatif pour déduire)</label>
                  <input type="number" value={form.points} onChange={e => setForm(f=>({...f, points:e.target.value}))} required placeholder="ex: 20" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input value={form.description} onChange={e => setForm(f=>({...f, description:e.target.value}))} placeholder="Ex: Super comportement !" />
                </div>
                {msg && <p style={{ fontWeight:600, fontSize:'0.88rem' }}>{msg}</p>}
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? '...' : 'Attribuer les points'}
                </button>
              </form>

              <div style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--bg-light)', borderRadius:'var(--radius-md)', fontSize:'0.82rem', color:'var(--text-muted)' }}>
                <strong style={{ display:'block', marginBottom:'0.5rem' }}>Attribution automatique :</strong>
                📝 +10 pts à l'inscription<br/>
                ✅ +20 pts quand tu confirmes la présence<br/>
                ❌ -10 pts si tu annules l'inscription
              </div>
            </div>
          </div>

          {/* Classement */}
          <div className="admin-table-wrap">
            <div className="admin-table-wrap__header"><h2>🏆 Classement</h2></div>
            {loading ? (
              <div className="admin-loading">Chargement...</div>
            ) : leaderboard.length === 0 ? (
              <div className="admin-empty"><span>🏆</span>Aucun point attribué</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Enfant</th><th>Points</th></tr>
                </thead>
                <tbody>
                  {leaderboard.map((e, i) => (
                    <tr key={e.childId}>
                      <td>
                        <span style={{ fontSize: i < 3 ? '1.2rem' : '0.9rem', fontFamily:"'Baloo 2',cursive", fontWeight:800 }}>
                          {i < 3 ? MEDAL[i] : `#${i+1}`}
                        </span>
                      </td>
                      <td><strong>{e.prenom} {e.nom}</strong></td>
                      <td>
                        <span style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:'1.1rem', color:'var(--vert-foret)' }}>
                          {e.total}
                        </span>
                        <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginLeft:'4px' }}>pts</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
