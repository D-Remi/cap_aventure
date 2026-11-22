import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AssistantService } from './assistant.service'
import { CustomThrottlerGuard } from '../../common/guards/custom-throttler.guard'

@Controller('assistant')
export class AssistantController {
  constructor(private svc: AssistantService) {}

  // Le site n'affiche la bulle que si l'assistant est configuré
  @Get('statut')
  statut() { return { actif: this.svc.actif() } }

  // 20 messages par adresse IP toutes les 10 minutes
  @Post()
  @HttpCode(200)
  @Throttle({ global: { limit: 20, ttl: 600000 } }) @UseGuards(CustomThrottlerGuard)
  repondre(@Body('messages') messages: unknown) { return this.svc.repondre(messages) }
}
