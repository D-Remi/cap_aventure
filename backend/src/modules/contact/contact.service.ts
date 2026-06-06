import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContactRequest } from './contact.entity'

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactRequest) private repo: Repository<ContactRequest>) {}
  create(dto: Partial<ContactRequest>) { return this.repo.save(this.repo.create(dto)) }
  findAll() { return this.repo.find({ order:{ created_at:'DESC' } }) }
  findPending() { return this.repo.find({ where:{ traite:false }, order:{ created_at:'DESC' } }) }
  async markTraite(id: number) { await this.repo.update(id, { traite:true }); return this.repo.findOne({ where:{ id } }) }
  remove(id: number) { return this.repo.delete(id) }
}