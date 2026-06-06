import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from './document.entity'
import { User } from '../users/user.entity'

@Injectable()
export class DocumentsService {
  constructor(@InjectRepository(Document) private repo: Repository<Document>) {}

  findByUser(userId: number) {
    return this.repo.find({
      where: { user_id: userId },
      select: ['id','child_id','user_id','type','nom','filename','mimetype','taille','valide','note_admin','created_at'],
      relations: ['child'],
      order: { created_at: 'DESC' },
    })
  }

  findAll() {
    return this.repo.find({
      select: ['id','child_id','user_id','type','nom','filename','mimetype','taille','valide','note_admin','created_at'],
      relations: ['child','user'],
      order: { created_at: 'DESC' },
    })
  }

  // Récupérer UN document avec ses données (pour visualisation)
  findOneWithData(id: number) {
    return this.repo.findOne({ where: { id } })
  }

  async create(user: User, dto: {
    child_id?: number
    type: string
    filename: string
    nom: string
    mimetype: string
    taille: number
    data: string   // base64
  }) {
    const doc = this.repo.create({
      user_id:  user.id,
      child_id: dto.child_id || null,
      type:     dto.type as any,
      nom:      dto.nom,
      filename: dto.filename,
      mimetype: dto.mimetype,
      taille:   dto.taille,
      data:     dto.data,
    })
    const saved = await this.repo.save(doc)
    // Retourner sans la data pour ne pas saturer la réponse
    const { data: _, ...rest } = saved as any
    return rest
  }

  async validate(id: number, valide: boolean, note?: string) {
    await this.repo.update(id, { valide, note_admin: note || null })
    return this.repo.findOne({
      where: { id },
      select: ['id','child_id','user_id','type','nom','filename','mimetype','taille','valide','note_admin','created_at'],
      relations: ['child','user'],
    })
  }

  async remove(id: number, user: User) {
    const doc = await this.repo.findOne({ where: { id } })
    if (!doc) throw new NotFoundException()
    if (user.role !== 'admin' && doc.user_id !== user.id) throw new ForbiddenException()
    return this.repo.delete(id)
  }
}