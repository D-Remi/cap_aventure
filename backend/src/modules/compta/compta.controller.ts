import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ComptaService } from './compta.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('compta')
@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
export class ComptaController {
  constructor(private svc: ComptaService) {}

  @Get()       findAll() { return this.svc.findAll() }
  @Get('stats') stats(@Query('year') year: string) { return this.svc.stats(+(year||new Date().getFullYear())) }
  @Get('month') byMonth(@Query('year') y: string, @Query('month') m: string) { return this.svc.findByMonth(+y, +m) }

  @Post()             create(@Body() dto: any) { return this.svc.create(dto) }
  @Put(':id')         update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }
  @Delete(':id')      remove(@Param('id') id: string) { return this.svc.remove(+id) }
}