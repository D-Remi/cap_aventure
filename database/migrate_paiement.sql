-- Migration paiement bookings
ALTER TABLE `bookings`
  ADD COLUMN IF NOT EXISTS `tarif_propose`    decimal(8,2) DEFAULT NULL COMMENT 'Tarif fixé par admin',
  ADD COLUMN IF NOT EXISTS `paiement_mode`    enum('cesu','virement') DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `paiement_ref`     varchar(255) DEFAULT NULL COMMENT 'Ref virement ou N° CESU',
  ADD COLUMN IF NOT EXISTS `paiement_declare` tinyint(1) DEFAULT 0 COMMENT 'Parent a déclaré le paiement',
  ADD COLUMN IF NOT EXISTS `paiement_valide`  tinyint(1) DEFAULT 0 COMMENT 'Admin a validé le paiement',
  ADD COLUMN IF NOT EXISTS `paiement_date`    datetime DEFAULT NULL;
SELECT 'Migration paiement OK' AS statut;
