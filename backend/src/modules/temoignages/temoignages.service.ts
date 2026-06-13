import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Temoignage } from './temoignage.entity'

@Injectable()
export class TemoignagesService {
  constructor(@InjectRepository(Temoignage) private repo: Repository<Temoignage>) {}

  // Public : uniquement les approuvés, ET seulement s'il y en a au moins 5
  async findPublic() {
    const approuves = await this.repo.find({ where:{ approuve:true }, order:{ created_at:'DESC' } })
    return approuves.length >= 5 ? approuves : []
  }

  // Compteur public (pour savoir combien il en manque)
  async countApprouves() {
    const n = await this.repo.count({ where:{ approuve:true } })
    return { count: n, seuil: 5, visible: n >= 5 }
  }

  findAll() { return this.repo.find({ order:{ created_at:'DESC' } }) }
  create(dto: Partial<Temoignage>) { return this.repo.save(this.repo.create({ ...dto, approuve:false })) }
  approve(id: number, approuve: boolean) { return this.repo.update(id, { approuve }).then(()=>this.repo.findOne({where:{id}})) }
  remove(id: number) { return this.repo.delete(id) }
}