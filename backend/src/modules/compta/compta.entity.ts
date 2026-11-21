import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'

// Livre des recettes (et dépenses) — obligatoire en micro-entreprise :
// chaque encaissement est noté à sa date, avec le client, la nature, le montant et le mode de paiement.
export const MODES_PAIEMENT = ['avance_immediate', 'virement', 'cesu', 'cheque', 'cb', 'especes'] as const

@Entity('compta_entrees')
export class ComptaEntree {
  @PrimaryGeneratedColumn() id: number

  @Column({ type:'date' }) date: string
  @Column({ type:'decimal', precision:8, scale:2 }) montant: number
  @Column({ type:'enum', enum: MODES_PAIEMENT as any, default:'virement' }) mode: string
  @Column({ nullable:true }) reference: string
  @Column({ nullable:true }) description: string
  @Column({ nullable:true }) famille: string
  @Column({ nullable:true }) user_id: number

  @ManyToOne(() => User, { onDelete:'SET NULL', nullable:true })
  @JoinColumn({ name:'user_id' }) user: User

  @Column({ type:'enum', enum:['recette','depense'], default:'recette' }) type: string
  @Column({ nullable:true }) categorie: string

  // Lien vers la facture réglée (rempli automatiquement quand une facture est marquée payée)
  @Column({ nullable:true }) facture_id: number

  @CreateDateColumn() created_at: Date
}
