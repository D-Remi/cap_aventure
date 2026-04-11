import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Child } from './child.entity'
import { User } from '../users/user.entity'

@Injectable()
export class ChildrenService {
  constructor(@InjectRepository(Child) private repo: Repository<Child>) {}

  findByUser(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { created_at: 'ASC' },
    })
  }

  findAll() {
    return this.repo.find({ relations: ['user'], order: { created_at: 'DESC' } })
  }

  async create(user: User, dto: Partial<Child>) {
    const child = this.repo.create({ ...dto, user })
    return this.repo.save(child)
  }

  async update(id: number, user: User, dto: Partial<Child>) {
    const child = await this.repo.findOne({ where: { id }, relations: ['user'] })
    if (!child) throw new NotFoundException()
    if (user.role !== 'admin' && child.user.id !== user.id) throw new ForbiddenException()
    await this.repo.update(id, dto)
    return this.repo.findOne({ where: { id } })
  }

  async remove(id: number, user: User) {
    const child = await this.repo.findOne({ where: { id }, relations: ['user'] })
    if (!child) throw new NotFoundException()
    if (user.role !== 'admin' && child.user.id !== user.id) throw new ForbiddenException()
    return this.repo.remove(child)
  }
}
