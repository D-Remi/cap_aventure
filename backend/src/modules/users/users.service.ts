import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find({
      select: ['id', 'email', 'prenom', 'nom', 'telephone', 'role', 'actif', 'created_at'],
      order: { created_at: 'DESC' },
    })
  }

  async findOne(id: number) {
    const u = await this.repo.findOne({ where: { id }, relations: ['children'] })
    if (!u) throw new NotFoundException()
    return u
  }

  async update(id: number, dto: Partial<User>) {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: number) {
    const u = await this.findOne(id)
    return this.repo.remove(u)
  }
}
