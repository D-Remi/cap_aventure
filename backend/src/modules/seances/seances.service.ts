import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Seance } from './seance.entity'
import { Objectif } from './objectif.entity'
import { User } from '../users/user.entity'

@Injectable()
export class SeancesService {
  constructor(
    @InjectRepository(Seance)  private seances:  Repository<Seance>,
    @InjectRepository(Objectif) private objectifs: Repository<Objectif>,
  ) {}

  // ═══ SÉANCES ═══

  // Admin : toutes les séances
  findAll() {
    return this.seances.find({ relations: ['user', 'child'], order: { date: 'DESC' } })
  }

  // Admin : séances d'une famille
  findByUser(userId: number) {
    return this.seances.find({
      where: { user_id: userId },
      relations: ['child'],
      order: { date: 'DESC' },
    })
  }

  // Famille : ses séances réalisées, sans les notes privées
  async findForFamily(userId: number) {
    const list = await this.seances.find({
      where: { user_id: userId },
      relations: ['child'],
      order: { date: 'DESC' },
    })
    // On retire les notes privées et les CR non partagés
    return list.map(s => {
      const { notes_privees, ...safe } = s
      return { ...safe, compte_rendu: s.cr_partage ? s.compte_rendu : null }
    })
  }

  findOne(id: number) {
    return this.seances.findOne({ where: { id }, relations: ['user', 'child'] })
  }

  async create(dto: Partial<Seance>) {
    // Calcul auto de la durée si horaires fournis
    if (dto.heure_debut && dto.heure_fin && !dto.duree_heures) {
      dto.duree_heures = this.calcDuree(dto.heure_debut, dto.heure_fin)
    }
    return this.seances.save(this.seances.create(dto))
  }

  async update(id: number, dto: Partial<Seance>) {
    if (dto.heure_debut && dto.heure_fin) {
      dto.duree_heures = this.calcDuree(dto.heure_debut, dto.heure_fin)
    }
    await this.seances.update(id, dto)
    return this.findOne(id)
  }

  remove(id: number) { return this.seances.delete(id) }

  private calcDuree(debut: string, fin: string): number {
    const [h1, m1] = debut.split(':').map(Number)
    const [h2, m2] = fin.split(':').map(Number)
    return +(((h2 * 60 + m2) - (h1 * 60 + m1)) / 60).toFixed(1)
  }

  // Statistiques par famille
  async statsFamille(userId: number) {
    const list = await this.seances.find({ where: { user_id: userId, statut: 'realisee' } })
    const totalHeures = list.reduce((s, x) => s + parseFloat(String(x.duree_heures || 0)), 0)
    const parType = list.reduce((acc, x) => {
      acc[x.type] = (acc[x.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return {
      nb_seances: list.length,
      total_heures: +totalHeures.toFixed(1),
      par_type: parType,
      derniere: list.length ? list.sort((a,b) => b.date.localeCompare(a.date))[0].date : null,
    }
  }

  // ═══ OBJECTIFS ═══

  findObjectifs(userId: number) {
    return this.objectifs.find({
      where: { user_id: userId },
      relations: ['child'],
      order: { created_at: 'DESC' },
    })
  }

  findObjectifsFamille(userId: number) {
    return this.objectifs.find({
      where: { user_id: userId, visible_famille: true },
      relations: ['child'],
      order: { created_at: 'DESC' },
    })
  }

  createObjectif(dto: Partial<Objectif>) {
    return this.objectifs.save(this.objectifs.create(dto))
  }

  async updateObjectif(id: number, dto: Partial<Objectif>) {
    await this.objectifs.update(id, dto)
    return this.objectifs.findOne({ where: { id }, relations: ['child'] })
  }

  removeObjectif(id: number) { return this.objectifs.delete(id) }
}
