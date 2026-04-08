import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm'
import { User } from '../users/user.entity'

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User

  @Column({ type: 'text' })
  content: string

  @Column({ default: false })
  read: boolean

  @Column({ default: false })
  archived: boolean   // conversation clôturée (soft)

  @DeleteDateColumn()
  deleted_at: Date    // soft delete TypeORM

  @CreateDateColumn()
  created_at: Date
}
