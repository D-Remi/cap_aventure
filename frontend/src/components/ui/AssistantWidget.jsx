import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { ouvrirRendezVous } from '../../utils/rendezVous'
import { waLink, IconeWhatsApp } from '../../data/contact'
import './AssistantWidget.css'

const CLE = 'ev-assistant'
const PAGES_PRIVEES = ['/admin', '/dashboard', '/profil', '/login', '/register', '/forgot-password', '/reset-password', '/mot-de-passe-oublie']
const SUGGESTIONS = [
  'Combien ça coûte vraiment ?',
  'Vous gardez les enfants autistes ?',
  'Vous venez chez nous en Suisse ?',
  'Comment se passe une première garde ?',
]
const MAX = 1500

const lire = () => { try { return JSON.parse(sessionStorage.getItem(CLE)) || [] } catch { return [] } }
const ecrire = (m) => { try { sessionStorage.setItem(CLE, JSON.stringify(m)) } catch { /* navigation privée */ } }

// Mise en forme sûre (sans HTML) : gras **…**, liens vers les pages du site, listes « - »
const MOTIF = /(\*\*[^*]+\*\*|\/(?:rendez-vous|tarifs|frontaliers-suisse|conseils|structures|documentation|cgv|confidentialite)(?:\/[\w-]+)?(?:#[\w-]+)?)/
const LIBELLES = {
  '/tarifs': 'la page Tarifs', '/frontaliers-suisse': 'la page Frontaliers et Suisse', '/conseils': 'les conseils',
  '/structures': 'la page Structures', '/documentation': "l'aide", '/cgv': 'les conditions générales', '/confidentialite': 'la confidentialité',
}
function Ligne({ texte }) {
  // split avec un groupe capturant : les morceaux impairs sont les éléments reconnus
  return texte.split(MOTIF).map((m, i) => {
    if (!m) return null
    if (i % 2 === 0) return <Fragment key={i}>{m}</Fragment>
    if (m.startsWith('**')) return <b key={i}>{m.slice(2, -2)}</b>
    if (m === '/rendez-vous') return <button key={i} type="button" className="ev-asst__lien" onClick={ouvrirRendezVous}>la page de réservation</button>
    const base = m.split('#')[0]
    const libelle = LIBELLES[base] || (base.startsWith('/conseils/') ? 'cet article' : base.slice(1))
    return <Link key={i} to={m} className="ev-asst__lien">{libelle}</Link>
  })
}
function Texte({ texte }) {
  const lignes = texte.split('\n').filter((l, i, t) => l.trim() || (i > 0 && t[i - 1].trim()))
  const blocs = []
  let liste = null
  lignes.forEach((l, i) => {
    const puce = l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)/)
    if (puce) { if (!liste) { liste = []; blocs.push(<ul key={`u${i}`}>{liste}</ul>) } liste.push(<li key={i}><Ligne texte={puce[1]} /></li>) }
    else { liste = null; if (l.trim()) blocs.push(<p key={i}><Ligne texte={l} /></p>) }
  })
  return blocs
}

