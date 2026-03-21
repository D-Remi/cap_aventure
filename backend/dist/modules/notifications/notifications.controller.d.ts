import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class NotificationsController {
    private notifService;
    private jwtService;
    private userRepo;
    constructor(notifService: NotificationsService, jwtService: JwtService, userRepo: Repository<User>);
    private getUserFromToken;
    streamForUser(token: string): Promise<Observable<MessageEvent>>;
}
