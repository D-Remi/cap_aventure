-- CapAventure — Table planning (séances détaillées)
-- Usage : mysql -u capaventure -p capaventure < database/migration_planning.sql

CREATE TABLE IF NOT EXISTS `planning_seances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text,
  `lieu` varchar(255) DEFAULT NULL,
  `notes_animateur` text COMMENT 'Notes privées animateur',
  `statut` enum('planifiee','confirmee','annulee') NOT NULL DEFAULT 'planifiee',
  `activity_id` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_seance_activity` (`activity_id`),
  CONSTRAINT `FK_seance_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Migration planning OK ✓' AS statut;

-- Ajouter velo et evenement à l'enum type
ALTER TABLE activities MODIFY COLUMN type ENUM('ski','vtt','rando','scout','autre','velo','evenement') NOT NULL DEFAULT 'autre';

SELECT 'Migration type enum OK ✓' AS statut;
