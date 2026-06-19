import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Contact.css'

// ⚠️ Remplace par ton vrai numéro WhatsApp (format international sans +)
const WA_NUM = "33752096698"

const SERVICES = [
  { val:'garde',      label:'🏠 Garde accompagnée',     msg:'garde de mon enfant' },
  { val:'repit',      label:'🌿 Répit TSA / TDAH',      msg:'répit pour mon enfant (TSA/TDAH)' },
  { val:'evenement',  label:'🎉 Animation événement',   msg:'animation pour un événement' },
  { val:'autre',      label:'💬 Autre demande',          msg:'renseignements' },
]

const DISPOS = [
  { val:'mercredi',   label:'Mercredis' },
  { val:'weekend',    label:'Week-ends' },
  { val:'vacances',   label:'Vacances scolaires' },
  { val:'flexible',   label:'Je suis flexible' },
]

function buildWALink(service, prenom, dispo) {
  const svc = SERVICES.find(s => s.val === service)
  const svcLabel = svc ? svc.msg : 'vos services'
  const dispoLabel = dispo ? DISPOS.find(d => d.val === dispo)?.label || '' : ''
  const msg = [
    `Bonjour ! Je m'appelle ${prenom || '(prénom)'}`,
    `et je souhaite un renseignement pour ${svcLabel}.`,
    dispoLabel ? `Je suis disponible de préférence : ${dispoLabel}.` : '',
    `Pouvez-vous me recontacter ? Merci !`,
  ].filter(Boolean).join(' ')
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`
}

export default function Contact() {
  const [prenom,  setPrenom]  = useState('')
  const [service, setService] = useState('')
  const [dispo,   setDispo]   = useState('')
  const [sending, setSending] = useState(false)
  const [done,    setDone]    = useState(false)

  // Envoi formulaire classique (backup)
  const submit = async () => {
    if (!prenom) { toast.error('Indiquez votre prénom'); return }
    setSending(true)
    try {
      await axios.post('/api/contact', {
        prenom, service, message: `Disponibilité : ${dispo}`,
        email: '', telephone: '',
      })
      setDone(true)
    } catch { toast.error('Erreur, réessayez') }
    finally { setSending(false) }
  }

  const INFOS = [
    { i:'📍', t:"Zone", v:"Biganos & Bassin d'Arcachon (33)" },
    { i:'👶', t:'Enfants', v:'4 à 14 ans · max 3 simultanément' },
    { i:'🗓️', t:'Disponibilités', v:'Mercredis, week-ends, vacances' },
    { i:'💶', t:'Paiement', v:'Virement · CESU' },
  ]

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">On en parle ?</span>
          <h2>Prenons <em>contact</em></h2>
          <p>En 30 secondes — choisissez comment vous préférez qu'on se parle.</p>
        </div>

        <div className="contact__grid">

          {/* Infos */}
          <div className="contact__info">
            {INFOS.map(({ i, t, v }) => (
              <div key={t} className="contact__item">
                <div className="contact__icon">{i}</div>
                <div><strong>{t}</strong><span>{v}</span></div>
              </div>
            ))}
            <div className="contact__photo">
              <img src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80" alt="Bassin d'Arcachon" loading="lazy"/>
            </div>
          </div>

          {/* Formulaire simplifié */}
          <div className="contact__form">
            {done ? (
              <div className="contact__done">
                <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🌲</div>
                <h3>Message envoyé !</h3>
                <p>Je vous réponds sous 24h. À très vite !</p>
              </div>
            ) : (
              <>
                <h3>📩 Me contacter</h3>
                <p className="contact__intro">Remplissez juste 3 champs — ou cliquez directement sur WhatsApp.</p>

                {/* Étape 1 — Prénom */}
                <div className="form-group">
                  <label>Votre prénom *</label>
                  <input
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    style={{ fontSize:'1.05rem' }}
                  />
                </div>

                {/* Étape 2 — Service */}
                <div className="form-group">
                  <label>Ce qui vous intéresse</label>
                  <div className="contact__chips">
                    {SERVICES.map(s => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => setService(s.val)}
                        className={`chip ${service === s.val ? 'chip--on' : ''}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Étape 3 — Disponibilité */}
                <div className="form-group">
                  <label>Votre disponibilité préférée</label>
                  <div className="contact__chips">
                    {DISPOS.map(d => (
                      <button
                        key={d.val}
                        type="button"
                        onClick={() => setDispo(d.val)}
                        className={`chip ${dispo === d.val ? 'chip--on' : ''}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA principal — WhatsApp */}
                <a
                  href={buildWALink(service, prenom, dispo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <span className="btn-whatsapp__icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  Envoyer un message WhatsApp
                </a>

                {/* Séparateur */}
                <div className="contact__sep">
                  <span>ou si vous préférez un email</span>
                </div>

                {/* CTA secondaire — email */}
                <button
                  className="btn-primary"
                  onClick={submit}
                  disabled={sending || !prenom}
                  style={{ width:'100%', justifyContent:'center' }}
                >
                  {sending ? 'Envoi…' : 'Envoyer par email'}
                </button>
                <p style={{ fontSize:'.78rem', color:'var(--text-muted)', textAlign:'center', marginTop:'.6rem' }}>
                  Je réponds sous 24h · Aucun engagement
                </p>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Bouton WhatsApp flottant permanent */}
      <a
        href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Bonjour ! Je souhaite en savoir plus sur vos services de garde / répit pour mon enfant.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        title="Nous écrire sur WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>WhatsApp</span>
      </a>
    </section>
  )
}