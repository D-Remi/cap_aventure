import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { MarketingService } from './marketing.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('marketing')
@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
export class MarketingController {
  constructor(private svc: MarketingService) {}

  // Planning réseaux sociaux
  @Get('publications')        listePublications() { return this.svc.listePublications() }
  @Post('publications')       creerPublication(@Body() dto: any) { return this.svc.creerPublication(dto) }
  @Put('publications/:id')    modifierPublication(@Param('id') id: string, @Body() dto: any) { return this.svc.modifierPublication(+id, dto) }
  @Delete('publications/:id') supprimerPublication(@Param('id') id: string) { return this.svc.supprimerPublication(+id) }

  // Suivi des prospects
  @Get('prospects')        listeProspects() { return this.svc.listeProspects() }
  @Post('prospects')       creerProspect(@Body() dto: any) { return this.svc.creerProspect(dto) }
  @Put('prospects/:id')    modifierProspect(@Param('id') id: string, @Body() dto: any) { return this.svc.modifierProspect(+id, dto) }
  @Delete('prospects/:id') supprimerProspect(@Param('id') id: string) { return this.svc.supprimerProspect(+id) }

  // Radar clients
  @Get('radar/config')     config() { return { categories: this.svc.categories(), franceTravail: this.svc.franceTravailConfigure() } }
  @Get('radar/entreprises') entreprises(@Query('categorie') c: string, @Query('page') p: string) { return this.svc.radarEntreprises(c, +(p || 1)) }
  @Get('radar/offres')     offres(@Query('q') q: string) { return this.svc.radarOffres(q || undefined) }
}
