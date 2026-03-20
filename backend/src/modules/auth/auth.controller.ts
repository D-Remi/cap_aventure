import { Controller, Post, Body, HttpCode, Patch, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { JwtAuthGuard, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'

class RegisterDto {
  @IsString() prenom: string
  @IsString() nom: string
  @IsEmail() email: string
  @IsString() @MinLength(8) password: string
  @IsOptional() @IsString() telephone?: string
}

class LoginDto {
  @IsEmail() email: string
  @IsString() password: string
}

class ForgotPasswordDto {
  @IsEmail() email: string
}

class ResetPasswordDto {
  @IsString() token: string
  @IsString() @MinLength(8) password: string
}

class UpdateProfileDto {
  @IsOptional() @IsString() prenom?: string
  @IsOptional() @IsString() nom?: string
  @IsOptional() @IsString() telephone?: string
  @IsOptional() @IsString() currentPassword?: string
  @IsOptional() @IsString() @MinLength(8) newPassword?: string
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 5 tentatives / minute pour register
  @Post('register')
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  // 10 tentatives / minute pour login
  @Post('login')
  @HttpCode(200)
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password)
  }

  // 3 demandes / minute pour mot de passe oublié
  @Post('forgot-password')
  @HttpCode(200)
  @Throttle({ auth: { limit: 3, ttl: 60000 } })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email)
  }

  @Post('reset-password')
  @HttpCode(200)
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password)
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto)
  }
}
