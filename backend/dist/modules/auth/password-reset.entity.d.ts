import { User } from '../users/user.entity';
export declare class PasswordResetToken {
    id: number;
    token: string;
    user: User;
    expires_at: Date;
    used: boolean;
    created_at: Date;
}
