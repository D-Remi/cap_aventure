import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Header } from '@nestjs/common'
import { ComptaService } from './compta.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

const annee = (y: string) => +(y || new Date().getFullYear())

@Controller('compta')
@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
export class ComptaController {
  constructor(private svc: ComptaService) {}

  @Get()       findAll() { return this.svc.findAll() }
  @Get('stats') stats(@Query('year') year: string) { return this.svc.stats(annee(year)) }
  @Get('month') byMonth(@Query('year') y: string, @Query('month') m: string) { return this.svc.findByMonth(+y, +m) }

  // Déclarations URSSAF, seuils (TVA, plafond micro, compte dédié) et alertes
  @Get('declarations') declarations(@Query('year') y: string) { return this.svc.declarations(annee(y)) }

  // Livre des recettes au format CSV (ouvrable dans Excel)
  @Get('livre-recettes')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  livre(@Query('year') y: string) { return this.svc.livreRecettesCsv(annee(y)) }

  // Données des attestations fiscales annuelles, par client
  @Get('attestations') attestations(@Query('year') y: string) { return this.svc.attestations(annee(y)) }

  // Chiffres trimestriels à reporter sur NOVA
  @Get('nova') nova(@Query('year') y: string) { return this.svc.nova(annee(y)) }

  @Post()             create(@Body() dto: any) { return this.svc.create(dto) }
  @Put(':id')         update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }
  @Delete(':id')      remove(@Param('id') id: string) { return this.svc.remove(+id) }
}
