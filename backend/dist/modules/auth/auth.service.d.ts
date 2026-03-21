import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { PasswordResetToken } from './password-reset.entity';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private usersRepo;
    private resetRepo;
    private jwt;
    private email;
    constructor(usersRepo: Repository<User>, resetRepo: Repository<PasswordResetToken>, jwt: JwtService, email: EmailService);
    register(dto: {
        prenom: string;
        nom: string;
        email: string;
        telephone?: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            prenom: string;
            nom: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            prenom: string;
            nom: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    updateProfile(userId: number, dto: {
        prenom?: string;
        nom?: string;
        telephone?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<User>;
    private signToken;
    validateById(id: number): Promise<User | null>;
}
