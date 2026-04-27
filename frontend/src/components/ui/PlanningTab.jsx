import { useState, useEffect } from 'react'
import api from '../../services/api'

const STATUT = {
  planifiee: { bg:'#fff7ed', text:'#c2410c', label:'📅 Planifiée' },
  confirmee: { bg:'#dcfce7', text:'#166534', label:'✅ Confirmée' },
  annulee:   { bg:'#fee2e2', text:'#991b1b',  label:'❌ Annulée' },
}

export default function PlanningTab() {
  const [seances,   setSeances]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filterAct, setFilterAct] = useState('')
  const [activities, setActivities] = useState([])

  useEffect(() => {
    api.get('/api/planning')
      .then(r => {
        setSeances(r.data)
        // Extraire les activités uniques
        const acts = []
        const seen = new Set()
        r.data.forEach(s => {
          if (s.activity && !seen.has(s.activity.id)) {
            seen.add(s.activity.id)
            acts.push(s.activity)
          }
        })
        setActivities(acts)
      })
      .catch(() => setSeances([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = seances.filter(s =>
    !filterAct || String(s.activity_id) === filterAct
  )

  // Grouper par mois
  const grouped = filtered.reduce((acc, s) => {
    const d = new Date(s.date)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const label = d.toLocaleDateString('fr-FR', { month:'long', year:'numeric' })
    if (!acc[key]) acc[key] = { label, seances: [] }
    acc[key].seances.push(s)
    return acc
  }, {})

  if (loading) return <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>Chargement...</div>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

      {/* Filtre */}
      {activities.length > 1 && (
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          <button
            onClick={() => setFilterAct('')}
            style={{ padding:'0.3rem 0.85rem', borderRadius:50, border:'1.5px solid', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit',
              background: filterAct === '' ? 'var(--bleu-nuit)' : 'var(--blanc)',
              color: filterAct === '' ? 'var(--blanc)' : 'var(--bleu-nuit)',
              borderColor: filterAct === '' ? 'var(--bleu-nuit)' : '#d4e4d4' }}>
            Toutes
          </button>
          {activities.map(a => (
            <button key={a.id}
              onClick={() => setFilterAct(String(a.id))}
              style={{ padding:'0.3rem 0.85rem', borderRadius:50, border:'1.5px solid', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                background: filterAct === String(a.id) ? 'var(--bleu-nuit)' : 'var(--blanc)',
                color: filterAct === String(a.id) ? 'var(--blanc)' : 'var(--bleu-nuit)',
                borderColor: filterAct === String(a.id) ? 'var(--bleu-nuit)' : '#d4e4d4' }}>
              {a.titre}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'2.5rem 1rem', background:'var(--blanc)', borderRadius:'var(--radius-xl)', border:'1.5px dashed #d4e4d4' }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>📅</div>
          <h3 style={{ fontFamily:"'Baloo 2',cursive", color:'var(--bleu-nuit)' }}>Aucune séance à venir</h3>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>Le planning sera mis à jour prochainement.</p>
        </div>
      ) : (
        Object.entries(grouped).sort(([a],[b]) => a.localeCompare(b)).map(([key, { label, seances: ss }]) => (
          <div key={key}>
            <h3 style={{ fontFamily:"'Baloo 2',cursive", color:'var(--bleu-nuit)', fontSize:'1rem', marginBottom:'0.75rem', textTransform:'capitalize' }}>
              📆 {label}
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {ss.map(s => {
                const st = STATUT[s.statut] || STATUT.planifiee
                return (
                  <div key={s.id} style={{ background:'var(--blanc)', borderRadius:'var(--radius-lg)', border:'1.5px solid #eef2ee', padding:'1rem 1.25rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                    {/* Date bloc */}
                    <div style={{ background:'var(--bleu-nuit)', color:'var(--blanc)', borderRadius:10, padding:'0.5rem 0.75rem', textAlign:'center', flexShrink:0, minWidth:52 }}>
                      <div style={{ fontSize:'1.2rem', fontWeight:800, fontFamily:"'Baloo 2',cursive", lineHeight:1 }}>
                        {new Date(s.date).getDate()}
                      </div>
                      <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.05em', opacity:0.8 }}>
                        {new Date(s.date).toLocaleDateString('fr-FR', { weekday:'short' })}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.25rem' }}>
                        <span style={{ fontWeight:700, color:'var(--bleu-nuit)', fontSize:'0.95rem' }}>{s.titre}</span>
                        <span style={{ background:st.bg, color:st.text, fontSize:'0.7rem', fontWeight:700, padding:'2px 8px', borderRadius:50 }}>{st.label}</span>
                      </div>
                      {s.activity && (
                        <div style={{ fontSize:'0.78rem', color:'var(--vert-foret)', fontWeight:600, marginBottom:'0.2rem' }}>
                          {s.activity.titre}
                        </div>
                      )}
                      {s.description && (
                        <div style={{ fontSize:'0.83rem', color:'var(--text-muted)', lineHeight:1.5 }}>{s.description}</div>
                      )}
                      <div style={{ display:'flex', gap:'1rem', marginTop:'0.3rem', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                          🕐 {new Date(s.date).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
                        </span>
                        {s.lieu && <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>📍 {s.lieu}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}