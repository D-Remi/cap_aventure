import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn() id: number
  @Column() user_id: number
  @ManyToOne(() => User, { onDelete:'CASCADE' }) @JoinColumn({name:'user_id'}) user: User
  @Column() prenom: string
  @Column() nom: string
  @Column({ type:'date', nullable:true }) date_naissance: string
  @Column({ type:'text', nullable:true }) allergie: string
  @Column({ nullable:true }) medecin_nom: string
  @Column({ nullable:true }) medecin_telephone: string
  @Column({ nullable:true }) contact_urgence_nom: string
  @Column({ nullable:true }) contact_urgence_telephone: string
  @Column({ nullable:true }) contact_urgence_lien: string
  @Column({ default:false }) dossier_complete: boolean
  @Column({ default:false }) besoins_specifiques: boolean
  @Column({ nullable:true }) type_besoin: string
  @Column({ type:'enum', enum:['total','partiel','accompagne'], default:'total' }) niveau_autonomie: string
  @Column({ type:'text', nullable:true }) centres_interet: string
  @Column({ type:'text', nullable:true }) activites_aimees: string
  @Column({ type:'text', nullable:true }) activites_a_eviter: string
  @Column({ type:'text', nullable:true }) declencheurs_crise: string
  @Column({ type:'text', nullable:true }) signes_avant_crise: string
  @Column({ type:'text', nullable:true }) hypersensibilites: string
  @Column({ type:'text', nullable:true }) hyposensibilites: string
  @Column({ type:'text', nullable:true }) methodes_apaisement: string
  @Column({ type:'text', nullable:true }) protocole_urgence: string
  @Column({ type:'enum', enum:['verbal','pictogrammes','mixte','lsf','autre'], default:'verbal' }) mode_communication: string
  @Column({ type:'text', nullable:true }) consignes_communication: string
  @Column({ default:false }) traitement_medicamenteux: boolean
  @Column({ type:'text', nullable:true }) details_traitement: string
  @Column({ nullable:true }) niveau_natation: string
  @Column({ type:'text', nullable:true }) infos_medicales: string
  @Column({ default:true }) autorisation_sortie: boolean
  @Column({ default:false }) autorisation_photo: boolean
  @Column({ type:'text', nullable:true }) suivi_professionnel: string
  @Column({ type:'text', nullable:true }) notes_animateur: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}