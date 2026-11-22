import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { RendezVousService } from './rendezvous.service'
import { ReserverRdvDto } from './rendezvous.dto'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'
import { CustomThrottlerGuard } from '../../common/guards/custom-throttler.guard'

@Controller('rendez-vous')
export class RendezVousController {
  constructor(private svc: RendezVousService) {}

  // Public : créneaux libres pour un appel découverte
  @Get('creneaux')
  creneaux() { return this.svc.disponibilites() }

  // Public : réservation (5 par adresse IP toutes les 10 minutes)
  @Post()
  @Throttle({ global: { limit: 5, ttl: 600000 } }) @UseGuards(CustomThrottlerGuard)
  reserver(@Body() dto: ReserverRdvDto) { return this.svc.reserver(dto) }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  liste() { return this.svc.liste() }

  @Get('reglages')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  reglages() { return this.svc.reglages() }

  @Put('reglages')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  majReglages(@Body() dto: any) { return this.svc.majReglages(dto) }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  statut(@Param('id') id: string, @Body() body: any) {
    return this.svc.changerStatut(+id, String(body?.statut || ''), body?.prevenir !== false)
  }
}
