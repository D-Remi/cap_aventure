import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Registration } from './registration.entity'
import { Activity } from '../activities/activity.entity'
import { Child } from '../children/child.entity'
import { User } from '../users/user.entity'
import { EmailService } from '../email/email.service'
import { NotificationsService } from '../notifications/notifications.service'
import { PointsService } from '../points/points.service'

// Points attribués automatiquement
const POINTS_INSCRIPTION = 10  // à l'inscription
const POINTS_PRESENCE    = 20  // quand confirmée (présence validée)

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration) private repo: Repository<Registration>,
    @InjectRepository(Activity)     private actRepo: Repository<Activity>,
    @InjectRepository(Child)        private childRepo: Repository<Child>,
    private email: EmailService,
    private notif: NotificationsService,
    private points: PointsService,
  ) {}

  async findByUser(userId: number) {
    return this.repo.find({
      where: { child: { user: { id: userId } } },
      relations: ['child', 'activity'],
      order: { created_at: 'DESC' },
    })
  }

  findAll() {
    return this.repo.find({
      relations: ['child', 'child.user', 'activity'],
      order: { created_at: 'DESC' },
    })
  }

  findByActivity(activityId: number) {
    return this.repo.find({
      where: { activity: { id: activityId } },
      relations: ['child', 'child.user'],
      order: { created_at: 'ASC' },
    })
  }

  async create(user: User, dto: { activity_id: number; child_id: number; subscription_type?: string; notes?: string }) {
    const child = await this.childRepo.findOne({
      where: { id: dto.child_id },
      relations: ['user'],
    })
    if (!child) throw new NotFoundException('Enfant introuvable.')
    if (user.role !== 'admin' && child.user.id !== user.id) {
      throw new ForbiddenException('Cet enfant ne vous appartient pas.')
    }

    const activity = await this.actRepo.findOne({ where: { id: dto.activity_id } })
    if (!activity) throw new NotFoundException('Activité introuvable.')

    const taken = await this.repo.count({
      where: [
        { activity: { id: dto.activity_id }, status: 'pending' },
        { activity: { id: dto.activity_id }, status: 'confirmed' },
      ],
    })
    if (taken >= activity.places_max) {
      throw new BadRequestException('Cette activité est complète.')
    }

    const existing = await this.repo.findOne({
      where: { child: { id: dto.child_id }, activity: { id: dto.activity_id } },
    })
    if (existing && existing.status !== 'cancelled') {
      throw new BadRequestException('Cet enfant est déjà inscrit à cette activité.')
    }

    const reg = this.repo.create({
      child,
      activity,
      status: 'pending',
      subscription_type: (dto.subscription_type as any) || 'seance',
      notes: dto.notes,
    })
    await this.repo.save(reg)

    // Email de confirmation d'inscription au parent
    this.email.sendRegistrationPending(
      child.user.email,
      child.user.prenom,
      `${child.prenom} ${child.nom}`,
      activity.titre,
    )

    // +10 points à l'inscription
    this.points.addPoints(
      child.id, POINTS_INSCRIPTION, 'inscription',
      `Inscription à "${activity.titre}"`, activity.id,
    ).catch(() => {}) // non bloquant

    // Notif temps réel pour les admins
    this.notif.emitAdmin({
      type: 'new_registration',
      title: 'Nouvelle inscription',
      message: `${child.prenom} ${child.nom} s'est inscrit(e) à "${activity.titre}"`,
      data: { childName: `${child.prenom} ${child.nom}`, activityTitle: activity.titre },
    })

    return reg
  }

  async updateStatus(id: number, status: 'pending' | 'confirmed' | 'cancelled') {
    await this.repo.update(id, { status })
    const reg = await this.repo.findOne({
      where: { id },
      relations: ['child', 'child.user', 'activity'],
    })

    if (reg && reg.child?.user) {
      const { email, prenom, id: userId } = reg.child.user
      const childName = `${reg.child.prenom} ${reg.child.nom}`
      const actTitle = reg.activity?.titre

      if (status === 'confirmed') {
        this.email.sendRegistrationConfirmed(email, prenom, childName, reg.activity)
        this.notif.emitUser(userId, {
          type: 'registration_status',
          title: '✅ Inscription confirmée !',
          message: `L'inscription de ${childName} pour "${actTitle}" est confirmée.`,
          data: { status: 'confirmed', childName, actTitle },
        })
        // +20 points pour présence confirmée
        this.points.addPoints(
          reg.child.id, POINTS_PRESENCE, 'presence',
          `Présence confirmée à "${actTitle}"`, reg.activity?.id,
        ).catch(() => {})
      } else if (status === 'cancelled') {
        this.email.sendRegistrationCancelled(email, prenom, childName, actTitle)
        this.notif.emitUser(userId, {
          type: 'registration_status',
          title: '❌ Inscription annulée',
          message: `L'inscription de ${childName} pour "${actTitle}" a été annulée.`,
          data: { status: 'cancelled', childName, actTitle },
        })
        // Retirer les points d'inscription si annulée
        this.points.addPoints(
          reg.child.id, -POINTS_INSCRIPTION, 'echange_recompense',
          `Annulation inscription "${actTitle}"`, reg.activity?.id,
        ).catch(() => {})
      }
    }

    return reg
  }

  async cancel(id: number, user: User) {
    const reg = await this.repo.findOne({ where: { id }, relations: ['child', 'child.user'] })
    if (!reg) throw new NotFoundException()
    if (user.role !== 'admin' && reg.child.user.id !== user.id) throw new ForbiddenException()
    return this.updateStatus(id, 'cancelled')
  }
}

