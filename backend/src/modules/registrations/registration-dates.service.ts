import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RegistrationDate } from './registration-dates.entity'
import { Registration } from './registration.entity'

// Nombre de séances par formule
const SEANCES_PAR_FORMULE: Record<string, number | null> = {
  essai:       1,
  seance:      1,
  mensuel:     4,
  trimestriel: null, // toutes les occurrences sur 3 mois
  semestriel:  null, // toutes sur 6 mois
  annuel:      null, // toutes sur l'année
}

// Durée en mois par formule (pour calculer la date de fin auto)
const MOIS_PAR_FORMULE: Record<string, number> = {
  mensuel:     1,
  trimestriel: 3,
  semestriel:  6,
  annuel:      10, // sept → juin
}

@Injectable()
export class RegistrationDatesService {
  constructor(
    @InjectRepository(RegistrationDate) private repo: Repository<RegistrationDate>,
    @InjectRepository(Registration)     private regRepo: Repository<Registration>,
  ) {}

  // ── Récupérer les dates sélectionnées pour une inscription ────
  async getByRegistration(registrationId: number) {
    return this.repo.find({
      where: { registration: { id: registrationId } },
      order: { date: 'ASC' },
    })
  }

  // ── Récupérer toutes les inscriptions d'un user avec leurs dates ─
  async getByUser(userId: number) {
    const regs = await this.regRepo.find({
      where: { child: { user: { id: userId } } },
      relations: ['child', 'activity'],
      order: { created_at: 'DESC' },
    })

    return Promise.all(regs.map(async reg => ({
      ...reg,
      selectedDates: await this.getByRegistration(reg.id),
    })))
  }

  // ── Sauvegarder les dates choisies par le parent ──────────────
  async saveDates(registrationId: number, userId: number, dates: string[]) {
    const reg = await this.regRepo.findOne({
      where: { id: registrationId },
      relations: ['child', 'child.user', 'activity'],
    })
    if (!reg) throw new NotFoundException('Inscription introuvable.')
    if (reg.child.user.id !== userId) throw new BadRequestException('Non autorisé.')

    const subType = reg.subscription_type
    const expectedCount = SEANCES_PAR_FORMULE[subType]

    // Validation du nombre de dates selon la formule
    if (subType === 'seance' || subType === 'essai') {
      if (dates.length !== 1) throw new BadRequestException('Sélectionnez exactement 1 date.')
    } else if (subType === 'mensuel') {
      if (dates.length !== 4) throw new BadRequestException('Sélectionnez exactement 4 dates.')
    }
    // Trimestriel/Semestriel/Annuel : pas de limite stricte, on valide juste que les dates existent

    // Vérifier que les dates existent bien dans l'activité
    const activityDates = reg.activity.dates || []
    for (const d of dates) {
      const dDate = new Date(d)
      const exists = activityDates.some(ad => {
        const adDate = new Date(ad)
        return adDate.toDateString() === dDate.toDateString()
      })
      if (!exists) throw new BadRequestException(`La date ${d} n'est pas disponible pour cette activité.`)
    }

    // Supprimer les anciennes dates et sauvegarder les nouvelles
    await this.repo.delete({ registration: { id: registrationId } })

    const entities = dates.map(d => this.repo.create({
      registration: { id: registrationId } as any,
      date: new Date(d),
    }))
    return this.repo.save(entities)
  }

  // ── Calculer automatiquement les dates selon formule + date début ─
  computeDatesFromStart(activity: any, startDate: string, subscriptionType: string): string[] {
    if (!activity.dates?.length) return []

    const start = new Date(startDate)
    const allDates = activity.dates
      .map((d: string) => new Date(d))
      .filter((d: Date) => d >= start)
      .sort((a: Date, b: Date) => a.getTime() - b.getTime())

    const subType = subscriptionType

    if (subType === 'essai' || subType === 'seance') {
      return allDates.slice(0, 1).map((d: Date) => d.toISOString())
    }

    if (subType === 'mensuel') {
      return allDates.slice(0, 4).map((d: Date) => d.toISOString())
    }

    // Pour les formules longues, calculer la date de fin
    const mois = MOIS_PAR_FORMULE[subType]
    if (mois) {
      const endDate = new Date(start)
      endDate.setMonth(endDate.getMonth() + mois)
      return allDates
        .filter((d: Date) => d <= endDate)
        .map((d: Date) => d.toISOString())
    }

    return allDates.map((d: Date) => d.toISOString())
  }

  // ── Admin : valider la présence à une date ───────────────────
  async markAttended(dateId: number, attended: boolean) {
    await this.repo.update(dateId, { attended })
    return this.repo.findOne({ where: { id: dateId } })
  }
}
