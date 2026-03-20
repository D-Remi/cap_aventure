import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { v4 as uuid } from 'uuid'
import { UploadController } from './upload.controller'

// ── Multer storage: activity images ───────────────────────────────
export const activityImageStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'activities'),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    cb(null, `activity-${uuid()}${ext}`)
  },
})

// ── Multer storage: user documents ────────────────────────────────
export const documentStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'documents'),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    cb(null, `doc-${uuid()}${ext}`)
  },
})

// ── File filters ──────────────────────────────────────────────────
export const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const ext = extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) cb(null, true)
  else cb(new Error('Seules les images JPG, PNG, WEBP et GIF sont acceptées.'), false)
}

export const documentFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png']
  const ext = extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) cb(null, true)
  else cb(new Error('Seuls les fichiers PDF et images sont acceptés.'), false)
}

@Module({
  controllers: [UploadController],
})
export class UploadModule {}
