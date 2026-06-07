import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Slot } from '../slots/slot.entity'

@Entity('planning_seances')
export class PlanningSeance {
  @PrimaryGeneratedColumn() id: number
  @ManyToOne(() => Slot, { onDelete:'SET NULL', nullable:true })
  @JoinColumn({ name:'slot_id' })
  slot: Slot
  @Column({ nullable:true }) slot_id: number
  @Column({ type:'datetime' }) date: Date
  @Column() titre: string
  @Column({ type:'text', nullable:true }) description: string
  @Column({ nullable:true }) lieu: string
  @Column({ type:'text', nullable:true }) notes_animateur: string
  @Column({ type:'enum', enum:['planifiee','confirmee','annulee'], default:'planifiee' }) statut: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}