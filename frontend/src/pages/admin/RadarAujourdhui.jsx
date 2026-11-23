import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import useEntreprise from '../../hooks/useEntreprise'
import { plaquetteProfessionnels, plaquetteFamilles } from '../../utils/plaquette'
import { score, debutSemaine, CANDIDATURE, OBJECTIF_DEFAUT, SOURCES, CLIENTS_RAPIDES } from './radarProspection'

const AUJ = new Date().toLocaleDateString('en-CA')
const CLE_OBJECTIF = 'ev-objectif-semaine'
const lireObjectif = () => { try { return parseInt(localStorage.getItem(CLE_OBJECTIF), 10) || OBJECTIF_DEFAUT } catch { return OBJECTIF_DEFAUT } }
const ETAPES = [['a_contacter', 'À contacter'], ['contacte', 'Contactés'], ['rdv', 'Rendez-vous'], ['partenaire', 'Partenaires'], ['client', 'Clients']]

function Ligne({ p, onContacter, etiquette }) {
  return (
    <div className="al-step" style={{ gridTemplateColumns: '1fr' }}>
      <div className="al-actions" style={{ justifyContent: 'space-between' }}>
        <div>
          <b>{p.nom}</b>
          <p>{[p.categorie || (p.type === 'famille' ? 'Famille' : null), p.ville, p.telephone].filter(Boolean).join(' · ')}</p>
        </div>
        <div className="al-actions">
          {etiquette}
          <button className="btn-primary" style={{ padding: '.35rem .8rem', fontSize: '.8rem' }} onClick={() => onContacter(p)}>Contacter</button>
        </div>
      </div>
    </div>
  )
}

