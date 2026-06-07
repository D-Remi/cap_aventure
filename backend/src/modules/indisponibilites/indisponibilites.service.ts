import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Indisponibilite } from './indisponibilite.entity'

@Injectable()
export class IndisponibilitesService {
  constructor(@InjectRepository(Indisponibilite) private repo: Repository<Indisponibilite>) {}

  findAll()    { return this.repo.find({ order:{ date:'ASC', heure_debut:'ASC' } }) }
  findByMonth(year: number, month: number) {
    const from = `${year}-${String(month).padStart(2,'0')}-01`
    const to   = `${year}-${String(month).padStart(2,'0')}-31`
    return this.repo.find({ where:{ date: Between(from, to) as any }, order:{ date:'ASC' } })
  }
  create(dto: Partial<Indisponibilite>) { return this.repo.save(this.repo.create(dto)) }
  remove(id: number)                   { return this.repo.delete(id) }
  update(id: number, dto: Partial<Indisponibilite>) {
    return this.repo.update(id, dto).then(() => this.repo.findOne({ where:{ id } }))
  }
}