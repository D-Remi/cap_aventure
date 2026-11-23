import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('contact_requests')
export class ContactRequest {
  @PrimaryGeneratedColumn() id: number
  @Column() prenom: string
  @Column({ nullable:true }) nom: string
  @Column() email: string
  @Column({ nullable:true }) telephone: string
  @Column({ type:'enum', enum:['repit','accompagnement','autre'], nullable:true }) service: string
  @Column({ nullable:true }) enfant_prenom: string
  @Column({ type:'enum', enum:['info','bientot','urgent'], nullable:true }) urgence: string
  @Column({ default:false }) besoins_specifiques: boolean
  @Column({ type:'text', nullable:true }) message: string
  @Column({ default:false }) traite: boolean
  @Column({ default:false }) spam: boolean
  @Column({ nullable:true }) spam_raison: string
  @Column({ length:30, nullable:true }) source: string   // comment la famille a connu Éduc & Vous
  @CreateDateColumn() created_at: Date
}