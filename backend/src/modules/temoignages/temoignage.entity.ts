import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'

@Entity('temoignages')
export class Temoignage {
  @PrimaryGeneratedColumn() id: number
  @Column({ nullable:true }) user_id: number
  @ManyToOne(() => User, { onDelete:'SET NULL', nullable:true }) @JoinColumn({ name:'user_id' }) user: User
  @Column() prenom: string
  @Column({ type:'tinyint', default:5 }) note: number
  @Column({ type:'text' }) contenu: string
  @Column({ default:false }) approuve: boolean
  @CreateDateColumn() created_at: Date
}