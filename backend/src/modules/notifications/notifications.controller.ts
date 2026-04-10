import { Controller, Get, Sse, MessageEvent, Query, UnauthorizedException } from '@nestjs/common'
import { Observable, merge } from 'rxjs'
import { map } from 'rxjs/operators'
import { NotificationsService } from './notifications.service'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/user.entity'

@Controller('notifications')
export class NotificationsController {
  constructor(
    private notifService: NotificationsService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  private async getUserFromToken(token: string): Promise<User> {
    try {
      const secret = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
      const payload = this.jwtService.verify(token, { secret })
      const user = await this.userRepo.findOne({ where: { id: payload.sub } })
      if (!user) throw new UnauthorizedException()
      return user
    } catch {
      throw new UnauthorizedException()
    }
  }

  @Get('stream')
  @Sse()
  async streamForUser(@Query('token') token: string): Promise<Observable<MessageEvent>> {
    const user = await this.getUserFromToken(token)
    const userStream$ = this.notifService.getUserStream$(user.id)

    if (user.role === 'admin' || (user.role as string) === 'animateur') {
      return merge(userStream$, this.notifService.getAdminStream$()).pipe(
        map(n => ({ data: JSON.stringify(n) } as MessageEvent))
      )
    }

    return userStream$.pipe(
      map(n => ({ data: JSON.stringify(n) } as MessageEvent))
    )
  }
}
