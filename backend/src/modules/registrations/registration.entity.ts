import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Child } from '../children/child.entity'
import { Activity } from '../activities/activity.entity'

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'
export type SubscriptionType   = 'seance' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel' | 'essai'

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  child_id: number

  @Column({ nullable: true })
  activity_id: number

  // Sans inverse — child.registrations n'existe plus dans la nouvelle entité Child
  @ManyToOne(() => Child, { onDelete:'CASCADE', nullable:true })
  @JoinColumn({ name:'child_id' })
  child: Child

  // Sans inverse — activity.registrations reste dans activity.entity.ts
  @ManyToOne(() => Activity, (activity) => activity.registrations, { onDelete:'CASCADE', nullable:true })
  @JoinColumn({ name:'activity_id' })
  activity: Activity

  @Column({ type:'enum', enum:['pending','confirmed','cancelled'], default:'pending' })
  status: RegistrationStatus

  @Column({ type:'enum', enum:['seance','mensuel','trimestriel','semestriel','annuel','essai'], default:'seance' })
  subscription_type: SubscriptionType

  @Column({ nullable:true, type:'text' })
  notes: string

  @CreateDateColumn()
  created_at: Date
}