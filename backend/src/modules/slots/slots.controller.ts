import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { SlotsService } from './slots.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('slots')
export class SlotsController {
  constructor(private svc: SlotsService) {}

  @Get()    getAll(@Query('all') all: string) { return this.svc.findAll(all === 'true') }
  @Get(':id') getOne(@Param('id') id: string) { return this.svc.findOne(+id) }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Post('recurrence')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  createRecurrence(@Body() dto: any) { return this.svc.createRecurrence(dto) }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(+id, dto) }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  remove(@Param('id') id: string) { return this.svc.remove(+id) }
}