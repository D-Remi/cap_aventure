import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private svc: BookingsService) {}

  @Get()
  @UseGuards(RolesGuard) @Roles('admin')
  findAll() { return this.svc.findAll() }

  @Get('mine')
  mine(@CurrentUser() u: User) { return this.svc.findByUser(u.id) }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(+id) }

  @Post()
  create(@CurrentUser() u: User, @Body() dto: any) { return this.svc.create(u, dto) }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard) @Roles('admin')
  confirm(@Param('id') id: string) { return this.svc.confirm(+id) }

  @Patch(':id/paiement')
  @UseGuards(JwtAuthGuard)
  declarerPaiement(@Param('id') id: string, @Body() dto: any) {
    return this.svc.declarerPaiement(+id, dto)
  }

  @Patch(':id/valider-paiement')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  validerPaiement(@Param('id') id: string) {
    return this.svc.validerPaiement(+id)
  }

  @Patch(':id/tarif')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  setTarif(@Param('id') id: string, @Body('tarif') tarif: number) {
    return this.svc.setTarif(+id, tarif)
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() u: User) { return this.svc.cancel(+id, u) }

  @Patch(':id/compte-rendu')
  @UseGuards(RolesGuard) @Roles('admin')
  cr(@Param('id') id: string, @Body('texte') texte: string) { return this.svc.addCompteRendu(+id, texte) }

  @Patch(':id/presence')
  @UseGuards(RolesGuard) @Roles('admin')
  presence(@Param('id') id: string, @Body() dto: any) { return this.svc.updatePresence(+id, dto) }
}