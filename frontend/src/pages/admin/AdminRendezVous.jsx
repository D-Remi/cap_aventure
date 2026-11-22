import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import './AdminLegal.css'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const HEURES = Array.from({ length: 27 }, (_, i) => {
  const m = 8 * 60 + i * 30
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
})
const AUJ = new Date().toLocaleDateString('en-CA')
const maj = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const quand = (r) => maj(`${new Date(`${r.date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à ${r.heure.replace(':', ' h ')}`)
const telBrut = (t) => String(t || '').replace(/[^+\d]/g, '')
const waNum = (t) => { const n = telBrut(t); return n.startsWith('+') ? n.slice(1) : n.replace(/^0/, '33') }

export default function AdminRendezVous() {
  const [rdv, setRdv] = useState([])
  const [reg, setReg] = useState(null)
  const [voirPasses, setVoirPasses] = useState(false)
  const [sauve, setSauve] = useState(false)

  const charger = () => {
    axios.get('/api/rendez-vous').then(r => setRdv(r.data || [])).catch(() => toast.error('Rendez-vous indisponibles'))
    axios.get('/api/rendez-vous/reglages').then(r => setReg(r.data)).catch(() => {})
  }
  useEffect(() => { charger() }, [])

  const statut = async (r, s) => {
    if (s === 'annule' && !window.confirm(`Annuler l'appel avec ${r.prenom} ? Un email lui proposera de choisir un autre créneau.`)) return
    try {
      await axios.patch(`/api/rendez-vous/${r.id}`, { statut: s, prevenir: true })
      toast.success(s === 'fait' ? 'Appel marqué comme fait' : s === 'annule' ? 'Appel annulé, la famille est prévenue' : 'Rendez-vous rétabli')
      charger()
    } catch { toast.error('Modification impossible') }
  }

  const basculer = (jour, h) => setReg(r => {
    const liste = r.creneaux[jour] || []
    return { ...r, creneaux: { ...r.creneaux, [jour]: liste.includes(h) ? liste.filter(x => x !== h) : [...liste, h].sort() } }
  })

  const enregistrer = async () => {
    setSauve(true)
    try {
      const { data } = await axios.put('/api/rendez-vous/reglages', reg)
      setReg(data); toast.success('Créneaux enregistrés')
    } catch { toast.error('Enregistrement impossible') } finally { setSauve(false) }
  }

  const copierLien = async () => {
    const lien = `${window.location.origin}/rendez-vous`
    try { await navigator.clipboard.writeText(lien); toast.success('Lien copié : colle-le dans ta bio Instagram ou tes messages') }
    catch { toast(lien) }
  }

  const aVenir = rdv.filter(r => r.statut === 'confirme' && r.date >= AUJ)
  const passes = rdv.filter(r => !(r.statut === 'confirme' && r.date >= AUJ)).reverse()
  const nbCreneaux = reg ? Object.values(reg.creneaux || {}).reduce((n, l) => n + l.length, 0) : 0

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Rendez-vous</h1>
            <p className="admin-page__subtitle">Les familles réservent un appel découverte sur le site. C'est toi qui appelles, à l'heure prévue.</p>
          </div>
        </div>

        <div className="al">
          <div className="al-actions">
            <a className="btn-secondary" href="/rendez-vous" target="_blank" rel="noopener noreferrer">Voir la page publique</a>
            <button className="btn-secondary" onClick={copierLien}>Copier le lien de réservation</button>
          </div>

          <section className="al-card">
            <h2>Appels à venir ({aVenir.length})</h2>
            {aVenir.length === 0 && <p className="al-sub">Aucun appel réservé pour le moment.</p>}
            <div className="al-steps">
              {aVenir.map(r => (
                <div key={r.id} className="al-step" style={{ gridTemplateColumns: '1fr' }}>
                  <div style={{ display: 'grid', gap: '.4rem' }}>
                    <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <b>{quand(r)}</b>
                        <p>{r.prenom} · <a href={`tel:${telBrut(r.telephone)}`}>{r.telephone}</a> · {r.email}
                          {r.residence ? ` · habite en ${r.residence === 'suisse' ? 'Suisse' : 'France'}` : ''}{r.commune ? ` (${r.commune})` : ''}</p>
                      </div>
                      <div className="al-actions">
                        <a className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} href={`https://wa.me/${waNum(r.telephone)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        <button className="btn-primary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => statut(r, 'fait')}>Appel fait</button>
                        <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => statut(r, 'annule')}>Annuler</button>
                      </div>
                    </div>
                    {r.message && <p style={{ whiteSpace: 'pre-wrap', background: '#F4F8F6', borderRadius: 10, padding: '.6rem .8rem' }}>{r.message}</p>}
                  </div>
                </div>
              ))}
            </div>
            {passes.length > 0 && (
              <>
                <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setVoirPasses(v => !v)}>
                  {voirPasses ? 'Masquer' : 'Voir'} les appels passés ou annulés ({passes.length})
                </button>
                {voirPasses && (
                  <div className="al-table-wrap" style={{ marginTop: '.8rem' }}>
                    <table className="al-table">
                      <thead><tr><th>Quand</th><th>Famille</th><th>Statut</th><th /></tr></thead>
                      <tbody>
                        {passes.map(r => (
                          <tr key={r.id}>
                            <td>{quand(r)}</td>
                            <td>{r.prenom} · {r.telephone}</td>
                            <td>{r.statut === 'fait' ? 'Fait' : r.statut === 'annule' ? 'Annulé' : 'Date passée'}</td>
                            <td className="r">{r.statut === 'annule' && r.date >= AUJ && <button className="btn-secondary" style={{ padding: '.3rem .7rem', fontSize: '.78rem' }} onClick={() => statut(r, 'confirme')}>Rétablir</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>

          {reg && (
            <section className="al-card">
              <div className="al-actions" style={{ justifyContent: 'space-between' }}>
                <h2>Mes créneaux d'appel</h2>
                <label className="al-sub" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={!!reg.actif} onChange={e => setReg(r => ({ ...r, actif: e.target.checked }))} />
                  Réservation ouverte sur le site
                </label>
              </div>
              <p className="al-sub">Clique sur les heures où tu peux appeler. Les créneaux qui tombent pendant une garde ou une séance planifiée sont retirés automatiquement, trajet compris. {nbCreneaux} créneau{nbCreneaux > 1 ? 'x' : ''} par semaine.</p>
              <div className="al-grid">
                <label className="al-field"><span>Durée d'un appel (min)</span><input type="number" min={10} max={90} value={reg.duree_min} onChange={e => setReg(r => ({ ...r, duree_min: e.target.value }))} /></label>
                <label className="al-field"><span>Réservable au moins (heures avant)</span><input type="number" min={1} max={168} value={reg.delai_heures} onChange={e => setReg(r => ({ ...r, delai_heures: e.target.value }))} /></label>
                <label className="al-field"><span>Jusqu'à (jours à l'avance)</span><input type="number" min={3} max={60} value={reg.jours_max} onChange={e => setReg(r => ({ ...r, jours_max: e.target.value }))} /></label>
              </div>
              <div style={{ display: 'grid', gap: '.7rem', marginTop: '.6rem' }}>
                {JOURS.map((nom, i) => {
                  const j = String(i + 1)
                  const liste = reg.creneaux?.[j] || []
                  return (
                    <div key={j} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '.6rem', alignItems: 'start' }}>
                      <b style={{ paddingTop: '.3rem' }}>{nom}</b>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                        {HEURES.map(h => {
                          const on = liste.includes(h)
                          return (
                            <button key={h} type="button" onClick={() => basculer(j, h)} aria-pressed={on} style={{
                              padding: '.25rem .45rem', borderRadius: 8, fontSize: '.76rem', fontFamily: 'inherit', cursor: 'pointer',
                              border: `1.5px solid ${on ? '#136F5B' : '#DFE7E3'}`, background: on ? '#136F5B' : '#fff', color: on ? '#fff' : '#34423D', fontWeight: 600,
                            }}>{h}</button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="al-actions" style={{ marginTop: '1rem' }}>
                <button className="btn-primary" onClick={enregistrer} disabled={sauve}>{sauve ? 'Enregistrement…' : 'Enregistrer mes créneaux'}</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
