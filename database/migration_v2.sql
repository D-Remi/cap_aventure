-- ============================================================
-- Migration : fiche enfant enrichie + table messages
-- À exécuter dans phpMyAdmin → base capaventure → SQL
-- ============================================================

USE capaventure;

-- ── Colonnes enfant ──────────────────────────────────────────
ALTER TABLE children
  ADD COLUMN  allergie VARCHAR(255) NULL AFTER infos_medicales,
  ADD COLUMN  medecin_nom VARCHAR(255) NULL AFTER allergie,
  ADD COLUMN  medecin_telephone VARCHAR(50) NULL AFTER medecin_nom,
  ADD COLUMN  contact_urgence_nom VARCHAR(255) NULL AFTER medecin_telephone,
  ADD COLUMN  contact_urgence_telephone VARCHAR(50) NULL AFTER contact_urgence_nom,
  ADD COLUMN  contact_urgence_lien VARCHAR(100) NULL AFTER contact_urgence_telephone,
  ADD COLUMN  niveau_natation VARCHAR(50) NULL AFTER contact_urgence_lien,
  ADD COLUMN  notes_animateur TEXT NULL AFTER niveau_natation;

-- ── Table messages ──────────────────────────────────────────
CREATE TABLE  messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender (sender_id),
  INDEX idx_receiver (receiver_id),
  INDEX idx_conversation (sender_id, receiver_id, created_at)
);

-- ── Vérification ─────────────────────────────────────────────
SELECT 'children columns:' as info;
DESCRIBE children;

SELECT 'messages table:' as info;
DESCRIBE messages;

-- ── Messages : colonnes soft delete et archive ───────────────
ALTER TABLE messages
  ADD COLUMN  archived TINYINT(1) NOT NULL DEFAULT 0 AFTER `read`,
  ADD COLUMN  deleted_at DATETIME NULL AFTER created_at;

CREATE INDEX  idx_msg_archived ON messages(archived);
