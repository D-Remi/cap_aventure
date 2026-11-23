-- ============================================================
--  Prospection et bilan des publications — novembre 2026
--  Le serveur ajoute ces colonnes tout seul au démarrage s'il en a le droit.
--  Si les journaux pm2 affichent « Colonnes de … non ajoutées », passe ce script
--  (une colonne déjà présente renvoie une erreur sans gravité : passe à la ligne suivante) :
--    mysql -u root -p capaventure < database/migrate_prospection_2026.sql
-- ============================================================

ALTER TABLE `publications` ADD COLUMN `vues` INT NULL;
ALTER TABLE `publications` ADD COLUMN `interactions` INT NULL;
ALTER TABLE `publications` ADD COLUMN `contacts` INT NULL;
ALTER TABLE `prospects` ADD COLUMN `dernier_contact` DATE NULL;
ALTER TABLE `contact_requests` ADD COLUMN `source` VARCHAR(30) NULL;
ALTER TABLE `rendez_vous` ADD COLUMN `source` VARCHAR(30) NULL;

SELECT 'prospection : colonnes ajoutées' AS statut;
