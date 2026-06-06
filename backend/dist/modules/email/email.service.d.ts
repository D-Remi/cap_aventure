export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    private send;
    private tpl;
    sendWelcome(to: string, prenom: string): Promise<void>;
    sendResetPassword(to: string, prenom: string, token: string): Promise<void>;
    sendBookingPending(to: string, prenom: string, enfant: string, date: string): Promise<void>;
    sendBookingConfirmed(to: string, prenom: string, enfant: string, date: string, heure?: string): Promise<void>;
    sendBookingCancelled(to: string, prenom: string, enfant: string, date: string): Promise<void>;
    sendContactNotif(data: {
        prenom: string;
        email: string;
        service?: string;
        besoins_specifiques?: boolean;
    }): Promise<void>;
    sendNewInterestNotification(adminEmail: string, form: any): Promise<void>;
    sendRegistrationConfirmed(to: string, prenom: string, childName: string, activity: any): Promise<void>;
    sendRegistrationPending(to: string, prenom: string, childName: string, activityTitle: string): Promise<void>;
    sendRegistrationCancelled(to: string, prenom: string, childName: string, activityTitle: string): Promise<void>;
}
