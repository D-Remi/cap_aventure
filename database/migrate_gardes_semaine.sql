-- Ajout du rythme de semaine (paire/impaire) aux gardes
ALTER TABLE gardes
  ADD COLUMN semaine_type ENUM('toutes','paire','impaire') DEFAULT 'toutes' AFTER recurrent;
