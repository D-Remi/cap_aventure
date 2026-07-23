import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const TYPES = {
  repit:          { label: 'Répit',          color: '#0e6b6b' },
  accompagnement: { label: 'Accompagnement', color: '#136f5b' },
  guidance:       { label: 'Guidance',       color: '#5b4b8a' },
}

export default function AdminStats() {
  const [seances, setSeances] = useState([])
  const [familles, setFamilles] = useState([])
  const [annee, setAnnee] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/seances').catch(() => ({ data: [] })),
      axios.get('/api/users').catch(() => ({ data: [] })),
    ]).then(([s, u]) => {
      setSeances(s.data)
      setFamilles(u.data.filter(x => x.role !== 'admin'))
    }).finally(() => setLoading(false))
  }, [])

  const realisees = seances.filter(s => s.statut === 'realisee' && s.date?.startsWith(String(annee)))

  // Par mois
  const parMois = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    const list = realisees.filter(s => s.date?.slice(5, 7) === m)
    return {
      mois: MOIS[i],
      nb: list.length,
      heures: +list.reduce((sum, s) => sum + parseFloat(s.duree_heures || 0), 0).toFixed(1),
      ca: +list.reduce((sum, s) => sum + parseFloat(s.montant || 0), 0).toFixed(2),
    }
  })
  const maxH = Math.max(...parMois.map(m => m.heures), 1)

  // Par type
  const parType = Object.keys(TYPES).map(t => {
    const list = realisees.filter(s => s.type === t)
    return {
      type: t,
      nb: list.length,
      heures: +list.reduce((sum, s) => sum + parseFloat(s.duree_heures || 0), 0).toFixed(1),
    }
  })

  const totalHeures = +realisees.reduce((s, x) => s + parseFloat(x.duree_heures || 0), 0).toFixed(1)
  const totalCA     = +realisees.reduce((s, x) => s + parseFloat(x.montant || 0), 0).toFixed(2)

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Statistiques</h1>
            <p className="admin-page__subtitle">Activité de l'année {annee}</p>
          </div>
          <select value={annee} onChange={e => setAnnee(+e.target.value)}
            style={{ padding: '.5rem .9rem', border: '1.5px solid var(--line)', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600 }}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {loading ? <div className="admin-loading">Chargement…</div> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { l: 'Séances réalisées', v: realisees.length },
                { l: 'Heures totales',    v: `${totalHeures} h` },
                { l: 'Familles suivies',  v: familles.length },
                { l: "Chiffre d'affaires", v: `${totalCA.toFixed(2)} €` },
              ].map(({ l, v }) => (
                <div key={l} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 14, padding: '1.3rem 1.5rem' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginBottom: '.4rem' }}>{l}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--s2)', letterSpacing: '-.03em', lineHeight: 1 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Graphique heures par mois */}
            <div style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, padding: '1.6rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.3rem' }}>Heures d'accompagnement par mois</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '.5rem', alignItems: 'end', height: 150 }}>
                {parMois.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: '.7rem', color: 'var(--soft)', fontWeight: 600 }}>
                      {m.heures > 0 ? m.heures : ''}
                    </span>
                    <div style={{
                      width: '100%', maxWidth: 28,
                      height: `${(m.heures / maxH) * 110}px`,
                      minHeight: m.heures > 0 ? 4 : 0,
                      background: 'var(--s2)', borderRadius: '4px 4px 0 0',
                      transition: 'height .4s',
                    }} />
                    <span style={{ fontSize: '.7rem', color: 'var(--soft)' }}>{m.mois}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition par type */}
            <div style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, padding: '1.6rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.3rem' }}>Répartition par type de prestation</h3>
              {parType.map(({ type, nb, heures }) => {
                const pct = realisees.length ? (nb / realisees.length) * 100 : 0
                return (
                  <div key={type} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem', fontSize: '.9rem' }}>
                      <span style={{ fontWeight: 600 }}>{TYPES[type].label}</span>
                      <span style={{ color: 'var(--soft)' }}>{nb} séance{nb > 1 ? 's' : ''} · {heures} h</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--gray2)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: TYPES[type].color, borderRadius: 4, transition: 'width .5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
