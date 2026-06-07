import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PlanningSeance } from './planning.entity'

@Injectable()
export class PlanningService {
  constructor(@InjectRepository(PlanningSeance) private repo: Repository<PlanningSeance>) {}
  findAll() { return this.repo.find({ order:{ date:'ASC' } }) }
  findBySlot(slotId: number) { return this.repo.find({ where:{ slot_id: slotId } }) }
}