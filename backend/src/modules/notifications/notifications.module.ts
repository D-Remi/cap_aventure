import { Module, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationsService } from './notifications.service'
import { NotificationsController } from './notifications.controller'
import { User } from '../users/user.entity'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:      process.env.JWT_SECRET || 'dev-secret-change-in-prod',
        signOptions: { expiresIn: process.env.JWT_EXPIRES || '7d' },
      }),
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
