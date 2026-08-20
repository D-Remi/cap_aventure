import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './ContactModal.css'

const WA_NUM = '33752096698'

const SERVICES = [
  { val: 'repit',          label: 'Garde d\'enfant / relais à la journée' },
  { val: 'autre',          label: 'Je ne sais pas encore' },
]

const URGENCES = [
  { val: 'info',    label: 'Je me renseigne' },
  { val: 'bientot', label: 'Dans les prochaines semaines' },
  { val: 'urgent',  label: "C'est assez urgent" },
]

export default function ContactModal({ open, onClose, serviceInitial = '' }) {
  const [service, setService] = useState(serviceInitial)
  const [urgence, setUrgence] = useState('')
  const [prenom,  setPrenom]  = useState('')
  const [email,   setEmail]   = useState('')
  const [tel,     setTel]     = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done,    setDone]    = useState(false)

  // Pré-sélection du service quand la modale s'ouvre depuis un bloc précis
  useEffect(() => {
    if (open && serviceInitial) setService(serviceInitial)
  }, [open, serviceInitial])

  // Fermeture avec Échap + blocage du défilement de la page
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const waLink = () => {
    const svc = SERVICES.find(s => s.val === service)?.label || 'vos services'
    return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Bonjour, je vous contacte au sujet de : ${svc}.`)}`
  }

  const submit = async () => {
    if (!prenom || !email) { toast.error('Prénom et email sont nécessaires'); return }
    setSending(true)
    try {
      await axios.post('/api/contact', {
        prenom,
        email,
        telephone: tel || undefined,
        service: service || 'autre',
        urgence: urgence || undefined,
        message: message || undefined,
      })
      setDone(true)
    } catch (err) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : (msg || 'Une erreur est survenue, réessayez'))
      console.error('Erreur envoi contact :', err?.response?.data || err)
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setDone(false); setService(''); setUrgence('')
    setPrenom(''); setEmail(''); setTel(''); setMessage('')
  }

  const close = () => { onClose(); setTimeout(reset, 300) }

  return (
    <div className="cmodal__overlay" onClick={close}>
      <div className="cmodal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="cmodal__close" onClick={close} aria-label="Fermer">✕</button>

        {done ? (
          <div className="cmodal__done">
            <h2>Message bien reçu</h2>
            <p>
              Je vous réponds sous 24 heures. Si votre situation est urgente,
              n'hésitez pas à m'écrire directement sur WhatsApp.
            </p>
            <div className="cmodal__done-btns">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="cmodal__wa">
                Écrire sur WhatsApp
              </a>
              <button className="btn-secondary" onClick={close}>Fermer</button>
            </div>
          </div>
        ) : (
          <>
            <div className="cmodal__head">
              <h2>Parlons de votre situation</h2>
              <p>
                Le premier échange est gratuit et sans engagement.
                Je réponds sous 24 heures.
              </p>
            </div>

            <div className="cmodal__body">
              <div className="cmodal__field">
                <label>Ce qui vous amène</label>
                <div className="cmodal__chips">
                  {SERVICES.map(s => (
                    <button
                      key={s.val}
                      type="button"
                      className={`cmodal__chip ${service === s.val ? 'is-on' : ''}`}
                      onClick={() => setService(s.val)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cmodal__field">
                <label>Où en êtes-vous</label>
                <div className="cmodal__chips">
                  {URGENCES.map(u => (
                    <button
                      key={u.val}
                      type="button"
                      className={`cmodal__chip ${urgence === u.val ? 'is-on' : ''}`}
                      onClick={() => setUrgence(u.val)}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cmodal__row">
                <div className="cmodal__field">
                  <label>Votre prénom *</label>
                  <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Prénom" />
                </div>
                <div className="cmodal__field">
                  <label>Votre email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@email.fr" />
                </div>
              </div>

              <div className="cmodal__field">
                <label>Téléphone</label>
                <input value={tel} onChange={e => setTel(e.target.value)} placeholder="06…" />
              </div>

              <div className="cmodal__field">
                <label>Décrivez votre situation en quelques mots</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Ce que vous vivez, ce dont vous auriez besoin…"
                />
              </div>
            </div>

            <div className="cmodal__foot">
              <button
                className="btn-primary cmodal__submit"
                onClick={submit}
                disabled={sending || !prenom || !email}
              >
                {sending ? 'Envoi…' : 'Envoyer ma demande'}
              </button>
              <div className="cmodal__sep"><span>ou</span></div>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="cmodal__wa">
                Écrire sur WhatsApp
              </a>
              <p className="cmodal__legal">
                Vos informations restent strictement confidentielles
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
