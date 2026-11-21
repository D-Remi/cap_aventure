import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Child } from '../children/child.entity'

export type UserRole = 'admin' | 'parent' | 'animateur'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({ type: 'enum', enum: ['admin', 'parent', 'animateur'], default: 'parent' })
  role: UserRole

  @Column()
  prenom: string

  @Column()
  nom: string

  @Column({ nullable: true })
  telephone: string

  @Column({ default: true })
  actif: boolean

  @OneToMany(() => Child, (child) => child.user, { cascade: true })
  children: Child[]

  // Adresse : obligatoire sur les factures et attestations fiscales (Code du travail D7233-1 et D7233-4)
  @Column({ nullable: true })
  adresse: string

  @Column({ nullable: true })
  code_postal: string

  @Column({ nullable: true })
  ville: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
