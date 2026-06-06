import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { Contrat } from './contrat.entity'
import { User } from '../users/user.entity'

@Entity('factures')
export class Facture {
  @PrimaryGeneratedColumn() id: number
  @Column() contrat_id: number
  @Column() user_id: number
  @ManyToOne(() => Contrat, { onDelete:'CASCADE' }) @JoinColumn({name:'contrat_id'}) contrat: Contrat
  @ManyToOne(() => User,    { onDelete:'CASCADE' }) @JoinColumn({name:'user_id'})    user:    User

  @Column() numero: string
  @Column({ type:'date' }) periode_debut: string
  @Column({ type:'date' }) periode_fin:   string
  @Column({ type:'decimal', precision:6, scale:1, default:0 }) total_heures: number
  @Column({ type:'decimal', precision:7, scale:1, default:0 }) total_km:     number
  @Column({ type:'decimal', precision:8, scale:2, default:0 }) montant_heures: number
  @Column({ type:'decimal', precision:8, scale:2, default:0 }) montant_km:     number
  @Column({ type:'decimal', precision:8, scale:2, default:0 }) montant_total:  number
  @Column({ type:'enum', enum:['brouillon','envoyee','payee'], default:'brouillon' }) statut: string
  @Column({ type:'text', nullable:true }) notes: string
  @Column({ nullable:true }) pdf_url: string
  @CreateDateColumn() created_at: Date
}