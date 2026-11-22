-- ============================================================
--  Prise de rendez-vous en ligne (appel découverte) — novembre 2026
--  Le serveur crée ces tables tout seul au démarrage s'il en a le droit.
--  Si les journaux pm2 affichent « Tables des rendez-vous non créées », passe ce script :
--    mysql -u root -p capaventure < database/migrate_rendez_vous_2026.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS `rendez_vous` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `heure` varchar(5) NOT NULL,
  `duree_min` int NOT NULL DEFAULT 30,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(30) NOT NULL,
  `residence` varchar(20) NULL,
  `commune` varchar(100) NULL,
  `message` text NULL,
  `statut` enum('confirme','fait','annule') NOT NULL DEFAULT 'confirme',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_rdv_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rendez_vous_reglages` (
  `id` int NOT NULL,
  `creneaux` text NOT NULL,
  `duree_min` int NOT NULL DEFAULT 30,
  `delai_heures` int NOT NULL DEFAULT 12,
  `jours_max` int NOT NULL DEFAULT 21,
  `actif` tinyint NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'rendez_vous : tables créées' AS statut;
