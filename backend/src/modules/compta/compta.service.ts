import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, In } from 'typeorm'
import { ComptaEntree } from './compta.entity'
import { ParametresEntreprise } from '../entreprise/parametres.entity'
import { ContratSeance } from '../contrats/contrat-seance.entity'
import { Contrat } from '../contrats/contrat.entity'
import { User } from '../users/user.entity'
import {
  PLAFOND_MICRO_SERVICES, SEUIL_TVA, SEUIL_TVA_MAJORE, SEUIL_COMPTE_DEDIE,
  ATTESTATION_AVANT, MODES_SANS_AVANTAGE_FISCAL,
} from './compta.constants'

const r2 = (n: number) => Math.round(n * 100) / 100
const num = (v: any) => parseFloat(String(v ?? 0)) || 0
const pad = (n: number) => String(n).padStart(2, '0')
const finDeMois = (y: number, m: number) => `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`

const NOMS_MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const LIBELLES_MODE: Record<string, string> = {
  avance_immediate: 'Avance immédiate URSSAF', virement: 'Virement', cesu: 'CESU préfinancé',
  cheque: 'Chèque', cb: 'Carte bancaire', especes: 'Espèces',
}

function heures(debut: string, fin: string) {
  const [h1, m1] = String(debut).split(':').map(Number)
  const [h2, m2] = String(fin).split(':').map(Number)
  let d = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (d < 0) d += 24 * 60 // garde de nuit qui passe minuit
  return d / 60
}

@Injectable()
export class ComptaService {
  constructor(
    @InjectRepository(ComptaEntree)         private repo: Repository<ComptaEntree>,
    @InjectRepository(ParametresEntreprise) private pRepo: Repository<ParametresEntreprise>,
    @InjectRepository(ContratSeance)        private sRepo: Repository<ContratSeance>,
    @InjectRepository(Contrat)              private cRepo: Repository<Contrat>,
    @InjectRepository(User)                 private uRepo: Repository<User>,
  ) {}

  findAll() { return this.repo.find({ relations:['user'], order:{ date:'DESC', created_at:'DESC' } }) }

  findByMonth(year: number, month: number) {
    return this.repo.find({
      where: { date: Between(`${year}-${pad(month)}-01`, finDeMois(year, month)) as any },
      relations: ['user'],
      order: { date:'DESC' },
    })
  }

  private recettesEntre(from: string, to: string) {
    return this.repo.find({ where: { type: 'recette', date: Between(from, to) as any }, relations: ['user'], order: { date: 'ASC', id: 'ASC' } })
  }

