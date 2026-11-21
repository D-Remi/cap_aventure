import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

// Planning des publications Instagram / Facebook
@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn() id: number
  @Column({ type: 'date' }) date: string
  @Column({ nullable: true }) heure: string
  @Column({ default: 'instagram,facebook' }) reseaux: string
  @Column({ type: 'enum', enum: ['post', 'story', 'reel'], default: 'post' }) format: string
  @Column({ nullable: true }) theme: string
  @Column({ nullable: true }) titre: string
  @Column({ type: 'text', nullable: true }) legende: string
  @Column({ type: 'enum', enum: ['idee', 'prete', 'programmee', 'publiee'], default: 'idee' }) statut: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}

// Suivi des futurs clients et partenaires (prescripteurs, familles, associations)
@Entity('prospects')
export class Prospect {
  @PrimaryGeneratedColumn() id: number
  @Column({ type: 'enum', enum: ['prescripteur', 'famille', 'association', 'etablissement', 'autre'], default: 'prescripteur' }) type: string
  @Column() nom: string
  @Column({ nullable: true }) organisme: string
  @Column({ nullable: true }) categorie: string
  @Column({ nullable: true }) siret: string
  @Column({ nullable: true }) adresse: string
  @Column({ nullable: true }) code_postal: string
  @Column({ nullable: true }) ville: string
  @Column({ nullable: true }) telephone: string
  @Column({ nullable: true }) email: string
  @Column({ nullable: true }) site: string
  @Column({ nullable: true }) source: string
  @Column({ type: 'enum', enum: ['a_contacter', 'contacte', 'rdv', 'partenaire', 'client', 'sans_suite'], default: 'a_contacter' }) statut: string
  @Column({ type: 'date', nullable: true }) relance: string
  @Column({ type: 'text', nullable: true }) notes: string
  @CreateDateColumn() created_at: Date
  @UpdateDateColumn() updated_at: Date
}
