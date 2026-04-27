import { useState } from 'react'
import './ActivityForm.css'

const TYPES      = ['vtt','scout','velo','evenement','rando','autre']
const DAYS_FR    = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']
const DAYS_LABEL = { lundi:'Lun', mardi:'Mar', mercredi:'Mer', jeudi:'Jeu', vendredi:'Ven', samedi:'Sam', dimanche:'Dim' }
const PAYMENT_OPTIONS = [
  { value:'especes',  label:'💵 Espèces' },
  { value:'virement', label:'🏦 Virement' },
  { value:'cesu',     label:'🎫 CESU' },
]
const SCHEDULE_OPTIONS = [
  { value:'ponctuelle',  label:'📅 Date unique',     desc:'Une sortie précise' },
  { value:'multi_dates', label:'📆 Plusieurs dates',  desc:'Plusieurs sorties' },
  { value:'recurrente',  label:'🔄 Récurrente',       desc:'Toutes les semaines' },
  { value:'saisonniere', label:'🌿 Saisonnière',      desc:'Sur une période' },
]
const TARIF_LABELS = ['Séance','Mensuel','Trimestriel','Semestriel','Annuel']
const TARIF_DESCS  = { 'Séance':'Par sortie', 'Mensuel':'4 séances/mois', 'Trimestriel':'3 mois', 'Semestriel':'6 mois', 'Annuel':'Sept → Juin' }

const EMPTY = {
  titre:'', description:'', type:'autre', schedule_type:'ponctuelle',
  date:'', dates:[], recurrence_days:[], recurrence_time:'14:00',
  date_debut:'', date_fin:'', periode_label:'',
  prix: 0, tarifs:[],
  payment_methods:['especes'], virement_info:'', cesu_info:'',
  lieu:'', age_min:'', age_max:'', places_max:'', actif:true,
}

