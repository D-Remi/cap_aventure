import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common'
import { ContratsService } from './contrats.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'

@Controller('contrats')
@UseGuards(JwtAuthGuard)
export class ContratsController {
  constructor(private svc: ContratsService) {}

  // ── Contrats ──
  @Get()
  findAll(@CurrentUser() u: User) {
    return u.role === 'admin' ? this.svc.findAll() : this.svc.findByUser(u.id)
  }

  @Get('calendrier')
  calendrier(@Query('from') from: string, @Query('to') to: string) {
    return this.svc.findActifsBetween(from, to)
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(+id) }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Put(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }

  @Patch(':id/envoyer')
  @UseGuards(RolesGuard) @Roles('admin')
  envoyer(@Param('id') id: string) { return this.svc.envoyer(+id) }

  @Patch(':id/signer-parent')
  signerParent(@Param('id') id: string, @Body('signature') sig: string, @CurrentUser() u: User) {
    return this.svc.signerParent(+id, sig, u)
  }

  @Patch(':id/signer-admin')
  @UseGuards(RolesGuard) @Roles('admin')
  signerAdmin(@Param('id') id: string, @Body('signature') sig: string) {
    return this.svc.signerAdmin(+id, sig)
  }

  // ── Séances ──
  @Get(':id/seances')
  seances(@Param('id') id: string) { return this.svc.findSeances(+id) }

  @Post(':id/seances')
  @UseGuards(RolesGuard) @Roles('admin')
  addSeance(@Param('id') id: string, @Body() dto: any) { return this.svc.addSeance(+id, dto) }

  @Put('seances/:sid')
  @UseGuards(RolesGuard) @Roles('admin')
  updateSeance(@Param('sid') sid: string, @Body() dto: any) { return this.svc.updateSeance(+sid, dto) }

  @Delete('seances/:sid')
  @UseGuards(RolesGuard) @Roles('admin')
  removeSeance(@Param('sid') sid: string) { return this.svc.removeSeance(+sid) }

  // ── Factures ──
  @Get(':id/factures')
  factures(@Param('id') id: string) { return this.svc.findFactures(+id) }

  @Post(':id/factures')
  @UseGuards(RolesGuard) @Roles('admin')
  genererFacture(@Param('id') id: string, @Body() dto: any) { return this.svc.genererFacture(+id, dto) }

  @Patch('factures/:fid/payee')
  @UseGuards(RolesGuard) @Roles('admin')
  marquerPayee(@Param('fid') fid: string) { return this.svc.marquerPayee(+fid) }
}