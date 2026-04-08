import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs'
import * as helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')

  app.use(helmet.default({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }))

  app.useGlobalPipes(new ValidationPipe({
    whitelist:            true,
    transform:            true,
    forbidNonWhitelisted: true,
    disableErrorMessages: false,
  }))

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim())
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`Origine non autorisée: ${origin}`))
      }
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  })

  // Dossiers uploads (persistants via Railway Volume)
  const uploadsRoot = process.env.UPLOADS_PATH || join(process.cwd(), 'uploads')
  ;['activities', 'documents'].forEach(dir => {
    const p = join(uploadsRoot, dir)
    if (!existsSync(p)) mkdirSync(p, { recursive: true })
  })
  app.useStaticAssets(uploadsRoot, { prefix: '/uploads' })

  const port = parseInt(process.env.PORT || '3001', 10)
  // 0.0.0.0 obligatoire pour Railway/Docker
  await app.listen(port, '0.0.0.0')
  console.log(`🚀 CapAventure API démarrée sur port ${port}`)
}

bootstrap()
