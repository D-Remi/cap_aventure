import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm'

// Appel découverte réservé en ligne par une famille
@Entity('rendez_vous')
export class RendezVous {
  @PrimaryGeneratedColumn() id: number
  @Index('idx_rdv_date') @Column({ type: 'date' }) date: string
  @Column({ length: 5 }) heure: string               // '18:30', heure de Paris
  @Column({ type: 'int', default: 30 }) duree_min: number
  @Column({ length: 100 }) prenom: string
  @Column() email: string
  @Column({ length: 30 }) telephone: string
  @Column({ length: 20, nullable: true }) residence: string   // france | suisse
  @Column({ length: 100, nullable: true }) commune: string
  @Column({ type: 'text', nullable: true }) message: string
  @Column({ type: 'enum', enum: ['confirme', 'fait', 'annule'], default: 'confirme' }) statut: string
  @CreateDateColumn() created_at: Date
}

// Réglages des créneaux (une seule ligne, id = 1)
@Entity('rendez_vous_reglages')
export class ReglagesRdv {
  @PrimaryColumn() id: number
  // Créneaux de début par jour de la semaine : { "1": ["12:30", "18:30"], ... "7": [] } (1 = lundi)
  @Column({ type: 'simple-json' }) creneaux: Record<string, string[]>
  @Column({ type: 'int', default: 30 }) duree_min: number
  @Column({ type: 'int', default: 12 }) delai_heures: number   // délai minimum avant un créneau
  @Column({ type: 'int', default: 21 }) jours_max: number      // jusqu'où on peut réserver
  @Column({ default: true }) actif: boolean
}

export const CRENEAUX_PAR_DEFAUT: Record<string, string[]> = {
  '1': ['12:30', '18:30', '19:00', '19:30'],
  '2': ['12:30', '18:30', '19:00', '19:30'],
  '3': ['10:00', '10:30', '12:30', '18:30', '19:00'],
  '4': ['12:30', '18:30', '19:00', '19:30'],
  '5': ['12:30', '18:30', '19:00'],
  '6': ['10:00', '10:30', '11:00'],
  '7': [],
}
