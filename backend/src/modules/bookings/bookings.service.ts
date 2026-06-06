import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Booking } from './booking.entity'
import { Slot } from '../slots/slot.entity'
import { User } from '../users/user.entity'
import { EmailService } from '../email/email.service'

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private repo: Repository<Booking>,
    @InjectRepository(Slot)    private slotRepo: Repository<Slot>,
    private ds: DataSource,
    private email: EmailService,
  ) {}

  findAll() {
    return this.repo.find({ relations:['slot','child','user'], order:{ created_at:'DESC' } })
  }

  findByUser(uid: number) {
    return this.repo.find({ where:{ user_id:uid }, relations:['slot','child'], order:{ created_at:'DESC' } })
  }

  findOne(id: number) {
    return this.repo.findOne({ where:{ id }, relations:['slot','child','user'] })
  }

  async create(user: User, dto: any) {
    return this.ds.transaction(async em => {
      const slot = await em.findOne(Slot, { where:{ id:dto.slot_id }, lock:{ mode:'pessimistic_write' } })
      if (!slot) throw new NotFoundException('Créneau introuvable')
      if (slot.statut !== 'ouvert') throw new ConflictException('Créneau non disponible')
      if (slot.places_prises >= slot.places_max) throw new ConflictException('Créneau complet')
      const exists = await em.findOne(Booking, { where:{ slot_id:dto.slot_id, child_id:dto.child_id } })
      if (exists) throw new ConflictException('Cet enfant est déjà inscrit sur ce créneau')
      const booking = em.create(Booking, { ...dto, user_id:user.id, status:'pending' })
      const saved = await em.save(booking)
      // Email confirmation pending au parent
      try {
        const dateLabel = new Date(slot.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
        await this.email.sendBookingPending(user.email, user.prenom, dto.child_name || 'votre enfant', dateLabel)
      } catch {}
      return saved
    })
  }

  async confirm(id: number) {
    const b = await this.repo.findOne({ where:{ id }, relations:['slot','child','user'] })
    if (!b) throw new NotFoundException()
    await this.repo.update(id, { status:'confirmed' })
    // Email confirmation au parent
    try {
      const dateLabel = new Date(b.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
      await this.email.sendBookingConfirmed(
        b.user.email,
        b.user.prenom,
        b.child.prenom,
        dateLabel,
        b.slot.heure_debut?.slice(0,5),
      )
    } catch {}
    return this.findOne(id)
  }

  async cancel(id: number, user: User) {
    const b = await this.repo.findOne({ where:{ id }, relations:['slot','child','user'] })
    if (!b) throw new NotFoundException()
    if (user.role !== 'admin' && b.user_id !== user.id) throw new ForbiddenException()
    await this.repo.update(id, { status:'cancelled' })
    // Email annulation
    try {
      const dateLabel = new Date(b.slot.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})
      await this.email.sendBookingCancelled(b.user.email, b.user.prenom, b.child.prenom, dateLabel)
    } catch {}
    return this.findOne(id)
  }

  async addCompteRendu(id: number, texte: string) {
    await this.repo.update(id, { compte_rendu:texte, compte_rendu_at:new Date() })
    return this.findOne(id)
  }

  async updatePresence(id: number, dto: any) {
    await this.repo.update(id, { present:dto.present, heure_arrivee:dto.heure_arrivee, heure_depart:dto.heure_depart })
    return this.findOne(id)
  }
}