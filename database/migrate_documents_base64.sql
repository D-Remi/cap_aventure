-- Migration documents : ajouter stockage base64
ALTER TABLE `documents`
  ADD COLUMN IF NOT EXISTS `data`     longtext DEFAULT NULL AFTER `filename`,
  ADD COLUMN IF NOT EXISTS `mimetype` varchar(100) DEFAULT NULL AFTER `data`;

-- L'ancienne colonne url n'est plus utilisée mais on la garde pour compatibilité
SELECT 'Migration documents base64 OK' AS statut;
