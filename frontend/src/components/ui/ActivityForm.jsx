import { useState } from 'react'
import ImageUploader from './ImageUploader'
import './ActivityForm.css'

const TYPES      = ['ski','vtt','rando','scout','autre']
const DAYS_FR    = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']
const DAYS_LABEL = { lundi:'Lun', mardi:'Mar', mercredi:'Mer', jeudi:'Jeu', vendredi:'Ven', samedi:'Sam', dimanche:'Dim' }
const PAYMENT_OPTIONS = [
  { value:'especes',  label:'💵 Espèces', desc:'Paiement en main propre' },
  { value:'virement', label:'🏦 Virement', desc:'Virement bancaire' },
  { value:'cesu',     label:'🎫 CESU', desc:'Chèque emploi service universel' },
]
const SCHEDULE_OPTIONS = [
  { value:'ponctuelle',   label:'📅 Date unique',     desc:'Une sortie à une date précise' },
  { value:'multi_dates',  label:'📆 Plusieurs dates',  desc:'Plusieurs sorties (ex: ski 3 mercredis)' },
  { value:'recurrente',   label:'🔄 Récurrente',       desc:'Tous les semaines (ex: club scout)' },
  { value:'saisonniere',  label:'🌨️ Saisonnière',      desc:'Sur une période (ex: ski tout l\'hiver)' },
]

const EMPTY = {
  titre:'', description:'', type:'ski', schedule_type:'ponctuelle',
  // ponctuelle
  date:'',
  // multi_dates
  dates:[],
  // recurrente
  recurrence_days:[], recurrence_time:'14:00',
  date_debut:'', date_fin:'', periode_label:'',
  // tarif
  prix:'', prix_seance:'', places_max:'',
  // paiement
  payment_methods:['especes'], virement_info:'', cesu_info:'',
  // autres
  lieu:'', age_min:'', age_max:'', image_url:'', actif:true,
}

