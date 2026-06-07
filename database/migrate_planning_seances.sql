-- Table planning_seances (nécessaire pour le module Planning)
CREATE TABLE IF NOT EXISTS `planning_seances` (
  `id`              int          NOT NULL AUTO_INCREMENT,
  `slot_id`         int          DEFAULT NULL,
  `date`            datetime     NOT NULL,
  `titre`           varchar(255) NOT NULL,
  `description`     text,
  `lieu`            varchar(255) DEFAULT NULL,
  `notes_animateur` text,
  `statut`          enum('planifiee','confirmee','annulee') NOT NULL DEFAULT 'planifiee',
  `created_at`      datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`      datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_slot` (`slot_id`),
  CONSTRAINT `FK_planning_slot` FOREIGN KEY (`slot_id`) REFERENCES `slots` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SELECT 'planning_seances OK' AS statut;
