import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import './AdminGardes.css'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const JOURS_COURT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Créneaux horaires affichés dans la grille (de 6h à 22h)
const HEURES = Array.from({ length: 15 }, (_, i) => 7 + i) // 7..21

const VIDE = {
  famille: '', enfant: '', nb_enfants: 1,
  type_contrat: 'cesu', agence_nom: '',
  jour_semaine: 1, heure_debut: '08:00', heure_fin: '12:00',
  recurrent: true, semaine_type: 'toutes', date_ponctuelle: '',
  lieu: '', trajet_min: 0, tarif_horaire: 13, statut: 'confirme', notes: '',
}

function dureeH(debut, fin) {
  const [dh, dm] = debut.split(':').map(Number)
  const [fh, fm] = fin.split(':').map(Number)
  let m = (fh * 60 + fm) - (dh * 60 + dm)
  if (m < 0) m += 1440
  return m / 60
}

export default function AdminGardes() {
  const [gardes, setGardes] = useState([])
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState(VIDE)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [semaineVue, setSemaineVue] = useState('complet') // 'communes' | 'paire' | 'impaire' | 'complet'

  const charger = async (sem = semaineVue) => {
    const q = (sem === 'paire' || sem === 'impaire') ? `?semaine=${sem}` : ''
    const [g, s] = await Promise.all([
      axios.get('/api/gardes'),
      axios.get('/api/gardes/stats' + q),
    ])
    setGardes(g.data)
    setStats(s.data)
  }

  useEffect(() => { charger() }, [])
  useEffect(() => { charger(semaineVue) }, [semaineVue])

  const submit = async () => {
    if (!form.famille || !form.heure_debut || !form.heure_fin) {
      alert('Famille, heure de début et heure de fin sont obligatoires.')
      return
    }
    const payload = {
      ...form,
      nb_enfants: parseInt(form.nb_enfants) || 1,
      trajet_min: parseInt(form.trajet_min) || 0,
      tarif_horaire: parseFloat(form.tarif_horaire) || 0,
      jour_semaine: parseInt(form.jour_semaine),
    }
    if (editing) await axios.put(`/api/gardes/${editing}`, payload)
    else await axios.post('/api/gardes', payload)
    setForm(VIDE); setEditing(null); setShowForm(false)
    charger()
  }

  const editer = (g) => {
    setForm({
      ...g,
      heure_debut: g.heure_debut?.slice(0, 5) || '08:00',
      heure_fin: g.heure_fin?.slice(0, 5) || '12:00',
      date_ponctuelle: g.date_ponctuelle || '',
    })
    setEditing(g.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette garde ?')) return
    await axios.delete(`/api/gardes/${id}`)
    charger()
  }

  // une garde est-elle visible dans la semaine affichée ?
  const gardeVisible = (g) => {
    if (semaineVue === 'complet') return true              // tout
    if (semaineVue === 'communes') return g.semaine_type === 'toutes'  // seulement les communes
    // vue 'paire' : communes + paires ; vue 'impaire' : communes + impaires
    if (g.semaine_type === 'toutes') return true
    return g.semaine_type === semaineVue
  }

  // deux gardes peuvent-elles tomber la même semaine ?
  const memeSemainePossible = (a, b) => {
    if (a.semaine_type === 'toutes' || b.semaine_type === 'toutes') return true
    return a.semaine_type === b.semaine_type
  }

  // chevauchement horaire (en minutes)
  const seChevauchent = (a, b) => {
    const min = (t) => { const [h, m] = t.slice(0, 5).split(':').map(Number); return h * 60 + m }
    return a.jour_semaine === b.jour_semaine &&
      min(a.heure_debut) < min(b.heure_fin) &&
      min(b.heure_debut) < min(a.heure_fin)
  }

  // liste des ids de gardes en conflit
  const gardesEnConflit = () => {
    const ids = new Set()
    const actives = gardes.filter(g => g.statut !== 'termine')
    for (let i = 0; i < actives.length; i++) {
      for (let j = i + 1; j < actives.length; j++) {
        const a = actives[i], b = actives[j]
        if (seChevauchent(a, b) && memeSemainePossible(a, b)) {
          ids.add(a.id); ids.add(b.id)
        }
      }
    }
    return ids
  }
  const conflits = gardesEnConflit()

  // position d'une garde dans la grille (top + hauteur en fonction des heures)
  const posGarde = (g) => {
    const [dh, dm] = g.heure_debut.slice(0, 5).split(':').map(Number)
    const [fh, fm] = g.heure_fin.slice(0, 5).split(':').map(Number)
    const debut = dh + dm / 60
    const fin = fh + fm / 60
    const top = (debut - 7) * 46        // 46px par heure
    const height = Math.max((fin - debut) * 46, 30)
    return { top, height }
  }

  return (
    <AdminLayout>
    <div className="ag">
      <div className="ag-head">
        <div>
          <h1>Planning des gardes</h1>
          <p>Vos créneaux de la semaine, vos revenus estimés et vos disponibilités.</p>
        </div>
        <button className="ag-add" onClick={() => { setForm(VIDE); setEditing(null); setShowForm(!showForm) }}>
          {showForm ? 'Fermer' : '+ Ajouter une garde'}
        </button>
      </div>

      {/* STATS */}
      {stats && (
        <div className="ag-stats">
          <div className="ag-stat">
            <span className="ag-stat-v">{stats.heuresSemaine} h</span>
            <span className="ag-stat-l">par semaine</span>
          </div>
          <div className="ag-stat">
            <span className="ag-stat-v">{stats.heuresMois} h</span>
            <span className="ag-stat-l">par mois (est.)</span>
          </div>
          <div className="ag-stat ag-stat--money">
            <span className="ag-stat-v">{stats.revenuSemaine} €</span>
            <span className="ag-stat-l">revenu / semaine</span>
          </div>
          <div className="ag-stat ag-stat--money">
            <span className="ag-stat-v">{stats.revenuMois} €</span>
            <span className="ag-stat-l">revenu / mois (est.)</span>
          </div>
          <div className="ag-stat">
            <span className="ag-stat-v">{stats.heuresCesu} h</span>
            <span className="ag-stat-l">en CESU</span>
          </div>
          <div className="ag-stat">
            <span className="ag-stat-v">{stats.heuresAgence} h</span>
            <span className="ag-stat-l">via agence</span>
          </div>
        </div>
      )}

      {/* FORMULAIRE */}
      {showForm && (
        <div className="ag-form">
          <h3>{editing ? 'Modifier la garde' : 'Nouvelle garde'}</h3>
          <div className="ag-grid2">
            <label>Famille *
              <input value={form.famille} onChange={e => setForm({ ...form, famille: e.target.value })} placeholder="Famille Martin" />
            </label>
            <label>Enfant(s)
              <input value={form.enfant} onChange={e => setForm({ ...form, enfant: e.target.value })} placeholder="Léa, 4 ans" />
            </label>
            <label>Nombre d'enfants
              <input type="number" min="1" value={form.nb_enfants} onChange={e => setForm({ ...form, nb_enfants: e.target.value })} />
            </label>
            <label>Type de contrat
              <select value={form.type_contrat} onChange={e => setForm({ ...form, type_contrat: e.target.value })}>
                <option value="cesu">CESU (direct famille)</option>
                <option value="agence">Agence</option>
              </select>
            </label>
            {form.type_contrat === 'agence' && (
              <label>Nom de l'agence
                <input value={form.agence_nom} onChange={e => setForm({ ...form, agence_nom: e.target.value })} placeholder="Kinougarde, Babychou..." />
              </label>
            )}
            <label>Jour
              <select value={form.jour_semaine} onChange={e => setForm({ ...form, jour_semaine: e.target.value })}>
                {JOURS.map((j, i) => <option key={j} value={i + 1}>{j}</option>)}
              </select>
            </label>
            <label>Heure de début *
              <input type="time" value={form.heure_debut} onChange={e => setForm({ ...form, heure_debut: e.target.value })} />
            </label>
            <label>Heure de fin *
              <input type="time" value={form.heure_fin} onChange={e => setForm({ ...form, heure_fin: e.target.value })} />
            </label>
            <label>Lieu / ville
              <input value={form.lieu} onChange={e => setForm({ ...form, lieu: e.target.value })} placeholder="Thonon-les-Bains" />
            </label>
            <label>Trajet aller (min)
              <input type="number" min="0" value={form.trajet_min} onChange={e => setForm({ ...form, trajet_min: e.target.value })} />
            </label>
            <label>Tarif horaire net (€)
              <input type="number" step="0.5" min="0" value={form.tarif_horaire} onChange={e => setForm({ ...form, tarif_horaire: e.target.value })} />
            </label>
            <label>Statut
              <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
                <option value="confirme">Confirmée</option>
                <option value="pressenti">Pressentie</option>
                <option value="termine">Terminée</option>
              </select>
            </label>
            <label className="ag-check">
              <input type="checkbox" checked={form.recurrent} onChange={e => setForm({ ...form, recurrent: e.target.checked })} />
              Garde récurrente (chaque semaine)
            </label>
            {form.recurrent && (
              <label>Rythme des semaines
                <select value={form.semaine_type} onChange={e => setForm({ ...form, semaine_type: e.target.value })}>
                  <option value="toutes">Toutes les semaines</option>
                  <option value="paire">Semaines paires uniquement</option>
                  <option value="impaire">Semaines impaires uniquement</option>
                </select>
              </label>
            )}
            {!form.recurrent && (
              <label>Date (si ponctuelle)
                <input type="date" value={form.date_ponctuelle} onChange={e => setForm({ ...form, date_ponctuelle: e.target.value })} />
              </label>
            )}
          </div>
          <label className="ag-full">Notes
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows="2" placeholder="Allergie, code portail, habitudes..." />
          </label>
          <div className="ag-form-actions">
            <button className="ag-save" onClick={submit}>{editing ? 'Enregistrer' : 'Ajouter'}</button>
            <button className="ag-cancel" onClick={() => { setShowForm(false); setEditing(null); setForm(VIDE) }}>Annuler</button>
          </div>
        </div>
      )}

      {/* MESSAGE si aucune garde */}
      {gardes.length === 0 && !showForm && (
        <div className="ag-empty">
          <div className="ag-empty-ic">📅</div>
          <h3>Votre planning est vide pour l'instant</h3>
          <p>Ajoutez vos gardes pour visualiser votre semaine, suivre vos revenus et repérer vos créneaux libres.</p>
          <button className="ag-empty-btn" onClick={() => { setForm(VIDE); setEditing(null); setShowForm(true) }}>
            + Ajouter ma première garde
          </button>
        </div>
      )}

      {/* ALERTE CONFLITS */}
      {conflits.size > 0 && (
        <div className="ag-conflit-alert">
          ⚠️ Attention : {conflits.size} garde{conflits.size > 1 ? 's' : ''} en chevauchement d'horaire (repérée{conflits.size > 1 ? 's' : ''} en rouge). Vérifiez que c'est bien voulu — sinon vous ne pouvez pas être à deux endroits en même temps.
        </div>
      )}

      {/* SWITCH SEMAINE PAIRE / IMPAIRE */}
      <div className="ag-switch">
        <span className="ag-switch-lbl">Afficher :</span>
        <div className="ag-switch-btns">
          <button className={semaineVue === 'complet' ? 'on' : ''} onClick={() => setSemaineVue('complet')}>Vue complète</button>
          <button className={semaineVue === 'communes' ? 'on' : ''} onClick={() => setSemaineVue('communes')}>Toutes les semaines</button>
          <button className={semaineVue === 'paire' ? 'on' : ''} onClick={() => setSemaineVue('paire')}>Semaine paire</button>
          <button className={semaineVue === 'impaire' ? 'on' : ''} onClick={() => setSemaineVue('impaire')}>Semaine impaire</button>
        </div>
        <span className="ag-switch-hint">
          {semaineVue === 'complet' && "Toutes vos gardes, paires et impaires confondues."}
          {semaineVue === 'communes' && "Seulement les gardes présentes chaque semaine."}
          {semaineVue === 'paire' && "Ce que vous gardez une semaine paire (communes + paires)."}
          {semaineVue === 'impaire' && "Ce que vous gardez une semaine impaire (communes + impaires)."}
        </span>
      </div>

      {/* GRILLE SEMAINE */}
      <div className="ag-week">
        <div className="ag-week-head">
          <div className="ag-corner"></div>
          {JOURS_COURT.map(j => <div key={j} className="ag-day-head">{j}</div>)}
        </div>
        <div className="ag-week-body">
          <div className="ag-hours">
            {HEURES.map(h => <div key={h} className="ag-hour">{h}h</div>)}
          </div>
          {[1, 2, 3, 4, 5, 6, 7].map(jour => (
            <div key={jour} className="ag-col">
              {HEURES.map(h => <div key={h} className="ag-slot"></div>)}
              {gardes.filter(g => g.jour_semaine === jour && g.statut !== 'termine' && gardeVisible(g)).map(g => {
                const { top, height } = posGarde(g)
                return (
                  <div
                    key={g.id}
                    className={`ag-garde ag-garde--${g.type_contrat} ${g.statut === 'pressenti' ? 'ag-garde--pressenti' : ''} ${conflits.has(g.id) ? 'ag-garde--conflit' : ''}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    onClick={() => editer(g)}
                    title="Cliquer pour modifier"
                  >
                    <b>{conflits.has(g.id) && <span className="ag-warn">⚠</span>}{g.famille}{g.semaine_type === 'paire' && <em className="ag-wk"> P</em>}{g.semaine_type === 'impaire' && <em className="ag-wk"> I</em>}</b>
                    <span>{g.heure_debut.slice(0, 5)}–{g.heure_fin.slice(0, 5)}</span>
                    {g.lieu && <span className="ag-garde-lieu">{g.lieu}</span>}
                    {g.trajet_min > 0 && <span className="ag-garde-trajet">🚗 {g.trajet_min} min</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* LÉGENDE */}
      <div className="ag-legend">
        <span><i className="ag-dot ag-dot--cesu"></i> CESU (direct)</span>
        <span><i className="ag-dot ag-dot--agence"></i> Agence</span>
        <span><i className="ag-dot ag-dot--pressenti"></i> Pressentie</span>
        <span className="ag-legend-tip">💡 Les zones vides = créneaux où tu peux caser une autre garde</span>
      </div>

      {/* LISTE DÉTAILLÉE */}
      {gardes.length > 0 && (
        <div className="ag-list">
          <h3>Toutes les gardes</h3>
          <table>
            <thead>
              <tr>
                <th>Famille</th><th>Jour</th><th>Horaire</th><th>Durée</th>
                <th>Type</th><th>Lieu</th><th>Trajet</th><th>Tarif</th><th></th>
              </tr>
            </thead>
            <tbody>
              {gardes.map(g => (
                <tr key={g.id} className={g.statut === 'termine' ? 'ag-row-done' : ''}>
                  <td><b>{g.famille}</b>{g.enfant && <small> · {g.enfant}</small>}</td>
                  <td>{JOURS[g.jour_semaine - 1]}</td>
                  <td>{g.heure_debut.slice(0, 5)}–{g.heure_fin.slice(0, 5)}</td>
                  <td>{dureeH(g.heure_debut.slice(0, 5), g.heure_fin.slice(0, 5))} h</td>
                  <td>{g.type_contrat === 'cesu' ? 'CESU' : `Agence${g.agence_nom ? ' · ' + g.agence_nom : ''}`}</td>
                  <td>{g.lieu || '—'}</td>
                  <td>{g.trajet_min ? `${g.trajet_min} min` : '—'}</td>
                  <td>{g.tarif_horaire} €/h</td>
                  <td className="ag-actions">
                    <button onClick={() => editer(g)}>✎</button>
                    <button onClick={() => supprimer(g.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminLayout>
  )
}
