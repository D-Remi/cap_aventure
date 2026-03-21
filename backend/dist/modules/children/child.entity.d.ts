import { User } from '../users/user.entity';
import { Registration } from '../registrations/registration.entity';
export declare class Child {
    id: number;
    user: User;
    prenom: string;
    nom: string;
    date_naissance: string;
    infos_medicales: string;
    registrations: Registration[];
    created_at: Date;
}
