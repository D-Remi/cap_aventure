import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Child } from '../children/child.entity'

@Entity('seances')
export class Seance {
  @PrimaryGeneratedColumn() id: number

  @Column() user_id: number
  @Column({ nullable: true }) child_id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User

  @ManyToOne(() => Child, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'child_id' }) child: Child

  // Type de prestation
  @Column({ type: 'enum', enum: ['repit', 'accompagnement', 'guidance'], default: 'accompagnement' })
  type: string

  @Column({ type: 'date' }) date: string
  @Column({ type: 'time', nullable: true }) heure_debut: string
  @Column({ type: 'time', nullable: true }) heure_fin: string
  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 }) duree_heures: number

  @Column({ nullable: true }) lieu: string

  // Ce qui a été travaillé — visible par la famille
  @Column({ type: 'text', nullable: true }) compte_rendu: string

  // Notes privées éducateur — JAMAIS visibles par la famille
  @Column({ type: 'text', nullable: true }) notes_privees: string

  // Objectifs travaillés pendant cette séance (texte libre ou liste)
  @Column({ type: 'text', nullable: true }) objectifs_travailles: string

  @Column({ type: 'enum', enum: ['planifiee', 'realisee', 'annulee'], default: 'planifiee' })
  statut: string

  // Le compte-rendu est-il partagé avec la famille ?
  @Column({ default: false }) cr_partage: boolean

  // Facturation
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }) montant: number
  @Column({ default: false }) facturee: boolean

  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}