export default function AssistantWidget() {
  const { pathname } = useLocation()
  const [actif, setActif] = useState(false)
  const [ouvert, setOuvert] = useState(false)
  const [messages, setMessages] = useState(lire)
  const [saisie, setSaisie] = useState('')
  const [attente, setAttente] = useState(false)
  const [erreur, setErreur] = useState('')
  const fil = useRef(null)
  const champ = useRef(null)

  useEffect(() => { axios.get('/api/assistant/statut').then(r => setActif(!!r.data?.actif)).catch(() => setActif(false)) }, [])
  useEffect(() => { ecrire(messages) }, [messages])
  useEffect(() => { fil.current?.scrollTo({ top: fil.current.scrollHeight, behavior: 'smooth' }) }, [messages, attente, ouvert])
  useEffect(() => { if (ouvert) setTimeout(() => champ.current?.focus(), 50) }, [ouvert])
  useEffect(() => {
    if (!ouvert) return
    const echap = (e) => { if (e.key === 'Escape') setOuvert(false) }
    document.addEventListener('keydown', echap)
    return () => document.removeEventListener('keydown', echap)
  }, [ouvert])

  if (!actif || PAGES_PRIVEES.some(p => pathname.startsWith(p))) return null

  const envoyer = async (texte) => {
    const t = String(texte || '').trim().slice(0, MAX)
    if (!t || attente) return
    setErreur('')
    // On garde les 19 derniers messages pour rester sous la limite, en commençant par une question
    let suite = [...messages, { role: 'user', content: t }]
    if (suite.length > 19) suite = suite.slice(-19)
    if (suite[0].role !== 'user') suite = suite.slice(1)
    setMessages(suite)
    setSaisie('')
    setAttente(true)
    try {
      const { data } = await axios.post('/api/assistant', { messages: suite })
      setMessages(m => [...m, { role: 'assistant', content: data.reponse }])
    } catch (err) {
      const msg = err?.response?.status === 429
        ? 'Beaucoup de questions en peu de temps : patientez quelques minutes, ou écrivez directement à Rémi.'
        : (err?.response?.data?.message || "L'assistant ne répond pas pour le moment. Écrivez directement à Rémi.")
      setErreur(Array.isArray(msg) ? msg[0] : msg)
      setMessages(m => m.slice(0, -1))
      setSaisie(t)
    } finally { setAttente(false) }
  }

  const recommencer = () => { setMessages([]); setErreur(''); setSaisie('') }

  return (
    <>
      {!ouvert && (
        <button type="button" className="ev-asst__bulle" onClick={() => setOuvert(true)} aria-label="Poser une question à l'assistant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 10.5h7M8.5 13.5h4" /></svg>
          <span>Une question ?</span>
        </button>
      )}

      {ouvert && (
        <section className="ev-asst" role="dialog" aria-label="Assistant Éduc & Vous">
          <header className="ev-asst__tete">
            <div>
              <b>Assistant Éduc & Vous</b>
              <small>Réponses automatiques (IA). Pour réserver ou confirmer, c'est Rémi.</small>
            </div>
            <div className="ev-asst__outils">
              {messages.length > 0 && <button type="button" onClick={recommencer} aria-label="Nouvelle conversation" title="Nouvelle conversation">↺</button>}
              <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer">✕</button>
            </div>
          </header>

          <div className="ev-asst__fil" ref={fil} aria-live="polite">
            <div className="ev-asst__msg ev-asst__msg--a">
              <p>Bonjour ! Je réponds à vos questions sur la garde et le répit avec Rémi : prix, aides, Suisse, déroulement. Que voulez-vous savoir ?</p>
            </div>
            {messages.length === 0 && (
              <div className="ev-asst__sugg">
                {SUGGESTIONS.map(s => <button key={s} type="button" onClick={() => envoyer(s)}>{s}</button>)}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`ev-asst__msg ev-asst__msg--${m.role === 'user' ? 'u' : 'a'}`}>
                {m.role === 'user' ? <p>{m.content}</p> : <Texte texte={m.content} />}
              </div>
            ))}
            {attente && <div className="ev-asst__msg ev-asst__msg--a ev-asst__points" aria-label="L'assistant écrit"><span /><span /><span /></div>}
            {erreur && <p className="ev-asst__erreur"><Ligne texte={erreur} /></p>}
          </div>

          <div className="ev-asst__actions">
            <button type="button" onClick={ouvrirRendezVous}>Réserver un appel</button>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"><IconeWhatsApp /> WhatsApp</a>
          </div>

          <form className="ev-asst__saisie" onSubmit={e => { e.preventDefault(); envoyer(saisie) }}>
            <textarea ref={champ} rows={1} value={saisie} maxLength={MAX} placeholder="Votre question…"
              onChange={e => setSaisie(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); envoyer(saisie) } }} />
            <button type="submit" disabled={attente || !saisie.trim()} aria-label="Envoyer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          <p className="ev-asst__mention">
            Évitez les informations médicales. Vos messages sont transmis à Anthropic pour générer les réponses et ne sont pas conservés par Éduc & Vous. <Link to="/confidentialite">Confidentialité</Link>
          </p>
        </section>
      )}
    </>
  )
}
