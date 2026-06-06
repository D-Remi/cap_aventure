import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { Child } from '../children/child.entity'
import { User } from '../users/user.entity'

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn() id: number
  @Column({ nullable:true }) child_id: number
  @Column() user_id: number

  @ManyToOne(() => Child, { onDelete:'SET NULL', nullable:true, eager:false })
  @JoinColumn({ name:'child_id' })
  child: Child

  @ManyToOne(() => User, { onDelete:'CASCADE' })
  @JoinColumn({ name:'user_id' })
  user: User

  @Column({ type:'enum', enum:['ordonnance','pap','mdph','autorisation_sortie','autorisation_photo','autre'], default:'autre' })
  type: string

  @Column() nom: string
  @Column() filename: string

  // Fichier stocké en base64 — accessible directement depuis le navigateur
  @Column({ type:'longtext', nullable:true }) data: string

  @Column({ nullable:true }) mimetype: string
  @Column({ nullable:true }) taille: number
  @Column({ type:'tinyint', nullable:true }) valide: boolean
  @Column({ type:'text', nullable:true }) note_admin: string

  @CreateDateColumn() created_at: Date
}