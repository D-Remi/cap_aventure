import { Child } from '../children/child.entity';
export type PointReason = 'inscription' | 'presence' | 'parrainage' | 'bonus_animateur' | 'echange_recompense';
export declare class PointsHistory {
    id: number;
    child: Child;
    points: number;
    reason: PointReason;
    description: string;
    activity_id: number;
    created_at: Date;
}
