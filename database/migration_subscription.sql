-- ============================================================
-- Migration : ajout subscription_type + notes dans registrations
-- À exécuter dans phpMyAdmin → base capaventure → onglet SQL
-- ============================================================

USE capaventure;

-- Ajouter la colonne subscription_type
ALTER TABLE registrations
  ADD COLUMN subscription_type ENUM('seance','mensuel','trimestriel','semestriel','annuel','essai')
  NOT NULL DEFAULT 'seance'
  AFTER status;

-- Ajouter la colonne notes
ALTER TABLE registrations
  ADD COLUMN notes TEXT NULL
  AFTER subscription_type;

-- Vérification
DESCRIBE registrations;

-- ============================================================
-- Table registration_dates (dates choisies par les parents)
-- ============================================================
CREATE TABLE IF NOT EXISTS registration_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  date DATETIME NOT NULL,
  attended TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  INDEX idx_reg_date (registration_id, date)
);
