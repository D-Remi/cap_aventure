import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { GardesService } from './gardes.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('gardes')
@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
export class GardesController {
  constructor(private svc: GardesService) {}

  @Get()        findAll() { return this.svc.findAll() }
  @Get('stats') stats(@Query('semaine') semaine: string) { return this.svc.stats(semaine) }

  @Post()        create(@Body() dto: any) { return this.svc.create(dto) }
  @Put(':id')    update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(+id) }
}
