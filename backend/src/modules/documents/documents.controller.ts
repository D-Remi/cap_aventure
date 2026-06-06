import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { User } from '../users/user.entity'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private svc: DocumentsService) {}

  @Get()
  findMine(@CurrentUser() user: User) {
    return user.role === 'admin' ? this.svc.findAll() : this.svc.findByUser(user.id)
  }

  @Get(':id/data')
  getData(@Param('id') id: string) {
    return this.svc.findOneWithData(+id)
  }

  @Post('upload')
  upload(
    @CurrentUser() user: User,
    @Body() body: {
      child_id?: number
      type: string
      filename: string
      nom: string
      mimetype: string
      taille: number
      data: string
    },
  ) {
    return this.svc.create(user, body)
  }

  @Patch(':id/validate')
  @UseGuards(RolesGuard) @Roles('admin')
  validate(@Param('id') id: string, @Body('valide') valide: boolean, @Body('note') note: string) {
    return this.svc.validate(+id, valide, note)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.svc.remove(+id, user)
  }
}