import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './document.entity'
import { User } from '../users/user.entity'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

@Injectable()
export class DocumentsService {
  constructor(@InjectRepository(Document) private repo: Repository<Document>) {}

  // Docs d'un parent (tous ses enfants)
  findByUser(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['child'],
      order: { created_at: 'DESC' },
    })
  }

  // Tous les docs (admin)
  findAll() {
    return this.repo.find({
      relations: ['child', 'user'],
      order: { created_at: 'DESC' },
    })
  }

  // Docs d'un enfant spécifique
  findByChild(childId: number) {
    return this.repo.find({
      where: { child: { id: childId } },
      order: { created_at: 'DESC' },
    })
  }

  async create(user: User, dto: {
    child_id?: number
    type: string
    filename: string
    original_name: string
    size: number
    url: string
  }) {
    const doc = this.repo.create({
      user,
      child: dto.child_id ? { id: dto.child_id } as any : null,
      type: dto.type as any,
      filename: dto.filename,
      original_name: dto.original_name,
      size: dto.size,
      url: dto.url,
    })
    return this.repo.save(doc)
  }

  async remove(id: number, user: User) {
    const doc = await this.repo.findOne({ where: { id }, relations: ['user'] })
    if (!doc) throw new NotFoundException()
    if (user.role !== 'admin' && doc.user.id !== user.id) throw new ForbiddenException()

    // Supprimer le fichier physique
    const filePath = join(process.cwd(), 'uploads', 'documents', doc.filename)
    if (existsSync(filePath)) unlinkSync(filePath)

    return this.repo.remove(doc)
  }
}
