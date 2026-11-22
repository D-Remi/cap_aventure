-- ============================================================
--  Filtre anti-robots du formulaire de contact (novembre 2026)
--  Le serveur ajoute ces colonnes tout seul au démarrage s'il en a le droit.
--  Si les journaux pm2 affichent « Colonnes anti-spam non ajoutées », passe ce script :
--    mysql -u root -p capaventure < database/migrate_contact_spam_2026.sql
-- ============================================================

ALTER TABLE `contact_requests`
  ADD COLUMN `spam` TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN `spam_raison` VARCHAR(255) NULL;

SELECT 'contact_requests : colonnes anti-spam ajoutées' AS statut;
