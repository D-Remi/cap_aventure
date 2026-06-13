import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { TemoignagesService } from './temoignages.service'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('temoignages')
export class TemoignagesController {
  constructor(private svc: TemoignagesService) {}

  @Get()        findPublic() { return this.svc.findPublic() }
  @Get('count') count()      { return this.svc.countApprouves() }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  findAll() { return this.svc.findAll() }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: any) { return this.svc.create(dto) }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  approve(@Param('id') id: string, @Body('approuve') approuve: boolean) { return this.svc.approve(+id, approuve) }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  remove(@Param('id') id: string) { return this.svc.remove(+id) }
}