export default function ActivityForm({ initial = {}, onSave, onCancel, saving }) {
  const [form, setForm]    = useState({ ...EMPTY, ...initial, tarifs: initial.tarifs || [] })
  const [newDate, setNewDate] = useState('')
  const [errors, setErrors]  = useState({})

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
    if (errors[k]) setErrors(ex => ({ ...ex, [k]: null }))
  }

  const toggleDay = (day) => setForm(f => ({
    ...f,
    recurrence_days: f.recurrence_days.includes(day)
      ? f.recurrence_days.filter(d => d !== day)
      : [...f.recurrence_days, day],
  }))

  const togglePayment = (m) => setForm(f => ({
    ...f,
    payment_methods: f.payment_methods.includes(m)
      ? f.payment_methods.filter(x => x !== m)
      : [...f.payment_methods, m],
  }))

  const addDate = () => {
    if (!newDate || form.dates.includes(newDate)) return
    setForm(f => ({ ...f, dates: [...f.dates, newDate].sort() }))
    setNewDate('')
  }
  const removeDate = (d) => setForm(f => ({ ...f, dates: f.dates.filter(x => x !== d) }))

  // ── Tarifs ──
  const addTarif    = () => setForm(f => ({ ...f, tarifs: [...f.tarifs, { label:'Séance', prix:'', desc:'', popular:false }] }))
  const removeTarif = (i) => setForm(f => ({ ...f, tarifs: f.tarifs.filter((_, idx) => idx !== i) }))
  const updateTarif = (i, k, v) => setForm(f => ({ ...f, tarifs: f.tarifs.map((t, idx) => idx === i ? { ...t, [k]: v } : t) }))
  const setPopular  = (i) => setForm(f => ({ ...f, tarifs: f.tarifs.map((t, idx) => ({ ...t, popular: idx === i })) }))

  const validate = () => {
    const e = {}
    if (!form.titre?.trim())       e.titre       = 'Titre obligatoire'
    if (!form.description?.trim()) e.description = 'Description obligatoire'
    if (!form.places_max)          e.places_max  = 'Obligatoire'
    // Tarifs : si remplis, le prix doit être valide
    if (form.tarifs?.some(t => t.prix !== '' && isNaN(Number(t.prix)))) e.tarifs = 'Prix invalide sur un tarif'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const toISO = (v) => {
    if (!v) return undefined
    // datetime-local → ajouter :00.000Z si manquant
    if (v.length === 16) return new Date(v).toISOString()
    // date seule → ISO date
    if (v.length === 10) return v
    return v
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const prixLegacy = form.tarifs.length > 0 ? Number(form.tarifs[0].prix) : Number(form.prix) || 0
    onSave({
      ...form,
      date:       toISO(form.date),
      date_debut: toISO(form.date_debut),
      date_fin:   toISO(form.date_fin),
      dates:      (form.dates || []).map(d => toISO(d)),
      prix:       prixLegacy,
      tarifs:     form.tarifs.map(t => ({ ...t, prix: Number(t.prix) })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="activity-form" noValidate>

      {/* ── Infos générales ── */}
      <div className="af-section">
        <h3 className="af-section__title">📋 Informations générales</h3>
        <div className="af-field">
          <label>Titre *</label>
          <input value={form.titre} onChange={set('titre')} placeholder="Ex: Club Scout — Samedi matin" className={errors.titre ? 'error' : ''} />
          {errors.titre && <span className="af-error">{errors.titre}</span>}
        </div>
        <div className="af-field">
          <label>Description *</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Décrivez l'activité..." className={errors.description ? 'error' : ''} />
          {errors.description && <span className="af-error">{errors.description}</span>}
        </div>
        <div className="af-row">
          <div className="af-field">
            <label>Type</label>
            <select value={form.type} onChange={set('type')}>
              {TYPES.map(t => {
                const LABELS = { vtt:'VTT & Vélo', scout:'Club Scout', velo:'Vélo École', evenement:'Événements', rando:'Rando', autre:'Multi-activités / Autre' }
                return <option key={t} value={t}>{LABELS[t] || t}</option>
              })}
            </select>
          </div>
          <div className="af-field">
            <label>Lieu</label>
            <input value={form.lieu} onChange={set('lieu')} placeholder="Ex: Parc de la Grange" />
          </div>
        </div>
        <div className="af-row">
          <div className="af-field">
            <label>Âge min</label>
            <input type="number" value={form.age_min} onChange={set('age_min')} placeholder="6" min={0} max={18} />
          </div>
          <div className="af-field">
            <label>Âge max</label>
            <input type="number" value={form.age_max} onChange={set('age_max')} placeholder="14" min={0} max={18} />
          </div>
          <div className="af-field">
            <label>Places max *</label>
            <input type="number" value={form.places_max} onChange={set('places_max')} placeholder="10" min={1} className={errors.places_max ? 'error' : ''} />
            {errors.places_max && <span className="af-error">{errors.places_max}</span>}
          </div>
        </div>
      </div>

      {/* ── Planning ── */}
      <div className="af-section">
        <h3 className="af-section__title">🗓️ Planning</h3>
        <div className="af-schedule-options">
          {SCHEDULE_OPTIONS.map(o => (
            <label key={o.value} className={`af-option ${form.schedule_type === o.value ? 'selected' : ''}`}>
              <input type="radio" name="schedule_type" value={o.value} checked={form.schedule_type === o.value} onChange={set('schedule_type')} hidden />
              <span className="af-option__label">{o.label}</span>
              <span className="af-option__desc">{o.desc}</span>
            </label>
          ))}
        </div>

        {form.schedule_type === 'ponctuelle' && (
          <div className="af-field">
            <label>Date & heure *</label>
            <input type="datetime-local" value={form.date} onChange={set('date')} className={errors.date ? 'error' : ''} />
            {errors.date && <span className="af-error">{errors.date}</span>}
          </div>
        )}

        {form.schedule_type === 'multi_dates' && (
          <div className="af-field">
            <label>Dates *</label>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem' }}>
              <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} style={{ flex:1 }} />
              <button type="button" className="btn-secondary" onClick={addDate}>+ Ajouter</button>
            </div>
            {errors.dates && <span className="af-error">{errors.dates}</span>}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
              {form.dates.map(d => (
                <span key={d} style={{ background:'#e8f5ed', color:'var(--vert-foret)', padding:'3px 10px', borderRadius:50, fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'4px' }}>
                  {new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                  <button type="button" onClick={() => removeDate(d)} style={{ background:'none', border:'none', cursor:'pointer', color:'#c00', fontWeight:700, lineHeight:1, padding:0 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {['recurrente','saisonniere'].includes(form.schedule_type) && (
          <>
            <div className="af-field">
              <label>Jours *</label>
              <div className="af-days">
                {DAYS_FR.map(d => (
                  <button type="button" key={d}
                    className={`af-day ${form.recurrence_days.includes(d) ? 'selected' : ''}`}
                    onClick={() => toggleDay(d)}>{DAYS_LABEL[d]}</button>
                ))}
              </div>
              {errors.recurrence_days && <span className="af-error">{errors.recurrence_days}</span>}
            </div>
            <div className="af-row">
              <div className="af-field">
                <label>Heure</label>
                <input type="time" value={form.recurrence_time} onChange={set('recurrence_time')} />
              </div>
              <div className="af-field">
                <label>Début *</label>
                <input type="date" value={form.date_debut} onChange={set('date_debut')} className={errors.date_debut ? 'error' : ''} />
                {errors.date_debut && <span className="af-error">{errors.date_debut}</span>}
              </div>
              <div className="af-field">
                <label>Fin *</label>
                <input type="date" value={form.date_fin} onChange={set('date_fin')} />
              </div>
            </div>
            <div className="af-field">
              <label>Label période</label>
              <input value={form.periode_label} onChange={set('periode_label')} placeholder="Ex: Saison 2025-2026" />
            </div>
          </>
        )}
      </div>

      {/* ── Tarifs ── */}
      <div className="af-section">
        <h3 className="af-section__title">💶 Tarifs <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:400 }}>(optionnel)</span></h3>
        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
          Ajoutez une formule par ligne. Cliquez ☆ pour mettre une formule en avant.
        </p>
        {errors.tarifs && <div className="af-error" style={{ marginBottom:'0.5rem' }}>{errors.tarifs}</div>}

        {form.tarifs.length === 0 && (
          <div style={{ textAlign:'center', padding:'0.85rem', background:'#f9fbf9', borderRadius:10, border:'1.5px dashed #c8e6d4', marginBottom:'0.75rem', color:'var(--text-muted)', fontSize:'0.83rem' }}>
            Aucun tarif configuré
          </div>
        )}

        <div className="af-tarifs-list">
          {form.tarifs.map((t, i) => (
            <div key={i} className={`af-tarif-row ${t.popular ? 'popular' : ''}`}>
              <button type="button" className="af-tarif-star" onClick={() => setPopular(i)} title="Populaire">
                {t.popular ? '⭐' : '☆'}
              </button>
              <div className="af-tarif-field">
                <label>Formule</label>
                <select value={t.label} onChange={e => updateTarif(i, 'label', e.target.value)}>
                  {TARIF_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="af-tarif-field af-tarif-field--prix">
                <label>Prix €</label>
                <input type="number" min="0" step="0.5" value={t.prix} onChange={e => updateTarif(i, 'prix', e.target.value)} placeholder="25" />
              </div>
              <div className="af-tarif-field af-tarif-field--desc">
                <label>Description</label>
                <input value={t.desc || ''} onChange={e => updateTarif(i, 'desc', e.target.value)} placeholder={TARIF_DESCS[t.label] || ''} />
              </div>
              <button type="button" className="af-tarif-remove" onClick={() => removeTarif(i)}>🗑️</button>
            </div>
          ))}
        </div>
        <button type="button" className="af-tarif-add" onClick={addTarif}>+ Ajouter une formule</button>
      </div>

      {/* ── Paiement ── */}
      <div className="af-section">
        <h3 className="af-section__title">💳 Modes de paiement *</h3>
        <div className="af-payment-options">
          {PAYMENT_OPTIONS.map(o => (
            <label key={o.value} className={`af-option ${form.payment_methods.includes(o.value) ? 'selected' : ''}`}>
              <input type="checkbox" checked={form.payment_methods.includes(o.value)} onChange={() => togglePayment(o.value)} hidden />
              <span className="af-option__label">{o.label}</span>
            </label>
          ))}
        </div>
        {errors.payment_methods && <span className="af-error">{errors.payment_methods}</span>}
        {form.payment_methods.includes('virement') && (
          <div className="af-field" style={{ marginTop:'0.75rem' }}>
            <label>Infos virement</label>
            <input value={form.virement_info} onChange={set('virement_info')} placeholder="IBAN, banque..." />
          </div>
        )}
        {form.payment_methods.includes('cesu') && (
          <div className="af-field" style={{ marginTop:'0.75rem' }}>
            <label>Infos CESU</label>
            <input value={form.cesu_info} onChange={set('cesu_info')} placeholder="Infos CESU..." />
          </div>
        )}
      </div>

      {/* ── Statut ── */}
      <div className="af-section">
        <label className="af-toggle">
          <input type="checkbox" checked={form.actif} onChange={set('actif')} />
          <span className="af-toggle__track" />
          <span className="af-toggle__label">{form.actif ? '✅ Activité visible' : '🔴 Activité masquée'}</span>
        </label>
      </div>

      <div className="af-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>Annuler</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

    </form>
  )
}
