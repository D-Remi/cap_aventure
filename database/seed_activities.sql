-- ============================================================
-- CapAventure — Script de création des activités
-- À exécuter dans phpMyAdmin ou dans ton client MySQL
-- Base : capaventure
-- ============================================================

USE capaventure;

-- Vider les activités existantes si besoin (optionnel)
-- DELETE FROM activities;

-- ============================================================
-- 1. SKI & MONTAGNE — Journée ponctuelle (exemple hiver)
-- ============================================================
INSERT INTO activities (
  titre, description, type,
  schedule_type, date,
  prix, places_max,
  payment_methods, virement_info, cesu_info,
  lieu, age_min, age_max, actif,
  created_at, updated_at
) VALUES (
  'Sortie Ski — Bernex (Dent d\'Oche)',
  'Journée ski à Bernex, station familiale avec vue imprenable sur le lac Léman. Toutes les pistes accessibles selon le niveau de chaque enfant. Encadrement BAFA, groupes par niveau. Casque obligatoire.',
  'ski',
  'ponctuelle',
  '2025-12-17 08:30:00',
  25.00, 12,
  '["especes","virement","cesu"]',
  'Virement à : CapAventure — coordonnées communiquées après inscription',
  'Chèques CESU acceptés, à remettre en main propre avant la sortie',
  'Bernex — Dent d\'Oche (74500)', 6, 14, 1,
  NOW(), NOW()
);

-- ============================================================
-- 2. SKI & MONTAGNE — Journée Thollon
-- ============================================================
INSERT INTO activities (
  titre, description, type,
  schedule_type, date,
  prix, places_max,
  payment_methods,
  lieu, age_min, age_max, actif,
  created_at, updated_at
) VALUES (
  'Sortie Ski — Thollon-les-Mémises',
  'Journée ski à Thollon-les-Mémises, avec une vue panoramique exceptionnelle sur le lac Léman et les Alpes. Station calme et adaptée aux enfants, idéale pour progresser à son rythme.',
  'ski',
  'ponctuelle',
  '2026-01-14 08:30:00',
  25.00, 12,
  '["especes","virement","cesu"]',
  'Thollon-les-Mémises (74500)', 6, 14, 1,
  NOW(), NOW()
);

-- ============================================================
-- 3. MULTI-ACTIVITÉS — Sortie ponctuelle
-- ============================================================
INSERT INTO activities (
  titre, description, type,
  schedule_type, date,
  prix, places_max,
  payment_methods,
  lieu, age_min, age_max, actif,
  created_at, updated_at
) VALUES (
  'Multi-activités — Journée découverte',
  'Journée multi-activités autour de Thonon : jeux collectifs, défis sportifs, activités nature au bord du lac Léman. Programme surprise révélé la veille ! Prévoir tenue confortable et chaussures de sport.',
  'autre',
  'ponctuelle',
  '2025-10-22 09:00:00',
  25.00, 10,
  '["especes","virement","cesu"]',
  'Thonon-les-Bains — Front de lac', 6, 14, 1,
  NOW(), NOW()
);

-- ============================================================
-- 4. ROLLER — Sortie ponctuelle bords du Léman
-- ============================================================
INSERT INTO activities (
  titre, description, type,
  schedule_type, date,
  prix, places_max,
  payment_methods,
  lieu, age_min, age_max, actif,
  created_at, updated_at
) VALUES (
  'Roller — Bords du lac Léman',
  'Sortie roller sur les pistes cyclables des bords du lac Léman à Thonon. Initiation pour les débutants, slalom et jeux de vitesse pour les plus confirmés. Casque + protections obligatoires. Location possible sur demande.',
  'vtt',
  'ponctuelle',
  '2025-09-17 14:00:00',
  25.00, 10,
  '["especes","virement","cesu"]',
  'Thonon-les-Bains — Bords du lac Léman', 6, 14, 1,
  NOW(), NOW()
);

-- ============================================================
-- 5. CLUB HEBDO — Mercredi après-midi (récurrent)
-- ============================================================
INSERT INTO activities (
  titre, description, type,
  schedule_type,
  recurrence_days, recurrence_time,
  date_debut, date_fin,
  prix, prix_seance,
  places_max,
  payment_methods, virement_info, cesu_info,
  lieu, age_min, age_max, actif,
  created_at, updated_at
) VALUES (
  'Club CapAventure — Mercredi',
  'Le club hebdomadaire du mercredi après-midi ! Un groupe fixe, des activités variées chaque semaine : jeux sportifs, sorties nature, ateliers, et des sorties spéciales (ski en hiver, roller au printemps…). Ambiance sympa, suivi personnalisé. Abonnement mensuel.',
  'scout',
  'recurrente',
  '["mercredi"]', '14:00',
  '2025-09-03', '2026-06-24',
  50.00, 15.00,
  10,
  '["especes","virement","cesu"]',
  'Virement mensuel — coordonnées communiquées à l\'inscription',
  'Chèques CESU acceptés pour l\'abonnement mensuel',
  'Thonon-les-Bains — Point de RDV à confirmer', 6, 14, 1,
  NOW(), NOW()
);

-- ============================================================
-- 6. CLUB HEBDO — Certains samedis (récurrent)
-- ============================================================
INSERT INTO activities (
  titre, description, type,
  schedule_type,
  recurrence_days, recurrence_time,
  date_debut, date_fin,
  periode_label,
  prix, prix_seance,
  places_max,
  payment_methods, virement_info, cesu_info,
  lieu, age_min, age_max, actif,
  created_at, updated_at
) VALUES (
  'Club CapAventure — Samedi',
  'Sorties du samedi pour les enfants qui ne peuvent pas venir le mercredi, ou pour les habitués qui veulent plus d\'aventure ! Sorties nature, jeux en forêt, bords du Léman, et en hiver les sorties ski du weekend.',
  'scout',
  'recurrente',
  '["samedi"]', '09:30',
  '2025-09-06', '2026-06-27',
  'Certains samedis selon le programme (annoncé 2 semaines à l\'avance)',
  50.00, 18.00,
  10,
  '["especes","virement","cesu"]',
  'Virement mensuel — coordonnées communiquées à l\'inscription',
  'Chèques CESU acceptés',
  'Thonon-les-Bains — Point de RDV à confirmer', 6, 14, 1,
  NOW(), NOW()
);

-- ============================================================
-- Vérification
-- ============================================================
SELECT id, titre, type, schedule_type, prix,
       DATE_FORMAT(date, '%d/%m/%Y %H:%i') as date_fmt,
       recurrence_days, places_max, actif
FROM activities
ORDER BY id;
