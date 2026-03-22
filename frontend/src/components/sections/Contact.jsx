import { useState } from 'react'
import axios from 'axios'
import './Contact.css'

const AGES = ['6 ans','7 ans','8 ans','9 ans','10 ans','11 ans','12 ans','13 ans','14 ans']
const ACTIVITES_LIST = ['Ski / Montagne','VTT / Vélo','Randonnée','Nature & Scouts','Tout m\'intéresse !']

export default function Contact() {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '',
    enfant: '', age: '', activite: '', message: '',
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.prenom || !form.email || !form.age) return
    setStatus('loading')
    try {
      await axios.post('/api/interest', form)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">

        <div className="contact__info reveal">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Rejoindre <span>l'aventure</span></h2>
          <p>
            Le projet démarre à la rentrée prochaine ! Laissez vos coordonnées
            pour être parmi les premiers informés des activités, des dates et des tarifs.
          </p>
          <div className="contact__chips">
            {[
              ['📍', 'Haute-Savoie (74)'],
              ['📅', 'Mercredis, week-ends & vacances'],
              ['🎒', '6 à 14 ans'],
              ['✅', 'Encadrement certifié BAFA'],
            ].map(([icon, text]) => (
              <div key={text} className="contact__chip">
                <div className="contact__chip-icon">{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div className="contact__form-card">
            {status === 'success' ? (
              <div className="contact__success">
                <div className="contact__success-icon">🎉</div>
                <h3>Merci, c'est noté !</h3>
                <p>Vous serez parmi les premiers informés au lancement de CapAventure. À bientôt sur les chemins de Haute-Savoie !</p>
              </div>
            ) : (
              <>
                <h3>📩 Je rejoins la liste d'intérêt</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Votre prénom *</label>
                      <input type="text" placeholder="Marie" value={form.prenom} onChange={set('prenom')} required />
                    </div>
                    <div className="form-group">
                      <label>Votre nom</label>
                      <input type="text" placeholder="Dupont" value={form.nom} onChange={set('nom')} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" placeholder="marie@email.com" value={form.email} onChange={set('email')} required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Prénom de l'enfant</label>
                      <input type="text" placeholder="Léo" value={form.enfant} onChange={set('enfant')} />
                    </div>
                    <div className="form-group">
                      <label>Âge de l'enfant *</label>
                      <select value={form.age} onChange={set('age')} required>
                        <option value="">-- Sélectionner --</option>
                        {AGES.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Activité qui vous intéresse</label>
                    <select value={form.activite} onChange={set('activite')}>
                      <option value="">-- Sélectionner --</option>
                      {ACTIVITES_LIST.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Un message ? (optionnel)</label>
                    <textarea placeholder="Une question, une disponibilité particulière..." value={form.message} onChange={set('message')} />
                  </div>

                  {status === 'error' && (
                    <p className="contact__error">Une erreur s'est produite, réessayez.</p>
                  )}

                  <button type="submit" className="btn-primary contact__submit" disabled={status === 'loading'}>
                    {status === 'loading' ? '⏳ Envoi...' : '🚀 Envoyer ma demande'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
