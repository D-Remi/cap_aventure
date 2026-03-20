import { Controller, Get, UseGuards } from '@nestjs/common'
import { StatsService } from './stats.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Registration } from '../registrations/registration.entity'
import { Activity } from '../activities/activity.entity'
import { User } from '../users/user.entity'
import { Child } from '../children/child.entity'

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'animateur')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getGlobal() { return this.statsService.getGlobalStats() }

  @Get('registrations-by-month')
  getRegsByMonth() { return this.statsService.getRegistrationsByMonth() }

  @Get('revenue-by-month')
  getRevenue() { return this.statsService.getRevenueByMonth() }

  @Get('by-type')
  getByType() { return this.statsService.getActivitiesByType() }

  @Get('top-activities')
  getTopActivities() { return this.statsService.getTopActivities() }

  @Get('user-growth')
  getUserGrowth() { return this.statsService.getUserGrowth() }
}

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Activity, User, Child])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
