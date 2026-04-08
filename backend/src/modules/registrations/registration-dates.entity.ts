import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { Registration } from '../registrations/registration.entity'

@Entity('registration_dates')
export class RegistrationDate {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Registration, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'registration_id' })
  registration: Registration

  @Column({ type: 'datetime' })
  date: Date

  @Column({ default: false })
  attended: boolean  // présence validée par l'animateur

  @CreateDateColumn()
  created_at: Date
}