export default function ActivityForm({ initial = {}, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [newDate, setNewDate] = useState('')
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }))
  }

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      recurrence_days: f.recurrence_days.includes(day)
        ? f.recurrence_days.filter(d => d !== day)
        : [...f.recurrence_days, day],
    }))
  }

  const togglePayment = (method) => {
    setForm(f => ({
      ...f,
      payment_methods: f.payment_methods.includes(method)
        ? f.payment_methods.filter(m => m !== method)
        : [...f.payment_methods, method],
    }))
  }

  const addDate = () => {
    if (!newDate) return
    if (!form.dates.includes(newDate)) {
      setForm(f => ({ ...f, dates: [...f.dates, newDate].sort() }))
    }
    setNewDate('')
  }

  const removeDate = (d) => setForm(f => ({ ...f, dates: f.dates.filter(x => x !== d) }))

  const validate = () => {
    const e = {}
    if (!form.titre.trim())       e.titre = 'Titre obligatoire'
    if (!form.description.trim()) e.description = 'Description obligatoire'
    if (!form.prix)               e.prix = 'Prix obligatoire'
    if (!form.places_max)         e.places_max = 'Nombre de places obligatoire'
    if (form.payment_methods.length === 0) e.payment_methods = 'Choisissez au moins un mode de paiement'

    if (form.schedule_type === 'ponctuelle' && !form.date)
      e.date = 'Date obligatoire'
    if (form.schedule_type === 'multi_dates' && form.dates.length < 2)
      e.dates = 'Ajoutez au moins 2 dates'
    if ((form.schedule_type === 'recurrente' || form.schedule_type === 'saisonniere') && form.recurrence_days.length === 0)
      e.recurrence_days = 'Choisissez au moins un jour'
    if ((form.schedule_type === 'recurrente' || form.schedule_type === 'saisonniere') && (!form.date_debut || !form.date_fin))
      e.date_debut = 'Dates de début et fin obligatoires'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave(form)
  }

  const st = form.schedule_type

  return (
    <form className="act-form" onSubmit={handleSubmit}>

      {/* ── Infos générales ── */}
      <div className="act-form__section">
        <h3>Informations générales</h3>
        <div className="form-group">
          <label>Titre *</label>
          <input value={form.titre} onChange={set('titre')} placeholder="Ex: Sortie ski aux Contamines" />
          {errors.titre && <span className="act-form__error">{errors.titre}</span>}
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Décrivez l'activité..." />
          {errors.description && <span className="act-form__error">{errors.description}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={set('type')}>
              {TYPES.map(t => <option key={t} value={t} style={{ textTransform:'capitalize' }}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Lieu</label>
            <input value={form.lieu} onChange={set('lieu')} placeholder="Ex: Contamines-Montjoie" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Âge min</label>
            <input type="number" min={4} max={18} value={form.age_min} onChange={set('age_min')} placeholder="6" />
          </div>
          <div className="form-group">
            <label>Âge max</label>
            <input type="number" min={4} max={18} value={form.age_max} onChange={set('age_max')} placeholder="14" />
          </div>
        </div>
      </div>

      {/* ── Mode de planification ── */}
      <div className="act-form__section">
        <h3>📅 Planification</h3>
        <div className="act-form__schedule-grid">
          {SCHEDULE_OPTIONS.map(opt => (
            <label key={opt.value} className={`act-form__schedule-card ${form.schedule_type === opt.value ? 'selected' : ''}`}>
              <input type="radio" name="schedule_type" value={opt.value} checked={form.schedule_type === opt.value} onChange={set('schedule_type')} />
              <span className="act-form__schedule-card__label">{opt.label}</span>
              <span className="act-form__schedule-card__desc">{opt.desc}</span>
            </label>
          ))}
        </div>

        {/* Ponctuelle */}
        {st === 'ponctuelle' && (
          <div className="form-group" style={{ marginTop:'1rem' }}>
            <label>Date et heure *</label>
            <input type="datetime-local" value={form.date} onChange={set('date')} />
            {errors.date && <span className="act-form__error">{errors.date}</span>}
          </div>
        )}

        {/* Multi-dates */}
        {st === 'multi_dates' && (
          <div style={{ marginTop:'1rem' }}>
            <label className="form-group" style={{ display:'block', marginBottom:'0.5rem', fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              Dates des séances *
            </label>
            <div className="act-form__multi-dates">
              {form.dates.map(d => (
                <div key={d} className="act-form__date-pill">
                  📅 {new Date(d).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })}
                  <button type="button" onClick={() => removeDate(d)}>✕</button>
                </div>
              ))}
            </div>
            <div className="act-form__add-date">
              <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} />
              <button type="button" className="btn-primary" onClick={addDate} style={{ padding:'0.6rem 1rem', fontSize:'0.88rem' }}>
                + Ajouter
              </button>
            </div>
            {errors.dates && <span className="act-form__error">{errors.dates}</span>}
          </div>
        )}

        {/* Récurrente */}
        {(st === 'recurrente' || st === 'saisonniere') && (
          <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="form-group">
              <label>Jours de la semaine *</label>
              <div className="act-form__days">
                {DAYS_FR.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`act-form__day-btn ${form.recurrence_days.includes(day) ? 'active' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {DAYS_LABEL[day]}
                  </button>
                ))}
              </div>
              {errors.recurrence_days && <span className="act-form__error">{errors.recurrence_days}</span>}
            </div>

            {st === 'recurrente' && (
              <div className="form-group">
                <label>Heure de début</label>
                <input type="time" value={form.recurrence_time} onChange={set('recurrence_time')} />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Date de début *</label>
                <input type="date" value={form.date_debut} onChange={set('date_debut')} />
              </div>
              <div className="form-group">
                <label>Date de fin *</label>
                <input type="date" value={form.date_fin} onChange={set('date_fin')} />
              </div>
            </div>
            {errors.date_debut && <span className="act-form__error">{errors.date_debut}</span>}

            <div className="form-group">
              <label>Label période (affiché aux parents)</label>
              <input value={form.periode_label} onChange={set('periode_label')} placeholder="Ex: Tous les mercredis, de septembre à juin" />
            </div>
          </div>
        )}
      </div>

      {/* ── Tarif ── */}
      <div className="act-form__section">
        <h3>💶 Tarif</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Prix {st === 'recurrente' || st === 'saisonniere' ? 'total' : ''} (€) *</label>
            <input type="number" min={0} step={0.01} value={form.prix} onChange={set('prix')} placeholder="25.00" />
            {errors.prix && <span className="act-form__error">{errors.prix}</span>}
          </div>
          {(st === 'recurrente' || st === 'saisonniere') && (
            <div className="form-group">
              <label>Prix à la séance (€)</label>
              <input type="number" min={0} step={0.01} value={form.prix_seance} onChange={set('prix_seance')} placeholder="8.00" />
            </div>
          )}
          <div className="form-group">
            <label>Places max *</label>
            <input type="number" min={1} value={form.places_max} onChange={set('places_max')} placeholder="12" />
            {errors.places_max && <span className="act-form__error">{errors.places_max}</span>}
          </div>
        </div>
      </div>

      {/* ── Paiement ── */}
      <div className="act-form__section">
        <h3>💳 Modes de paiement acceptés</h3>
        <div className="act-form__payment-grid">
          {PAYMENT_OPTIONS.map(opt => (
            <label key={opt.value} className={`act-form__payment-card ${form.payment_methods.includes(opt.value) ? 'selected' : ''}`}>
              <input type="checkbox" checked={form.payment_methods.includes(opt.value)} onChange={() => togglePayment(opt.value)} />
              <span className="act-form__payment-card__label">{opt.label}</span>
              <span className="act-form__payment-card__desc">{opt.desc}</span>
            </label>
          ))}
        </div>
        {errors.payment_methods && <span className="act-form__error">{errors.payment_methods}</span>}

        {form.payment_methods.includes('virement') && (
          <div className="form-group" style={{ marginTop:'0.75rem' }}>
            <label>Informations virement (IBAN, banque...)</label>
            <textarea value={form.virement_info} onChange={set('virement_info')} rows={2}
              placeholder="IBAN : FR76 XXXX XXXX XXXX XXXX&#10;Banque : Crédit Agricole&#10;Référence : Prénom + Activité" />
          </div>
        )}
        {form.payment_methods.includes('cesu') && (
          <div className="form-group" style={{ marginTop:'0.75rem' }}>
            <label>Informations CESU</label>
            <textarea value={form.cesu_info} onChange={set('cesu_info')} rows={2}
              placeholder="Chèques CESU acceptés, à remettre en main propre." />
          </div>
        )}
      </div>

      {/* ── Photo ── */}
      <div className="act-form__section">
        <h3>📷 Photo</h3>
        <ImageUploader value={form.image_url} onChange={(url) => setForm(f => ({ ...f, image_url: url }))} />
      </div>

      {/* ── Visibilité ── */}
      <div className="act-form__section act-form__section--inline">
        <input type="checkbox" id="actif" checked={form.actif} onChange={set('actif')} />
        <label htmlFor="actif" style={{ margin:0, fontSize:'0.95rem', fontWeight:600, color:'var(--text-dark)', textTransform:'none', letterSpacing:0 }}>
          Activité visible et ouverte aux inscriptions
        </label>
      </div>

      {/* ── Actions ── */}
      <div className="act-form__actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer l\'activité'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  )
}
