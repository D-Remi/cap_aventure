import { User } from '../users/user.entity';
import { Registration } from '../registrations/registration.entity';
export declare class Child {
    id: number;
    user: User;
    prenom: string;
    nom: string;
    date_naissance: string;
    infos_medicales: string;
    allergie: string;
    medecin_nom: string;
    medecin_telephone: string;
    contact_urgence_nom: string;
    contact_urgence_telephone: string;
    contact_urgence_lien: string;
    niveau_natation: string;
    notes_animateur: string;
    registrations: Registration[];
    created_at: Date;
}
