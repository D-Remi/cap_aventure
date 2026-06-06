-- CapAventure — Module Contrats Répit
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

CREATE TABLE IF NOT EXISTS `contrats` (
  `id`                  int          NOT NULL AUTO_INCREMENT,
  `user_id`             int          NOT NULL,
  `child_id`            int          NOT NULL,
  -- Période
  `date_debut`          date         NOT NULL,
  `date_fin`            date         NOT NULL,
  `jours_semaine`       varchar(20)  DEFAULT NULL COMMENT 'ex: 1,3,5 = lun,mer,ven',
  -- Tarification
  `tarif_horaire`       decimal(6,2) NOT NULL DEFAULT 15.00,
  `heures_semaine`      decimal(4,1) NOT NULL DEFAULT 3.0,
  `tarif_km`            decimal(5,2) NOT NULL DEFAULT 0.40,
  `km_inclus`           int          NOT NULL DEFAULT 0,
  -- Contenu
  `objectifs`           text         DEFAULT NULL,
  `besoins_specifiques` text         DEFAULT NULL,
  `modalites`           text         DEFAULT NULL COMMENT 'Lieu, transport, repas...',
  `clauses`             text         DEFAULT NULL COMMENT 'Clauses particulières',
  -- Statut
  `statut`              enum('brouillon','envoye','signe_parent','signe_admin','actif','termine','annule')
                                     NOT NULL DEFAULT 'brouillon',
  -- Signatures
  `signature_parent`    mediumtext   DEFAULT NULL COMMENT 'base64 image',
  `signature_parent_at` datetime     DEFAULT NULL,
  `signature_admin`     mediumtext   DEFAULT NULL COMMENT 'base64 image',
  `signature_admin_at`  datetime     DEFAULT NULL,
  -- Montant estimé
  `montant_estime`      decimal(8,2) DEFAULT NULL,
  `created_at`          datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`          datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_user`   (`user_id`),
  KEY `idx_child`  (`child_id`),
  KEY `idx_statut` (`statut`),
  CONSTRAINT `fk_contrat_user`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)    ON DELETE CASCADE,
  CONSTRAINT `fk_contrat_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `contrat_seances` (
  `id`          int          NOT NULL AUTO_INCREMENT,
  `contrat_id`  int          NOT NULL,
  `date`        date         NOT NULL,
  `heure_debut` time         NOT NULL,
  `heure_fin`   time         NOT NULL,
  `km_aller`    decimal(6,1) NOT NULL DEFAULT 0,
  `km_retour`   decimal(6,1) NOT NULL DEFAULT 0,
  `notes`       text         DEFAULT NULL,
  `montant_heures` decimal(8,2) DEFAULT NULL COMMENT 'calculé auto',
  `montant_km`     decimal(8,2) DEFAULT NULL COMMENT 'calculé auto',
  `montant_total`  decimal(8,2) DEFAULT NULL COMMENT 'calculé auto',
  `facture_id`  int          DEFAULT NULL,
  `created_at`  datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`  datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_contrat` (`contrat_id`),
  KEY `idx_date`    (`date`),
  CONSTRAINT `fk_seance_contrat` FOREIGN KEY (`contrat_id`) REFERENCES `contrats`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `factures` (
  `id`               int          NOT NULL AUTO_INCREMENT,
  `contrat_id`       int          NOT NULL,
  `user_id`          int          NOT NULL,
  `numero`           varchar(30)  NOT NULL COMMENT 'ex: FAC-2025-001',
  `periode_debut`    date         NOT NULL,
  `periode_fin`      date         NOT NULL,
  `total_heures`     decimal(6,1) NOT NULL DEFAULT 0,
  `total_km`         decimal(7,1) NOT NULL DEFAULT 0,
  `montant_heures`   decimal(8,2) NOT NULL DEFAULT 0,
  `montant_km`       decimal(8,2) NOT NULL DEFAULT 0,
  `montant_total`    decimal(8,2) NOT NULL DEFAULT 0,
  `statut`           enum('brouillon','envoyee','payee') NOT NULL DEFAULT 'brouillon',
  `notes`            text         DEFAULT NULL,
  `pdf_url`          varchar(500) DEFAULT NULL,
  `created_at`       datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_contrat` (`contrat_id`),
  CONSTRAINT `fk_facture_contrat` FOREIGN KEY (`contrat_id`) REFERENCES `contrats`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_facture_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET foreign_key_checks = 1;
SELECT 'Tables contrats OK' AS statut;