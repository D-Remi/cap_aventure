import { useState, useEffect } from 'react'
import axios from 'axios'

const TYPES = {
  repit:          { label: 'Relais',          color: '#0e6b6b', bg: '#e6f2f2' },
  accompagnement: { label: 'Accompagnement',  color: '#136f5b', bg: '#e7f2ee' },
  guidance:       { label: 'Guidance',        color: '#5b4b8a', bg: '#eeeaf5' },
}

export default function SuiviTab() {
  const [seances,   setSeances]   = useState([])
  const [objectifs, setObjectifs] = useState([])
  const [stats,     setStats]     = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/seances/mine'),
      axios.get('/api/seances/mine/objectifs'),
      axios.get('/api/seances/mine/stats'),
    ]).then(([s, o, st]) => {
      setSeances(s.data); setObjectifs(o.data); setStats(st.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--soft)' }}>Chargement…</div>

  const realisees = seances.filter(s => s.statut === 'realisee')
  const aVenir    = seances.filter(s => s.statut === 'planifiee')

  return (
    <div className="dash-tab">
      <h2>Suivi de l'accompagnement</h2>
      <p className="dash-subtitle">Les séances réalisées et les objectifs travaillés ensemble.</p>

      {stats && stats.nb_seances > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.9rem', marginBottom: '1.6rem' }}>
          {[
            { l: 'Séances réalisées', v: stats.nb_seances },
            { l: 'Heures ensemble',   v: `${stats.total_heures} h` },
            { l: 'Objectifs suivis',  v: objectifs.length },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: 'var(--gray)', borderRadius: 12, padding: '1.1rem 1.3rem' }}>
              <div style={{ fontSize: '.74rem', color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginBottom: '.3rem' }}>{l}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--s2)', letterSpacing: '-.02em' }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Objectifs */}
      {objectifs.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '.9rem' }}>Ce qu'on travaille ensemble</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {objectifs.map(o => (
              <div key={o.id} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 12, padding: '1.1rem 1.3rem' }}>
                <div style={{ fontWeight: 600, fontSize: '.96rem', marginBottom: '.2rem' }}>{o.titre}</div>
                {o.description && <p style={{ fontSize: '.88rem', color: 'var(--soft)', marginBottom: '.7rem', lineHeight: 1.6 }}>{o.description}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                  <div style={{ flex: 1, height: 7, background: 'var(--gray2)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${o.progression}%`, height: '100%', background: 'var(--s2)', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--s2)' }}>{o.progression}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prochaines séances */}
      {aVenir.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '.9rem' }}>Prochaines séances</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {aVenir.map(s => (
              <div key={s.id} style={{ background: 'var(--s2-light)', borderRadius: 12, padding: '1rem 1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.94rem' }}>{fmt(s.date)}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--soft)' }}>
                    {s.heure_debut?.slice(0,5)}–{s.heure_fin?.slice(0,5)}
                    {s.child ? ` · ${s.child.prenom}` : ''}
                    {s.lieu ? ` · ${s.lieu}` : ''}
                  </div>
                </div>
                <span style={{ background: '#fff', color: 'var(--s2)', padding: '3px 10px', borderRadius: 50, fontSize: '.76rem', fontWeight: 700 }}>À venir</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '.9rem' }}>Historique des séances</h3>
      {realisees.length === 0 ? (
        <div style={{ background: 'var(--gray)', borderRadius: 14, padding: '2.5rem', textAlign: 'center', color: 'var(--soft)' }}>
          Aucune séance réalisée pour le moment.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
          {realisees.map(s => {
            const T = TYPES[s.type] || TYPES.accompagnement
            return (
              <div key={s.id} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 12, padding: '1.1rem 1.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: s.compte_rendu ? '.7rem' : 0 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.94rem' }}>{fmt(s.date)}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--soft)' }}>
                      {s.heure_debut?.slice(0,5)}–{s.heure_fin?.slice(0,5)}
                      {s.duree_heures ? ` · ${s.duree_heures} h` : ''}
                      {s.child ? ` · ${s.child.prenom}` : ''}
                    </div>
                  </div>
                  <span style={{ background: T.bg, color: T.color, padding: '3px 10px', borderRadius: 50, fontSize: '.74rem', fontWeight: 700 }}>{T.label}</span>
                </div>
                {s.compte_rendu && (
                  <div style={{ background: 'var(--gray)', borderRadius: 8, padding: '.8rem .95rem', fontSize: '.89rem', lineHeight: 1.65 }}>
                    {s.compte_rendu}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
