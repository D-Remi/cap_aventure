import { Repository } from 'typeorm';
import { PointsHistory, PointReason } from './points.entity';
import { Child } from '../children/child.entity';
export declare class PointsService {
    private repo;
    private childRepo;
    constructor(repo: Repository<PointsHistory>, childRepo: Repository<Child>);
    getTotal(childId: number): Promise<number>;
    getHistory(childId: number): Promise<PointsHistory[]>;
    getByUser(userId: number): Promise<{
        child: Child;
        total: number;
        history: PointsHistory[];
    }[]>;
    addPoints(childId: number, points: number, reason: PointReason, description?: string, activityId?: number): Promise<PointsHistory>;
    redeemPoints(childId: number, cost: number, description: string): Promise<PointsHistory>;
    getLeaderboard(): Promise<{
        rank: number;
        childId: any;
        prenom: any;
        nom: any;
        total: number;
    }[]>;
    getAdminStats(): Promise<{
        totalDistributed: number;
        totalRedeemed: number;
    }>;
}
