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

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
