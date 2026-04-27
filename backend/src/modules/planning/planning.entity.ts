import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Activity } from '../activities/activity.entity'

@Entity('planning_seances')
export class PlanningSeance {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'datetime' })
  date: Date

  @Column()
  titre: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  lieu: string

  @Column({ type: 'text', nullable: true })
  notes_animateur: string

  @Column({ type: 'enum', enum: ['planifiee','confirmee','annulee'], default: 'planifiee' })
  statut: 'planifiee' | 'confirmee' | 'annulee'

  @ManyToOne(() => Activity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity

  @Column({ nullable: true })
  activity_id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
