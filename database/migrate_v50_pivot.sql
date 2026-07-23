-- ═══════════════════════════════════════════════════════
-- CapAventure v50 — Pivot médico-social
-- Répit handicap + Accompagnement éducatif
-- ═══════════════════════════════════════════════════════

-- ── Table des séances (cœur du nouveau système) ──
CREATE TABLE IF NOT EXISTS `seances` (
  `id`                   int NOT NULL AUTO_INCREMENT,
  `user_id`              int NOT NULL,
  `child_id`             int DEFAULT NULL,
  `type`                 enum('repit','accompagnement','guidance') NOT NULL DEFAULT 'accompagnement',
  `date`                 date NOT NULL,
  `heure_debut`          time DEFAULT NULL,
  `heure_fin`            time DEFAULT NULL,
  `duree_heures`         decimal(4,1) NOT NULL DEFAULT 0.0,
  `lieu`                 varchar(255) DEFAULT NULL,
  `compte_rendu`         text,
  `notes_privees`        text,
  `objectifs_travailles` text,
  `statut`               enum('planifiee','realisee','annulee') NOT NULL DEFAULT 'planifiee',
  `cr_partage`           tinyint(1) NOT NULL DEFAULT 0,
  `montant`              decimal(8,2) DEFAULT NULL,
  `facturee`             tinyint(1) NOT NULL DEFAULT 0,
  `created_at`           datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`           datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_seance_user`  (`user_id`),
  KEY `idx_seance_child` (`child_id`),
  KEY `idx_seance_date`  (`date`),
  CONSTRAINT `FK_seance_user`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)    ON DELETE CASCADE,
  CONSTRAINT `FK_seance_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Table des objectifs éducatifs ──
CREATE TABLE IF NOT EXISTS `objectifs` (
  `id`              int NOT NULL AUTO_INCREMENT,
  `user_id`         int NOT NULL,
  `child_id`        int DEFAULT NULL,
  `titre`           varchar(255) NOT NULL,
  `description`     text,
  `domaine`         enum('cadre','communication','autonomie','emotions','relations','autre') NOT NULL DEFAULT 'autre',
  `statut`          enum('a_travailler','en_cours','atteint','suspendu') NOT NULL DEFAULT 'a_travailler',
  `progression`     tinyint NOT NULL DEFAULT 0,
  `date_debut`      date DEFAULT NULL,
  `date_cible`      date DEFAULT NULL,
  `visible_famille` tinyint(1) NOT NULL DEFAULT 1,
  `created_at`      datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`      datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_obj_user`  (`user_id`),
  KEY `idx_obj_child` (`child_id`),
  CONSTRAINT `FK_obj_user`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)    ON DELETE CASCADE,
  CONSTRAINT `FK_obj_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Tables devenues inutiles (garde ponctuelle / créneaux) ──
-- ATTENTION : ces DROP suppriment définitivement les anciennes données.
-- Faites une sauvegarde avant si vous voulez les conserver :
--   mysqldump -u capaventure -p capaventure bookings slots planning_seances indisponibilites > backup_ancien.sql
--
-- Décommentez les lignes suivantes une fois la sauvegarde faite :
-- DROP TABLE IF EXISTS `bookings`;
-- DROP TABLE IF EXISTS `planning_seances`;
-- DROP TABLE IF EXISTS `indisponibilites`;
-- DROP TABLE IF EXISTS `slots`;

SELECT 'Migration v50 terminée — tables seances et objectifs créées' AS statut;
