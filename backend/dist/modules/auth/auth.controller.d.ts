import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
declare class RegisterDto {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    telephone?: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
declare class ForgotPasswordDto {
    email: string;
}
declare class ResetPasswordDto {
    token: string;
    password: string;
}
declare class UpdateProfileDto {
    prenom?: string;
    nom?: string;
    telephone?: string;
    currentPassword?: string;
    newPassword?: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            prenom: string;
            nom: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            prenom: string;
            nom: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    updateProfile(user: User, dto: UpdateProfileDto): Promise<User>;
}
export {};
