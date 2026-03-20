import { useState } from 'react'
import ImageUploader from '../ui/ImageUploader'
import '../ui/ImageUploader.css'
import './ActivityForm.css'

const TYPES = ['ski','vtt','rando','scout','autre']
const SCHEDULE_TYPES = [
  { value: 'ponctuelle',   label: '📅 Date unique',          desc: 'Une sortie à une date précise' },
  { value: 'multi_dates',  label: '🗓️ Plusieurs dates',      desc: 'Mêmes activité, dates différentes' },
  { value: 'recurrente',   label: '🔁 Récurrente',           desc: 'Chaque semaine un jour fixe (club...)' },
  { value: 'saisonniere',  label: '🌿 Saisonnière',          desc: 'Sur une période (ex: ski tout l\'hiver)' },
]
const DAYS = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']
const PAYMENT_METHODS = [
  { value: 'especes',  label: '💵 Espèces',  icon: '💵' },
  { value: 'virement', label: '🏦 Virement', icon: '🏦' },
  { value: 'cesu',     label: '🎫 CESU',     icon: '🎫' },
]

const EMPTY = {
  titre: '', description: '', type: 'autre',
  schedule_type: 'ponctuelle',
  date: '', dates: [''], recurrence_days: [], recurrence_time: '14:00',
  date_debut: '', date_fin: '', periode_label: '',
  prix: '', prix_seance: '',
  payment_methods: ['especes'],
  virement_info: '', cesu_info: '',
  places_max: '', image_url: '', lieu: '',
  age_min: '', age_max: '', actif: true,
}

export function activityToForm(a) {
  return {
    titre:           a.titre || '',
    description:     a.description || '',
    type:            a.type || 'autre',
    schedule_type:   a.schedule_type || 'ponctuelle',
    date:            a.date ? new Date(a.date).toISOString().slice(0,16) : '',
    dates:           a.dates?.length ? a.dates.map(d => new Date(d).toISOString().slice(0,16)) : [''],
    recurrence_days: a.recurrence_days || [],
    recurrence_time: a.recurrence_time || '14:00',
    date_debut:      a.date_debut || '',
    date_fin:        a.date_fin || '',
    periode_label:   a.periode_label || '',
    prix:            a.prix?.toString() || '',
    prix_seance:     a.prix_seance?.toString() || '',
    payment_methods: a.payment_methods || ['especes'],
    virement_info:   a.virement_info || '',
    cesu_info:       a.cesu_info || '',
    places_max:      a.places_max?.toString() || '',
    image_url:       a.image_url || '',
    lieu:            a.lieu || '',
    age_min:         a.age_min?.toString() || '',
    age_max:         a.age_max?.toString() || '',
    actif:           a.actif ?? true,
  }
}

export function formToPayload(form) {
  const base = {
    titre:           form.titre,
    description:     form.description,
    type:            form.type,
    schedule_type:   form.schedule_type,
    prix:            parseFloat(form.prix) || 0,
    places_max:      parseInt(form.places_max) || 1,
    payment_methods: form.payment_methods,
    image_url:       form.image_url || undefined,
    lieu:            form.lieu || undefined,
    age_min:         form.age_min ? parseInt(form.age_min) : undefined,
    age_max:         form.age_max ? parseInt(form.age_max) : undefined,
    actif:           form.actif,
    virement_info:   form.payment_methods.includes('virement') ? form.virement_info : undefined,
    cesu_info:       form.payment_methods.includes('cesu')     ? form.cesu_info     : undefined,
  }

  if (form.schedule_type === 'ponctuelle') {
    base.date = form.date
  } else if (form.schedule_type === 'multi_dates') {
    base.dates = form.dates.filter(d => d)
    base.prix_seance = parseFloat(form.prix_seance) || undefined
  } else if (form.schedule_type === 'recurrente') {
    base.recurrence_days = form.recurrence_days
    base.recurrence_time = form.recurrence_time
    base.date_debut      = form.date_debut || undefined
    base.date_fin        = form.date_fin   || undefined
    base.prix_seance     = parseFloat(form.prix_seance) || undefined
  } else if (form.schedule_type === 'saisonniere') {
    base.date_debut    = form.date_debut
    base.date_fin      = form.date_fin
    base.periode_label = form.periode_label || undefined
  }

  return base
}

