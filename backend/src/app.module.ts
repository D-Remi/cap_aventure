import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
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
import { StatsModule }         from './modules/stats/stats.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig()),
    MulterModule.register({}),

    // ── Rate limiting global ──────────────────────────────────
    // 100 requêtes / minute par IP par défaut
    // Les routes sensibles ont leur propre limite via @Throttle()
    ThrottlerModule.forRoot([{
      name:  'global',
      ttl:   60000,   // 1 minute
      limit: 100,
    }, {
      name:  'auth',   // Pour login/register : plus strict
      ttl:   60000,
      limit: 10,
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
    StatsModule,
  ],
  providers: [
    // Rate limiting appliqué globalement
    { provide: APP_GUARD, useClass: ThrottlerGuard },
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
