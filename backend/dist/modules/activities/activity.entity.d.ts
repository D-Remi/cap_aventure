import { Registration } from '../registrations/registration.entity';
export type ActivityType = 'ski' | 'vtt' | 'rando' | 'scout' | 'autre' | 'velo' | 'evenement';
export type ScheduleType = 'ponctuelle' | 'multi_dates' | 'recurrente' | 'saisonniere';
export type PaymentMethod = 'especes' | 'virement' | 'cesu';
export type RecurrenceDay = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';
export interface Tarif {
    label: string;
    prix: number;
    popular: boolean;
    desc?: string;
}
export declare class Activity {
    id: number;
    titre: string;
    description: string;
    type: ActivityType;
    schedule_type: ScheduleType;
    date: Date;
    dates: string[];
    recurrence_days: RecurrenceDay[];
    recurrence_time: string;
    date_debut: string;
    date_fin: string;
    periode_label: string;
    prix: number;
    prix_seance: number;
    tarifs: Tarif[];
    payment_methods: PaymentMethod[];
    virement_info: string;
    cesu_info: string;
    places_max: number;
    image_url: string;
    lieu: string;
    age_min: number;
    age_max: number;
    actif: boolean;
    registrations: Registration[];
    created_at: Date;
    updated_at: Date;
}
