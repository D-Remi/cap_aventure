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

  // ── Sécurité HTTP headers ─────────────────────────────────────
  app.use(helmet.default({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }))

  // ── Validation stricte + transformation ───────────────────────
  app.useGlobalPipes(new ValidationPipe({
    whitelist:            true,   // Supprime les champs non déclarés dans le DTO
    transform:            true,   // Transforme les types automatiquement
    forbidNonWhitelisted: true,   // Rejette les requêtes avec des champs inconnus
    disableErrorMessages: false,
  }))

  // ── CORS strict ───────────────────────────────────────────────
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(',')
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

  // ── Uploads ───────────────────────────────────────────────────
  const uploadsRoot = join(process.cwd(), 'uploads')
  ;['activities', 'documents'].forEach(dir => {
    const p = join(uploadsRoot, dir)
    if (!existsSync(p)) mkdirSync(p, { recursive: true })
  })

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 CapAventure API sur http://127.0.0.1:${port}/api`)
  console.log(`🔒 Sécurité : Helmet + Rate limiting + Validation stricte`)
}

bootstrap()
