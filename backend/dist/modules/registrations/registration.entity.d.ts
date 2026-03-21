import { Child } from '../children/child.entity';
import { Activity } from '../activities/activity.entity';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export declare class Registration {
    id: number;
    child: Child;
    activity: Activity;
    status: RegistrationStatus;
    created_at: Date;
}
