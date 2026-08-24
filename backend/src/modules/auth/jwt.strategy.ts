import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { AuthService } from './auth.service'

// Extrait le JWT depuis le cookie httpOnly 'access_token' en priorité,
// avec repli sur le header Authorization (compatibilité / outils).
const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies && req.cookies['access_token']) {
    return req.cookies['access_token']
  }
  return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
    })
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.authService.validateById(payload.sub)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
