import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Slot } from '../slots/slot.entity'
import { Child } from '../children/child.entity'
import { User } from '../users/user.entity'

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn() id: number
  @Column() slot_id: number
  @Column() child_id: number
  @Column() user_id: number
  @ManyToOne(() => Slot,  { onDelete:'RESTRICT', eager:true }) @JoinColumn({name:'slot_id'})  slot:  Slot
  @ManyToOne(() => Child, { onDelete:'CASCADE',  eager:true }) @JoinColumn({name:'child_id'}) child: Child
  @ManyToOne(() => User,  { onDelete:'CASCADE' })              @JoinColumn({name:'user_id'})  user:  User
  @Column({ type:'enum', enum:['pending','confirmed','cancelled','no_show'], default:'pending' }) status: string
  @Column({ type:'enum', enum:['journee','demi_journee','semaine','mensuel'], default:'journee' }) formule: string
  @Column({ type:'decimal', precision:8, scale:2, default:25 }) tarif_applique: number
  @Column({ type:'enum', enum:['especes','virement','cesu'], nullable:true }) paiement: string
  @Column({ type:'enum', enum:['en_attente','recu','rembourse'], default:'en_attente' }) paiement_statut: string
  @Column({ type:'decimal', precision:8, scale:2, nullable:true }) tarif_propose: number
  @Column({ type:'enum', enum:['cesu','virement'], nullable:true }) paiement_mode: string
  @Column({ nullable:true }) paiement_ref: string
  @Column({ default:false }) paiement_declare: boolean
  @Column({ default:false }) paiement_valide: boolean
  @Column({ type:'datetime', nullable:true }) paiement_date: Date
  @Column({ type:'text', nullable:true }) notes_parent: string
  @Column({ type:'text', nullable:true }) notes_animateur: string
  @Column({ type:'text', nullable:true }) compte_rendu: string
  @Column({ type:'datetime', nullable:true }) compte_rendu_at: Date
  @Column({ type:'tinyint', nullable:true }) present: boolean
  @Column({ type:'time', nullable:true }) heure_arrivee: string
  @Column({ type:'time', nullable:true }) heure_depart: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}