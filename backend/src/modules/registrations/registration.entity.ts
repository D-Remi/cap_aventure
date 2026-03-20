import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Child } from '../children/child.entity'
import { Activity } from '../activities/activity.entity'

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Child, (child) => child.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: Child

  @ManyToOne(() => Activity, (activity) => activity.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
  status: RegistrationStatus

  @CreateDateColumn()
  created_at: Date
}
