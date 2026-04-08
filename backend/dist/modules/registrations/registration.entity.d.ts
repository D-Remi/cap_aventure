import { Child } from '../children/child.entity';
import { Activity } from '../activities/activity.entity';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type SubscriptionType = 'seance' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel' | 'essai';
export declare class Registration {
    id: number;
    child: Child;
    activity: Activity;
    status: RegistrationStatus;
    subscription_type: SubscriptionType;
    notes: string;
    created_at: Date;
}
