-- ═══════════════════════════════════════════════════════════
--  CapAventure v50 — Schéma complet (base vierge)
--  Répit handicap + Accompagnement éducatif
--
--  ATTENTION : ce script SUPPRIME toutes les tables existantes
--  et leurs données. Sauvegardez avant :
--    mysqldump -u capaventure -p capaventure > backup.sql
-- ═══════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── Suppression des anciennes tables (actives et obsolètes) ──
DROP TABLE IF EXISTS `temoignages`;
DROP TABLE IF EXISTS `compta_entrees`;
DROP TABLE IF EXISTS `factures`;
DROP TABLE IF EXISTS `contrat_seances`;
DROP TABLE IF EXISTS `contrats`;
DROP TABLE IF EXISTS `photos`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `contact_requests`;
DROP TABLE IF EXISTS `objectifs`;
DROP TABLE IF EXISTS `seances`;
DROP TABLE IF EXISTS `children`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;

-- ── Tables obsolètes de l'ancienne activité (garde ponctuelle) ──
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `slots`;
DROP TABLE IF EXISTS `planning_seances`;
DROP TABLE IF EXISTS `indisponibilites`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `interest`;
DROP TABLE IF EXISTS `points`;
DROP TABLE IF EXISTS `attendance`;

SET FOREIGN_KEY_CHECKS = 1;



