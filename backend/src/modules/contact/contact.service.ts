import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContactRequest } from './contact.entity'
import { EmailService } from '../email/email.service'
import { analyserContact } from './anti-spam'
import { ajouterColonnes } from '../../common/colonnes'

@Injectable()
export class ContactService implements OnModuleInit {
  private readonly logger = new Logger(ContactService.name)

  constructor(
    @InjectRepository(ContactRequest) private repo: Repository<ContactRequest>,
    private email: EmailService,
  ) {}

  // Ajoute les colonnes anti-spam si la migration n'a pas encore été passée,
  // pour que le formulaire de contact ne tombe jamais en panne après un déploiement.
  async onModuleInit() {
    await ajouterColonnes(this.repo, 'contact_requests', {
      spam: 'TINYINT(1) NOT NULL DEFAULT 0',
      spam_raison: 'VARCHAR(255) NULL',
      source: 'VARCHAR(30) NULL',
    }, this.logger)
  }

  async create(dto: Partial<ContactRequest> & { site_web?: string; duree?: number }) {
    const { site_web, duree, ...donnees } = dto
    const verdict = analyserContact({ ...donnees, site_web, duree })

    // Robot certain : rien n'est enregistré, mais il reçoit une réponse normale
    if (verdict.bloquer) {
      this.logger.warn(`Formulaire de contact : robot bloqué (${donnees.email})`)
      return { id: 0, prenom: donnees.prenom }
    }

    const saved = await this.repo.save(this.repo.create({
      ...donnees,
      spam: !!verdict.raison,
      spam_raison: verdict.raison || null,
    }))

    // Notification email à l'admin, seulement pour les vraies demandes (ne bloque pas si l'email échoue)
    if (!saved.spam) {
      this.email.sendContactNotif({
        prenom: saved.prenom,
        email: saved.email,
        telephone: saved.telephone,
        service: saved.service,
        urgence: saved.urgence,
        message: saved.message,
      }).catch(() => {})
    }
    return { id: saved.id, prenom: saved.prenom }
  }

  findAll() { return this.repo.find({ order: { created_at: 'DESC' } }) }
  findPending() { return this.repo.find({ where: { traite: false, spam: false }, order: { created_at: 'DESC' } }) }
  async markTraite(id: number) { await this.repo.update(id, { traite: true }); return this.repo.findOne({ where: { id } }) }
  async marquerSpam(id: number, spam: boolean) {
    await this.repo.update(id, { spam, spam_raison: spam ? 'Classée indésirable à la main' : null })
    return this.repo.findOne({ where: { id } })
  }
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
