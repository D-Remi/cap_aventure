import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { User } from '../users/user.entity'
import { PasswordResetToken } from './password-reset.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetToken]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:      process.env.JWT_SECRET || 'dev-secret-change-in-prod',
        signOptions: { expiresIn: process.env.JWT_EXPIRES || '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
