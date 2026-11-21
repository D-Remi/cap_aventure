import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { EntrepriseService } from './entreprise.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('entreprise')
export class EntrepriseController {
  constructor(private svc: EntrepriseService) {}

  // Public : alimente les pages Mentions légales et CGV du site
  @Get('public')
  getPublic() { return this.svc.getPublic() }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  get() { return this.svc.get() }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  update(@Body() dto: any) { return this.svc.update(dto) }
}