export default function ActivityForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setE = (k) => (e) => set(k, e.target.type === 'checkbox' ? e.target.checked : e.target.value)

  const toggleDay = (day) => {
    set('recurrence_days',
      form.recurrence_days.includes(day)
        ? form.recurrence_days.filter(d => d !== day)
        : [...form.recurrence_days, day]
    )
  }

  const togglePayment = (method) => {
    set('payment_methods',
      form.payment_methods.includes(method)
        ? form.payment_methods.filter(m => m !== method)
        : [...form.payment_methods, method]
    )
  }

  const addDate = () => set('dates', [...form.dates, ''])
  const removeDate = (i) => set('dates', form.dates.filter((_, idx) => idx !== i))
  const setDate = (i, v) => set('dates', form.dates.map((d, idx) => idx === i ? v : d))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formToPayload(form))
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit}>

      {/* ── Infos générales ── */}
      <div className="af-section">
        <h3 className="af-section__title">📋 Informations générales</h3>
        <div className="form-group">
          <label>Titre *</label>
          <input value={form.titre} onChange={setE('titre')} required placeholder="Ex: Sortie ski aux Contamines" />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea value={form.description} onChange={setE('description')} required rows={3} placeholder="Décrivez l'activité..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Type d'activité</label>
            <select value={form.type} onChange={setE('type')}>
              {TYPES.map(t => <option key={t} value={t} style={{ textTransform:'capitalize' }}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Lieu</label>
            <input value={form.lieu} onChange={setE('lieu')} placeholder="Ex: Les Contamines, station..." />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Âge minimum</label>
            <input type="number" min="3" max="18" value={form.age_min} onChange={setE('age_min')} placeholder="6" />
          </div>
          <div className="form-group">
            <label>Âge maximum</label>
            <input type="number" min="3" max="18" value={form.age_max} onChange={setE('age_max')} placeholder="14" />
          </div>
        </div>
      </div>

      {/* ── Planification ── */}
      <div className="af-section">
        <h3 className="af-section__title">📅 Planification</h3>

        <div className="af-schedule-grid">
          {SCHEDULE_TYPES.map(s => (
            <button
              key={s.value}
              type="button"
              className={`af-schedule-btn ${form.schedule_type === s.value ? 'active' : ''}`}
              onClick={() => set('schedule_type', s.value)}
            >
              <span className="af-schedule-btn__label">{s.label}</span>
              <span className="af-schedule-btn__desc">{s.desc}</span>
            </button>
          ))}
        </div>

        {/* Ponctuelle */}
        {form.schedule_type === 'ponctuelle' && (
          <div className="form-group" style={{ marginTop:'1rem' }}>
            <label>Date & heure *</label>
            <input type="datetime-local" value={form.date} onChange={setE('date')} required />
          </div>
        )}

        {/* Multi dates */}
        {form.schedule_type === 'multi_dates' && (
          <div style={{ marginTop:'1rem' }}>
            <label style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:'0.6rem' }}>
              Dates des séances *
            </label>
            <div className="af-dates-list">
              {form.dates.map((d, i) => (
                <div key={i} className="af-date-row">
                  <input type="datetime-local" value={d} onChange={e => setDate(i, e.target.value)} required />
                  {form.dates.length > 1 && (
                    <button type="button" className="af-date-remove" onClick={() => removeDate(i)}>✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="af-add-date" onClick={addDate}>+ Ajouter une date</button>
          </div>
        )}

        {/* Récurrente */}
        {form.schedule_type === 'recurrente' && (
          <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="form-group">
              <label>Jour(s) de la semaine *</label>
              <div className="af-days-grid">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`af-day-btn ${form.recurrence_days.includes(day) ? 'active' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day.slice(0,3).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Heure de début *</label>
                <input type="time" value={form.recurrence_time} onChange={setE('recurrence_time')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Début de la période</label>
                <input type="date" value={form.date_debut} onChange={setE('date_debut')} />
              </div>
              <div className="form-group">
                <label>Fin de la période</label>
                <input type="date" value={form.date_fin} onChange={setE('date_fin')} />
              </div>
            </div>
          </div>
        )}

        {/* Saisonnière */}
        {form.schedule_type === 'saisonniere' && (
          <div style={{ marginTop:'1rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Début de saison *</label>
                <input type="date" value={form.date_debut} onChange={setE('date_debut')} required />
              </div>
              <div className="form-group">
                <label>Fin de saison *</label>
                <input type="date" value={form.date_fin} onChange={setE('date_fin')} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description de la période</label>
              <input value={form.periode_label} onChange={setE('periode_label')} placeholder="Ex: Tous les mercredis après-midi en hiver" />
            </div>
          </div>
        )}
      </div>

      {/* ── Prix & paiement ── */}
      <div className="af-section">
        <h3 className="af-section__title">💶 Prix & Paiement</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Prix total (€) *</label>
            <input type="number" min="0" step="0.01" value={form.prix} onChange={setE('prix')} required placeholder="25.00" />
          </div>
          {(form.schedule_type === 'multi_dates' || form.schedule_type === 'recurrente') && (
            <div className="form-group">
              <label>Prix à la séance (€)</label>
              <input type="number" min="0" step="0.01" value={form.prix_seance} onChange={setE('prix_seance')} placeholder="10.00" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Modes de paiement acceptés *</label>
          <div className="af-payment-grid">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.value}
                type="button"
                className={`af-payment-btn ${form.payment_methods.includes(m.value) ? 'active' : ''}`}
                onClick={() => togglePayment(m.value)}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {form.payment_methods.includes('virement') && (
          <div className="form-group">
            <label>Informations virement</label>
            <textarea
              value={form.virement_info}
              onChange={setE('virement_info')}
              rows={2}
              placeholder="Ex: Virement à : CapAventure — IBAN : FR76 XXXX XXXX..."
            />
          </div>
        )}
        {form.payment_methods.includes('cesu') && (
          <div className="form-group">
            <label>Informations CESU</label>
            <textarea
              value={form.cesu_info}
              onChange={setE('cesu_info')}
              rows={2}
              placeholder="Ex: Chèques CESU acceptés, à remettre en main propre"
            />
          </div>
        )}
      </div>

      {/* ── Capacité & photo ── */}
      <div className="af-section">
        <h3 className="af-section__title">⚙️ Capacité & Photo</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Places maximum *</label>
            <input type="number" min="1" value={form.places_max} onChange={setE('places_max')} required placeholder="12" />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'1.4rem' }}>
            <input type="checkbox" id="actif" checked={form.actif} onChange={setE('actif')} />
            <label htmlFor="actif" style={{ textTransform:'none', fontSize:'0.92rem', fontWeight:600, color:'var(--text-dark)', cursor:'pointer' }}>
              Activité visible et ouverte aux inscriptions
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Photo de l'activité</label>
          <ImageUploader value={form.image_url} onChange={v => set('image_url', v)} />
        </div>
      </div>

      <div className="af-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer l\'activité'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  )
}
