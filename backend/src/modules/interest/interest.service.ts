import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InterestForm } from './interest.entity'
import { EmailService } from '../email/email.service'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(InterestForm) private repo: Repository<InterestForm>,
    private email: EmailService,
    private notif: NotificationsService,
  ) {}

  async create(dto: Partial<InterestForm>) {
    const form = await this.repo.save(this.repo.create(dto))
    if (process.env.ADMIN_EMAIL) {
      this.email.sendNewInterestNotification(process.env.ADMIN_EMAIL, {
        prenom: dto.prenom || '',
        nom: dto.nom || '',
        email: dto.email || '',
        enfant: dto.enfant || '',
        activite: dto.activite || '',
      })
    }
    // Notif temps réel pour les admins
    this.notif.emitAdmin({
      type: 'new_interest',
      title: '📩 Nouvelle demande de contact',
      message: `${dto.prenom} ${dto.nom || ''} a soumis une demande via le site`,
      data: { prenom: dto.prenom, email: dto.email },
    })
    return form
  }

  findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } })
  }
}
