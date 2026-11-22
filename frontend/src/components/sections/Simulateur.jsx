import { useMemo, useState } from 'react'
import { TARIFS as T, plafondCredit, euros } from '../../data/tarifs'
import { ouvrirRendezVous } from '../../utils/rendezVous'
import './Simulateur.css'

const FORMULES = [
  { v: 'semaine', l: 'Chaque semaine', d: `${T.abonnement} €/h, même créneau` },
  { v: 'ponctuel', l: 'De temps en temps', d: `${T.ponctuel} €/h, à la demande` },
  { v: 'journee', l: 'Journée répit', d: `${T.journee} € les 8 h` },
  { v: 'soiree', l: 'Soirée + nuit', d: `${T.soiree} €, 18 h → 9 h` },
  { v: 'weekend', l: 'Week-end', d: `${T.weekend} €, samedi → dimanche` },
]

const SEMAINES_PAR_MOIS = 52 / 12

function Curseur({ label, valeur, min, max, pas = 1, unite, onChange }) {
  return (
    <label className="ev-simu__curseur">
      <span>{label} <b>{valeur} {unite}</b></span>
      <input type="range" min={min} max={max} step={pas} value={valeur} onChange={e => onChange(Number(e.target.value))} />
    </label>
  )
}

function Puces({ options, valeur, onChange, label }) {
  return (
    <div className="ev-simu__puces" role="radiogroup" aria-label={label}>
      {options.map(o => (
        <button key={o.v} type="button" role="radio" aria-checked={valeur === o.v}
          className={valeur === o.v ? 'is-on' : ''} onClick={() => onChange(o.v)}>
          {o.l}{o.d && <small>{o.d}</small>}
        </button>
      ))}
    </div>
  )
}

