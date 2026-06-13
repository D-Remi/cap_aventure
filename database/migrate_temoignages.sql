-- Table témoignages parents
CREATE TABLE IF NOT EXISTS `temoignages` (
  `id`         int          NOT NULL AUTO_INCREMENT,
  `user_id`    int          DEFAULT NULL,
  `prenom`     varchar(255) NOT NULL,
  `note`       tinyint      NOT NULL DEFAULT 5,
  `contenu`    text         NOT NULL,
  `approuve`   tinyint(1)   NOT NULL DEFAULT 0,
  `created_at` datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_approuve` (`approuve`),
  CONSTRAINT `FK_temoignage_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SELECT 'Table temoignages OK' AS statut;
