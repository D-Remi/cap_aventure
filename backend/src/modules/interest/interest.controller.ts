import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { InterestService } from './interest.service'
import { CreateInterestDto } from '../../common/dto'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('interest')
export class InterestController {
  constructor(private service: InterestService) {}

  @Post()
  @Throttle({ global: { limit: 5, ttl: 600000 } })
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
