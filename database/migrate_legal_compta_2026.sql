-- ============================================================
-- Éduc & Vous — Migration « légal + comptabilité » (novembre 2026)
-- À lancer UNE FOIS sur le serveur, avant de redémarrer l'API :
--   mysql -u UTILISATEUR -p NOM_DE_LA_BASE < database/migrate_legal_compta_2026.sql
-- Sauvegardez la base avant :
--   mysqldump -u UTILISATEUR -p NOM_DE_LA_BASE > sauvegarde_avant_migration.sql
-- ============================================================

-- 1) Paramètres légaux de l'entreprise (une seule ligne, id = 1)
CREATE TABLE IF NOT EXISTS `parametres_entreprise` (
  `id`                      int NOT NULL,
  `nom`                     varchar(255) DEFAULT NULL,
  `prenom`                  varchar(255) DEFAULT NULL,
  `nom_commercial`          varchar(255) DEFAULT NULL,
  `adresse`                 varchar(255) DEFAULT NULL,
  `code_postal`             varchar(255) DEFAULT NULL,
  `ville`                   varchar(255) DEFAULT NULL,
  `email`                   varchar(255) DEFAULT NULL,
  `telephone`               varchar(255) DEFAULT NULL,
  `siret`                   varchar(255) DEFAULT NULL,
  `code_ape`                varchar(255) DEFAULT NULL,
  `immatriculation`         varchar(255) DEFAULT NULL,
  `date_creation`           date DEFAULT NULL,
  `sap_numero`              varchar(255) DEFAULT NULL,
  `sap_date`                date DEFAULT NULL,
  `agrement_numero`         varchar(255) DEFAULT NULL,
  `agrement_date`           date DEFAULT NULL,
  `intervenant_identifiant` varchar(255) DEFAULT NULL,
  `tva_regime`              enum('franchise','assujetti') NOT NULL DEFAULT 'franchise',
  `tva_taux`                decimal(4,2) NOT NULL DEFAULT 10.00,
  `taux_cotisations`        decimal(5,2) NOT NULL DEFAULT 21.20,
  `taux_cfp`                decimal(5,2) NOT NULL DEFAULT 0.10,
  `versement_liberatoire`   tinyint NOT NULL DEFAULT 0,
  `taux_vl`                 decimal(5,2) NOT NULL DEFAULT 1.70,
  `acre`                    tinyint NOT NULL DEFAULT 0,
  `periodicite_urssaf`      enum('mensuelle','trimestrielle') NOT NULL DEFAULT 'trimestrielle',
  `assureur`                varchar(255) DEFAULT NULL,
  `police_rc`               varchar(255) DEFAULT NULL,
  `mediateur_nom`           varchar(255) DEFAULT NULL,
  `mediateur_adresse`       varchar(255) DEFAULT NULL,
  `mediateur_site`          varchar(255) DEFAULT NULL,
  `hebergeur`               varchar(255) DEFAULT NULL,
  `iban`                    varchar(255) DEFAULT NULL,
  `bic`                     varchar(255) DEFAULT NULL,
  `checklist`               text,
  `updated_at`              datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `parametres_entreprise` (`id`, `nom`, `prenom`, `nom_commercial`, `email`, `telephone`)
VALUES (1, 'Delfosse', 'Rémi', 'Éduc & Vous', 'delfosseremi33@gmail.com', '+33 7 52 09 66 98');

-- 2) Livre des recettes : nouveaux modes de paiement + lien vers la facture
ALTER TABLE `compta_entrees`
  MODIFY `mode` enum('avance_immediate','virement','cesu','cheque','cb','especes') NOT NULL DEFAULT 'virement';
ALTER TABLE `compta_entrees` ADD COLUMN `facture_id` int DEFAULT NULL;

-- 3) Factures : date et mode de règlement
ALTER TABLE `factures` ADD COLUMN `date_paiement` date DEFAULT NULL;
ALTER TABLE `factures` ADD COLUMN `mode_paiement` varchar(255) DEFAULT NULL;

-- 4) Familles : adresse (obligatoire sur factures et attestations fiscales)
ALTER TABLE `users` ADD COLUMN `adresse` varchar(255) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `code_postal` varchar(255) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `ville` varchar(255) DEFAULT NULL;

SELECT 'Migration légal + compta OK' AS statut;