-- ═══ Comptes et authentification ═══

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','parent','animateur') NOT NULL DEFAULT 'parent',
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ab673f0e63eac966762155508e` (`token`),
  KEY `FK_52ac39dd8a28730c63aeb428c9c` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Dossiers enfants ═══

CREATE TABLE IF NOT EXISTS `children` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `allergie` text,
  `medecin_nom` varchar(255) DEFAULT NULL,
  `contact_urgence_nom` varchar(255) DEFAULT NULL,
  `dossier_complete` tinyint(1) NOT NULL DEFAULT '0',
  `besoins_specifiques` tinyint(1) NOT NULL DEFAULT '0',
  `niveau_autonomie` enum('total','partiel','accompagne') NOT NULL DEFAULT 'total',
  `centres_interet` text,
  `activites_aimees` text,
  `activites_a_eviter` text,
  `declencheurs_crise` text,
  `signes_avant_crise` text,
  `hypersensibilites` text,
  `hyposensibilites` text,
  `methodes_apaisement` text,
  `protocole_urgence` text,
  `mode_communication` enum('verbal','pictogrammes','mixte','lsf','autre') NOT NULL DEFAULT 'verbal',
  `consignes_communication` text,
  `traitement_medicamenteux` tinyint(1) NOT NULL DEFAULT '0',
  `details_traitement` text,
  `infos_medicales` text,
  `autorisation_sortie` tinyint(1) NOT NULL DEFAULT '1',
  `autorisation_photo` tinyint(1) NOT NULL DEFAULT '0',
  `suivi_professionnel` text,
  `notes_animateur` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `medecin_telephone` varchar(255) DEFAULT NULL,
  `contact_urgence_telephone` varchar(255) DEFAULT NULL,
  `contact_urgence_lien` varchar(255) DEFAULT NULL,
  `type_besoin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_644df4cc525729181dbee86a44d` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Suivi des accompagnements ═══

CREATE TABLE IF NOT EXISTS `seances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `child_id` int DEFAULT NULL,
  `type` enum('repit','accompagnement','guidance') NOT NULL DEFAULT 'accompagnement',
  `date` date NOT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `duree_heures` decimal(4,1) NOT NULL DEFAULT '0.0',
  `lieu` varchar(255) DEFAULT NULL,
  `compte_rendu` text,
  `notes_privees` text,
  `objectifs_travailles` text,
  `statut` enum('planifiee','realisee','annulee') NOT NULL DEFAULT 'planifiee',
  `cr_partage` tinyint(1) NOT NULL DEFAULT '0',
  `montant` decimal(8,2) DEFAULT NULL,
  `facturee` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_abc673ced9344c943362f3284ac` (`user_id`),
  KEY `FK_3ad28447379e21236123791a729` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `objectifs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `child_id` int DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text,
  `domaine` enum('cadre','communication','autonomie','emotions','relations','autre') NOT NULL DEFAULT 'autre',
  `statut` enum('a_travailler','en_cours','atteint','suspendu') NOT NULL DEFAULT 'a_travailler',
  `progression` tinyint NOT NULL DEFAULT '0',
  `date_debut` date DEFAULT NULL,
  `date_cible` date DEFAULT NULL,
  `visible_famille` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_9a566963161354f2a1c20c5235c` (`user_id`),
  KEY `FK_c54dfb884532883a4f2b4c161e1` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Demandes entrantes ═══

CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `service` enum('repit','accompagnement','autre') DEFAULT NULL,
  `urgence` enum('info','bientot','urgent') DEFAULT NULL,
  `enfant_prenom` varchar(255) DEFAULT NULL,
  `besoins_specifiques` tinyint NOT NULL DEFAULT '0',
  `message` text,
  `traite` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_contact_traite` (`traite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Documents, messages et photos ═══

CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `child_id` int DEFAULT NULL,
  `type` enum('ordonnance','pap','mdph','autorisation_sortie','autorisation_photo','autre') NOT NULL DEFAULT 'autre',
  `filename` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `nom` varchar(255) NOT NULL,
  `taille` int DEFAULT NULL,
  `valide` tinyint DEFAULT NULL,
  `note_admin` text,
  `data` longtext,
  `mimetype` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_02d6e4deb547677674a91439450` (`child_id`),
  KEY `FK_c7481daf5059307842edef74d73` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `lu` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_22133395bd13b970ccd0c34ab22` (`sender_id`),
  KEY `FK_b561864743d235f44e70addc1f5` (`receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `data` longtext NOT NULL,
  `taille` int DEFAULT NULL,
  `visible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `date_seance` varchar(255) DEFAULT NULL,
  `mimetype` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fba01d0b0db3b24815b2330aedb` (`child_id`),
  KEY `FK_c4404a2ee605249b508c623e68f` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Contrats et facturation ═══

CREATE TABLE IF NOT EXISTS `contrats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `child_id` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `tarif_horaire` decimal(6,2) NOT NULL DEFAULT '15.00',
  `heures_semaine` decimal(4,1) NOT NULL DEFAULT '3.0',
  `tarif_km` decimal(5,2) NOT NULL DEFAULT '0.40',
  `km_inclus` int NOT NULL DEFAULT '0',
  `objectifs` text,
  `besoins_specifiques` text,
  `modalites` text,
  `clauses` text,
  `statut` enum('brouillon','envoye','signe_parent','signe_admin','actif','termine','annule') NOT NULL DEFAULT 'brouillon',
  `signature_parent` mediumtext,
  `signature_parent_at` datetime DEFAULT NULL,
  `signature_admin` mediumtext,
  `signature_admin_at` datetime DEFAULT NULL,
  `montant_estime` decimal(8,2) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `jours_semaine` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5cf97e062e57d8e85abedd519c3` (`user_id`),
  KEY `FK_3f2909d8f4abd720236dfc5369b` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contrat_seances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contrat_id` int NOT NULL,
  `date` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `km_aller` decimal(6,1) NOT NULL DEFAULT '0.0',
  `km_retour` decimal(6,1) NOT NULL DEFAULT '0.0',
  `notes` text,
  `montant_heures` decimal(8,2) DEFAULT NULL,
  `montant_km` decimal(8,2) DEFAULT NULL,
  `montant_total` decimal(8,2) DEFAULT NULL,
  `facture_id` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_c2acfabcb64afb6105bc6b4e558` (`contrat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `factures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contrat_id` int NOT NULL,
  `user_id` int NOT NULL,
  `periode_debut` date NOT NULL,
  `periode_fin` date NOT NULL,
  `total_heures` decimal(6,1) NOT NULL DEFAULT '0.0',
  `total_km` decimal(7,1) NOT NULL DEFAULT '0.0',
  `montant_heures` decimal(8,2) NOT NULL DEFAULT '0.00',
  `montant_km` decimal(8,2) NOT NULL DEFAULT '0.00',
  `montant_total` decimal(8,2) NOT NULL DEFAULT '0.00',
  `statut` enum('brouillon','envoyee','payee') NOT NULL DEFAULT 'brouillon',
  `notes` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `numero` varchar(255) NOT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3a319c66994c6b3f10276bd9327` (`contrat_id`),
  KEY `FK_247454d7688935147d827a90186` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Comptabilité ═══

CREATE TABLE IF NOT EXISTS `compta_entrees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `montant` decimal(8,2) NOT NULL,
  `mode` enum('cesu','virement','especes') NOT NULL DEFAULT 'virement',
  `reference` varchar(255) DEFAULT NULL,
  `famille` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `type` enum('recette','depense') NOT NULL DEFAULT 'recette',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `description` varchar(255) DEFAULT NULL,
  `categorie` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2e94da1c349f35f4ac32afd9872` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══ Témoignages ═══

CREATE TABLE IF NOT EXISTS `temoignages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `prenom` varchar(255) NOT NULL,
  `note` tinyint NOT NULL DEFAULT '5',
  `contenu` text NOT NULL,
  `approuve` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_87aabb512ade0c86eea1c0c1433` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ═══════════════════════════════════════════════════════════
--  Contraintes d'intégrité référentielle
--  (ajoutées après création de toutes les tables)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `FK_prt_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `children`
  ADD CONSTRAINT `FK_child_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `seances`
  ADD CONSTRAINT `FK_seance_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `seances`
  ADD CONSTRAINT `FK_seance_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL;

ALTER TABLE `objectifs`
  ADD CONSTRAINT `FK_obj_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `objectifs`
  ADD CONSTRAINT `FK_obj_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL;

ALTER TABLE `documents`
  ADD CONSTRAINT `FK_doc_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `documents`
  ADD CONSTRAINT `FK_doc_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL;

ALTER TABLE `messages`
  ADD CONSTRAINT `FK_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `messages`
  ADD CONSTRAINT `FK_msg_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `photos`
  ADD CONSTRAINT `FK_photo_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `photos`
  ADD CONSTRAINT `FK_photo_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE SET NULL;

ALTER TABLE `contrats`
  ADD CONSTRAINT `FK_contrat_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;
ALTER TABLE `contrats`
  ADD CONSTRAINT `FK_contrat_child` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE CASCADE;

ALTER TABLE `contrat_seances`
  ADD CONSTRAINT `FK_cs_contrat` FOREIGN KEY (`contrat_id`) REFERENCES `contrats`(`id`) ON DELETE CASCADE;

ALTER TABLE `factures`
  ADD CONSTRAINT `FK_facture_contrat` FOREIGN KEY (`contrat_id`) REFERENCES `contrats`(`id`) ON DELETE CASCADE;

ALTER TABLE `compta_entrees`
  ADD CONSTRAINT `FK_compta_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL;

ALTER TABLE `temoignages`
  ADD CONSTRAINT `FK_temoignage_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL;


-- ═══════════════════════════════════════════════════════════
--  Compte administrateur
--  Le mot de passe doit être un hash bcrypt.
--  Générez-le puis remplacez la valeur ci-dessous :
--    node -e "console.log(require('bcrypt').hashSync('VotreMotDePasse', 10))"
-- ═══════════════════════════════════════════════════════════

-- INSERT INTO `users` (`email`, `password`, `role`, `prenom`, `nom`, `actif`)
-- VALUES ('votre@email.fr', '$2b$10$REMPLACEZ_PAR_VOTRE_HASH', 'admin', 'Prénom', 'Nom', 1);

SELECT 'Schéma CapAventure v50 créé — 14 tables' AS statut;
