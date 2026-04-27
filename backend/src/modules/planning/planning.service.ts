import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThanOrEqual } from 'typeorm'
import { PlanningSeance } from './planning.entity'

@Injectable()
export class PlanningService {
  constructor(@InjectRepository(PlanningSeance) private repo: Repository<PlanningSeance>) {}

  findAll(from?: string) {
    const where: any = {}
    if (from) where.date = MoreThanOrEqual(new Date(from))
    return this.repo.find({ where, relations: ['activity'], order: { date: 'ASC' } })
  }

  findByActivity(activityId: number) {
    return this.repo.find({ where: { activity_id: activityId }, order: { date: 'ASC' } })
  }

  create(dto: Partial<PlanningSeance>) {
    return this.repo.save(this.repo.create(dto))
  }

  async update(id: number, dto: Partial<PlanningSeance>) {
    await this.repo.update(id, dto)
    return this.repo.findOne({ where: { id }, relations: ['activity'] })
  }

  remove(id: number) {
    return this.repo.delete(id)
  }
}