import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ThrottlerModule } from '@nestjs/throttler'
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { dbConfig } from './config/database.config'
import { EmailModule }         from './modules/email/email.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { AuthModule }          from './modules/auth/auth.module'
import { UsersModule }         from './modules/users/users.module'
import { ChildrenModule }      from './modules/children/children.module'
import { ActivitiesModule }    from './modules/activities/activities.module'
import { RegistrationsModule } from './modules/registrations/registrations.module'
import { InterestModule }      from './modules/interest/interest.module'
import { UploadModule }        from './modules/upload/upload.module'
import { DocumentsModule }     from './modules/documents/documents.module'
import { PointsModule }         from './modules/points/points.module'
import { MessagesModule }         from './modules/messages/messages.module'
import { StatsModule }         from './modules/stats/stats.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig()),
    MulterModule.register({}),

    // ── Rate limiting ─────────────────────────────────────────
    // Limite généreuse pour l'usage normal du site
    // Les routes auth sensibles ont @Throttle() plus strict
    ThrottlerModule.forRoot([{
      name:  'global',
      ttl:   60000,
      limit: 2000,    // ~33 req/sec — admin navigue sans jamais toucher la limite
    }, {
      name:  'auth',
      ttl:   60000,
      limit: 10,      // login/register : 10/min reste strict
    }]),

    EmailModule,
    NotificationsModule,
    AuthModule,
    UsersModule,
    ChildrenModule,
    ActivitiesModule,
    RegistrationsModule,
    InterestModule,
    UploadModule,
    DocumentsModule,
    PointsModule,
    MessagesModule,
    StatsModule,
  ],
  providers: [
    // ThrottlerGuard retiré du global — appliqué uniquement sur les routes @Throttle() (auth)
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist:            true,
        transform:            true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
