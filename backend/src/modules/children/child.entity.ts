import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Registration } from '../registrations/registration.entity'

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  prenom: string

  @Column()
  nom: string

  @Column({ type: 'date', nullable: true })
  date_naissance: string

  @Column({ type: 'text', nullable: true })
  infos_medicales: string

  @Column({ nullable: true })
  allergie: string

  @Column({ nullable: true })
  medecin_nom: string

  @Column({ nullable: true })
  medecin_telephone: string

  @Column({ nullable: true })
  contact_urgence_nom: string

  @Column({ nullable: true })
  contact_urgence_telephone: string

  @Column({ nullable: true })
  contact_urgence_lien: string

  @Column({ nullable: true })
  niveau_natation: string

  @Column({ type: 'text', nullable: true })
  notes_animateur: string

  @OneToMany(() => Registration, (reg) => reg.child)
  registrations: Registration[]

  @CreateDateColumn()
  created_at: Date
}
