-- Migration documents : stockage base64
ALTER TABLE `documents`
  ADD COLUMN IF NOT EXISTS `data`     longtext DEFAULT NULL AFTER `filename`,
  ADD COLUMN IF NOT EXISTS `mimetype` varchar(100) DEFAULT NULL AFTER `data`;
SELECT 'Migration documents base64 OK' AS statut;
