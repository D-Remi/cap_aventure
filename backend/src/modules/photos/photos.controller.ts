import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { PhotosService } from './photos.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private svc: PhotosService) {}

  @Get()
  findMine(@CurrentUser() user: User) {
    return user.role === 'admin' ? this.svc.findAll() : this.svc.findByUser(user.id)
  }

  @Get(':id/data')
  getData(@Param('id') id: string) {
    return this.svc.findOneWithData(+id)
  }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Patch(':id/visible')
  @UseGuards(RolesGuard) @Roles('admin')
  setVisible(@Param('id') id: string, @Body('visible') visible: boolean) {
    return this.svc.setVisible(+id, visible)
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  remove(@Param('id') id: string) { return this.svc.remove(+id) }
}