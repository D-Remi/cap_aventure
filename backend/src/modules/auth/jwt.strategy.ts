import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from './auth.service'
import { jwtConfig } from '../../config/database.config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    })
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.authService.validateById(payload.sub)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
