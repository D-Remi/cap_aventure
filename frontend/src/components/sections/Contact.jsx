import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Contact.css'

const WA_NUM = '33752096698'

const SERVICES = [
  { val: 'repit',          label: 'Répit — enfant en situation de handicap' },
  { val: 'accompagnement', label: 'Accompagnement éducatif familial' },
  { val: 'autre',          label: 'Je ne sais pas encore' },
]

const URGENCES = [
  { val: 'info',    label: 'Je me renseigne' },
  { val: 'bientot', label: 'Dans les prochaines semaines' },
  { val: 'urgent',  label: "C'est urgent, je suis à bout" },
]

export default function Contact() {
  const [service, setService] = useState('')
  const [urgence, setUrgence] = useState('')
  const [prenom,  setPrenom]  = useState('')
  const [email,   setEmail]   = useState('')
  const [tel,     setTel]     = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done,    setDone]    = useState(false)

  const waLink = () => {
    const svc = SERVICES.find(s => s.val === service)?.label || 'vos services'
    const txt = `Bonjour, je vous contacte au sujet de : ${svc}.`
    return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(txt)}`
  }

  const submit = async () => {
    if (!prenom || !email) { toast.error('Prénom et email sont nécessaires'); return }
    setSending(true)
    try {
      await axios.post('/api/contact', {
        prenom, email, telephone: tel,
        service: service || 'autre',
        message: [
          `Service souhaité : ${SERVICES.find(s => s.val === service)?.label || 'Non précisé'}`,
          `Échéance : ${URGENCES.find(u => u.val === urgence)?.label || 'Non précisée'}`,
          '',
          message || '(aucun message)',
        ].join('\n'),
      })
      setDone(true)
    } catch {
      toast.error('Une erreur est survenue, réessayez')
    } finally {
      setSending(false)
    }
  }

  if (done) return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__done">
          <h2>Message bien reçu</h2>
          <p>
            Je vous réponds sous 24 heures. Si votre situation est urgente,
            n'hésitez pas à m'écrire directement sur WhatsApp.
          </p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="contact__wa">
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  )

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__box">
          <div className="contact__intro">
            <h2>Le premier échange est gratuit</h2>
            <p>
              Trente minutes pour me raconter votre situation. Sans jugement,
              sans engagement. Et si je ne suis pas la bonne personne,
              je vous le dirai franchement.
            </p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="contact__wa">
              Écrire sur WhatsApp
            </a>
          </div>

          <div className="contact__form">
            <div className="contact__field">
              <label>Ce qui vous amène</label>
              <div className="contact__chips">
                {SERVICES.map(s => (
                  <button
                    key={s.val}
                    type="button"
                    className={`contact__chip ${service === s.val ? 'is-on' : ''}`}
                    onClick={() => setService(s.val)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="contact__field">
              <label>Où en êtes-vous</label>
              <div className="contact__chips">
                {URGENCES.map(u => (
                  <button
                    key={u.val}
                    type="button"
                    className={`contact__chip ${urgence === u.val ? 'is-on' : ''}`}
                    onClick={() => setUrgence(u.val)}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="contact__row">
              <div className="contact__field">
                <label>Votre prénom *</label>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Prénom" />
              </div>
              <div className="contact__field">
                <label>Votre email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@email.fr" />
              </div>
            </div>

            <div className="contact__field">
              <label>Téléphone</label>
              <input value={tel} onChange={e => setTel(e.target.value)} placeholder="06…" />
            </div>

            <div className="contact__field">
              <label>Décrivez votre situation en quelques mots</label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ce que vous vivez, ce dont vous auriez besoin…"
              />
            </div>

            <button
              className="btn-primary contact__submit"
              onClick={submit}
              disabled={sending || !prenom || !email}
            >
              {sending ? 'Envoi…' : 'Envoyer ma demande'}
            </button>
            <p className="contact__legal">
              Réponse sous 24h · Vos informations restent strictement confidentielles
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
