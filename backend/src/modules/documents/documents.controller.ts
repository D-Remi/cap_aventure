import {
  Controller, Get, Post, Delete, Param, Body,
  UseGuards, UseInterceptors, UploadedFile, Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DocumentsService } from './documents.service'
import { User } from '../users/user.entity'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { documentStorage, documentFilter } from '../upload/upload.module'

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private service: DocumentsService) {}

  @Get()
  findMine(@CurrentUser() user: User) {
    if (user.role === 'admin') return this.service.findAll()
    return this.service.findByUser(user.id)
  }

  @Get('child/:childId')
  findByChild(@Param('childId') childId: string, @CurrentUser() user: User) {
    return this.service.findByChild(+childId)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Body('child_id') childId: string,
    @Body('type') type: string,
  ) {
    return this.service.create(user, {
      child_id: childId ? +childId : undefined,
      type: type || 'autre',
      filename: file.filename,
      original_name: file.originalname,
      size: file.size,
      url: `/api/upload/documents/${file.filename}`,
    })
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.remove(+id, user)
  }
}
