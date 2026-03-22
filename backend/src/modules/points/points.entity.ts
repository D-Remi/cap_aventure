import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { Child } from '../children/child.entity'

export type PointReason =
  | 'inscription'        // +10 pts par inscription confirmée
  | 'presence'           // +20 pts présence validée par l'animateur
  | 'parrainage'         // +50 pts si un ami s'inscrit grâce à lui
  | 'bonus_animateur'    // bonus manuel donné par l'animateur
  | 'echange_recompense' // déduction lors d'un échange

@Entity('points_history')
export class PointsHistory {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Child, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: Child

  @Column({ type: 'int' })
  points: number  // positif = gain, négatif = déduction

  @Column({
    type: 'enum',
    enum: ['inscription', 'presence', 'parrainage', 'bonus_animateur', 'echange_recompense'],
  })
  reason: PointReason

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  activity_id: number

  @CreateDateColumn()
  created_at: Date
}
