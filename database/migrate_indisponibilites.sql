-- Migration indisponibilités animateur
CREATE TABLE IF NOT EXISTS `indisponibilites` (
  `id`          int          NOT NULL AUTO_INCREMENT,
  `date`        date         NOT NULL,
  `heure_debut` time         NOT NULL DEFAULT '00:00:00',
  `heure_fin`   time         NOT NULL DEFAULT '23:59:00',
  `motif`       varchar(255) DEFAULT NULL,
  `journee_complete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at`  datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Table indisponibilites OK' AS statut;
