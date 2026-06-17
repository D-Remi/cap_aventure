-- Table comptabilité
CREATE TABLE IF NOT EXISTS `compta_entrees` (
  `id`          int NOT NULL AUTO_INCREMENT,
  `date`        date NOT NULL,
  `montant`     decimal(8,2) NOT NULL,
  `mode`        enum('cesu','virement','especes') NOT NULL DEFAULT 'virement',
  `reference`   varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `famille`     varchar(255) DEFAULT NULL,
  `user_id`     int DEFAULT NULL,
  `type`        enum('recette','depense') NOT NULL DEFAULT 'recette',
  `categorie`   varchar(100) DEFAULT NULL,
  `created_at`  datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`),
  KEY `idx_type` (`type`),
  CONSTRAINT `FK_compta_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SELECT 'Table compta_entrees OK' AS statut;
