import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminAttendance() {
  const [activities, setActivities] = useState([])
  const [selected, setSelected]     = useState(null) // activité choisie
  const [sessionDate, setSessionDate] = useState('') // date de séance choisie
  const [registrations, setRegs]    = useState([])
  const [regDates, setRegDates]     = useState({}) // regId → dates choisies
  const [loading, setLoading]       = useState(false)
  const [saving, setSaving]         = useState({})

  useEffect(() => {
    axios.get('/api/activities?all=true').then(r => setActivities(r.data))
  }, [])

  const loadActivity = async (act) => {
    setSelected(act)
    setSessionDate('')
    setRegs([])
    setRegDates({})
  }

  const loadSession = async (date) => {
    if (!selected || !date) return
    setSessionDate(date)
    setLoading(true)
    try {
      // Charger toutes les inscriptions de cette activité
      const { data: regs } = await axios.get(`/api/registrations/activity/${selected.id}`)
      setRegs(regs.filter(r => r.status !== 'cancelled'))

      // Charger les dates choisies pour chaque inscription
      const datesMap = {}
      await Promise.all(regs.map(async r => {
        try {
          const { data } = await axios.get(`/api/registration-dates/${r.id}`)
          datesMap[r.id] = data
        } catch { datesMap[r.id] = [] }
      }))
      setRegDates(datesMap)
    } finally { setLoading(false) }
  }

  // Vérifier si un enfant a cette date dans ses dates choisies
  const hasThisDate = (regId, dateStr) => {
    const dates = regDates[regId] || []
    return dates.some(d => {
      const a = new Date(d.date), b = new Date(dateStr)
      return a.toDateString() === b.toDateString()
    })
  }

  // Trouver l'id de la date dans registration_dates
  const getDateEntry = (regId, dateStr) => {
    return (regDates[regId] || []).find(d => {
      const a = new Date(d.date), b = new Date(dateStr)
      return a.toDateString() === b.toDateString()
    })
  }

  const toggleAttendance = async (reg, dateStr) => {
    const entry = getDateEntry(reg.id, dateStr)
    if (!entry) return
    setSaving(prev => ({ ...prev, [reg.id]: true }))
    try {
      await axios.patch(`/api/registration-dates/${entry.id}/attended`, {
        attended: !entry.attended,
      })
      setRegDates(prev => ({
        ...prev,
        [reg.id]: prev[reg.id].map(d => d.id === entry.id ? { ...d, attended: !d.attended } : d),
      }))
    } finally { setSaving(prev => ({ ...prev, [reg.id]: false })) }
  }

  // Dates disponibles pour la séance (issues de l'activité)
  const availableDates = selected?.dates || []

  // Inscrits pour cette date (ceux qui l'ont choisie)
  const presentForDate = sessionDate
    ? registrations.filter(r => hasThisDate(r.id, sessionDate))
    : []

  const handlePrint = () => {
    if (!selected || !sessionDate) return
    const rows = presentForDate.map(r => `
      <tr>
        <td>${r.child?.prenom} ${r.child?.nom}</td>
        <td>${r.child?.user?.prenom} ${r.child?.user?.nom}</td>
        <td>${r.child?.user?.email || ''}</td>
        <td style="text-align:center">${getDateEntry(r.id, sessionDate)?.attended ? '✓' : '☐'}</td>
      </tr>
    `).join('')
    const html = `
      <html><head><meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; }
        h1 { font-size: 1.3rem; margin-bottom: 0.25rem; }
        p { color: #666; margin-bottom: 1.5rem; font-size: 0.9rem; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #0d2c4a; color: white; padding: 0.6rem 0.9rem; text-align: left; font-size: 0.85rem; }
        td { padding: 0.5rem 0.9rem; border-bottom: 1px solid #ddd; font-size: 0.85rem; }
        tr:nth-child(even) td { background: #f9f9f9; }
        .footer { margin-top: 2rem; font-size: 0.8rem; color: #999; }
      </style></head><body>
      <h1>Liste de présence — ${selected.titre}</h1>
      <p>Séance du ${new Date(sessionDate).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
      <table>
        <thead><tr><th>Enfant</th><th>Parent</th><th>Email parent</th><th>Présent(e)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="footer">CapAventure — Thonon-les-Bains · Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
      </body></html>
    `
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    w.print()
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>✅ Liste de présence</h1>
            <p>Marquez les présences séance par séance</p>
          </div>
          {sessionDate && presentForDate.length > 0 && (
            <button className="btn-primary" onClick={handlePrint}>🖨️ Imprimer</button>
          )}
        </div>

        {/* Sélecteur activité */}
        <div className="admin-table-wrap" style={{ marginBottom:'1.5rem' }}>
          <div className="admin-table-wrap__header"><h2>Choisir une activité</h2></div>
          <div style={{ padding:'1.25rem', display:'flex', flexWrap:'wrap', gap:'0.65rem' }}>
            {activities
              .filter(a => a.schedule_type === 'multi_dates' || a.schedule_type === 'recurrente')
              .map(a => (
                <button
                  key={a.id}
                  onClick={() => loadActivity(a)}
                  style={{
                    padding:'0.5rem 1.1rem', borderRadius:50,
                    border: `2px solid ${selected?.id === a.id ? 'var(--vert-clair)' : '#dde8e1'}`,
                    background: selected?.id === a.id ? '#e8f5ed' : 'var(--blanc)',
                    fontWeight:700, fontSize:'0.85rem', cursor:'pointer',
                    color: selected?.id === a.id ? 'var(--vert-foret)' : 'var(--text-muted)',
                    transition:'all 0.18s',
                  }}
                >
                  {a.titre}
                </button>
              ))
            }
          </div>
        </div>

        {/* Sélecteur de date de séance */}
        {selected && (
          <div className="admin-table-wrap" style={{ marginBottom:'1.5rem' }}>
            <div className="admin-table-wrap__header"><h2>Choisir une séance</h2></div>
            <div style={{ padding:'1.25rem', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {(selected.dates || [])
                .map(d => new Date(d))
                .sort((a, b) => a - b)
                .map(d => {
                  const iso = d.toISOString()
                  const isSelected = sessionDate === iso
                  return (
                    <button
                      key={iso}
                      onClick={() => loadSession(iso)}
                      style={{
                        padding:'0.4rem 0.85rem', borderRadius:8,
                        border: `2px solid ${isSelected ? 'var(--vert-clair)' : '#dde8e1'}`,
                        background: isSelected ? '#e8f5ed' : 'var(--blanc)',
                        fontWeight:700, fontSize:'0.78rem', cursor:'pointer',
                        color: isSelected ? 'var(--vert-foret)' : 'var(--text-muted)',
                        transition:'all 0.18s',
                      }}
                    >
                      {d.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })}
                    </button>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* Liste de présence */}
        {sessionDate && (
          <div className="admin-table-wrap">
            <div className="admin-table-wrap__header">
              <h2>
                Séance du {new Date(sessionDate).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                {' '}— {presentForDate.length} inscrit{presentForDate.length > 1 ? 's' : ''}
              </h2>
            </div>

            {loading ? (
              <div className="admin-loading">Chargement...</div>
            ) : presentForDate.length === 0 ? (
              <div className="admin-empty">
                <span>📋</span>
                Aucun enfant n'a sélectionné cette date
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Enfant</th>
                    <th>Âge</th>
                    <th>Parent</th>
                    <th>Téléphone</th>
                    <th>Allergie</th>
                    <th style={{ textAlign:'center' }}>Présent(e)</th>
                  </tr>
                </thead>
                <tbody>
                  {presentForDate.map(r => {
                    const entry = getDateEntry(r.id, sessionDate)
                    const isPresent = entry?.attended || false
                    const age = r.child?.date_naissance
                      ? Math.floor((new Date() - new Date(r.child.date_naissance)) / (365.25 * 24 * 3600 * 1000))
                      : '—'
                    return (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.child?.prenom} {r.child?.nom}</strong>
                          {r.child?.infos_medicales && (
                            <div style={{ fontSize:'0.75rem', color:'#dc2626', marginTop:'0.15rem' }}>
                              ⚠️ {r.child.infos_medicales}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize:'0.85rem' }}>{age} ans</td>
                        <td style={{ fontSize:'0.85rem' }}>
                          {r.child?.user?.prenom} {r.child?.user?.nom}
                          <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{r.child?.user?.email}</div>
                        </td>
                        <td style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
                          {r.child?.user?.telephone || '—'}
                        </td>
                        <td style={{ fontSize:'0.82rem', color: r.child?.allergie ? '#dc2626' : 'var(--text-muted)' }}>
                          {r.child?.allergie || '—'}
                        </td>
                        <td style={{ textAlign:'center' }}>
                          <button
                            onClick={() => entry && toggleAttendance(r, sessionDate)}
                            disabled={!entry || saving[r.id]}
                            style={{
                              width: 38, height: 38,
                              borderRadius: 8,
                              border: `2px solid ${isPresent ? 'var(--vert-clair)' : '#dde8e1'}`,
                              background: isPresent ? '#e8f5ed' : 'var(--blanc)',
                              fontSize: '1.2rem',
                              cursor: entry ? 'pointer' : 'not-allowed',
                              transition: 'all 0.18s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              margin: 'auto',
                            }}
                            title={entry ? (isPresent ? 'Marquer absent' : 'Marquer présent') : 'Date non sélectionnée'}
                          >
                            {saving[r.id] ? '⏳' : isPresent ? '✅' : '☐'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
