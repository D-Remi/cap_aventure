-- Module Planning des gardes (Éduc & Vous)
CREATE TABLE IF NOT EXISTS gardes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  famille VARCHAR(255) NOT NULL,
  enfant VARCHAR(255),
  nb_enfants INT DEFAULT 1,
  type_contrat ENUM('cesu','agence') DEFAULT 'cesu',
  agence_nom VARCHAR(255),
  jour_semaine INT NOT NULL,          -- 1=Lundi ... 7=Dimanche
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  recurrent BOOLEAN DEFAULT TRUE,
  semaine_type ENUM('toutes','paire','impaire') DEFAULT 'toutes',
  date_ponctuelle DATE,
  lieu VARCHAR(255),
  trajet_min INT DEFAULT 0,
  tarif_horaire DECIMAL(6,2) DEFAULT 0,
  statut ENUM('confirme','pressenti','termine') DEFAULT 'confirme',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
