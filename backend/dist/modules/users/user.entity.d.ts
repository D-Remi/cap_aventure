import { Child } from '../children/child.entity';
export type UserRole = 'admin' | 'parent' | 'animateur';
export declare class User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    prenom: string;
    nom: string;
    telephone: string;
    actif: boolean;
    children: Child[];
    created_at: Date;
    updated_at: Date;
}
