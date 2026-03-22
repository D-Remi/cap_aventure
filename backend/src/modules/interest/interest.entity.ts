import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('interest_forms')
export class InterestForm {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  prenom: string

  @Column({ nullable: true })
  nom: string

  @Column()
  email: string

  @Column({ nullable: true })
  enfant: string

  @Column({ nullable: true })
  age: string

  @Column({ nullable: true })
  activite: string

  @Column({ type: 'text', nullable: true })
  message: string

  @CreateDateColumn()
  created_at: Date
}
