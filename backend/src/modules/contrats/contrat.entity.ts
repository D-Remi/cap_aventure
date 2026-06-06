import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Child } from '../children/child.entity'

@Entity('contrats')
export class Contrat {
  @PrimaryGeneratedColumn() id: number
  @Column() user_id: number
  @Column() child_id: number
  @ManyToOne(() => User,  { onDelete:'CASCADE', eager:true }) @JoinColumn({name:'user_id'})  user:  User
  @ManyToOne(() => Child, { onDelete:'CASCADE', eager:true }) @JoinColumn({name:'child_id'}) child: Child

  @Column({ type:'date' }) date_debut: string
  @Column({ type:'date' }) date_fin:   string
  @Column({ nullable:true }) jours_semaine: string

  @Column({ type:'decimal', precision:6, scale:2, default:15 }) tarif_horaire: number
  @Column({ type:'decimal', precision:4, scale:1, default:3  }) heures_semaine: number
  @Column({ type:'decimal', precision:5, scale:2, default:0.40 }) tarif_km: number
  @Column({ default:0 }) km_inclus: number

  @Column({ type:'text', nullable:true }) objectifs: string
  @Column({ type:'text', nullable:true }) besoins_specifiques: string
  @Column({ type:'text', nullable:true }) modalites: string
  @Column({ type:'text', nullable:true }) clauses: string

  @Column({ type:'enum', enum:['brouillon','envoye','signe_parent','signe_admin','actif','termine','annule'], default:'brouillon' })
  statut: string

  @Column({ type:'mediumtext', nullable:true }) signature_parent: string
  @Column({ type:'datetime', nullable:true })   signature_parent_at: Date
  @Column({ type:'mediumtext', nullable:true }) signature_admin: string
  @Column({ type:'datetime', nullable:true })   signature_admin_at: Date

  @Column({ type:'decimal', precision:8, scale:2, nullable:true }) montant_estime: number

  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}