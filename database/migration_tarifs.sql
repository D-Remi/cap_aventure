-- CapAventure — Migration tarifs structurés par activité
-- Usage : mysql -u capaventure -p capaventure < database/migration_tarifs.sql

ALTER TABLE activities
  ADD COLUMN IF NOT EXISTS tarifs JSON NULL COMMENT 'Tarifs structurés [{"label":"Séance","prix":25,"popular":false}, ...]'
  AFTER prix_seance;

SELECT 'Migration tarifs OK ✓' AS statut;
