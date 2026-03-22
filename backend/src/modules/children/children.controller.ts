import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { ChildrenService } from './children.service'
import { CreateChildDto } from '../../common/dto'
import { User } from '../users/user.entity'
import { JwtAuthGuard, RolesGuard, CurrentUser } from '../../common/guards/auth.guard'

@Controller('children')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChildrenController {
  constructor(private service: ChildrenService) {}

  @Get()
  getMyChildren(@CurrentUser() user: User) {
    if (user.role === 'admin') return this.service.findAll()
    return this.service.findByUser(user.id)
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateChildDto) {
    return this.service.create(user, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.remove(+id, user)
  }
}
