import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Contrat } from './contrat.entity'

@Entity('contrat_seances')
export class ContratSeance {
  @PrimaryGeneratedColumn() id: number
  @Column() contrat_id: number
  @ManyToOne(() => Contrat, { onDelete:'CASCADE' }) @JoinColumn({name:'contrat_id'}) contrat: Contrat

  @Column({ type:'date' })  date:        string
  @Column({ type:'time' })  heure_debut: string
  @Column({ type:'time' })  heure_fin:   string
  @Column({ type:'decimal', precision:6, scale:1, default:0 }) km_aller:  number
  @Column({ type:'decimal', precision:6, scale:1, default:0 }) km_retour: number
  @Column({ type:'text', nullable:true }) notes: string
  @Column({ type:'decimal', precision:8, scale:2, nullable:true }) montant_heures: number
  @Column({ type:'decimal', precision:8, scale:2, nullable:true }) montant_km:     number
  @Column({ type:'decimal', precision:8, scale:2, nullable:true }) montant_total:  number
  @Column({ nullable:true }) facture_id: number

  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}