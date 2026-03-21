export interface AppNotification {
    type: 'registration_status' | 'new_registration' | 'new_interest' | 'activity_created';
    title: string;
    message: string;
    data?: any;
    userId?: number;
    timestamp: Date;
}
export declare class NotificationsService {
    private adminStream$;
    private userStreams;
    emitAdmin(notification: Omit<AppNotification, 'timestamp'>): void;
    emitUser(userId: number, notification: Omit<AppNotification, 'timestamp'>): void;
    getAdminStream$(): import("rxjs").Observable<AppNotification>;
    getUserStream$(userId: number): import("rxjs").Observable<AppNotification>;
    cleanUserStream(userId: number): void;
}
