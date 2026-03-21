import { Repository } from 'typeorm';
import { Registration } from './registration.entity';
import { Activity } from '../activities/activity.entity';
import { Child } from '../children/child.entity';
import { User } from '../users/user.entity';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PointsService } from '../points/points.service';
export declare class RegistrationsService {
    private repo;
    private actRepo;
    private childRepo;
    private email;
    private notif;
    private points;
    constructor(repo: Repository<Registration>, actRepo: Repository<Activity>, childRepo: Repository<Child>, email: EmailService, notif: NotificationsService, points: PointsService);
    findByUser(userId: number): Promise<Registration[]>;
    findAll(): Promise<Registration[]>;
    findByActivity(activityId: number): Promise<Registration[]>;
    create(user: User, dto: {
        activity_id: number;
        child_id: number;
    }): Promise<Registration>;
    updateStatus(id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Registration>;
    cancel(id: number, user: User): Promise<Registration>;
}
