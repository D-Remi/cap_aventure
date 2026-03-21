import { Repository } from 'typeorm';
import { InterestForm } from './interest.entity';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class InterestService {
    private repo;
    private email;
    private notif;
    constructor(repo: Repository<InterestForm>, email: EmailService, notif: NotificationsService);
    create(dto: Partial<InterestForm>): Promise<InterestForm>;
    findAll(): Promise<InterestForm[]>;
}
