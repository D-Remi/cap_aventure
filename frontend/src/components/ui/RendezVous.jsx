import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import ChampPiege from './ChampPiege'
import { waLink, TEL_AFFICHE, TEL_LIEN, IconeWhatsApp } from '../../data/contact'
import './RendezVous.css'

const maj = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const jourCourt = (d) => maj(new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }))
const jourLong = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const heureFr = (h) => h.replace(':', ' h ')

// Réservation d'un appel découverte : 1. le créneau, 2. les coordonnées, 3. la confirmation
export default function RendezVous({ onFermer }) {
  const [dispo, setDispo] = useState(null)
  const [erreur, setErreur] = useState(false)
  const [jour, setJour] = useState('')
  const [heure, setHeure] = useState('')
  const [etape, setEtape] = useState(1)
  const [f, setF] = useState({ prenom: '', telephone: '', email: '', residence: '', commune: '', message: '' })
  const [piege, setPiege] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [fait, setFait] = useState(null)
  const debut = useRef(Date.now())

  const charger = () => {
    setErreur(false)
    axios.get('/api/rendez-vous/creneaux')
      .then(r => {
        setDispo(r.data)
        if (r.data.jours?.length) setJour(j => r.data.jours.some(x => x.date === j) ? j : r.data.jours[0].date)
      })
      .catch(() => setErreur(true))
  }
  useEffect(() => { charger() }, [])

  const set = (k, v) => setF(s => ({ ...s, [k]: v }))
  const heures = dispo?.jours?.find(j => j.date === jour)?.creneaux || []

  const reserver = async (e) => {
    e.preventDefault()
    if (!f.prenom.trim() || !f.telephone.trim() || !f.email.trim()) { toast.error('Prénom, téléphone et email sont nécessaires'); return }
    setEnvoi(true)
    try {
      const { data } = await axios.post('/api/rendez-vous', {
        date: jour, heure,
        prenom: f.prenom.trim(), telephone: f.telephone.trim(), email: f.email.trim(),
        residence: f.residence || undefined, commune: f.commune.trim() || undefined, message: f.message.trim() || undefined,
        site_web: piege || undefined, temps_formulaire: Date.now() - debut.current,
      })
      setFait(data)
      setEtape(3)
    } catch (err) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'La réservation a échoué, réessayez'))
      if (err?.response?.status === 409) { setHeure(''); setEtape(1); charger() }
    } finally { setEnvoi(false) }
  }

  const secours = (
    <div className="ev-rdv__secours">
      <a href={waLink("Bonjour Rémi, j'aimerais qu'on s'appelle au sujet de mon enfant.")} target="_blank" rel="noopener noreferrer" className="ev-rdv__wa"><IconeWhatsApp /> WhatsApp</a>
      <a href={TEL_LIEN} className="ev-rdv__tel">{TEL_AFFICHE}</a>
    </div>
  )

  if (erreur) return (
    <div className="ev-rdv">
      <p className="ev-rdv__vide">Les créneaux ne se chargent pas pour le moment. Écrivez-moi ou appelez-moi directement :</p>
      {secours}
    </div>
  )
  if (!dispo) return <div className="ev-rdv"><p className="ev-rdv__vide">Chargement des créneaux…</p></div>

  if (etape === 3) return (
    <div className="ev-rdv ev-rdv--fait">
      <span className="ev-rdv__ok" aria-hidden="true">✓</span>
      <h3>C'est noté, {f.prenom.trim()} !</h3>
      <p>Je vous appelle le <b>{jourLong(fait?.date || jour)} à {heureFr(fait?.heure || heure)}</b>, au {f.telephone}. Une confirmation vient de partir sur {f.email}.</p>
      <div className="ev-rdv__actions">
        {fait?.agenda && <a className="ev-btn ev-btn--green" href={fait.agenda} target="_blank" rel="noopener noreferrer">Ajouter à mon agenda</a>}
        {onFermer && <button type="button" className="ev-btn ev-btn--ghost" onClick={onFermer}>Fermer</button>}
      </div>
    </div>
  )

  if (!dispo.actif || !dispo.jours.length) return (
    <div className="ev-rdv">
      <p className="ev-rdv__vide">Aucun créneau d'appel n'est ouvert en ce moment. Écrivez-moi ou appelez-moi, je vous réponds vite :</p>
      {secours}
    </div>
  )

  return (
    <div className="ev-rdv">
      <ol className="ev-rdv__etapes" aria-label="Étapes">
        <li className={etape === 1 ? 'is-on' : 'is-ok'}>1. Le moment</li>
        <li className={etape === 2 ? 'is-on' : ''}>2. Vos coordonnées</li>
      </ol>

      {etape === 1 && (
        <>
          <p className="ev-rdv__intro">Un appel de {dispo.duree} minutes, gratuit et sans engagement : c'est moi qui vous appelle. Heures de Paris, identiques à Genève et Lausanne.</p>
          <div className="ev-rdv__jours" role="listbox" aria-label="Jour">
            {dispo.jours.map(j => (
              <button key={j.date} type="button" role="option" aria-selected={jour === j.date}
                className={jour === j.date ? 'is-on' : ''} onClick={() => { setJour(j.date); setHeure('') }}>
                {jourCourt(j.date)}<small>{j.creneaux.length} créneau{j.creneaux.length > 1 ? 'x' : ''}</small>
              </button>
            ))}
          </div>
          <div className="ev-rdv__heures" role="listbox" aria-label="Heure">
            {heures.map(h => (
              <button key={h} type="button" role="option" aria-selected={heure === h}
                className={heure === h ? 'is-on' : ''} onClick={() => setHeure(h)}>{heureFr(h)}</button>
            ))}
          </div>
          <div className="ev-rdv__actions">
            <button type="button" className="ev-btn ev-btn--green" disabled={!heure} onClick={() => setEtape(2)}>
              {heure ? `Continuer · ${jourCourt(jour)} à ${heureFr(heure)}` : 'Choisissez une heure'}
            </button>
          </div>
        </>
      )}

      {etape === 2 && (
        <form className="ev-rdv__form" onSubmit={reserver}>
          <p className="ev-rdv__choix">
            {maj(jourLong(jour))} à {heureFr(heure)}
            <button type="button" onClick={() => setEtape(1)}>Changer</button>
          </p>
          <div className="ev-rdv__ligne">
            <label>Votre prénom *<input value={f.prenom} onChange={e => set('prenom', e.target.value)} autoComplete="given-name" required /></label>
            <label>Téléphone *<input type="tel" value={f.telephone} onChange={e => set('telephone', e.target.value)} autoComplete="tel" placeholder="06… ou +41…" required /></label>
          </div>
          <label>Email *<input type="email" value={f.email} onChange={e => set('email', e.target.value)} autoComplete="email" placeholder="pour la confirmation" required /></label>
          <div className="ev-rdv__ligne">
            <div className="ev-rdv__puces" role="radiogroup" aria-label="Vous habitez">
              <span>Vous habitez</span>
              {[['france', 'En France'], ['suisse', 'En Suisse']].map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={f.residence === v} className={f.residence === v ? 'is-on' : ''} onClick={() => set('residence', v)}>{l}</button>
              ))}
            </div>
            <label>Commune<input value={f.commune} onChange={e => set('commune', e.target.value)} autoComplete="address-level2" placeholder="Thonon, Évian, Genève…" /></label>
          </div>
          <label>En deux mots (facultatif)<textarea rows={3} value={f.message} onChange={e => set('message', e.target.value)} placeholder="L'âge de votre enfant, ce que vous cherchez… Inutile de donner des détails médicaux ici." /></label>
          <ChampPiege value={piege} onChange={setPiege} />
          <p className="ev-rdv__rgpd">Vos coordonnées servent uniquement à organiser cet appel. <Link to="/confidentialite">Confidentialité</Link></p>
          <div className="ev-rdv__actions">
            <button type="submit" className="ev-btn ev-btn--green" disabled={envoi}>{envoi ? 'Réservation…' : "Réserver l'appel"}</button>
          </div>
        </form>
      )}
    </div>
  )
}
