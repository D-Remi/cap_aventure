import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('gardes')
export class Garde {
  @PrimaryGeneratedColumn() id: number

  // Famille / enfant
  @Column() famille: string
  @Column({ nullable: true }) enfant: string
  @Column({ type: 'int', default: 1 }) nb_enfants: number

  // Type de contrat
  @Column({ type: 'enum', enum: ['cesu', 'agence'], default: 'cesu' }) type_contrat: string
  @Column({ nullable: true }) agence_nom: string   // si type = agence

  // Créneau
  // jour_semaine : 1=Lundi ... 7=Dimanche (pour la vue semaine récurrente)
  @Column({ type: 'int' }) jour_semaine: number
  @Column({ type: 'time' }) heure_debut: string    // '08:00'
  @Column({ type: 'time' }) heure_fin: string      // '12:00'

  // Récurrence
  @Column({ type: 'boolean', default: true }) recurrent: boolean  // chaque semaine ?
  // 'toutes' = chaque semaine, 'paire' = semaines paires, 'impaire' = semaines impaires
  @Column({ type: 'enum', enum: ['toutes', 'paire', 'impaire'], default: 'toutes' }) semaine_type: string
  @Column({ type: 'date', nullable: true }) date_ponctuelle: string // si non récurrent

  // Lieu et trajet
  @Column({ nullable: true }) lieu: string          // ville / adresse
  @Column({ type: 'int', default: 0 }) trajet_min: number  // minutes de trajet aller

  // Tarif
  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 }) tarif_horaire: number

  // Statut
  @Column({ type: 'enum', enum: ['confirme', 'pressenti', 'termine'], default: 'confirme' }) statut: string

  @Column({ type: 'text', nullable: true }) notes: string

  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}
