import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { Child } from '../children/child.entity'
import { User } from '../users/user.entity'

export type DocumentType = 'fiche_sanitaire' | 'autorisation' | 'assurance' | 'autre'

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Child, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'child_id' })
  child: Child

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({
    type: 'enum',
    enum: ['fiche_sanitaire', 'autorisation', 'assurance', 'autre'],
    default: 'autre',
  })
  type: DocumentType

  @Column()
  filename: string

  @Column()
  original_name: string

  @Column({ type: 'int' })
  size: number

  @Column()
  url: string

  @CreateDateColumn()
  created_at: Date
}
