import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { IndisponibilitesService } from './indisponibilites.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('indisponibilites')
export class IndisponibilitesController {
  constructor(private svc: IndisponibilitesService) {}

  @Get()
  findAll() { return this.svc.findAll() }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  remove(@Param('id') id: string) { return this.svc.remove(+id) }
}