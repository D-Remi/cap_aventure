import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: User) {
    return user
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: Partial<User>) {
    return this.service.update(+id, dto)
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
