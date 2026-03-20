import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { RegistrationsService } from './registrations.service'
import { CreateRegistrationDto, UpdateRegistrationStatusDto } from '../../common/dto'
import { User } from '../users/user.entity'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'

@Controller('registrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistrationsController {
  constructor(private service: RegistrationsService) {}

  @Get('mine')
  mine(@CurrentUser() user: User) {
    return this.service.findByUser(user.id)
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.service.findAll()
  }

  @Get('activity/:actId')
  @Roles('admin')
  byActivity(@Param('actId') actId: string) {
    return this.service.findByActivity(+actId)
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateRegistrationDto) {
    return this.service.create(user, dto)
  }

  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRegistrationStatusDto) {
    return this.service.updateStatus(+id, dto.status as any)
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.cancel(+id, user)
  }
}
