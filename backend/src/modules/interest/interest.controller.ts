import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { InterestService } from './interest.service'
import { CreateInterestDto } from '../../common/dto'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('interest')
export class InterestController {
  constructor(private service: InterestService) {}

  // Max 3 soumissions / 10 minutes par IP
  @Throttle({ short: { limit: 3, ttl: 600000 }, medium: { limit: 3, ttl: 600000 } })
  @Post()
  create(@Body() dto: CreateInterestDto) {
    return this.service.create(dto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.service.findAll()
  }
}
