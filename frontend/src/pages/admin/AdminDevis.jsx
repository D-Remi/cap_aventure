import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'
import { genererDevisPDF, chargerEntreprise } from '../../utils/pdfGenerator'
import './AdminLegal.css'

const dans = (jours) => new Date(Date.now() + jours * 86400000).toISOString().slice(0, 10)
const numero = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `DEV-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
}

// Modèles repris de la grille tarifaire du site
const MODELES = {
  souffle: { description: 'Souffle : garde à domicile, créneau hebdomadaire (4 h par semaine)', heures: '17.3', prix: '40' },
  relais: { description: 'Relais : garde ponctuelle à domicile', heures: '3', prix: '45' },
  journee: { description: 'Journée répit (8 h)', heures: '8', prix: '42.5' },
}

export default function AdminDevis() {
  const [familles, setFamilles] = useState([])
  const [d, setD] = useState({
    numero: numero(), date: dans(0), validite: dans(30),
    client_nom: '', client_adresse: '', lieu: '',
    periodicite: 'par mois', frais_deplacement: '0', notes: '',
    lignes: [{ ...MODELES.souffle }],
  })

  useEffect(() => {
    axios.get('/api/users').then(r => setFamilles((r.data || []).filter(u => u.role === 'parent'))).catch(() => {})
  }, [])

  const set = (k, v) => setD(s => ({ ...s, [k]: v }))
  const setLigne = (i, k, v) => setD(s => ({ ...s, lignes: s.lignes.map((l, j) => j === i ? { ...l, [k]: v } : l) }))

  const choisirFamille = (id) => {
    const u = familles.find(x => String(x.id) === id)
    if (!u) return
    const adr = [u.adresse, [u.code_postal, u.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ')
    setD(s => ({ ...s, client_nom: `${u.prenom} ${u.nom}`, client_adresse: adr, lieu: s.lieu || adr }))
  }

  const total = d.lignes.reduce((s, l) => s + (parseFloat(l.heures) || 0) * (parseFloat(l.prix) || 0), 0) + (parseFloat(d.frais_deplacement) || 0)

  const generer = async () => {
    const ent = await chargerEntreprise()
    genererDevisPDF(d, ent)
    setD(s => ({ ...s, numero: numero() }))
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>Devis</h1>
            <p className="admin-page__subtitle">Obligatoire et gratuit dès 100 € TTC de prestations par mois, ou si la famille le demande (arrêté du 17 mars 2015). Garde une copie au moins un an.</p>
          </div>
        </div>

        <div className="al">
          <section className="al-card">
            <h2>Client et intervention</h2>
            <div className="al-grid">
              <label className="al-field"><span>Famille inscrite</span>
                <select defaultValue="" onChange={e => choisirFamille(e.target.value)}>
                  <option value="">Choisir (ou remplir à la main)</option>
                  {familles.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                </select>
              </label>
              <label className="al-field"><span>Nom du client</span><input value={d.client_nom} onChange={e => set('client_nom', e.target.value)} /></label>
              <label className="al-field"><span>Adresse du client</span><input value={d.client_adresse} onChange={e => set('client_adresse', e.target.value)} /></label>
              <label className="al-field"><span>Lieu d'intervention</span><input value={d.lieu} onChange={e => set('lieu', e.target.value)} /><small>Adresse ou zone indiquée par le client</small></label>
              <label className="al-field"><span>Date du devis</span><input type="date" value={d.date} onChange={e => set('date', e.target.value)} /></label>
              <label className="al-field"><span>Valable jusqu'au</span><input type="date" value={d.validite} onChange={e => set('validite', e.target.value)} /></label>
            </div>
          </section>

          <section className="al-card">
            <div className="al-actions" style={{ justifyContent: 'space-between' }}>
              <h2>Prestations</h2>
              <div className="al-actions">
                {Object.entries(MODELES).map(([k, m]) => (
                  <button key={k} className="btn-secondary" style={{ padding: '.35rem .8rem', fontSize: '.8rem' }}
                    onClick={() => setD(s => ({ ...s, lignes: [...s.lignes, { ...m }] }))}>+ {m.description.split(' :')[0].split(' (')[0]}</button>
                ))}
              </div>
            </div>
            <label className="al-field" style={{ maxWidth: 260 }}><span>Les quantités sont</span>
              <select value={d.periodicite} onChange={e => set('periodicite', e.target.value)}>
                <option value="par mois">par mois</option>
                <option value="par semaine">par semaine</option>
                <option value="au total">au total</option>
              </select>
            </label>
            <div className="al-lines">
              {d.lignes.map((l, i) => (
                <div className="al-line" key={i}>
                  <label className="al-field"><span>Description</span><input value={l.description} onChange={e => setLigne(i, 'description', e.target.value)} /></label>
                  <label className="al-field"><span>Heures</span><input type="number" step="0.5" value={l.heures} onChange={e => setLigne(i, 'heures', e.target.value)} /></label>
                  <label className="al-field"><span>Prix horaire TTC</span><input type="number" step="0.5" value={l.prix} onChange={e => setLigne(i, 'prix', e.target.value)} /></label>
                  <button className="btn-secondary" style={{ padding: '.5rem .7rem' }} aria-label="Supprimer la ligne"
                    onClick={() => setD(s => ({ ...s, lignes: s.lignes.filter((_, j) => j !== i) }))}>Retirer</button>
                </div>
              ))}
            </div>
            <div className="al-grid">
              <label className="al-field"><span>Frais de déplacement (€)</span><input type="number" step="0.5" value={d.frais_deplacement} onChange={e => set('frais_deplacement', e.target.value)} /><small>Au-delà de 20 km autour de Thonon, ou forfait stations</small></label>
              <label className="al-field"><span>Remarques</span><input value={d.notes} onChange={e => set('notes', e.target.value)} placeholder="Ex. créneau le mercredi 13 h 30 - 17 h 30" /></label>
            </div>
            <div className="al-actions" style={{ justifyContent: 'space-between' }}>
              <b style={{ fontSize: '1.1rem', color: '#0B2A22' }}>Total {d.periodicite} : {total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € TTC</b>
              <button className="btn-primary" onClick={generer} disabled={!d.client_nom || d.lignes.length === 0}>Générer le devis PDF</button>
            </div>
            {d.periodicite === 'par mois' && total < 100 && <p className="al-sub">Moins de 100 € par mois : le devis n'est obligatoire que si la famille le demande.</p>}
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}
