export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    private send;
    private baseTemplate;
    sendWelcome(to: string, prenom: string): Promise<void>;
    sendResetPassword(to: string, prenom: string, token: string): Promise<void>;
    sendRegistrationConfirmed(to: string, prenom: string, childName: string, activity: {
        titre: string;
        date: Date;
        prix: number;
    }): Promise<void>;
    sendRegistrationPending(to: string, prenom: string, childName: string, activityTitle: string): Promise<void>;
    sendRegistrationCancelled(to: string, prenom: string, childName: string, activityTitle: string): Promise<void>;
    sendActivityReminder(to: string, prenom: string, childName: string, activity: {
        titre: string;
        date: Date;
    }): Promise<void>;
    sendNewInterestNotification(adminEmail: string, form: {
        prenom: string;
        nom: string;
        email: string;
        enfant: string;
        activite: string;
    }): Promise<void>;
}
