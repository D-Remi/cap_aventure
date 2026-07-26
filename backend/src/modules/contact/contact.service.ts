import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContactRequest } from './contact.entity'
import { EmailService } from '../email/email.service'

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactRequest) private repo: Repository<ContactRequest>,
    private email: EmailService,
  ) {}

  async create(dto: Partial<ContactRequest>) {
    const saved = await this.repo.save(this.repo.create(dto))
    // Notification email à l'admin (ne bloque pas si l'email échoue)
    this.email.sendContactNotif({
      prenom: saved.prenom,
      email: saved.email,
      telephone: saved.telephone,
      service: saved.service,
      urgence: saved.urgence,
      message: saved.message,
    }).catch(() => {})
    return saved
  }

  findAll() { return this.repo.find({ order: { created_at: 'DESC' } }) }
  findPending() { return this.repo.find({ where: { traite: false }, order: { created_at: 'DESC' } }) }
  async markTraite(id: number) { await this.repo.update(id, { traite: true }); return this.repo.findOne({ where: { id } }) }
  remove(id: number) { return this.repo.delete(id) }

  // Réponse envoyée au parent depuis l'admin
  async repondre(id: number, message: string) {
    const contact = await this.repo.findOne({ where: { id } })
    if (!contact) return null
    await this.email.sendReponseContact(contact.email, contact.prenom, message)
    await this.repo.update(id, { traite: true })
    return this.repo.findOne({ where: { id } })
  }
}