  async stats(year: number) {
    // Filtre sur la date de l'opération (et non sur la date de saisie)
    const all = await this.repo.find({ where: { date: Between(`${year}-01-01`, `${year}-12-31`) as any } })
    const months = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      const entrees = all.filter(e => Number(String(e.date).slice(5, 7)) === m)
      const recettes = entrees.filter(e => e.type === 'recette').reduce((s, e) => s + num(e.montant), 0)
      const depenses = entrees.filter(e => e.type === 'depense').reduce((s, e) => s + num(e.montant), 0)
      return { mois: m, recettes: r2(recettes), depenses: r2(depenses), net: r2(recettes - depenses) }
    })
    const totalRecettes = months.reduce((s, m) => s + m.recettes, 0)
    const totalDepenses = months.reduce((s, m) => s + m.depenses, 0)
    return { months, totalRecettes: r2(totalRecettes), totalDepenses: r2(totalDepenses), net: r2(totalRecettes - totalDepenses) }
  }

  create(dto: Partial<ComptaEntree>) { return this.repo.save(this.repo.create(dto)) }
  update(id: number, dto: Partial<ComptaEntree>) { return this.repo.update(id, dto).then(() => this.repo.findOne({ where:{id} })) }
  remove(id: number) { return this.repo.delete(id) }

  private async params() {
    let p = await this.pRepo.findOne({ where: { id: 1 } })
    if (!p) p = await this.pRepo.save(this.pRepo.create({ id: 1 }))
    return p
  }

  // ── Déclarations URSSAF, seuils et alertes ──────────────────────────────
  async declarations(year: number) {
    const p = await this.params()
    const recettes = await this.recettesEntre(`${year}-01-01`, `${year}-12-31`)
    const prev = await this.recettesEntre(`${year - 1}-01-01`, `${year - 1}-12-31`)
    const assujetti = p.tva_regime === 'assujetti'
    const tva = num(p.tva_taux) / 100
    const ht = (ttc: number) => assujetti ? ttc / (1 + tva) : ttc

    const tCot = num(p.taux_cotisations) / 100
    const tCfp = num(p.taux_cfp) / 100
    const tVl  = p.versement_liberatoire ? num(p.taux_vl) / 100 : 0

    const calc = (label: string, from: string, to: string, echeance: string) => {
      const encaisse = recettes.filter(e => e.date >= from && e.date <= to).reduce((s, e) => s + num(e.montant), 0)
      const ca = ht(encaisse)
      const cotisations = ca * tCot, cfp = ca * tCfp, vl = ca * tVl
      return {
        periode: label, du: from, au: to, echeance,
        encaisse_ttc: r2(encaisse), ca_a_declarer: r2(ca), tva_collectee: r2(encaisse - ca),
        cotisations: r2(cotisations), cfp: r2(cfp), impot_vl: r2(vl), total_a_payer: r2(cotisations + cfp + vl),
      }
    }

    const periodes = p.periodicite_urssaf === 'mensuelle'
      ? Array.from({ length: 12 }, (_, i) => {
          const m = i + 1
          const ny = m === 12 ? year + 1 : year, nm = m === 12 ? 1 : m + 1
          return calc(`${NOMS_MOIS[i]} ${year}`, `${year}-${pad(m)}-01`, finDeMois(year, m), finDeMois(ny, nm))
        })
      : [
          calc(`1er trimestre ${year}`, `${year}-01-01`, `${year}-03-31`, `${year}-04-30`),
          calc(`2e trimestre ${year}`,  `${year}-04-01`, `${year}-06-30`, `${year}-07-31`),
          calc(`3e trimestre ${year}`,  `${year}-07-01`, `${year}-09-30`, `${year}-10-31`),
          calc(`4e trimestre ${year}`,  `${year}-10-01`, `${year}-12-31`, `${year + 1}-01-31`),
        ]

    const caAnnee = ht(recettes.reduce((s, e) => s + num(e.montant), 0))
    const caPrec  = ht(prev.reduce((s, e) => s + num(e.montant), 0))

    // Projection simple sur l'année à partir du rythme actuel
    const today = new Date()
    const jours = year === today.getFullYear()
      ? Math.max(1, Math.ceil((today.getTime() - new Date(year, 0, 1).getTime()) / 86400000))
      : 365
    const projection = year === today.getFullYear() ? caAnnee * 365 / jours : caAnnee

    const alertes: { niveau: 'info' | 'attention' | 'urgent', texte: string }[] = []
    if (!assujetti && caAnnee > SEUIL_TVA_MAJORE)
      alertes.push({ niveau: 'urgent', texte: `Chiffre d'affaires au-dessus de ${SEUIL_TVA_MAJORE} € : la TVA est due dès le jour du dépassement. Contactez votre service des impôts.` })
    else if (!assujetti && caAnnee > SEUIL_TVA)
      alertes.push({ niveau: 'attention', texte: `Chiffre d'affaires au-dessus de ${SEUIL_TVA} € : vous resterez en franchise cette année si vous ne dépassez pas ${SEUIL_TVA_MAJORE} €, mais la TVA s'appliquera l'an prochain.` })
    else if (!assujetti && projection > SEUIL_TVA)
      alertes.push({ niveau: 'info', texte: `Au rythme actuel, vous dépasserez ${SEUIL_TVA} € cette année : anticipez la TVA dans vos prix.` })
    if (caAnnee > PLAFOND_MICRO_SERVICES)
      alertes.push({ niveau: 'urgent', texte: `Plafond micro-entreprise (${PLAFOND_MICRO_SERVICES} €) dépassé cette année. Deux années de suite au-dessus font sortir du régime.` })
    if (caAnnee > SEUIL_COMPTE_DEDIE && caPrec > SEUIL_COMPTE_DEDIE)
      alertes.push({ niveau: 'attention', texte: `Plus de ${SEUIL_COMPTE_DEDIE} € de CA deux années de suite : un compte bancaire dédié à l'activité est obligatoire.` })
    if (!p.siret || !p.sap_numero)
      alertes.push({ niveau: 'attention', texte: 'SIRET ou numéro de déclaration SAP non renseigné : vos factures et attestations fiscales ne sont pas conformes.' })

    return {
      annee: year,
      periodicite: p.periodicite_urssaf,
      regime_tva: p.tva_regime,
      acre: p.acre,
      taux: { cotisations: num(p.taux_cotisations), cfp: num(p.taux_cfp), vl: tVl * 100 },
      periodes,
      total: {
        ca: r2(caAnnee),
        cotisations: r2(periodes.reduce((s, x) => s + x.cotisations, 0)),
        cfp: r2(periodes.reduce((s, x) => s + x.cfp, 0)),
        impot_vl: r2(periodes.reduce((s, x) => s + x.impot_vl, 0)),
        a_payer: r2(periodes.reduce((s, x) => s + x.total_a_payer, 0)),
      },
      ca_annee_precedente: r2(caPrec),
      projection: r2(projection),
      seuils: { plafond_micro: PLAFOND_MICRO_SERVICES, tva: SEUIL_TVA, tva_majore: SEUIL_TVA_MAJORE, compte_dedie: SEUIL_COMPTE_DEDIE },
      alertes,
    }
  }

  // ── Livre des recettes (export CSV pour Excel) ─────────────────────────
  async livreRecettesCsv(year: number) {
    const recettes = await this.recettesEntre(`${year}-01-01`, `${year}-12-31`)
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lignes = [
      ['Date d\'encaissement', 'Référence (facture, chèque…)', 'Client', 'Nature de la prestation', 'Montant (€)', 'Mode de règlement'].map(esc).join(';'),
      ...recettes.map(e => [
        String(e.date).split('-').reverse().join('/'),
        e.reference || '',
        e.user ? `${e.user.prenom} ${e.user.nom}` : (e.famille || ''),
        e.description || e.categorie || 'Garde d\'enfants à domicile',
        num(e.montant).toFixed(2).replace('.', ','),
        LIBELLES_MODE[e.mode] || e.mode,
      ].map(esc).join(';')),
      ['', '', '', 'TOTAL', recettes.reduce((s, e) => s + num(e.montant), 0).toFixed(2).replace('.', ','), ''].map(esc).join(';'),
    ]
    return '﻿' + lignes.join('\r\n')
  }

  // ── Attestations fiscales annuelles (Code du travail, art. D7233-4) ────
  async attestations(year: number) {
    const p = await this.params()
    const recettes = (await this.recettesEntre(`${year}-01-01`, `${year}-12-31`)).filter(e => e.user_id)
    const userIds = [...new Set(recettes.map(e => e.user_id))]
    if (!userIds.length) return { annee: year, avant: ATTESTATION_AVANT, entreprise: p, clients: [] }

    const users = await this.uRepo.find({ where: { id: In(userIds) } })
    const contrats = await this.cRepo.find({ where: { user_id: In(userIds) } })
    const seances = contrats.length
      ? await this.sRepo.find({ where: { contrat_id: In(contrats.map(c => c.id)), date: Between(`${year}-01-01`, `${year}-12-31`) as any }, order: { date: 'ASC' } })
      : []

    const clients = users.map(u => {
      const rec = recettes.filter(e => e.user_id === u.id)
      const eligibles = rec.filter(e => !MODES_SANS_AVANTAGE_FISCAL.includes(e.mode))
      const cIds = contrats.filter(c => c.user_id === u.id).map(c => c.id)
      const interventions = seances.filter(s => cIds.includes(s.contrat_id)).map(s => ({
        date: s.date, debut: String(s.heure_debut).slice(0, 5), fin: String(s.heure_fin).slice(0, 5),
        duree: r2(heures(s.heure_debut, s.heure_fin)),
      }))
      return {
        user: { id: u.id, prenom: u.prenom, nom: u.nom, email: u.email, adresse: u.adresse, code_postal: u.code_postal, ville: u.ville },
        montant_acquitte: r2(eligibles.reduce((s, e) => s + num(e.montant), 0)),
        dont_cesu: r2(eligibles.filter(e => e.mode === 'cesu').reduce((s, e) => s + num(e.montant), 0)),
        especes_exclues: r2(rec.filter(e => MODES_SANS_AVANTAGE_FISCAL.includes(e.mode)).reduce((s, e) => s + num(e.montant), 0)),
        heures_total: r2(interventions.reduce((s, i) => s + i.duree, 0)),
        interventions,
        adresse_manquante: !u.adresse || !u.ville,
      }
    })
    return { annee: year, avant: ATTESTATION_AVANT, entreprise: p, clients }
  }

  // ── Chiffres pour NOVA (états d'activité trimestriels, art. R7232-19) ──
  async nova(year: number) {
    const recettes = await this.recettesEntre(`${year}-01-01`, `${year}-12-31`)
    const seances = await this.sRepo.find({ where: { date: Between(`${year}-01-01`, `${year}-12-31`) as any }, relations: ['contrat'] })
    const trimestres = [1, 2, 3, 4].map(t => {
      const from = `${year}-${pad(t * 3 - 2)}-01`, to = finDeMois(year, t * 3)
      const rec = recettes.filter(e => e.date >= from && e.date <= to)
      const sea = seances.filter(s => s.date >= from && s.date <= to)
      const clients = new Set<number>([
        ...rec.filter(e => e.user_id).map(e => e.user_id),
        ...sea.filter(s => s.contrat).map(s => s.contrat.user_id),
      ])
      return {
        trimestre: t, du: from, au: to,
        heures: r2(sea.reduce((s, x) => s + heures(x.heure_debut, x.heure_fin), 0)),
        chiffre_affaires: r2(rec.reduce((s, e) => s + num(e.montant), 0)),
        clients: clients.size,
        interventions: sea.length,
      }
    })
    return { annee: year, trimestres, total: {
      heures: r2(trimestres.reduce((s, t) => s + t.heures, 0)),
      chiffre_affaires: r2(trimestres.reduce((s, t) => s + t.chiffre_affaires, 0)),
    } }
  }
}
