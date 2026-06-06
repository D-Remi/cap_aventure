import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlanningSeance } from './planning.entity'

@Injectable()
export class PlanningService {
  constructor(@InjectRepository(PlanningSeance) private repo: Repository<PlanningSeance>) {}

  findAll(from?: string) {
    const where: any = {}
    if (from) where.date = { $gte: new Date(from) }
    return this.repo.find({ where, relations: ['slot'], order: { date: 'ASC' } })
  }

  findBySlot(slotId: number) {
    return this.repo.find({ where: { slot_id: slotId }, order: { date: 'ASC' } })
  }

  create(dto: Partial<PlanningSeance>) {
    return this.repo.save(this.repo.create(dto))
  }

  async update(id: number, dto: Partial<PlanningSeance>) {
    await this.repo.update(id, dto)
    return this.repo.findOne({ where: { id }, relations: ['slot'] })
  }

  remove(id: number) {
    return this.repo.delete(id)
  }
}