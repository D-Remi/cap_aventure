import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PointsHistory, PointReason } from './points.entity'
import { Child } from '../children/child.entity'

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointsHistory) private repo: Repository<PointsHistory>,
    @InjectRepository(Child)         private childRepo: Repository<Child>,
  ) {}

  // ── Total de points d'un enfant ───────────────────────────────
  async getTotal(childId: number): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('p')
      .select('SUM(p.points)', 'total')
      .where('p.child_id = :childId', { childId })
      .getRawOne()
    return parseInt(result.total) || 0
  }

  // ── Historique d'un enfant ────────────────────────────────────
  getHistory(childId: number) {
    return this.repo.find({
      where: { child: { id: childId } },
      order: { created_at: 'DESC' },
    })
  }

  // ── Points de tous les enfants d'un parent ────────────────────
  async getByUser(userId: number) {
    const children = await this.childRepo.find({
      where: { user: { id: userId } },
    })
    return Promise.all(children.map(async (c) => ({
      child: c,
      total: await this.getTotal(c.id),
      history: await this.repo.find({
        where: { child: { id: c.id } },
        order: { created_at: 'DESC' },
        take: 10,
      }),
    })))
  }

  // ── Ajouter des points ────────────────────────────────────────
  async addPoints(
    childId: number,
    points: number,
    reason: PointReason,
    description?: string,
    activityId?: number,
  ) {
    const child = await this.childRepo.findOne({ where: { id: childId } })
    if (!child) throw new NotFoundException('Enfant introuvable')

    const entry = this.repo.create({
      child,
      points,
      reason,
      description,
      activity_id: activityId,
    })
    return this.repo.save(entry)
  }

  // ── Échanger des points contre une récompense ─────────────────
  async redeemPoints(childId: number, cost: number, description: string) {
    const total = await this.getTotal(childId)
    if (total < cost) {
      throw new BadRequestException(`Points insuffisants (${total} pts disponibles, ${cost} requis)`)
    }
    return this.addPoints(childId, -cost, 'echange_recompense', description)
  }

  // ── Classement global des enfants ────────────────────────────
  async getLeaderboard() {
    const result = await this.repo
      .createQueryBuilder('p')
      .select('p.child_id', 'childId')
      .addSelect('SUM(p.points)', 'total')
      .leftJoin('p.child', 'child')
      .addSelect('child.prenom', 'prenom')
      .addSelect('child.nom', 'nom')
      .groupBy('p.child_id')
      .orderBy('total', 'DESC')
      .limit(20)
      .getRawMany()

    return result.map((r, i) => ({
      rank:    i + 1,
      childId: r.childId,
      prenom:  r.prenom,
      nom:     r.nom,
      total:   parseInt(r.total) || 0,
    }))
  }

  // ── Stats admin ───────────────────────────────────────────────
  async getAdminStats() {
    const totalDistributed = await this.repo
      .createQueryBuilder('p')
      .select('SUM(p.points)', 'total')
      .where('p.points > 0')
      .getRawOne()

    const totalRedeemed = await this.repo
      .createQueryBuilder('p')
      .select('SUM(ABS(p.points))', 'total')
      .where('p.points < 0')
      .getRawOne()

    return {
      totalDistributed: parseInt(totalDistributed.total) || 0,
      totalRedeemed:    parseInt(totalRedeemed.total) || 0,
    }
  }
}
