import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Not, Repository } from 'typeorm'
import { RendezVous, ReglagesRdv, CRENEAUX_PAR_DEFAUT } from './rendezvous.entities'
import { ReserverRdvDto } from './rendezvous.dto'
import { creneauxLibres, maintenantParis, ajouterJours, enMinutes, lienAgenda, dateLongue, Occupation } from './creneaux'
import { Garde } from '../gardes/garde.entity'
import { Seance } from '../seances/seance.entity'
import { EmailService } from '../email/email.service'
import { analyserContact } from '../contact/anti-spam'

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/

@Injectable()
export class RendezVousService implements OnModuleInit {
  private readonly logger = new Logger(RendezVousService.name)

  constructor(
    @InjectRepository(RendezVous) private repo: Repository<RendezVous>,
    @InjectRepository(ReglagesRdv) private regRepo: Repository<ReglagesRdv>,
    @InjectRepository(Garde) private gardes: Repository<Garde>,
    @InjectRepository(Seance) private seances: Repository<Seance>,
    private email: EmailService,
  ) {}

  // Crée les tables si la migration n'a pas encore été passée (la production n'utilise pas synchronize)
  async onModuleInit() {
    try {
      await this.repo.query(`CREATE TABLE IF NOT EXISTS \`rendez_vous\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`date\` date NOT NULL,
        \`heure\` varchar(5) NOT NULL,
        \`duree_min\` int NOT NULL DEFAULT 30,
        \`prenom\` varchar(100) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`telephone\` varchar(30) NOT NULL,
        \`residence\` varchar(20) NULL,
        \`commune\` varchar(100) NULL,
        \`message\` text NULL,
        \`statut\` enum('confirme','fait','annule') NOT NULL DEFAULT 'confirme',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`), KEY \`idx_rdv_date\` (\`date\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
      await this.repo.query(`CREATE TABLE IF NOT EXISTS \`rendez_vous_reglages\` (
        \`id\` int NOT NULL,
        \`creneaux\` text NOT NULL,
        \`duree_min\` int NOT NULL DEFAULT 30,
        \`delai_heures\` int NOT NULL DEFAULT 12,
        \`jours_max\` int NOT NULL DEFAULT 21,
        \`actif\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
    } catch (e) {
      this.logger.error(`Tables des rendez-vous non créées : passe database/migrate_rendez_vous_2026.sql (${e?.message})`)
    }
  }

  async reglages(): Promise<ReglagesRdv> {
    const r = await this.regRepo.findOne({ where: { id: 1 } })
    if (r) return r
    return this.regRepo.save(this.regRepo.create({ id: 1, creneaux: CRENEAUX_PAR_DEFAUT, duree_min: 30, delai_heures: 12, jours_max: 21, actif: true }))
  }

  async majReglages(dto: any) {
    const r = await this.reglages()
    if (dto.creneaux && typeof dto.creneaux === 'object') {
      const propre: Record<string, string[]> = {}
      for (let j = 1; j <= 7; j++) {
        const liste = Array.isArray(dto.creneaux[String(j)]) ? dto.creneaux[String(j)] : []
        propre[String(j)] = [...new Set<string>(liste.filter((h: unknown) => typeof h === 'string' && HEURE.test(h)))].sort()
      }
      r.creneaux = propre
    }
    const borne = (v: unknown, min: number, max: number, def: number) => {
      const n = Number(v)
      return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def
    }
    if (dto.duree_min !== undefined) r.duree_min = borne(dto.duree_min, 10, 90, r.duree_min)
    if (dto.delai_heures !== undefined) r.delai_heures = borne(dto.delai_heures, 1, 168, r.delai_heures)
    if (dto.jours_max !== undefined) r.jours_max = borne(dto.jours_max, 3, 60, r.jours_max)
    if (dto.actif !== undefined) r.actif = !!dto.actif
    return this.regRepo.save(r)
  }

  // Ce qui occupe déjà l'agenda : gardes, séances planifiées, appels déjà réservés
  private async occupations(debut: string, fin: string): Promise<Occupation[]> {
    const occ: Occupation[] = []
    const gardes = await this.gardes.find({ where: { statut: Not('termine') } })
    for (const g of gardes) {
      const base = { debut: g.heure_debut, fin: g.heure_fin, marge: g.trajet_min || 0 }
      // Gardes une semaine sur deux : bloquées chaque semaine, par prudence
      if (g.recurrent) occ.push({ ...base, jour: g.jour_semaine })
      else if (g.date_ponctuelle && g.date_ponctuelle >= debut && g.date_ponctuelle <= fin) occ.push({ ...base, date: g.date_ponctuelle })
    }
    const seances = await this.seances.find({ where: { date: Between(debut, fin), statut: 'planifiee' } })
    for (const s of seances) {
      if (s.heure_debut && s.heure_fin) occ.push({ date: s.date, debut: s.heure_debut, fin: s.heure_fin, marge: 30 })
    }
    const rdv = await this.repo.find({ where: { date: Between(debut, fin), statut: 'confirme' } })
    for (const r of rdv) {
      const m = enMinutes(r.heure) + r.duree_min
      occ.push({ date: r.date, debut: r.heure, fin: `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}` })
    }
    return occ
  }

  async disponibilites() {
    const r = await this.reglages()
    if (!r.actif) return { actif: false, duree: r.duree_min, jours: [] }
    const now = maintenantParis()
    const occupations = await this.occupations(now.date, ajouterJours(now.date, r.jours_max))
    const jours = creneauxLibres({ creneaux: r.creneaux, duree: r.duree_min, delaiHeures: r.delai_heures, joursMax: r.jours_max, occupations, maintenant: now })
    return { actif: true, duree: r.duree_min, jours }
  }

  async reserver(dto: ReserverRdvDto) {
    const { site_web, temps_formulaire, ...donnees } = dto
    const verdict = analyserContact({ prenom: donnees.prenom, email: donnees.email, message: donnees.message, site_web, duree: temps_formulaire })
    if (verdict.bloquer) {
      this.logger.warn(`Réservation : robot bloqué (${donnees.email})`)
      return { ok: true, date: donnees.date, heure: donnees.heure }
    }
    if (verdict.raison) {
      this.logger.warn(`Réservation refusée (${verdict.raison}) : ${donnees.email}`)
      throw new BadRequestException("Votre réservation n'a pas pu être enregistrée. Écrivez-moi par le formulaire de contact ou sur WhatsApp.")
    }

    const dispo = await this.disponibilites()
    const jour = dispo.jours.find(j => j.date === donnees.date)
    if (!jour || !jour.creneaux.includes(donnees.heure)) {
      throw new ConflictException("Ce créneau vient d'être pris ou n'est plus disponible. Choisissez-en un autre.")
    }

    const rdv = await this.repo.save(this.repo.create({ ...donnees, duree_min: dispo.duree, statut: 'confirme' }))
    const quand = `${dateLongue(rdv.date)} à ${rdv.heure.replace(':', ' h ')}`
    const agenda = lienAgenda(rdv.date, rdv.heure, rdv.duree_min, 'Appel avec Rémi · Éduc & Vous', `Rémi vous appelle au ${rdv.telephone}.`)

    this.email.sendRdvAdmin({ ...rdv, quand }).catch(() => {})
    this.email.sendRdvConfirmation(rdv.email, rdv.prenom, quand, rdv.telephone, agenda).catch(() => {})
    return { ok: true, date: rdv.date, heure: rdv.heure, duree: rdv.duree_min, agenda }
  }

  liste() {
    const debut = ajouterJours(maintenantParis().date, -60)
    return this.repo.find({ where: { date: Between(debut, '2999-12-31') }, order: { date: 'ASC', heure: 'ASC' } })
  }

  async changerStatut(id: number, statut: string, prevenir: boolean) {
    if (!['confirme', 'fait', 'annule'].includes(statut)) throw new BadRequestException('Statut inconnu')
    const rdv = await this.repo.findOne({ where: { id } })
    if (!rdv) throw new NotFoundException()
    const avant = rdv.statut
    rdv.statut = statut
    await this.repo.save(rdv)
    if (statut === 'annule' && avant !== 'annule' && prevenir) {
      const quand = `${dateLongue(rdv.date)} à ${rdv.heure.replace(':', ' h ')}`
      this.email.sendRdvAnnulation(rdv.email, rdv.prenom, quand).catch(() => {})
    }
    return rdv
  }
}
