import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import './ContactModal.css'

export default function ContactModal({ onClose, prefillDate = null }) {
  const { user } = useAuth()

  const [form, setForm] = useState({
    prenom:              user?.prenom || '',
    email:               user?.email  || '',
    telephone:           user?.telephone || '',
    service:             '',
    enfant_prenom:       '',
    enfant_age:          '',
    besoins_specifiques: false,
    message:             prefillDate
      ? `Bonjour, je souhaite réserver le ${new Date(prefillDate+'T00:00:00').toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long'})}.`
      : '',
  })
  const [sending, setSending] = useState(false)

  const set = k => e => setForm(f => ({
    ...f,
    [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  }))

  const submit = async e => {
    e.preventDefault()
    if (!form.prenom || !form.email) { toast.error('Prénom et email requis'); return }
    setSending(true)
    try {
      await axios.post('/api/contact', form)
      toast.success('Message envoyé ! Je vous réponds rapidement.')
      onClose()
    } catch { toast.error('Erreur, réessayez') }
    finally { setSending(false) }
  }

  return (
    <div className="cmodal-overlay" onClick={onClose}>
      <div className="cmodal" onClick={e => e.stopPropagation()}>
        <div className="cmodal__head">
          <div>
            <h3>📩 Nous contacter</h3>
            <span>{user ? `Connecté en tant que ${user.prenom}` : 'Entrez vos coordonnées'}</span>
          </div>
          <button className="cmodal__close" onClick={onClose}>✕</button>
        </div>

        <form className="cmodal__body" onSubmit={submit}>
          {/* Infos contact */}
          <div className="cmodal__row">
            <div className="cmodal__field">
              <label>Prénom *</label>
              <input value={form.prenom} onChange={set('prenom')} placeholder="Votre prénom" disabled={!!user}/>
            </div>
            <div className="cmodal__field">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="votre@email.fr" disabled={!!user}/>
            </div>
          </div>
          <div className="cmodal__field">
            <label>Téléphone</label>
            <input value={form.telephone} onChange={set('telephone')} placeholder="06..." disabled={!!user && !!user.telephone}/>
          </div>

          {/* Service */}
          <div className="cmodal__field">
            <label>Service souhaité</label>
            <select value={form.service} onChange={set('service')}>
              <option value="">— Choisir —</option>
              <option value="garde">Garde + sorties activités</option>
              <option value="repit">Répit enfant à besoins spécifiques</option>
              <option value="evenement">Animation événement</option>
              <option value="autre">Autre / Je ne sais pas encore</option>
            </select>
          </div>

          {/* Enfant */}
          <div className="cmodal__row">
            <div className="cmodal__field">
              <label>Prénom de l'enfant</label>
              <input value={form.enfant_prenom} onChange={set('enfant_prenom')} placeholder="Prénom"/>
            </div>
            <div className="cmodal__field">
              <label>Âge</label>
              <input value={form.enfant_age} onChange={set('enfant_age')} placeholder="Ex: 7 ans"/>
            </div>
          </div>

          <label className="cmodal__check">
            <input type="checkbox" checked={form.besoins_specifiques} onChange={set('besoins_specifiques')}/>
            <span>Mon enfant a des besoins spécifiques (TSA, TDAH…)</span>
          </label>

          <div className="cmodal__field">
            <label>Message</label>
            <textarea rows={3} value={form.message} onChange={set('message')} placeholder="Décrivez votre situation, vos besoins…"/>
          </div>

          <button type="submit" className="btn-primary" disabled={sending} style={{width:'100%',justifyContent:'center'}}>
            {sending ? 'Envoi…' : 'Envoyer le message 🌲'}
          </button>
        </form>
      </div>
    </div>
  )
}