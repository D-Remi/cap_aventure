import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Photo } from './photo.entity'

@Injectable()
export class PhotosService {
  constructor(@InjectRepository(Photo) private repo: Repository<Photo>) {}

  // Parent : ses propres photos
  findByUser(userId: number) {
    return this.repo.find({
      where: { user_id: userId, visible: true },
      select: ['id','child_id','titre','date_seance','mimetype','taille','visible','created_at'],
      relations: ['child'],
      order: { created_at: 'DESC' },
    })
  }

  // Admin : toutes les photos
  findAll() {
    return this.repo.find({
      select: ['id','child_id','user_id','titre','date_seance','mimetype','taille','visible','created_at'],
      relations: ['child','user'],
      order: { created_at: 'DESC' },
    })
  }

  // Récupérer une photo avec ses données (pour affichage)
  findOneWithData(id: number) {
    return this.repo.findOne({ where: { id } })
  }

  create(dto: Partial<Photo>) { return this.repo.save(this.repo.create(dto)) }

  async setVisible(id: number, visible: boolean) {
    await this.repo.update(id, { visible })
    return this.repo.findOne({ where: { id } })
  }

  remove(id: number) { return this.repo.delete(id) }
}