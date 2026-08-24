import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../users/user.entity'

// Un refresh token par session/appareil. Stocké HASHÉ en base (jamais en clair).
// Permet de révoquer une session précise (ou toutes) sans toucher aux autres.
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn() id: number

  @Column() userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  // hash SHA-256 du token (jamais le token en clair)
  @Column() tokenHash: string

  // pour repérer l'appareil (optionnel, aide au diagnostic)
  @Column({ nullable: true }) userAgent: string
  @Column({ nullable: true }) ip: string

  @Column({ type: 'datetime' }) expiresAt: Date

  // révoqué manuellement ou après rotation
  @Column({ type: 'boolean', default: false }) revoked: boolean

  @CreateDateColumn() createdAt: Date
}
