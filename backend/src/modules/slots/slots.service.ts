import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThanOrEqual } from 'typeorm'
import { Slot } from './slot.entity'

@Injectable()
export class SlotsService {
  constructor(@InjectRepository(Slot) private repo: Repository<Slot>) {}

  findAll(all = false) {
    if (all) return this.repo.find({ order:{ date:'ASC' } })
    const today = new Date().toISOString().split('T')[0]
    return this.repo.find({
      where:{ actif:true, statut:'ouvert', date: MoreThanOrEqual(today) as any },
      order:{ date:'ASC' },
    })
  }

  findOne(id: number) { return this.repo.findOne({ where:{ id } }) }

  create(dto: Partial<Slot>) {
    if (dto.places_max && dto.places_max > 3) dto.places_max = 3
    return this.repo.save(this.repo.create(dto))
  }

  async update(id: number, dto: Partial<Slot>) {
    if (dto.places_max && dto.places_max > 3) dto.places_max = 3
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  remove(id: number) { return this.repo.delete(id) }

  // Créer plusieurs créneaux récurrents d'un coup
  async createRecurrence(dto: {
    date_debut: string
    date_fin: string
    jours: number[]   // 0=lun,1=mar...6=dim
    heure_debut: string
    heure_fin: string
    periode: string
    type_accueil: string
    titre?: string
    description?: string
    lieu?: string
    tarif: number
    places_max: number
  }) {
    const start  = new Date(dto.date_debut)
    const end    = new Date(dto.date_fin)
    const slots: Slot[] = []
    const cur    = new Date(start)

    while (cur <= end) {
      const dow = (cur.getDay() + 6) % 7 // 0=lun
      if (dto.jours.includes(dow)) {
        const dateStr = cur.toISOString().split('T')[0]
        const slot = this.repo.create({
          date:         dateStr,
          periode:      dto.periode as any,
          heure_debut:  dto.heure_debut,
          heure_fin:    dto.heure_fin,
          type_accueil: dto.type_accueil as any,
          titre:        dto.titre || null,
          description:  dto.description || null,
          lieu:         dto.lieu || 'Biganos',
          tarif:        dto.tarif,
          places_max:   Math.min(dto.places_max, 3),
          statut:       'ouvert',
          actif:        true,
        })
        slots.push(slot)
      }
      cur.setDate(cur.getDate() + 1)
    }

    return this.repo.save(slots)
  }
}