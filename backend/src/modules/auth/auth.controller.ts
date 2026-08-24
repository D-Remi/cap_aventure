import { Controller, Post, Body, HttpCode, Patch, UseGuards, Res, Req, Get } from '@nestjs/common'
import { Response, Request } from 'express'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { JwtAuthGuard, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'


// Options des cookies httpOnly — invisibles au JavaScript (protection XSS)
const cookieBase = {
  httpOnly: true,                          // JS ne peut pas lire le cookie
  secure: process.env.NODE_ENV === 'production', // HTTPS only en prod
  sameSite: 'strict' as const,             // protection CSRF
  path: '/',
}
const ACCESS_MAX = 15 * 60 * 1000           // 15 min
const REFRESH_MAX = 7 * 24 * 60 * 60 * 1000 // 7 jours

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, { ...cookieBase, maxAge: ACCESS_MAX })
  res.cookie('refresh_token', refreshToken, { ...cookieBase, maxAge: REFRESH_MAX })
}
function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', cookieBase)
  res.clearCookie('refresh_token', cookieBase)
}

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
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.register(dto)
    const tokens = await this.authService.issueTokens(user, req.headers['user-agent'], req.ip)
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken)
    return { user: tokens.user }
  }

  // 10 tentatives / minute pour login
  @Post('login')
  @HttpCode(200)
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(dto.email, dto.password)
    const tokens = await this.authService.issueTokens(user, req.headers['user-agent'], req.ip)
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken)
    return { user: tokens.user }
  }

  // Rafraîchit l'access token à partir du refresh token (rotation)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.['refresh_token']
    const tokens = await this.authService.refresh(raw, req.headers['user-agent'], req.ip)
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken)
    return { user: tokens.user }
  }

  // Déconnexion : révoque le refresh token courant et efface les cookies
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.cookies?.['refresh_token'])
    clearAuthCookies(res)
    return { ok: true }
  }

  // Déconnexion de tous les appareils
  @Post('logout-all')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logoutAll(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutAll(user.id)
    clearAuthCookies(res)
    return { ok: true }
  }

  // Renvoie l'utilisateur courant (pour recharger la session au démarrage)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return { user: { id: user.id, email: user.email, prenom: user.prenom, nom: user.nom, role: user.role } }
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
