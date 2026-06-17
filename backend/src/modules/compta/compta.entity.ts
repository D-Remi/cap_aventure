import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'

@Entity('compta_entrees')
export class ComptaEntree {
  @PrimaryGeneratedColumn() id: number

  @Column({ type:'date' }) date: string
  @Column({ type:'decimal', precision:8, scale:2 }) montant: number
  @Column({ type:'enum', enum:['cesu','virement','especes'], default:'virement' }) mode: string
  @Column({ nullable:true }) reference: string
  @Column({ nullable:true }) description: string
  @Column({ nullable:true }) famille: string
  @Column({ nullable:true }) user_id: number

  @ManyToOne(() => User, { onDelete:'SET NULL', nullable:true })
  @JoinColumn({ name:'user_id' }) user: User

  @Column({ type:'enum', enum:['recette','depense'], default:'recette' }) type: string
  @Column({ nullable:true }) categorie: string

  @CreateDateColumn() created_at: Date
}