import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ContactService } from './contact.service'
import { CreateContactDto } from './create-contact.dto'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'
import { UseGuards } from '@nestjs/common'

@Controller('contact')
export class ContactController {
  constructor(private svc: ContactService) {}

  @Post()
  @Throttle({ global:{ limit:5, ttl:600000 } })
  create(@Body() dto: CreateContactDto) { return this.svc.create(dto) }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  findAll() { return this.svc.findAll() }

  @Patch(':id/traite')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  markTraite(@Param('id') id: string) { return this.svc.markTraite(+id) }

  @Post(':id/repondre')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  repondre(@Param('id') id: string, @Body('message') message: string) {
    return this.svc.repondre(+id, message)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')
  remove(@Param('id') id: string) { return this.svc.remove(+id) }
}