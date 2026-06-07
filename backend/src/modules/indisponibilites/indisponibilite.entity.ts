import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('indisponibilites')
export class Indisponibilite {
  @PrimaryGeneratedColumn() id: number
  @Column({ type:'date' })   date: string
  @Column({ type:'time', default:'00:00:00' }) heure_debut: string
  @Column({ type:'time', default:'23:59:00' }) heure_fin:   string
  @Column({ nullable:true })  motif: string
  @Column({ default:false })  journee_complete: boolean
  @CreateDateColumn()         created_at: Date
}