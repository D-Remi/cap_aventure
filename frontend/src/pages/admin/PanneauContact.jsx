import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { messages, cleModele, LIBELLES_MODELES, ajouterJours } from './radarProspection'

const AUJ = new Date().toLocaleDateString('en-CA')
const dateFr = () => new Date().toLocaleDateString('fr-FR')
const telBrut = (t) => String(t || '').replace(/[^+\d]/g, '')
// Numéro mobile français ou suisse : WhatsApp possible
const waNum = (t) => {
  const n = telBrut(t)
  if (/^0[67]\d{8}$/.test(n)) return `33${n.slice(1)}`
  if (/^\+33[67]\d{8}$/.test(n) || /^\+417\d{8}$/.test(n)) return n.slice(1)
  return null
}

const copier = async (texte) => {
  try { await navigator.clipboard.writeText(texte); toast.success('Copié') }
  catch { toast.error('Copie impossible : sélectionne le texte à la main') }
}

// Fenêtre « Contacter » : message prêt selon le type de contact, puis mise à jour du suivi en un clic
export default function PanneauContact({ prospect: p, onFermer, onFait }) {
  const [cle, setCle] = useState(cleModele(p))
  const [canal, setCanal] = useState(p.email ? 'email' : p.telephone ? 'appel' : 'court')
  const m = messages(p, cle)
  const [corps, setCorps] = useState(m.email)
  const [court, setCourt] = useState(m.court)

  useEffect(() => { setCorps(m.email); setCourt(m.court) }, [cle]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const echap = (e) => { if (e.key === 'Escape') onFermer() }
    document.addEventListener('keydown', echap)
    return () => document.removeEventListener('keydown', echap)
  }, [onFermer])

  const wa = waNum(p.telephone)
  const libelleCanal = { email: 'email', appel: 'téléphone', court: 'message' }[canal]
  const note = (txt) => `${p.notes ? `${p.notes}\n` : ''}${dateFr()} : ${txt}`

  const fait = (type) => {
    if (type === 'contacte') onFait({ statut: 'contacte', dernier_contact: AUJ, relance: ajouterJours(7), notes: note(`contacté par ${libelleCanal}.`) })
    if (type === 'relance') onFait({ dernier_contact: AUJ, relance: ajouterJours(10), notes: note(`relancé par ${libelleCanal}.`) })
    if (type === 'rdv') onFait({ statut: 'rdv', dernier_contact: AUJ, relance: ajouterJours(14), notes: note('rendez-vous obtenu.') })
    if (type === 'non') onFait({ statut: 'sans_suite', relance: null, notes: note('ne souhaite pas être recontacté.') })
    onFermer()
  }

  const champ = { width: '100%', boxSizing: 'border-box', padding: '.7rem .8rem', border: '1.5px solid #DFE7E3', borderRadius: 10, fontFamily: 'inherit', fontSize: '.9rem', lineHeight: 1.5 }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(15,17,21,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onFermer}>
      <div role="dialog" aria-modal="true" aria-label={`Contacter ${p.nom}`} onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 680, maxHeight: '92vh', overflowY: 'auto', padding: '1.4rem' }}>
        <div className="al-actions" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0 }}>Contacter {p.nom}</h2>
            <p className="al-sub" style={{ margin: '.2rem 0 0' }}>{[p.categorie, p.ville, p.telephone, p.email].filter(Boolean).join(' · ') || 'Coordonnées à compléter dans « Détails »'}</p>
          </div>
          <button className="btn-secondary" onClick={onFermer} aria-label="Fermer">✕</button>
        </div>

        <div className="al-grid" style={{ marginTop: '.8rem' }}>
          <label className="al-field"><span>Message adapté à</span>
            <select value={cle} onChange={e => setCle(e.target.value)}>
              {Object.entries(LIBELLES_MODELES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
        </div>

        <div className="al-actions" style={{ marginTop: '.6rem' }}>
          {[['email', 'Email'], ['appel', 'Téléphone'], ['court', 'Message court (WhatsApp, Messenger, SMS)']].map(([k, l]) => (
            <button key={k} className={canal === k ? 'btn-primary' : 'btn-secondary'} style={{ padding: '.4rem .8rem', fontSize: '.82rem' }} onClick={() => setCanal(k)}>{l}</button>
          ))}
        </div>

        {canal === 'email' && (
          <div style={{ display: 'grid', gap: '.6rem', marginTop: '.8rem' }}>
            <label className="al-field"><span>Objet</span><input value={m.objet} readOnly style={champ} /></label>
            <label className="al-field"><span>Message (modifiable)</span><textarea rows={13} value={corps} onChange={e => setCorps(e.target.value)} style={champ} /></label>
            <div className="al-actions">
              <button className="btn-secondary" onClick={() => copier(corps)}>Copier le message</button>
              {p.email
                ? <a className="btn-primary" href={`mailto:${p.email}?subject=${encodeURIComponent(m.objet)}&body=${encodeURIComponent(corps)}`}>Ouvrir dans ma messagerie</a>
                : <span className="al-sub">Pas d'email : ajoute-le dans « Détails », ou passe par le formulaire de contact de son site.</span>}
            </div>
            <p className="al-sub">Astuce : joins la plaquette « professionnels » (bouton dans l'onglet Aujourd'hui).</p>
          </div>
        )}

        {canal === 'appel' && (
          <div style={{ display: 'grid', gap: '.6rem', marginTop: '.8rem' }}>
            <div style={{ ...champ, whiteSpace: 'pre-wrap', background: '#F4F8F6' }}>{m.appel}</div>
            <div className="al-actions">
              {p.telephone
                ? <a className="btn-primary" href={`tel:${telBrut(p.telephone)}`}>Appeler {p.telephone}</a>
                : <a className="btn-secondary" href={`https://www.google.com/search?q=${encodeURIComponent(`${p.nom} ${p.ville || ''} téléphone`)}`} target="_blank" rel="noopener noreferrer">Trouver le numéro</a>}
            </div>
            <p className="al-sub">Le meilleur moment : en début de matinée ou juste après midi. Note le prénom de la personne et la suite promise.</p>
          </div>
        )}

        {canal === 'court' && (
          <div style={{ display: 'grid', gap: '.6rem', marginTop: '.8rem' }}>
            <textarea rows={6} value={court} onChange={e => setCourt(e.target.value)} style={champ} />
            <div className="al-actions">
              <button className="btn-secondary" onClick={() => copier(court)}>Copier</button>
              {wa && <a className="btn-primary" href={`https://wa.me/${wa}?text=${encodeURIComponent(court)}`} target="_blank" rel="noopener noreferrer">Envoyer sur WhatsApp</a>}
              <a className="btn-secondary" href={`https://www.facebook.com/search/top?q=${encodeURIComponent(p.nom)}`} target="_blank" rel="noopener noreferrer">Le trouver sur Facebook</a>
              <a className="btn-secondary" href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(p.nom)}`} target="_blank" rel="noopener noreferrer">Sur LinkedIn</a>
            </div>
          </div>
        )}

        <h3 style={{ marginTop: '1.2rem' }}>C'est fait ?</h3>
        <div className="al-actions">
          {p.statut === 'a_contacter'
            ? <button className="btn-primary" onClick={() => fait('contacte')}>Contacté · relance dans 7 jours</button>
            : <button className="btn-primary" onClick={() => fait('relance')}>Relancé · nouvelle relance dans 10 jours</button>}
          <button className="btn-secondary" onClick={() => fait('rdv')}>Rendez-vous obtenu</button>
          <button className="btn-secondary" onClick={() => fait('non')}>Ne veut pas être recontacté</button>
        </div>
      </div>
    </div>
  )
}
