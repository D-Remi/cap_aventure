import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Registration } from '../registrations/registration.entity'

export type ActivityType  = 'ski' | 'vtt' | 'rando' | 'scout' | 'autre' | 'velo' | 'evenement'
export type ScheduleType  = 'ponctuelle' | 'multi_dates' | 'recurrente' | 'saisonniere'
export type PaymentMethod = 'especes' | 'virement' | 'cesu'
export type RecurrenceDay = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche'

export interface Tarif {
  label:   string   // ex: "Séance", "Mensuel", "Trimestriel"
  prix:    number   // ex: 25
  popular: boolean  // affiche badge "Populaire"
  desc?:   string   // ex: "4 séances/mois"
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  titre: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'enum', enum: ['ski','vtt','rando','scout','autre','velo','evenement'], default: 'autre' })
  type: ActivityType

  @Column({ type: 'enum', enum: ['ponctuelle','multi_dates','recurrente','saisonniere'], default: 'ponctuelle' })
  schedule_type: ScheduleType

  @Column({ type: 'datetime', nullable: true })
  date: Date

  @Column({ type: 'json', nullable: true })
  dates: string[]

  @Column({ type: 'json', nullable: true })
  recurrence_days: RecurrenceDay[]

  @Column({ nullable: true })
  recurrence_time: string

  @Column({ type: 'date', nullable: true })
  date_debut: string

  @Column({ type: 'date', nullable: true })
  date_fin: string

  @Column({ nullable: true })
  periode_label: string

  // ── Prix legacy (gardé pour compatibilité) ──
  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  prix: number

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  prix_seance: number

  // ── Tarifs structurés (nouveau) ──
  @Column({ type: 'json', nullable: true })
  tarifs: Tarif[]

  @Column({ type: 'json', nullable: true })
  payment_methods: PaymentMethod[]

  @Column({ type: 'text', nullable: true })
  virement_info: string

  @Column({ type: 'text', nullable: true })
  cesu_info: string

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
