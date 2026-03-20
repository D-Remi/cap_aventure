import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { PointsService } from './points.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

class AddPointsDto {
  @IsInt() @Type(() => Number) child_id: number
  @IsInt() @Type(() => Number) points: number
  @IsEnum(['inscription','presence','parrainage','bonus_animateur','echange_recompense']) reason: string
  @IsOptional() @IsString() description?: string
  @IsOptional() @IsInt() @Type(() => Number) activity_id?: number
}

class RedeemDto {
  @IsInt() @Type(() => Number) child_id: number
  @IsInt() @Min(1) @Type(() => Number) cost: number
  @IsString() description: string
}

@Controller('points')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PointsController {
  constructor(private service: PointsService) {}

  // Parent : voir les points de ses enfants
  @Get('mine')
  getMine(@CurrentUser() user: User) {
    return this.service.getByUser(user.id)
  }

  // Parent / admin : total d'un enfant
  @Get('child/:childId')
  getTotal(@Param('childId') id: string) {
    return this.service.getTotal(+id).then(total => ({ total }))
  }

  // Parent / admin : historique d'un enfant
  @Get('child/:childId/history')
  getHistory(@Param('childId') id: string) {
    return this.service.getHistory(+id)
  }

  // Classement public
  @Get('leaderboard')
  getLeaderboard() {
    return this.service.getLeaderboard()
  }

  // Admin : ajouter des points manuellement
  @Post('add')
  @Roles('admin', 'animateur')
  add(@Body() dto: AddPointsDto) {
    return this.service.addPoints(
      dto.child_id, dto.points, dto.reason as any,
      dto.description, dto.activity_id,
    )
  }

  // Admin : échanger des points
  @Post('redeem')
  @Roles('admin', 'animateur')
  redeem(@Body() dto: RedeemDto) {
    return this.service.redeemPoints(dto.child_id, dto.cost, dto.description)
  }

  // Admin : stats globales points
  @Get('admin/stats')
  @Roles('admin')
  adminStats() {
    return this.service.getAdminStats()
  }
}
