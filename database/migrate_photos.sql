-- Table photos séances
CREATE TABLE IF NOT EXISTS `photos` (
  `id`          int          NOT NULL AUTO_INCREMENT,
  `child_id`    int          DEFAULT NULL,
  `user_id`     int          NOT NULL,
  `titre`       varchar(255) DEFAULT NULL,
  `date_seance` date         DEFAULT NULL,
  `data`        longtext     NOT NULL,
  `mimetype`    varchar(100) DEFAULT NULL,
  `taille`      int          DEFAULT NULL,
  `visible`     tinyint(1)   NOT NULL DEFAULT 1,
  `created_at`  datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_child` (`child_id`),
  CONSTRAINT `FK_photo_user`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)    ON DELETE CASCADE,
  CONSTRAINT `FK_photo_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SELECT 'Table photos OK' AS statut;
