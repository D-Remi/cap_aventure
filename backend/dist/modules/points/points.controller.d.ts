import { PointsService } from './points.service';
import { User } from '../users/user.entity';
declare class AddPointsDto {
    child_id: number;
    points: number;
    reason: string;
    description?: string;
    activity_id?: number;
}
declare class RedeemDto {
    child_id: number;
    cost: number;
    description: string;
}
export declare class PointsController {
    private service;
    constructor(service: PointsService);
    getMine(user: User): Promise<{
        child: import("../children/child.entity").Child;
        total: number;
        history: import("./points.entity").PointsHistory[];
    }[]>;
    getTotal(id: string): Promise<{
        total: number;
    }>;
    getHistory(id: string): Promise<import("./points.entity").PointsHistory[]>;
    getLeaderboard(): Promise<{
        rank: number;
        childId: any;
        prenom: any;
        nom: any;
        total: number;
    }[]>;
    add(dto: AddPointsDto): Promise<import("./points.entity").PointsHistory>;
    redeem(dto: RedeemDto): Promise<import("./points.entity").PointsHistory>;
    adminStats(): Promise<{
        totalDistributed: number;
        totalRedeemed: number;
    }>;
}
export {};
