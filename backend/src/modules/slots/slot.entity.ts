import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn() id: number
  @Column({ type:'date' }) date: string
  @Column({ type:'enum', enum:['matin','apres_midi','journee'], default:'journee' }) periode: string
  @Column({ type:'time', default:'09:00:00' }) heure_debut: string
  @Column({ type:'time', default:'17:30:00' }) heure_fin: string
  @Column({ type:'tinyint', default:3 }) places_max: number
  @Column({ type:'tinyint', default:0 }) places_prises: number
  @Column({ type:'enum', enum:['standard','adapte','mixte'], default:'mixte' }) type_accueil: string
  @Column({ nullable:true }) titre: string
  @Column({ type:'text', nullable:true }) description: string
  @Column({ default:'Biganos' }) lieu: string
  @Column({ type:'decimal', precision:8, scale:2, default:25 }) tarif: number
  @Column({ type:'decimal', precision:8, scale:2, nullable:true }) tarif_adapte: number
  @Column({ type:'enum', enum:['ouvert','complet','annule','passe'], default:'ouvert' }) statut: string
  @Column({ default:true }) actif: boolean
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}