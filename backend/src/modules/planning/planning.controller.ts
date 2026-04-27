import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { PlanningService } from './planning.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('planning')
export class PlanningController {
  constructor(private service: PlanningService) {}

  @Get()
  findAll(@Query('from') from?: string) {
    return this.service.findAll(from)
  }

  @Get('activity/:id')
  findByActivity(@Param('id') id: string) {
    return this.service.findByActivity(+id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: any) {
    return this.service.create(dto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(+id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
