-- ============================================================
-- Éduc & Vous — Migration « réseaux sociaux + radar clients » (novembre 2026)
-- À lancer UNE FOIS sur le serveur, après migrate_legal_compta_2026.sql :
--   mysql -u UTILISATEUR -p NOM_DE_LA_BASE < database/migrate_marketing_2026.sql
-- ============================================================

-- Planning des publications Instagram / Facebook
CREATE TABLE IF NOT EXISTS `publications` (
  `id`         int NOT NULL AUTO_INCREMENT,
  `date`       date NOT NULL,
  `heure`      varchar(255) DEFAULT NULL,
  `reseaux`    varchar(255) NOT NULL DEFAULT 'instagram,facebook',
  `format`     enum('post','story','reel') NOT NULL DEFAULT 'post',
  `theme`      varchar(255) DEFAULT NULL,
  `titre`      varchar(255) DEFAULT NULL,
  `legende`    text,
  `statut`     enum('idee','prete','programmee','publiee') NOT NULL DEFAULT 'idee',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_pub_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Suivi des futurs clients et partenaires
CREATE TABLE IF NOT EXISTS `prospects` (
  `id`          int NOT NULL AUTO_INCREMENT,
  `type`        enum('prescripteur','famille','association','etablissement','autre') NOT NULL DEFAULT 'prescripteur',
  `nom`         varchar(255) NOT NULL,
  `organisme`   varchar(255) DEFAULT NULL,
  `categorie`   varchar(255) DEFAULT NULL,
  `siret`       varchar(255) DEFAULT NULL,
  `adresse`     varchar(255) DEFAULT NULL,
  `code_postal` varchar(255) DEFAULT NULL,
  `ville`       varchar(255) DEFAULT NULL,
  `telephone`   varchar(255) DEFAULT NULL,
  `email`       varchar(255) DEFAULT NULL,
  `site`        varchar(255) DEFAULT NULL,
  `source`      varchar(255) DEFAULT NULL,
  `statut`      enum('a_contacter','contacte','rdv','partenaire','client','sans_suite') NOT NULL DEFAULT 'a_contacter',
  `relance`     date DEFAULT NULL,
  `notes`       text,
  `created_at`  datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`  datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_prospect_statut` (`statut`),
  KEY `idx_prospect_siret` (`siret`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Migration réseaux sociaux + radar OK' AS statut;
