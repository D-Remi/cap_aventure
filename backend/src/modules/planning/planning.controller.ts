import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { PlanningService } from './planning.service'
import { JwtAuthGuard } from '../../common/guards/auth.guard'

@Controller('planning')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(private svc: PlanningService) {}
  @Get() findAll() { return this.svc.findAll() }
  @Get('slot/:id') findBySlot(@Param('id') id: string) { return this.svc.findBySlot(+id) }
}