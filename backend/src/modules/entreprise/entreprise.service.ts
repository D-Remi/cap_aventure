import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ParametresEntreprise } from './parametres.entity'

// Champs modifiables depuis le back-office
const CHAMPS = [
  'nom', 'prenom', 'nom_commercial', 'adresse', 'code_postal', 'ville', 'email', 'telephone',
  'siret', 'code_ape', 'immatriculation', 'date_creation',
  'sap_numero', 'sap_date', 'agrement_numero', 'agrement_date', 'intervenant_identifiant',
  'tva_regime', 'tva_taux', 'taux_cotisations', 'taux_cfp', 'versement_liberatoire', 'taux_vl', 'acre', 'periodicite_urssaf',
  'assureur', 'police_rc', 'mediateur_nom', 'mediateur_adresse', 'mediateur_site', 'hebergeur',
  'iban', 'bic', 'checklist',
]

// Champs publiés sur le site (mentions légales, CGV) : jamais l'IBAN ni la liste des démarches
const PUBLICS = [
  'nom', 'prenom', 'nom_commercial', 'adresse', 'code_postal', 'ville', 'email', 'telephone',
  'siret', 'code_ape', 'immatriculation', 'sap_numero', 'sap_date', 'agrement_numero', 'agrement_date',
  'tva_regime', 'tva_taux', 'assureur', 'police_rc', 'mediateur_nom', 'mediateur_adresse', 'mediateur_site', 'hebergeur',
]

@Injectable()
export class EntrepriseService {
  constructor(@InjectRepository(ParametresEntreprise) private repo: Repository<ParametresEntreprise>) {}

  async get(): Promise<ParametresEntreprise> {
    let p = await this.repo.findOne({ where: { id: 1 } })
    if (!p) p = await this.repo.save(this.repo.create({ id: 1 }))
    return p
  }

  async getPublic() {
    const p = await this.get()
    const out: Record<string, any> = {}
    PUBLICS.forEach(k => { out[k] = (p as any)[k] ?? null })
    return out
  }

  async update(dto: Record<string, any>) {
    await this.get()
    const data: Record<string, any> = {}
    CHAMPS.forEach(k => {
      if (dto[k] === undefined) return
      let v = dto[k]
      if (v === '') v = null
      if (k === 'checklist' && v && typeof v !== 'string') v = JSON.stringify(v)
      data[k] = v
    })
    await this.repo.update(1, data)
    return this.get()
  }
}
