import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContactRequest } from './contact.entity'
import { EmailService } from '../email/email.service'
import { analyserContact } from './anti-spam'

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
    try {
      const cols: { c: string }[] = await this.repo.query(
        "SELECT COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_requests'",
      )
      if (!cols.length) return
      const noms = cols.map(x => x.c)
      if (!noms.includes('spam')) {
        await this.repo.query('ALTER TABLE `contact_requests` ADD COLUMN `spam` TINYINT(1) NOT NULL DEFAULT 0')
        this.logger.log('Colonne contact_requests.spam ajoutée')
      }
      if (!noms.includes('spam_raison')) {
        await this.repo.query('ALTER TABLE `contact_requests` ADD COLUMN `spam_raison` VARCHAR(255) NULL')
        this.logger.log('Colonne contact_requests.spam_raison ajoutée')
      }
    } catch (e) {
      this.logger.error(`Colonnes anti-spam non ajoutées : passe database/migrate_contact_spam_2026.sql (${e?.message})`)
    }
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
