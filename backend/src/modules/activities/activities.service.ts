import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Activity, ActivityType } from './activity.entity'
import { Registration } from '../registrations/registration.entity'

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private repo: Repository<Activity>,
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
  ) {}

  async findAll(onlyActif = false) {
    const qb = this.repo.createQueryBuilder('a')
      .loadRelationCountAndMap(
        'a.inscriptions_count',
        'a.registrations',
        'r',
        (qb) => qb.where("r.status != 'cancelled'"),
      )
      // MySQL : ISNULL() met les NULL à la fin
      .orderBy('ISNULL(a.date)', 'ASC')
      .addOrderBy('a.date', 'ASC')

    if (onlyActif) {
      qb.where('a.actif = true')
        .andWhere(
          '(a.schedule_type != :p OR a.date >= :now)',
          { p: 'ponctuelle', now: new Date() }
        )
    }

    const activities = await qb.getMany()

    return activities.map((a) => ({
      ...a,
      places_restantes: Math.max(0, a.places_max - ((a as any).inscriptions_count || 0)),
    }))
  }

  async findOne(id: number) {
    const a = await this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.registrations', 'r', "r.status != 'cancelled'")
      .where('a.id = :id', { id })
      .getOne()
    if (!a) throw new NotFoundException()
    const inscriptions = (a.registrations || []).length
    return {
      ...a,
      places_restantes: Math.max(0, a.places_max - inscriptions),
    }
  }

  create(dto: Partial<Activity>) {
    return this.repo.save(this.repo.create(dto))
  }

  async update(id: number, dto: Partial<Activity>) {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number) {
    const a = await this.findOne(id)
    return this.repo.remove(a)
  }
}
