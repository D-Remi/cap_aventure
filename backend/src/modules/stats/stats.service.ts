import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Registration } from '../registrations/registration.entity'
import { Activity } from '../activities/activity.entity'
import { User } from '../users/user.entity'
import { Child } from '../children/child.entity'

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    @InjectRepository(Activity)     private actRepo: Repository<Activity>,
    @InjectRepository(User)         private userRepo: Repository<User>,
    @InjectRepository(Child)        private childRepo: Repository<Child>,
  ) {}

  async getGlobalStats() {
    const [totalUsers, totalChildren, totalActivities, allRegs] = await Promise.all([
      this.userRepo.count({ where: { role: 'parent' } }),
      this.childRepo.count(),
      this.actRepo.count(),
      this.regRepo.find({ relations: ['activity', 'child', 'child.user'] }),
    ])

    const confirmed  = allRegs.filter(r => r.status === 'confirmed')
    const pending    = allRegs.filter(r => r.status === 'pending')
    const cancelled  = allRegs.filter(r => r.status === 'cancelled')
    const revenue    = confirmed.reduce((s, r) => s + parseFloat(String(r.activity?.prix || 0)), 0)
    const potRevenue = pending.reduce((s, r) => s + parseFloat(String(r.activity?.prix || 0)), 0)

    return {
      totalUsers,
      totalChildren,
      totalActivities,
      totalRegistrations: allRegs.length,
      confirmed:  confirmed.length,
      pending:    pending.length,
      cancelled:  cancelled.length,
      revenue:    Math.round(revenue * 100) / 100,
      potRevenue: Math.round(potRevenue * 100) / 100,
    }
  }

  async getRegistrationsByMonth() {
    const regs = await this.regRepo.find({ order: { created_at: 'ASC' } })
    const byMonth: Record<string, { confirmed: number; pending: number; cancelled: number }> = {}

    regs.forEach(r => {
      const key = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      if (!byMonth[key]) byMonth[key] = { confirmed: 0, pending: 0, cancelled: 0 }
      byMonth[key][r.status] = (byMonth[key][r.status] || 0) + 1
    })

    return Object.entries(byMonth).map(([month, counts]) => ({ month, ...counts }))
  }

  async getRevenueByMonth() {
    const regs = await this.regRepo.find({
      where: { status: 'confirmed' },
      relations: ['activity'],
      order: { created_at: 'ASC' },
    })
    const byMonth: Record<string, number> = {}

    regs.forEach(r => {
      const key = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      byMonth[key] = (byMonth[key] || 0) + parseFloat(String(r.activity?.prix || 0))
    })

    return Object.entries(byMonth).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue * 100) / 100,
    }))
  }

  async getActivitiesByType() {
    const activities = await this.actRepo.find({ relations: ['registrations'] })
    const byType: Record<string, { count: number; inscrits: number }> = {}

    activities.forEach(a => {
      if (!byType[a.type]) byType[a.type] = { count: 0, inscrits: 0 }
      byType[a.type].count++
      byType[a.type].inscrits += a.registrations?.filter(r => r.status !== 'cancelled').length || 0
    })

    return Object.entries(byType).map(([type, data]) => ({ type, ...data }))
  }

  async getTopActivities() {
    const activities = await this.actRepo.find({ relations: ['registrations'] })
    return activities
      .map(a => ({
        id: a.id,
        titre: a.titre,
        type: a.type,
        date: a.date,
        prix: a.prix,
        places_max: a.places_max,
        inscrits: a.registrations?.filter(r => r.status !== 'cancelled').length || 0,
        taux_remplissage: Math.round(
          ((a.registrations?.filter(r => r.status !== 'cancelled').length || 0) / a.places_max) * 100
        ),
      }))
      .sort((a, b) => b.inscrits - a.inscrits)
      .slice(0, 5)
  }

  async getUserGrowth() {
    const users = await this.userRepo.find({
      where: { role: 'parent' },
      order: { created_at: 'ASC' },
    })
    const byMonth: Record<string, number> = {}

    users.forEach(u => {
      const key = new Date(u.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      byMonth[key] = (byMonth[key] || 0) + 1
    })

    // Cumul
    let cumul = 0
    return Object.entries(byMonth).map(([month, count]) => {
      cumul += count
      return { month, nouveaux: count, total: cumul }
    })
  }
}
