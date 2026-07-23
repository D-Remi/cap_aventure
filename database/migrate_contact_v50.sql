-- ═══════════════════════════════════════════════════════════
--  Correction table contact_requests pour le pivot v50
--  À exécuter si la base existe déjà (sinon utilisez le schéma complet)
-- ═══════════════════════════════════════════════════════════

-- Nouveau champ : échéance de la demande
ALTER TABLE `contact_requests`
  ADD COLUMN `urgence` enum('info','bientot','urgent') DEFAULT NULL AFTER `service`;

-- L'enum service doit accepter 'accompagnement' (et non plus garde/evenement)
-- Étape 1 : élargir temporairement pour ne rien casser
ALTER TABLE `contact_requests`
  MODIFY COLUMN `service` varchar(30) DEFAULT NULL;

-- Étape 2 : convertir les anciennes valeurs
UPDATE `contact_requests` SET `service` = 'autre' WHERE `service` IN ('garde','evenement');

-- Étape 3 : appliquer le nouvel enum
ALTER TABLE `contact_requests`
  MODIFY COLUMN `service` enum('repit','accompagnement','autre') DEFAULT NULL;

-- Colonne devenue inutile (plus de tranche d'âge affichée)
ALTER TABLE `contact_requests` DROP COLUMN `enfant_age`;

-- Index pour le filtre "à traiter"
ALTER TABLE `contact_requests` ADD INDEX `idx_contact_traite` (`traite`);

SELECT 'contact_requests migrée pour v50' AS statut;
