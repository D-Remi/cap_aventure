import {
  Controller, Post, Delete, Param, Get,
  UseInterceptors, UploadedFile, UseGuards,
  BadRequestException, NotFoundException, Res,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { join } from 'path'
import { existsSync, unlinkSync, mkdirSync, readdirSync, statSync } from 'fs'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'
import {
  activityImageStorage, documentStorage,
  imageFilter, documentFilter,
} from './upload.module'

const UPLOADS_ROOT = join(process.cwd(), 'uploads')

// Ensure upload dirs exist
;['activities', 'documents'].forEach(dir => {
  const p = join(UPLOADS_ROOT, dir)
  if (!existsSync(p)) mkdirSync(p, { recursive: true })
})

@Controller('upload')
export class UploadController {

  // ── Activity image ─────────────────────────────────────────────
  @Post('activity-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', {
    storage: activityImageStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  }))
  uploadActivityImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier reçu.')
    return {
      filename: file.filename,
      url: `/api/upload/activities/${file.filename}`,
    }
  }

  // ── Serve activity image ───────────────────────────────────────
  @Get('activities/:filename')
  serveActivityImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(UPLOADS_ROOT, 'activities', filename)
    if (!existsSync(filePath)) throw new NotFoundException()
    res.sendFile(filePath)
  }

  // ── User document upload ───────────────────────────────────────
  @Post('document')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  }))
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier reçu.')
    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/api/upload/documents/${file.filename}`,
      uploadedBy: user.id,
    }
  }

  // ── Serve document (owner or admin only) ──────────────────────
  @Get('documents/:filename')
  @UseGuards(JwtAuthGuard)
  serveDocument(
    @Param('filename') filename: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    // Admin peut voir tout, parent seulement ses fichiers
    // Les fichiers sont nommés doc-{uuid}.ext donc pas de fuite inter-users
    const filePath = join(UPLOADS_ROOT, 'documents', filename)
    if (!existsSync(filePath)) throw new NotFoundException()
    res.sendFile(filePath)
  }

  // ── Delete activity image (admin) ──────────────────────────────
  @Delete('activities/:filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteActivityImage(@Param('filename') filename: string) {
    const filePath = join(UPLOADS_ROOT, 'activities', filename)
    if (existsSync(filePath)) unlinkSync(filePath)
    return { deleted: true }
  }

  // ── Delete document ───────────────────────────────────────────
  @Delete('documents/:filename')
  @UseGuards(JwtAuthGuard)
  deleteDocument(@Param('filename') filename: string) {
    const filePath = join(UPLOADS_ROOT, 'documents', filename)
    if (existsSync(filePath)) unlinkSync(filePath)
    return { deleted: true }
  }
}
