type ScheduleType = 'ponctuelle' | 'multi_dates' | 'recurrente' | 'saisonniere';
type RecurrenceDay = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';
export declare class CreateActivityDto {
    titre: string;
    description: string;
    type: string;
    schedule_type: ScheduleType;
    date?: string;
    dates?: string[];
    recurrence_days?: RecurrenceDay[];
    recurrence_time?: string;
    date_debut?: string;
    date_fin?: string;
    periode_label?: string;
    prix: number;
    prix_seance?: number;
    tarifs?: Array<{
        label: string;
        prix: number;
        popular: boolean;
        desc?: string;
    }>;
    places_max: number;
    payment_methods?: string[];
    virement_info?: string;
    cesu_info?: string;
    lieu?: string;
    age_min?: number;
    age_max?: number;
    image_url?: string;
    actif?: boolean;
}
export declare class UpdateActivityDto {
    titre?: string;
    description?: string;
    type?: string;
    schedule_type?: ScheduleType;
    date?: string;
    dates?: string[];
    recurrence_days?: string[];
    recurrence_time?: string;
    date_debut?: string;
    date_fin?: string;
    periode_label?: string;
    prix?: number;
    prix_seance?: number;
    places_max?: number;
    payment_methods?: string[];
    virement_info?: string;
    cesu_info?: string;
    lieu?: string;
    age_min?: number;
    age_max?: number;
    tarifs?: Array<{
        label: string;
        prix: number;
        popular: boolean;
        desc?: string;
    }>;
    image_url?: string;
    actif?: boolean;
}
export declare class CreateChildDto {
    prenom: string;
    nom: string;
    date_naissance: string;
    infos_medicales?: string;
}
export declare class CreateRegistrationDto {
    activity_id: number;
    child_id: number;
    subscription_type?: string;
    notes?: string;
}
export declare class UpdateRegistrationStatusDto {
    status: string;
}
export declare class CreateInterestDto {
    prenom: string;
    nom?: string;
    email: string;
    enfant?: string;
    age?: string;
    activite?: string;
    message?: string;
}
export declare class CreateDocumentDto {
    child_id?: number;
    type?: string;
}
export {};
