import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Contact.css'
const INFOS=[
  {i:'📍',t:"Zone d'intervention",v:"Biganos & Bassin d'Arcachon — Gironde (33)"},
  {i:'🎓',t:'Qualification',v:"Animateur diplômé BAFA · Exp. assistant d'éducation"},
  {i:'👶',t:'Enfants accueillis',v:'4 à 14 ans · max 3 enfants simultanément'},
  {i:'🗓️',t:'Disponibilités',v:'Mercredis, week-ends, vacances & selon besoins'},
  {i:'💶',t:'Paiement',v:'Espèces · Virement · CESU'},
]
export default function Contact(){
  const [form,setForm]=useState({prenom:'',email:'',telephone:'',service:'',enfant_prenom:'',enfant_age:'',besoins_specifiques:false,message:''})
  const [sending,setSending]=useState(false)
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.type==='checkbox'?e.target.checked:e.target.value}))
  const submit=async e=>{
    e.preventDefault()
    if(!form.prenom||!form.email){toast.error('Prénom et email requis');return}
    setSending(true)
    try{
      await axios.post('/api/contact',form)
      toast.success('Message envoyé ! Je vous réponds rapidement.')
      setForm({prenom:'',email:'',telephone:'',service:'',enfant_prenom:'',enfant_age:'',besoins_specifiques:false,message:''})
    }catch{toast.error('Erreur, réessayez')}
    finally{setSending(false)}
  }
  return(
    <section className="contact section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">On en parle ?</span>
          <h2>Prenons <em>contact</em></h2>
          <p>Décrivez votre situation. Je vous réponds rapidement.</p>
        </div>
        <div className="contact__grid">
          <div className="contact__info">
            {INFOS.map(({i,t,v})=>(
              <div key={t} className="contact__item">
                <div className="contact__icon">{i}</div>
                <div><strong>{t}</strong><span>{v}</span></div>
              </div>
            ))}
            <div className="contact__photo"><img src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80" alt="Bassin d'Arcachon" loading="lazy"/></div>
          </div>
          <form className="contact__form" onSubmit={submit} noValidate>
            <h3>📩 Me contacter</h3>
            <div className="contact__row">
              <div className="form-group"><label>Prénom *</label><input value={form.prenom} onChange={set('prenom')} placeholder="Votre prénom"/></div>
              <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={set('email')} placeholder="votre@email.fr"/></div>
            </div>
            <div className="form-group"><label>Téléphone</label><input value={form.telephone} onChange={set('telephone')} placeholder="06..."/></div>
            <div className="form-group">
              <label>Service souhaité</label>
              <select value={form.service} onChange={set('service')}>
                <option value="">— Choisir —</option>
                <option value="garde">Garde + sorties activités</option>
                <option value="repit">Répit enfant à besoins spécifiques</option>
                <option value="evenement">Animation événement</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="contact__row">
              <div className="form-group"><label>Prénom de l'enfant</label><input value={form.enfant_prenom} onChange={set('enfant_prenom')} placeholder="Prénom"/></div>
              <div className="form-group"><label>Âge</label><input value={form.enfant_age} onChange={set('enfant_age')} placeholder="Ex: 7 ans"/></div>
            </div>
            <label className="contact__check">
              <input type="checkbox" checked={form.besoins_specifiques} onChange={set('besoins_specifiques')}/>
              <span>Mon enfant a des besoins spécifiques (TSA, TDAH…)</span>
            </label>
            <div className="form-group" style={{marginTop:'.85rem'}}><label>Votre message</label><textarea rows={4} value={form.message} onChange={set('message')} placeholder="Décrivez votre situation, vos besoins, vos questions…"/></div>
            <button className="btn-primary" type="submit" disabled={sending} style={{width:'100%',justifyContent:'center',marginTop:'.5rem'}}>
              {sending?'Envoi…':'Envoyer mon message 🌲'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}