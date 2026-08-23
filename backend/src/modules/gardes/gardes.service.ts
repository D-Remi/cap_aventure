import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Garde } from './garde.entity'

@Injectable()
export class GardesService {
  constructor(
    @InjectRepository(Garde) private repo: Repository<Garde>,
  ) {}

  findAll() {
    return this.repo.find({ order: { jour_semaine: 'ASC', heure_debut: 'ASC' } })
  }

  create(data: Partial<Garde>) {
    return this.repo.save(this.repo.create(data))
  }

  async update(id: number, data: Partial<Garde>) {
    await this.repo.update(id, data)
    return this.repo.findOne({ where: { id } })
  }

  remove(id: number) {
    return this.repo.delete(id)
  }

  // Statistiques : heures et revenus estimés.
  // semaine = 'paire' | 'impaire' pour filtrer, sinon compte une semaine "type"
  async stats(semaine?: string) {
    const gardes = await this.repo.find()
    let heuresSemaine = 0
    let revenuSemaine = 0
    let heuresCesu = 0
    let heuresAgence = 0

    for (const g of gardes) {
      if (g.statut === 'termine') continue
      // filtrage par type de semaine
      if (semaine === 'paire' && g.semaine_type === 'impaire') continue
      if (semaine === 'impaire' && g.semaine_type === 'paire') continue
      const h = this.dureeHeures(g.heure_debut, g.heure_fin)
      // les gardes ponctuelles ne comptent pas dans le "par semaine" récurrent
      if (g.recurrent) {
        heuresSemaine += h
        revenuSemaine += h * Number(g.tarif_horaire || 0)
        if (g.type_contrat === 'cesu') heuresCesu += h
        else heuresAgence += h
      }
    }

    return {
      heuresSemaine: Math.round(heuresSemaine * 10) / 10,
      heuresMois: Math.round(heuresSemaine * 4.33 * 10) / 10,
      revenuSemaine: Math.round(revenuSemaine * 100) / 100,
      revenuMois: Math.round(revenuSemaine * 4.33 * 100) / 100,
      heuresCesu: Math.round(heuresCesu * 10) / 10,
      heuresAgence: Math.round(heuresAgence * 10) / 10,
      nbGardes: gardes.filter(g => g.statut !== 'termine').length,
    }
  }

  private dureeHeures(debut: string, fin: string): number {
    const [dh, dm] = debut.split(':').map(Number)
    const [fh, fm] = fin.split(':').map(Number)
    let mins = (fh * 60 + fm) - (dh * 60 + dm)
    if (mins < 0) mins += 24 * 60
    return mins / 60
  }
}
