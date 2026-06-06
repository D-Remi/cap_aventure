import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('contact_requests')
export class ContactRequest {
  @PrimaryGeneratedColumn() id: number
  @Column() prenom: string
  @Column({ nullable:true }) nom: string
  @Column() email: string
  @Column({ nullable:true }) telephone: string
  @Column({ type:'enum', enum:['garde','repit','evenement','autre'], nullable:true }) service: string
  @Column({ nullable:true }) enfant_prenom: string
  @Column({ nullable:true }) enfant_age: string
  @Column({ default:false }) besoins_specifiques: boolean
  @Column({ type:'text', nullable:true }) message: string
  @Column({ default:false }) traite: boolean
  @CreateDateColumn() created_at: Date
}