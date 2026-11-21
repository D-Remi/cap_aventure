import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm'

// Informations légales de l'entreprise (une seule ligne, id = 1).
// Elles alimentent les mentions légales, les CGV, les factures, les devis et les attestations fiscales.
@Entity('parametres_entreprise')
export class ParametresEntreprise {
  @PrimaryColumn() id: number

  // Identité (mention « EI » obligatoire depuis la loi du 14 février 2022)
  @Column({ nullable: true }) nom: string
  @Column({ nullable: true }) prenom: string
  @Column({ nullable: true }) nom_commercial: string
  @Column({ nullable: true }) adresse: string
  @Column({ nullable: true }) code_postal: string
  @Column({ nullable: true }) ville: string
  @Column({ nullable: true }) email: string
  @Column({ nullable: true }) telephone: string

  // Immatriculation
  @Column({ nullable: true }) siret: string
  @Column({ nullable: true }) code_ape: string
  @Column({ nullable: true }) immatriculation: string   // ex. « Inscrit au RNE » / « RCS Thonon-les-Bains »
  @Column({ type: 'date', nullable: true }) date_creation: string

  // Services à la personne
  @Column({ nullable: true }) sap_numero: string
  @Column({ type: 'date', nullable: true }) sap_date: string
  @Column({ nullable: true }) agrement_numero: string
  @Column({ type: 'date', nullable: true }) agrement_date: string
  @Column({ nullable: true }) intervenant_identifiant: string   // identifiant de l'intervenant (D7233-1 6°)

  // Fiscalité et cotisations (micro-entreprise)
  @Column({ type: 'enum', enum: ['franchise', 'assujetti'], default: 'franchise' }) tva_regime: string
  @Column({ type: 'decimal', precision: 4, scale: 2, default: 10 }) tva_taux: number
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 21.2 }) taux_cotisations: number
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.1 }) taux_cfp: number
  @Column({ default: false }) versement_liberatoire: boolean
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.7 }) taux_vl: number
  @Column({ default: false }) acre: boolean
  @Column({ type: 'enum', enum: ['mensuelle', 'trimestrielle'], default: 'trimestrielle' }) periodicite_urssaf: string

  // Assurance, médiation, hébergement
  @Column({ nullable: true }) assureur: string
  @Column({ nullable: true }) police_rc: string
  @Column({ nullable: true }) mediateur_nom: string
  @Column({ nullable: true }) mediateur_adresse: string
  @Column({ nullable: true }) mediateur_site: string
  @Column({ nullable: true }) hebergeur: string

  // Paiement (affiché sur les factures)
  @Column({ nullable: true }) iban: string
  @Column({ nullable: true }) bic: string

  // Liste des démarches cochées (JSON : { cle: true })
  @Column({ type: 'text', nullable: true }) checklist: string

  @UpdateDateColumn() updated_at: Date
}
