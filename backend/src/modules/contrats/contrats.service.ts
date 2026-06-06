import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Contrat } from './contrat.entity'
import { ContratSeance } from './contrat-seance.entity'
import { Facture } from './facture.entity'
import { User } from '../users/user.entity'

@Injectable()
export class ContratsService {
  constructor(
    @InjectRepository(Contrat)       private cRepo: Repository<Contrat>,
    @InjectRepository(ContratSeance) private sRepo: Repository<ContratSeance>,
    @InjectRepository(Facture)       private fRepo: Repository<Facture>,
  ) {}

  findAll()                       { return this.cRepo.find({ order:{ created_at:'DESC' } }) }
  findByUser(uid: number)         { return this.cRepo.find({ where:{ user_id:uid }, order:{ created_at:'DESC' } }) }
  findOne(id: number)             { return this.cRepo.findOne({ where:{ id } }) }
  findSeances(contratId: number)  { return this.sRepo.find({ where:{ contrat_id:contratId }, order:{ date:'ASC' } }) }
  findFactures(contratId: number) { return this.fRepo.find({ where:{ contrat_id:contratId }, order:{ created_at:'DESC' } }) }

  // Créneaux contractés (pour le calendrier)
  findActifsBetween(from: string, to: string) {
    return this.cRepo.find({
      where: [{ statut:'actif' }, { statut:'signe_admin' }],
      order: { date_debut:'ASC' },
    })
  }

  // Admin crée le contrat
  async create(dto: Partial<Contrat>) {
    const semaines = this.countWeeks(dto.date_debut, dto.date_fin)
    const estime   = Math.round(semaines * Number(dto.heures_semaine) * Number(dto.tarif_horaire))
    const c = this.cRepo.create({ ...dto, montant_estime: estime, statut:'brouillon' })
    return this.cRepo.save(c)
  }

  async update(id: number, dto: Partial<Contrat>) {
    await this.cRepo.update(id, dto)
    return this.findOne(id)
  }

  // Admin envoie au parent
  async envoyer(id: number) {
    await this.cRepo.update(id, { statut:'envoye' })
    return this.findOne(id)
  }

  // Signature parent
  async signerParent(id: number, signature: string, user: User) {
    const c = await this.cRepo.findOne({ where:{ id } })
    if (!c) throw new NotFoundException()
    if (c.user_id !== user.id) throw new ForbiddenException()
    if (!['envoye','brouillon'].includes(c.statut)) throw new ForbiddenException('Contrat déjà signé')
    await this.cRepo.update(id, {
      signature_parent:    signature,
      signature_parent_at: new Date(),
      statut:              'signe_parent',
    })
    return this.findOne(id)
  }

  // Signature admin
  async signerAdmin(id: number, signature: string) {
    await this.cRepo.update(id, {
      signature_admin:    signature,
      signature_admin_at: new Date(),
      statut:             'actif',
    })
    return this.findOne(id)
  }

  // Saisie d'une séance
  async addSeance(contratId: number, dto: Partial<ContratSeance>) {
    const c = await this.cRepo.findOne({ where:{ id:contratId } })
    if (!c) throw new NotFoundException()
    const heures = this.calcHeures(dto.heure_debut, dto.heure_fin)
    const kmTotal = (Number(dto.km_aller)||0) + (Number(dto.km_retour)||0)
    const kmFacturables = Math.max(0, kmTotal - Number(c.km_inclus))
    const mHeures = Math.round(heures * Number(c.tarif_horaire) * 100) / 100
    const mKm     = Math.round(kmFacturables * Number(c.tarif_km) * 100) / 100
    const s = this.sRepo.create({
      ...dto,
      contrat_id:     contratId,
      montant_heures: mHeures,
      montant_km:     mKm,
      montant_total:  Math.round((mHeures + mKm) * 100) / 100,
    })
    return this.sRepo.save(s)
  }

  async updateSeance(id: number, dto: Partial<ContratSeance>) {
    const s = await this.sRepo.findOne({ where:{ id }, relations:['contrat'] })
    if (!s) throw new NotFoundException()
    const c = s.contrat
    const heures   = this.calcHeures(dto.heure_debut||s.heure_debut, dto.heure_fin||s.heure_fin)
    const kmTotal  = (Number(dto.km_aller??s.km_aller)||0) + (Number(dto.km_retour??s.km_retour)||0)
    const kmFact   = Math.max(0, kmTotal - Number(c.km_inclus))
    const mHeures  = Math.round(heures * Number(c.tarif_horaire) * 100) / 100
    const mKm      = Math.round(kmFact  * Number(c.tarif_km)     * 100) / 100
    await this.sRepo.update(id, { ...dto, montant_heures:mHeures, montant_km:mKm, montant_total:Math.round((mHeures+mKm)*100)/100 })
    return this.sRepo.findOne({ where:{ id } })
  }

  removeSeance(id: number) { return this.sRepo.delete(id) }

  // Générer une facture
  async genererFacture(contratId: number, dto: { periode_debut:string; periode_fin:string; notes?:string }) {
    const c       = await this.cRepo.findOne({ where:{ id:contratId } })
    const seances = await this.sRepo.find({
      where: { contrat_id:contratId, facture_id:null,
        date: Between(dto.periode_debut, dto.periode_fin) as any },
    })
    const totH  = seances.reduce((s,x) => s + this.calcHeures(x.heure_debut,x.heure_fin), 0)
    const totKm = seances.reduce((s,x) => s + Number(x.km_aller||0) + Number(x.km_retour||0), 0)
    const mH    = seances.reduce((s,x) => s + Number(x.montant_heures||0), 0)
    const mKm   = seances.reduce((s,x) => s + Number(x.montant_km||0),    0)
    const total = Math.round((mH+mKm)*100)/100

    const count  = await this.fRepo.count()
    const numero = `FAC-${new Date().getFullYear()}-${String(count+1).padStart(3,'0')}`

    const facture = await this.fRepo.save(this.fRepo.create({
      contrat_id:    contratId,
      user_id:       c.user_id,
      numero,
      periode_debut: dto.periode_debut,
      periode_fin:   dto.periode_fin,
      total_heures:  Math.round(totH*10)/10,
      total_km:      totKm,
      montant_heures: Math.round(mH*100)/100,
      montant_km:    Math.round(mKm*100)/100,
      montant_total: total,
      notes:         dto.notes,
      statut:        'brouillon',
    }))

    // Marquer les séances comme facturées
    await Promise.all(seances.map(s => this.sRepo.update(s.id, { facture_id:facture.id })))
    return { facture, seances }
  }

  async marquerPayee(factureId: number) {
    await this.fRepo.update(factureId, { statut:'payee' })
    return this.fRepo.findOne({ where:{ id:factureId } })
  }

  // Helpers
  private calcHeures(debut: string, fin: string) {
    if (!debut||!fin) return 0
    const [h1,m1] = debut.split(':').map(Number)
    const [h2,m2] = fin.split(':').map(Number)
    return Math.max(0, (h2*60+m2 - h1*60-m1) / 60)
  }

  private countWeeks(from: string, to: string) {
    const d1 = new Date(from), d2 = new Date(to)
    return Math.max(1, Math.ceil((d2.getTime()-d1.getTime()) / (7*86400000)))
  }
}