// Tableau de bord de la prospection : objectif, relances, contacts prioritaires, d'où viennent les demandes
export default function RadarAujourdhui({ prospects, onContacter, onOnglet }) {
  const ent = useEntreprise()
  const [objectif, setObjectif] = useState(lireObjectif)
  const [demandes, setDemandes] = useState({ contacts: [], rdv: [] })

  useEffect(() => {
    Promise.all([
      axios.get('/api/contact').then(r => r.data || []).catch(() => []),
      axios.get('/api/rendez-vous').then(r => r.data || []).catch(() => []),
    ]).then(([contacts, rdv]) => setDemandes({ contacts, rdv }))
  }, [])

  const changerObjectif = (n) => {
    const v = Math.max(1, Math.min(100, Number(n) || OBJECTIF_DEFAUT))
    setObjectif(v)
    try { localStorage.setItem(CLE_OBJECTIF, String(v)) } catch { /* navigation privée */ }
  }

  const clients = prospects.filter(p => p.categorie !== CANDIDATURE)
  const lundi = debutSemaine()
  const faitsSemaine = clients.filter(p => p.dernier_contact && p.dernier_contact >= lundi).length
  const relances = prospects.filter(p => p.relance && p.relance <= AUJ && !['client', 'partenaire', 'sans_suite'].includes(p.statut))
  const priorites = clients.filter(p => score(p) >= 0).sort((a, b) => score(b) - score(a)).slice(0, 6)
  const rdvAVenir = demandes.rdv.filter(r => r.statut === 'confirme' && r.date >= AUJ).length
  const pct = Math.min(100, Math.round((faitsSemaine / objectif) * 100))

  // D'où viennent les demandes des 90 derniers jours
  const depuis = new Date(Date.now() - 90 * 864e5)
  const recentes = [
    ...demandes.contacts.filter(c => !c.spam && new Date(c.created_at) >= depuis),
    ...demandes.rdv.filter(r => new Date(r.created_at) >= depuis),
  ]
  const parSource = {}
  recentes.forEach(d => { const k = d.source || 'inconnue'; parSource[k] = (parSource[k] || 0) + 1 })
  const sources = Object.entries(parSource).sort((a, b) => b[1] - a[1])
  const maxSource = Math.max(1, ...sources.map(s => s[1]))

  const telecharger = (f) => { try { f(ent) } catch { toast.error('Plaquette impossible à générer') } }

  return (
    <>
      <section className="al-card">
        <h2>Ma prospection de la semaine</h2>
        <div className="al-stats">
          <div className="al-stat"><span>Contacts cette semaine</span><b>{faitsSemaine} / {objectif}</b></div>
          <div className="al-stat"><span>Relances à faire</span><b>{relances.length}</b></div>
          <div className="al-stat"><span>Appels réservés à venir</span><b>{rdvAVenir}</b></div>
          <div className="al-stat"><span>Demandes reçues (90 j)</span><b>{recentes.length}</b></div>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: '#EEF4F1', overflow: 'hidden', marginTop: '.4rem' }} aria-label={`Objectif de la semaine atteint à ${pct} %`}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#C8F169' : '#136F5B', transition: 'width .3s' }} />
        </div>
        <div className="al-actions" style={{ marginTop: '.6rem' }}>
          <label className="al-sub" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Objectif : <input type="number" min={1} max={100} value={objectif} onChange={e => changerObjectif(e.target.value)} style={{ width: 64, padding: '.3rem', borderRadius: 8, border: '1px solid #DFE7E3', fontFamily: 'inherit' }} /> contacts par semaine
          </label>
          <span className="al-sub">Dix contacts par semaine (emails, appels, plaquettes déposées) suffisent en général pour décrocher les premiers clients en quelques semaines.</span>
        </div>
        <div className="al-actions" style={{ marginTop: '.4rem' }}>
          {ETAPES.map(([k, l]) => (
            <span key={k} className="al-pill al-pill--todo">{l} : {clients.filter(p => p.statut === k).length}</span>
          ))}
        </div>
      </section>

      <section className="al-card">
        <h2>Relances du jour ({relances.length})</h2>
        {relances.length === 0 && <p className="al-sub">Aucune relance aujourd'hui.</p>}
        <div className="al-steps">
          {relances.map(p => <Ligne key={p.id} p={p} onContacter={onContacter} etiquette={<span className="al-pill al-pill--wait">Relance prévue le {new Date(`${p.relance}T12:00:00`).toLocaleDateString('fr-FR')}</span>} />)}
        </div>
      </section>

      <section className="al-card">
        <h2>À contacter en priorité</h2>
        <p className="al-sub">Classés selon leurs chances de t'envoyer des familles vite : annonces de parents, rééducateurs, IME, SESSAD et CAMSP d'abord, contacts du cœur du Chablais et coordonnées connues en premier.</p>
        {priorites.length === 0 && (
          <div className="al-actions">
            <span className="al-sub">Plus personne à contacter dans ton suivi.</span>
            <button className="btn-secondary" onClick={() => onOnglet('prescripteurs')}>Trouver des prescripteurs</button>
            <button className="btn-secondary" onClick={() => onOnglet('annonces')}>Voir les annonces de familles</button>
          </div>
        )}
        <div className="al-steps">
          {priorites.map(p => <Ligne key={p.id} p={p} onContacter={onContacter} etiquette={p.type === 'famille' ? <span className="al-pill al-pill--ok">Famille</span> : null} />)}
        </div>
      </section>

      <section className="al-card">
        <h2>Plaquettes à imprimer ou à joindre</h2>
        <p className="al-sub">Une page A4 avec tes coordonnées, le lien de réservation et les mentions légales. Imprime-la pour les salles d'attente, les pharmacies et les crèches, ou joins-la à tes emails.</p>
        <div className="al-actions">
          <button className="btn-primary" onClick={() => telecharger(plaquetteProfessionnels)}>Plaquette pour les professionnels</button>
          <button className="btn-secondary" onClick={() => telecharger(plaquetteFamilles)}>Plaquette pour les familles</button>
        </div>
        {!ent.siret && <p className="al-sub">Renseigne ton SIRET et ton numéro SAP dans « Mon entreprise & obligations » : ils s'afficheront en bas des plaquettes.</p>}
      </section>

      <section className="al-card">
        <h2>D'où viennent tes demandes</h2>
        <p className="al-sub">Réponses à « Comment m'avez-vous connu ? » sur le formulaire de contact et la réservation d'appel, sur les 90 derniers jours. Mets ton énergie là où ça marche.</p>
        {sources.length === 0 && <p className="al-sub">Pas encore de demande avec cette information.</p>}
        <div style={{ display: 'grid', gap: '.45rem' }}>
          {sources.map(([k, n]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 36px', gap: '.6rem', alignItems: 'center' }}>
              <span>{SOURCES[k] || 'Non renseigné'}</span>
              <div style={{ height: 12, borderRadius: 99, background: '#EEF4F1' }}><div style={{ width: `${(n / maxSource) * 100}%`, height: '100%', borderRadius: 99, background: '#136F5B' }} /></div>
              <b style={{ textAlign: 'right' }}>{n}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="al-card">
        <h2>Des clients rapidement : les pistes</h2>
        <div className="al-steps">
          {CLIENTS_RAPIDES.map(c => (
            <div key={c.t} className="al-step" style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <b>{c.t}</b>
                <p>{c.d}</p>
                {c.lien && <a href={c.lien} target="_blank" rel="noopener noreferrer">Ouvrir</a>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
