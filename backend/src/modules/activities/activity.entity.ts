import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Registration } from '../registrations/registration.entity'

export type ActivityType     = 'ski' | 'vtt' | 'rando' | 'scout' | 'autre'
export type ScheduleType     = 'ponctuelle' | 'multi_dates' | 'recurrente' | 'saisonniere'
export type PaymentMethod    = 'especes' | 'virement' | 'cesu'
export type RecurrenceDay    = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche'

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  titre: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'enum', enum: ['ski','vtt','rando','scout','autre'], default: 'autre' })
  type: ActivityType

  // ── Scheduling ───────────────────────────────────────────────
  @Column({ type: 'enum', enum: ['ponctuelle','multi_dates','recurrente','saisonniere'], default: 'ponctuelle' })
  schedule_type: ScheduleType

  /** ponctuelle : date unique */
  @Column({ type: 'datetime', nullable: true })
  date: Date

  /** multi_dates : liste de dates JSON ["2025-03-15T09:00:00", ...] */
  @Column({ type: 'json', nullable: true })
  dates: string[]

  /** recurrente : jour(s) de la semaine */
  @Column({ type: 'json', nullable: true })
  recurrence_days: RecurrenceDay[]

  /** recurrente : heure (ex: "14:00") */
  @Column({ nullable: true })
  recurrence_time: string

  /** recurrente / saisonniere : date de début de validité */
  @Column({ type: 'date', nullable: true })
  date_debut: string

  /** recurrente / saisonniere : date de fin de validité */
  @Column({ type: 'date', nullable: true })
  date_fin: string

  /** saisonniere : description libre (ex: "Tous les mercredis hivers") */
  @Column({ nullable: true })
  periode_label: string

  // ── Prix & paiement ──────────────────────────────────────────
  @Column({ type: 'decimal', precision: 8, scale: 2 })
  prix: number

  /** Prix à la séance (pour récurrentes) */
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  prix_seance: number

  /** Modes de paiement acceptés */
  @Column({ type: 'json', nullable: true })
  payment_methods: PaymentMethod[]

  /** Infos virement (IBAN tronqué, banque...) */
  @Column({ type: 'text', nullable: true })
  virement_info: string

  /** Infos CESU */
  @Column({ type: 'text', nullable: true })
  cesu_info: string

  // ── Autres ───────────────────────────────────────────────────
  @Column()
  places_max: number

  @Column({ nullable: true })
  image_url: string

  @Column({ nullable: true })
  lieu: string

  @Column({ nullable: true })
  age_min: number

  @Column({ nullable: true })
  age_max: number

  @Column({ default: true })
  actif: boolean

  @OneToMany(() => Registration, (reg) => reg.activity)
  registrations: Registration[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
