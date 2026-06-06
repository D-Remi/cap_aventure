import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Child } from './child.entity'
import { User } from '../users/user.entity'

@Injectable()
export class ChildrenService {
  constructor(@InjectRepository(Child) private repo: Repository<Child>) {}
  findByUser(uid: number) { return this.repo.find({ where:{ user_id:uid }, order:{ created_at:'ASC' } }) }
  findAll() { return this.repo.find({ relations:['user'], order:{ created_at:'DESC' } }) }
  findOne(id: number) { return this.repo.findOne({ where:{ id }, relations:['user'] }) }
  create(user: User, dto: Partial<Child>) { return this.repo.save(this.repo.create({ ...dto, user_id: user.id })) }
  async updateStep1(id: number, user: User, dto: any) {
    const c = await this.repo.findOne({ where:{ id } })
    if (!c) throw new NotFoundException()
    if (user.role !== 'admin' && c.user_id !== user.id) throw new ForbiddenException()
    const fields = ['prenom','nom','date_naissance','allergie','medecin_nom','medecin_telephone','contact_urgence_nom','contact_urgence_telephone','contact_urgence_lien']
    const payload: any = {}
    fields.forEach(f => { if (dto[f] !== undefined) payload[f] = dto[f] })
    await this.repo.update(id, payload)
    return this.repo.findOne({ where:{ id } })
  }
  async updateStep2(id: number, user: User, dto: any) {
    const c = await this.repo.findOne({ where:{ id } })
    if (!c) throw new NotFoundException()
    if (user.role !== 'admin' && c.user_id !== user.id) throw new ForbiddenException()
    await this.repo.update(id, { ...dto, dossier_complete: true })
    return this.repo.findOne({ where:{ id } })
  }
  async updateNotesAnimateur(id: number, notes: string) {
    await this.repo.update(id, { notes_animateur: notes })
    return this.repo.findOne({ where:{ id } })
  }
  async remove(id: number, user: User) {
    const c = await this.repo.findOne({ where:{ id } })
    if (!c) throw new NotFoundException()
    if (user.role !== 'admin' && c.user_id !== user.id) throw new ForbiddenException()
    return this.repo.delete(id)
  }
}