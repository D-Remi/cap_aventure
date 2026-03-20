import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import AdminLayout from '../../components/layout/AdminLayout'

const COLORS = ['#1b6fa8', '#4ecb71', '#f5c842', '#f07d2a', '#5bbde4']

const TYPE_LABELS = { ski:'Ski', vtt:'VTT', rando:'Rando', scout:'Scouts', autre:'Autre' }

export default function AdminStats() {
  const [global, setGlobal]       = useState(null)
  const [byMonth, setByMonth]     = useState([])
  const [revenue, setRevenue]     = useState([])
  const [byType, setByType]       = useState([])
  const [topActs, setTopActs]     = useState([])
  const [growth, setGrowth]       = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [g, m, r, t, a, gr] = await Promise.all([
          axios.get('/api/stats'),
          axios.get('/api/stats/registrations-by-month'),
          axios.get('/api/stats/revenue-by-month'),
          axios.get('/api/stats/by-type'),
          axios.get('/api/stats/top-activities'),
          axios.get('/api/stats/user-growth'),
        ])
        setGlobal(g.data)
        setByMonth(m.data)
        setRevenue(r.data)
        setByType(t.data.map(d => ({ ...d, name: TYPE_LABELS[d.type] || d.type })))
        setTopActs(a.data)
        setGrowth(gr.data)
      } finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <AdminLayout><div className="admin-loading" style={{ minHeight:'80vh' }}>Chargement des statistiques...</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Statistiques avancées</h1>
            <p>Tableau de bord analytique CapAventure</p>
          </div>
        </div>

        {/* KPIs globaux */}
        {global && (
          <div className="admin-stats-grid" style={{ marginBottom:'2rem' }}>
            {[
              { label:'Familles inscrites', value: global.totalUsers, icon:'👨‍👩‍👧', color:'#dbeafe' },
              { label:'Enfants enregistrés', value: global.totalChildren, icon:'🧒', color:'#dcfce7' },
              { label:'Activités créées', value: global.totalActivities, icon:'🎿', color:'#fef9c3' },
              { label:'Revenus confirmés', value: `${global.revenue}€`, icon:'💶', color:'#ede9fe' },
              { label:'Inscriptions totales', value: global.totalRegistrations, icon:'📋', color:'#f0fdf4' },
              { label:'Confirmées', value: global.confirmed, icon:'✅', color:'#dcfce7' },
              { label:'En attente', value: global.pending, icon:'⏳', color:'#fef9c3' },
              { label:'Revenus potentiels', value: `${global.potRevenue}€`, icon:'🔮', color:'#fdf2f8' },
            ].map(kpi => (
              <div key={kpi.label} className="admin-stat-card">
                <div className="admin-stat-card__icon" style={{ background: kpi.color }}>{kpi.icon}</div>
                <div className="admin-stat-card__body">
                  <div className="admin-stat-card__num">{kpi.value}</div>
                  <div className="admin-stat-card__label">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="stats-charts-grid">

          {/* Inscriptions par mois */}
          {byMonth.length > 0 && (
            <div className="stats-chart-card stats-chart-card--wide">
              <h3>📋 Inscriptions par mois</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byMonth} margin={{ top:5, right:20, left:0, bottom:5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="confirmed" name="Confirmées" fill="#4ecb71" radius={[4,4,0,0]} />
                  <Bar dataKey="pending"   name="En attente" fill="#f5c842" radius={[4,4,0,0]} />
                  <Bar dataKey="cancelled" name="Annulées"   fill="#fca5a5" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Revenus par mois */}
          {revenue.length > 0 && (
            <div className="stats-chart-card stats-chart-card--wide">
              <h3>💶 Revenus confirmés par mois (€)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenue} margin={{ top:5, right:20, left:0, bottom:5 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1b6fa8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1b6fa8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [`${v}€`, 'Revenus']}
                    contentStyle={{ borderRadius: 12, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone" dataKey="revenue" name="Revenus"
                    stroke="#1b6fa8" strokeWidth={2.5}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Activités par type */}
          {byType.length > 0 && (
            <div className="stats-chart-card">
              <h3>🎿 Répartition par type d'activité</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={byType}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {byType.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n, p) => [v, p.payload.name]}
                    contentStyle={{ borderRadius: 12, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Croissance familles */}
          {growth.length > 0 && (
            <div className="stats-chart-card">
              <h3>👨‍👩‍👧 Croissance des familles inscrites</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={growth} margin={{ top:5, right:20, left:0, bottom:5 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4ecb71" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ecb71" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="total" name="Total familles" stroke="#4ecb71" strokeWidth={2.5} fill="url(#growthGrad)" />
                  <Area type="monotone" dataKey="nouveaux" name="Nouveaux" stroke="#1a5c3a" strokeWidth={1.5} fill="none" strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top activités */}
          {topActs.length > 0 && (
            <div className="stats-chart-card stats-chart-card--wide">
              <h3>🏆 Top 5 activités les plus populaires</h3>
              <table className="admin-table" style={{ marginTop:'0.75rem' }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Activité</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Prix</th>
                    <th>Inscrits</th>
                    <th>Taux remplissage</th>
                  </tr>
                </thead>
                <tbody>
                  {topActs.map((a, i) => (
                    <tr key={a.id}>
                      <td>
                        <span style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : 'var(--text-muted)' }}>
                          #{i + 1}
                        </span>
                      </td>
                      <td><strong>{a.titre}</strong></td>
                      <td style={{ textTransform:'capitalize' }}>{a.type}</td>
                      <td style={{ fontSize:'0.82rem' }}>
                        {new Date(a.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                      </td>
                      <td>{parseFloat(a.prix).toFixed(2)}€</td>
                      <td><strong style={{ color:'var(--vert-clair)' }}>{a.inscrits}</strong> / {a.places_max}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                          <div style={{
                            flex:1, height:8, borderRadius:4,
                            background:'#eef2ee', overflow:'hidden',
                          }}>
                            <div style={{
                              width:`${a.taux_remplissage}%`,
                              height:'100%',
                              background: a.taux_remplissage >= 80 ? '#ef4444' : a.taux_remplissage >= 50 ? '#f59e0b' : '#4ecb71',
                              borderRadius:4,
                              transition:'width 0.5s',
                            }} />
                          </div>
                          <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', minWidth:32 }}>
                            {a.taux_remplissage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .stats-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .stats-chart-card {
          background: var(--blanc);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .stats-chart-card--wide {
          grid-column: span 2;
        }
        .stats-chart-card h3 {
          font-family: 'Baloo 2', cursive;
          font-size: 1rem;
          color: var(--bleu-nuit);
          margin-bottom: 1rem;
        }
        @media (max-width: 900px) {
          .stats-charts-grid { grid-template-columns: 1fr; }
          .stats-chart-card--wide { grid-column: span 1; }
        }
      `}</style>
    </AdminLayout>
  )
}
