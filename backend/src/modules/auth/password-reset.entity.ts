import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  token: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'datetime' })
  expires_at: Date

  @Column({ default: false })
  used: boolean

  @CreateDateColumn()
  created_at: Date
}
