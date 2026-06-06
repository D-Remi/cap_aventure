import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { ChildrenService } from './children.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private svc: ChildrenService) {}
  @Get()    getAll(@CurrentUser() u: User) { return u.role==='admin' ? this.svc.findAll() : this.svc.findByUser(u.id) }
  @Get(':id') getOne(@Param('id') id: string) { return this.svc.findOne(+id) }
  @Post()   create(@CurrentUser() u: User, @Body() dto: any) { return this.svc.create(u, dto) }
  @Put(':id/step1') step1(@Param('id') id: string, @CurrentUser() u: User, @Body() dto: any) { return this.svc.updateStep1(+id, u, dto) }
  @Put(':id/step2') step2(@Param('id') id: string, @CurrentUser() u: User, @Body() dto: any) { return this.svc.updateStep2(+id, u, dto) }
  @Patch(':id/notes') @UseGuards(RolesGuard) @Roles('admin')
  notes(@Param('id') id: string, @Body('notes') notes: string) { return this.svc.updateNotesAnimateur(+id, notes) }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() u: User) { return this.svc.remove(+id, u) }
}