export default function Simulateur({ residenceInitiale = 'france', onContact }) {
  const [residence, setResidence] = useState(residenceInitiale)
  const [formule, setFormule] = useState(residenceInitiale === 'suisse' ? 'ponctuel' : 'semaine')
  const [heuresSemaine, setHeuresSemaine] = useState(4)
  const [gardes, setGardes] = useState(2)
  const [heuresGarde, setHeuresGarde] = useState(4)
  const [fratrie, setFratrie] = useState(0)
  const [enfants, setEnfants] = useState(1)
  const [aeeh, setAeeh] = useState(false)

  const suisse = residence === 'suisse'
  // En Suisse : uniquement des gardes ponctuelles (pas d'abonnement hebdomadaire)
  const f = suisse && formule === 'semaine' ? 'ponctuel' : formule
  const minHeures = suisse ? T.minSuisseHeures : 3
  const hGarde = Math.max(heuresGarde, minHeures)

  const r = useMemo(() => {
    let prix = 0, detail = ''
    const parHeure = (base) => base + T.enfantSup * fratrie
    if (f === 'semaine') {
      const h = heuresSemaine * SEMAINES_PAR_MOIS
      prix = h * parHeure(T.abonnement)
      detail = `${heuresSemaine} h par semaine, soit ${h.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} h par mois`
    } else if (f === 'ponctuel') {
      prix = gardes * hGarde * parHeure(T.ponctuel)
      detail = `${gardes} garde${gardes > 1 ? 's' : ''} de ${hGarde} h par mois`
    } else if (f === 'journee') {
      prix = gardes * (T.journee + T.enfantSup * fratrie * 8)
      detail = `${gardes} journée${gardes > 1 ? 's' : ''} par mois`
    } else if (f === 'soiree') {
      prix = gardes * T.soiree
      detail = `${gardes} soirée${gardes > 1 ? 's' : ''} + nuit par mois`
    } else {
      prix = gardes * T.weekend
      detail = `${gardes} week-end${gardes > 1 ? 's' : ''} par mois`
    }
    const deplacements = suisse ? gardes * T.forfaitSuisse : 0
    prix += deplacements

    if (suisse) return { prix, detail, deplacements, credit: 0, reste: prix }

    const annuel = prix * 12
    const plafond = plafondCredit({ enfants, aeeh })
    const creditAnnuel = 0.5 * Math.min(annuel, plafond)
    const credit = creditAnnuel / 12
    return { prix, detail, deplacements, credit, reste: prix - credit, plafond, depasse: annuel > plafond }
  }, [f, heuresSemaine, gardes, hGarde, fratrie, suisse, enfants, aeeh])

  const forfaitSansFratrie = (f === 'soiree' || f === 'weekend') && fratrie > 0

  return (
    <div className="ev-simu">
      <div className="ev-simu__form">
        <div className="ev-simu__bloc">
          <h3>Vous habitez</h3>
          <Puces label="Lieu de résidence" valeur={residence} onChange={setResidence}
            options={[{ v: 'france', l: 'En France' }, { v: 'suisse', l: 'En Suisse' }]} />
        </div>

        <div className="ev-simu__bloc">
          <h3>La formule</h3>
          <Puces label="Formule" valeur={f} onChange={setFormule}
            options={suisse ? FORMULES.filter(o => o.v !== 'semaine') : FORMULES} />
          {suisse && <p className="ev-simu__aide">En Suisse, je viens pour des gardes ponctuelles réservées au moins 8 jours avant. Pour un créneau chaque semaine, on passe par Chèque service (Genève) ou Chèques-emploi (Vaud) : écrivez-moi.</p>}
        </div>

        <div className="ev-simu__bloc">
          <h3>Combien</h3>
          {f === 'semaine'
            ? <Curseur label="Heures par semaine" valeur={heuresSemaine} min={2} max={20} unite="h" onChange={setHeuresSemaine} />
            : <Curseur label={f === 'ponctuel' ? 'Gardes par mois' : 'Par mois'} valeur={gardes} min={1} max={f === 'weekend' ? 2 : 8} unite="" onChange={setGardes} />}
          {f === 'ponctuel' && (
            <Curseur label="Heures par garde" valeur={hGarde} min={minHeures} max={10} unite="h" onChange={setHeuresGarde} />
          )}
          <Curseur label="Frères et sœurs gardés en plus" valeur={fratrie} min={0} max={3} unite="" onChange={setFratrie} />
          {forfaitSansFratrie && <p className="ev-simu__aide">Soirée et week-end avec la fratrie : le prix est fixé sur devis, ce calcul ne l'inclut pas.</p>}
        </div>

        {!suisse && (
          <div className="ev-simu__bloc">
            <h3>Pour le plafond du crédit d'impôt</h3>
            <Curseur label="Enfants à charge" valeur={enfants} min={1} max={4} unite="" onChange={setEnfants} />
            <label className="ev-simu__case">
              <input type="checkbox" checked={aeeh} onChange={e => setAeeh(e.target.checked)} />
              <span>Un enfant ouvre droit au complément d'AEEH, ou un membre du foyer est invalide</span>
            </label>
          </div>
        )}
      </div>

      <aside className="ev-simu__resultat" aria-live="polite">
        <span className="ev-simu__sur">{r.detail}</span>
        {suisse ? (
          <>
            <p className="ev-simu__lab">Ce que vous payez</p>
            <p className="ev-simu__gros">{euros(r.reste)}<small> / mois</small></p>
            <ul className="ev-simu__lignes">
              <li><span>Gardes</span><b>{euros(r.prix - r.deplacements)}</b></li>
              <li><span>Forfait Genève ou Vaud ({gardes} × {T.forfaitSuisse} €)</span><b>{euros(r.deplacements)}</b></li>
            </ul>
            <p className="ev-simu__note">Facturé en euros. Pas de crédit d'impôt français pour les familles qui habitent en Suisse. Selon votre canton, une partie des frais de garde peut être déductible de vos impôts : renseignez-vous auprès de votre administration fiscale.</p>
          </>
        ) : (
          <>
            <p className="ev-simu__lab">Ce que vous payez réellement</p>
            <p className="ev-simu__gros">{euros(r.reste)}<small> / mois</small></p>
            <ul className="ev-simu__lignes">
              <li><span>Prix facturé</span><b>{euros(r.prix)}</b></li>
              <li><span>Crédit d'impôt de 50 %</span><b className="moins">− {euros(r.credit)}</b></li>
            </ul>
            {r.depasse && <p className="ev-simu__alerte">Vos dépenses dépassent le plafond annuel de {euros(r.plafond)} : au-delà, le crédit d'impôt ne s'applique plus. Le montant ci-dessus est une moyenne sur l'année.</p>}
            <p className="ev-simu__note">Estimation sous conditions, pour un foyer résident fiscal en France. Le crédit d'impôt est déduit tout de suite avec l'avance immédiate de l'URSSAF, sinon il vous est versé l'année suivante, même si vous ne payez pas d'impôt.</p>
          </>
        )}
        <div className="ev-simu__btns">
          <button type="button" className="ev-btn ev-btn--lime" onClick={ouvrirRendezVous}>Réserver un appel gratuit</button>
          {onContact && <button type="button" className="ev-btn ev-btn--ghost-light" onClick={() => onContact('repit')}>Poser une question</button>}
        </div>
      </aside>
    </div>
  )
}
