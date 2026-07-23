import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { SeancesService } from './seances.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'

@Controller('seances')
@UseGuards(JwtAuthGuard)
export class SeancesController {
  constructor(private svc: SeancesService) {}

  // Famille : ses propres séances (CR partagés uniquement, sans notes privées)
  @Get('mine')
  mine(@CurrentUser() user: User) {
    return this.svc.findForFamily(user.id)
  }

  @Get('mine/objectifs')
  mesObjectifs(@CurrentUser() user: User) {
    return this.svc.findObjectifsFamille(user.id)
  }

  @Get('mine/stats')
  mesStats(@CurrentUser() user: User) {
    return this.svc.statsFamille(user.id)
  }

  // ═══ ADMIN ═══
  @Get()
  @UseGuards(RolesGuard) @Roles('admin')
  findAll() { return this.svc.findAll() }

  @Get('famille/:userId')
  @UseGuards(RolesGuard) @Roles('admin')
  byFamille(@Param('userId') id: string) { return this.svc.findByUser(+id) }

  @Get('famille/:userId/stats')
  @UseGuards(RolesGuard) @Roles('admin')
  statsFamille(@Param('userId') id: string) { return this.svc.statsFamille(+id) }

  @Get('famille/:userId/objectifs')
  @UseGuards(RolesGuard) @Roles('admin')
  objectifsFamille(@Param('userId') id: string) { return this.svc.findObjectifs(+id) }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Put(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  remove(@Param('id') id: string) { return this.svc.remove(+id) }

  // Objectifs
  @Post('objectifs')
  @UseGuards(RolesGuard) @Roles('admin')
  createObjectif(@Body() dto: any) { return this.svc.createObjectif(dto) }

  @Put('objectifs/:id')
  @UseGuards(RolesGuard) @Roles('admin')
  updateObjectif(@Param('id') id: string, @Body() dto: any) { return this.svc.updateObjectif(+id, dto) }

  @Delete('objectifs/:id')
  @UseGuards(RolesGuard) @Roles('admin')
  removeObjectif(@Param('id') id: string) { return this.svc.removeObjectif(+id) }
}
