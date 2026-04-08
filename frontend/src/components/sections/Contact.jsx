import { useState } from 'react'
import axios from 'axios'
import './Contact.css'

const ACTIVITES_LIST = [
  'Ski & Montagne',
  'Multi-activités',
  'Roller / Patins',
  'Club Mercredi',
  'Club Samedi',
  'Tout m\'intéresse !',
]
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const CRENEAUX = ['Matin (9h–12h)', 'Après-midi (14h–18h)', 'Journée complète']
const AGES = ['6 ans','7 ans','8 ans','9 ans','10 ans','11 ans','12 ans','13 ans','14 ans']

export default function Contact() {
  const [tab, setTab] = useState('info') // 'info' | 'dispo'
  const [form, setForm] = useState({
    // Commun
    prenom: '', nom: '', email: '', telephone: '',
    // Infos générales
    enfant: '', age: '', activite: '', message: '',
    // Disponibilités
    jours: [],
    creneaux: [],
    nb_enfants: '1',
    niveau: '',
  })
  const [status, setStatus] = useState('idle')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleArray = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter(v => v !== val)
        : [...f[key], val],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.prenom || !form.email) return
    setStatus('loading')
    try {
      const payload = {
        prenom:   form.prenom,
        nom:      form.nom,
        email:    form.email,
        enfant:   form.enfant,
        age:      form.age,
        activite: form.activite,
        message:  tab === 'dispo'
          ? `[Demande de disponibilités]\nJours : ${form.jours.join(', ') || '—'}\nCréneaux : ${form.creneaux.join(', ') || '—'}\nNb enfants : ${form.nb_enfants}\nNiveau : ${form.niveau || '—'}\n\n${form.message}`
          : form.message,
      }
      await axios.post('/api/interest', payload)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">

        {/* ── Info gauche ── */}
        <div className="contact__info reveal">
          <span className="section-tag">Contact</span>
          <h2 className="section-title">Rejoindre <span>l'aventure</span></h2>
          <p>
            Une question sur les activités ? Tu veux savoir quand on organise la prochaine sortie ?
            Dis-nous tes disponibilités et on te recontacte rapidement !
          </p>

          <div className="contact__chips">
            {[
              ['⛷️', 'Ski & Montagne'],
              ['🛼', 'Roller / Patins'],
              ['🎯', 'Multi-activités'],
              ['📅', 'Club Hebdo'],
              ['🏔️', 'Chablais / Léman'],
              ['✅', 'Animateur BAFA'],
              ['🎂', '6–14 ans'],
            ].map(([icon, label]) => (
              <span key={label} className="contact__chip">{icon} {label}</span>
            ))}
          </div>

          <div className="contact__reassurance">
            <div>✅ Réponse sous 48h</div>
            <div>📩 Sans engagement</div>
            <div>🔒 Données confidentielles</div>
          </div>
        </div>

        {/* ── Formulaire ── */}
        <div className="contact__form-wrap reveal">

          {status === 'success' ? (
            <div className="contact__success">
              <span>🎉</span>
              <h3>Message envoyé !</h3>
              <p>Merci {form.prenom} ! On vous recontacte sous 48h. À bientôt sur les bords du lac Léman et dans les montagnes du Chablais !</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="contact__tabs">
                <button
                  className={`contact__tab ${tab === 'info' ? 'active' : ''}`}
                  onClick={() => setTab('info')}
                >
                  💬 Infos générales
                </button>
                <button
                  className={`contact__tab ${tab === 'dispo' ? 'active' : ''}`}
                  onClick={() => setTab('dispo')}
                >
                  📅 Mes disponibilités
                </button>
              </div>

              <form className="contact__form" onSubmit={handleSubmit}>
                {/* Champs communs */}
                <div className="contact__row">
                  <div className="contact__field">
                    <label>Prénom *</label>
                    <input value={form.prenom} onChange={set('prenom')} required placeholder="Marie" />
                  </div>
                  <div className="contact__field">
                    <label>Nom</label>
                    <input value={form.nom} onChange={set('nom')} placeholder="Dupont" />
                  </div>
                </div>
                <div className="contact__row">
                  <div className="contact__field">
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={set('email')} required placeholder="marie@email.fr" />
                  </div>
                  <div className="contact__field">
                    <label>Téléphone</label>
                    <input type="tel" value={form.telephone} onChange={set('telephone')} placeholder="06 XX XX XX XX" />
                  </div>
                </div>

                {/* ── Tab Infos générales ── */}
                {tab === 'info' && (
                  <>
                    <div className="contact__row">
                      <div className="contact__field">
                        <label>Prénom de l'enfant</label>
                        <input value={form.enfant} onChange={set('enfant')} placeholder="Léo" />
                      </div>
                      <div className="contact__field">
                        <label>Âge</label>
                        <select value={form.age} onChange={set('age')}>
                          <option value="">-- Âge --</option>
                          {AGES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="contact__field">
                      <label>Activité qui vous intéresse</label>
                      <select value={form.activite} onChange={set('activite')}>
                        <option value="">-- Choisir --</option>
                        {ACTIVITES_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="contact__field">
                      <label>Votre message</label>
                      <textarea value={form.message} onChange={set('message')} rows={3}
                        placeholder="Une question, une précision, une demande particulière…" />
                    </div>
                  </>
                )}

                {/* ── Tab Disponibilités ── */}
                {tab === 'dispo' && (
                  <>
                    <div className="contact__field">
                      <label>Activité souhaitée</label>
                      <select value={form.activite} onChange={set('activite')}>
                        <option value="">-- Choisir --</option>
                        {ACTIVITES_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>

                    <div className="contact__field">
                      <label>Jours disponibles</label>
                      <div className="contact__toggle-group">
                        {JOURS.map(j => (
                          <button
                            key={j} type="button"
                            className={`contact__toggle ${form.jours.includes(j) ? 'active' : ''}`}
                            onClick={() => toggleArray('jours', j)}
                          >
                            {j.slice(0,3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="contact__field">
                      <label>Créneaux préférés</label>
                      <div className="contact__toggle-group">
                        {CRENEAUX.map(c => (
                          <button
                            key={c} type="button"
                            className={`contact__toggle ${form.creneaux.includes(c) ? 'active' : ''}`}
                            onClick={() => toggleArray('creneaux', c)}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="contact__row">
                      <div className="contact__field">
                        <label>Nombre d'enfants</label>
                        <select value={form.nb_enfants} onChange={set('nb_enfants')}>
                          {['1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div className="contact__field">
                        <label>Niveau / expérience</label>
                        <select value={form.niveau} onChange={set('niveau')}>
                          <option value="">-- Niveau --</option>
                          <option value="debutant">Débutant</option>
                          <option value="intermediaire">Intermédiaire</option>
                          <option value="confirme">Confirmé</option>
                        </select>
                      </div>
                    </div>

                    <div className="contact__field">
                      <label>Informations complémentaires</label>
                      <textarea value={form.message} onChange={set('message')} rows={2}
                        placeholder="Âge(s) de l'enfant, contraintes particulières, questions…" />
                    </div>
                  </>
                )}

                {status === 'error' && (
                  <p style={{ color:'#dc2626', fontSize:'0.85rem' }}>
                    Une erreur est survenue. Réessayez ou envoyez un email directement.
                  </p>
                )}

                <button type="submit" className="contact__submit" disabled={status === 'loading'}>
                  {status === 'loading'
                    ? '⏳ Envoi en cours...'
                    : tab === 'dispo'
                      ? '📅 Envoyer mes disponibilités'
                      : '💬 Envoyer ma demande'
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
