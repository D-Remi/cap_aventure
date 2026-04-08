import { Injectable, ExecutionContext } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    // Exempter les admins et animateurs du rate limiting
    if (req.user?.role === 'admin' || req.user?.role === 'animateur') {
      return true
    }
    return super.canActivate(context)
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user?.id?.toString() || req.ip
  }
}
