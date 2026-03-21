import { Repository } from 'typeorm';
import { Registration } from '../registrations/registration.entity';
import { Activity } from '../activities/activity.entity';
import { User } from '../users/user.entity';
import { Child } from '../children/child.entity';
export declare class StatsService {
    private regRepo;
    private actRepo;
    private userRepo;
    private childRepo;
    constructor(regRepo: Repository<Registration>, actRepo: Repository<Activity>, userRepo: Repository<User>, childRepo: Repository<Child>);
    getGlobalStats(): Promise<{
        totalUsers: number;
        totalChildren: number;
        totalActivities: number;
        totalRegistrations: number;
        confirmed: number;
        pending: number;
        cancelled: number;
        revenue: number;
        potRevenue: number;
    }>;
    getRegistrationsByMonth(): Promise<{
        confirmed: number;
        pending: number;
        cancelled: number;
        month: string;
    }[]>;
    getRevenueByMonth(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getActivitiesByType(): Promise<{
        count: number;
        inscrits: number;
        type: string;
    }[]>;
    getTopActivities(): Promise<{
        id: number;
        titre: string;
        type: import("../activities/activity.entity").ActivityType;
        date: Date;
        prix: number;
        places_max: number;
        inscrits: number;
        taux_remplissage: number;
    }[]>;
    getUserGrowth(): Promise<{
        month: string;
        nouveaux: number;
        total: number;
    }[]>;
}
