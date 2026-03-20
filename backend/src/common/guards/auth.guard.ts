import { Injectable, CanActivate, ExecutionContext, SetMetadata, ForbiddenException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'

// ── JWT Guard ──────────────────────────────────────────────────────
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// ── Roles decorator + guard ────────────────────────────────────────
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler())
    if (!roles) return true
    const { user } = ctx.switchToHttp().getRequest()
    // admin a accès à tout, animateur a accès aux routes marquées 'animateur'
    if (user?.role === 'admin') return true
    if (!roles.includes(user?.role)) {
      throw new ForbiddenException('Accès refusé.')
    }
    return true
  }
}

// ── CurrentUser decorator ──────────────────────────────────────────
import { createParamDecorator } from '@nestjs/common'
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
)
