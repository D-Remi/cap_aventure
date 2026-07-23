import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminDashboard() {
  const [data, setData] = useState({
    familles: 0, enfants: 0, seances: 0, heures: 0,
    demandes: 0, prochaines: [], recentes: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/users').catch(() => ({ data: [] })),
      axios.get('/api/children').catch(() => ({ data: [] })),
      axios.get('/api/seances').catch(() => ({ data: [] })),
      axios.get('/api/contact').catch(() => ({ data: [] })),
    ]).then(([u, c, s, ct]) => {
      const familles = u.data.filter(x => x.role !== 'admin')
      const seances  = s.data
      const realisees = seances.filter(x => x.statut === 'realisee')
      const heures = realisees.reduce((sum, x) => sum + parseFloat(x.duree_heures || 0), 0)
      const today = new Date().toISOString().slice(0, 10)

      setData({
        familles: familles.length,
        enfants:  c.data.length,
        seances:  realisees.length,
        heures:   +heures.toFixed(1),
        demandes: ct.data.filter(x => !x.traite).length,
        prochaines: seances
          .filter(x => x.statut === 'planifiee' && x.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 5),
        recentes: realisees
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5),
      })
    }).finally(() => setLoading(false))
  }, [])

  const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : ''

  const CARDS = [
    { label: 'Familles suivies',   value: data.familles },
    { label: 'Enfants',            value: data.enfants },
    { label: 'Séances réalisées',  value: data.seances },
    { label: "Heures d'accompagnement", value: `${data.heures} h` },
  ]

  const LINKS = [
    { to: '/admin/seances',   label: 'Suivi & séances',   desc: 'Comptes-rendus et objectifs' },
    { to: '/admin/contacts',  label: 'Demandes reçues',   desc: `${data.demandes} en attente` },
    { to: '/admin/children',  label: 'Dossiers enfants',  desc: 'Profils et besoins' },
    { to: '/admin/compta',    label: 'Comptabilité',      desc: 'Recettes et dépenses' },
  ]

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Tableau de bord</h1>
            <p className="admin-page__subtitle">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {loading ? <div className="admin-loading">Chargement…</div> : (
          <>
            {/* Chiffres clés */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {CARDS.map(({ label, value }) => (
                <div key={label} style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 14, padding: '1.3rem 1.5rem' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600, marginBottom: '.4rem' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--s2)', letterSpacing: '-.03em', lineHeight: 1 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Accès rapides */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {LINKS.map(({ to, label, desc }) => (
                <Link key={to} to={to} style={{
                  background: 'var(--gray)', borderRadius: 14, padding: '1.2rem 1.4rem',
                  border: '1.5px solid transparent', transition: 'all .2s', display: 'block',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '.98rem', marginBottom: '.2rem' }}>{label}</div>
                  <div style={{ fontSize: '.83rem', color: 'var(--soft)' }}>{desc}</div>
                </Link>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem' }}>
              {/* Prochaines séances */}
              <div style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Prochaines séances</h3>
                {data.prochaines.length === 0 ? (
                  <p style={{ color: 'var(--soft)', fontSize: '.9rem' }}>Aucune séance planifiée.</p>
                ) : data.prochaines.map(s => (
                  <div key={s.id} style={{ padding: '.7rem 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{fmt(s.date)}</div>
                      <div style={{ fontSize: '.8rem', color: 'var(--soft)' }}>
                        {s.user?.prenom} {s.user?.nom}{s.child ? ` · ${s.child.prenom}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: '.8rem', color: 'var(--soft)', whiteSpace: 'nowrap' }}>
                      {s.heure_debut?.slice(0,5)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Séances récentes */}
              <div style={{ background: '#fff', border: '1.5px solid var(--line)', borderRadius: 16, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Dernières séances réalisées</h3>
                {data.recentes.length === 0 ? (
                  <p style={{ color: 'var(--soft)', fontSize: '.9rem' }}>Aucune séance enregistrée.</p>
                ) : data.recentes.map(s => (
                  <div key={s.id} style={{ padding: '.7rem 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{fmt(s.date)}</div>
                      <div style={{ fontSize: '.8rem', color: 'var(--soft)' }}>
                        {s.user?.prenom} {s.user?.nom}
                      </div>
                    </div>
                    <span style={{ fontSize: '.8rem', color: 'var(--s2)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {s.duree_heures} h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
