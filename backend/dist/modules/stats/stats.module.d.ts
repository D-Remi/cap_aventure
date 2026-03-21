import { StatsService } from './stats.service';
export declare class StatsController {
    private statsService;
    constructor(statsService: StatsService);
    getGlobal(): Promise<{
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
    getRegsByMonth(): Promise<{
        confirmed: number;
        pending: number;
        cancelled: number;
        month: string;
    }[]>;
    getRevenue(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getByType(): Promise<{
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
export declare class StatsModule {
}
