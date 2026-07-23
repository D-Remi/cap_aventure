import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Child } from '../children/child.entity'

@Entity('objectifs')
export class Objectif {
  @PrimaryGeneratedColumn() id: number

  @Column() user_id: number
  @Column({ nullable: true }) child_id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User

  @ManyToOne(() => Child, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'child_id' }) child: Child

  @Column() titre: string
  @Column({ type: 'text', nullable: true }) description: string

  @Column({ type: 'enum', enum: ['cadre', 'communication', 'autonomie', 'emotions', 'relations', 'autre'], default: 'autre' })
  domaine: string

  @Column({ type: 'enum', enum: ['a_travailler', 'en_cours', 'atteint', 'suspendu'], default: 'a_travailler' })
  statut: string

  // Progression 0-100
  @Column({ type: 'tinyint', default: 0 }) progression: number

  @Column({ type: 'date', nullable: true }) date_debut: string
  @Column({ type: 'date', nullable: true }) date_cible: string

  @Column({ default: true }) visible_famille: boolean

  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}
