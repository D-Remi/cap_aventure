-- ============================================================
-- CapAventure — Planning 2025-2027 complet
-- Zone A (Haute-Savoie) — Thonon-les-Bains
-- ============================================================
USE capaventure;

-- Supprimer les anciens inserts de test si besoin
-- DELETE FROM activities WHERE schedule_type = 'multi_dates';

-- ============================================================
-- HELPER : on crée les activités avec multi_dates en JSON
-- ============================================================

-- 1. CLUB SCOUT — Samedis matin hors vacances
INSERT INTO activities (
  titre, description, type, schedule_type, dates, prix, prix_seance,
  places_max, payment_methods, virement_info, cesu_info,
  lieu, age_min, age_max, actif, created_at, updated_at
) VALUES (
  'Club Scout CapAventure — Samedis',
  'Le club scout du samedi matin ! Rendez-vous régulier pour les aventuriers : jeux en forêt, techniques scouts, bivouac, orientation, sorties nature autour de Thonon et dans le Chablais. Un groupe soudé qui se retrouve chaque semaine hors vacances scolaires.',
  'scout', 'multi_dates',
  '["2025-09-06 09:30:00", "2025-09-13 09:30:00", "2025-09-20 09:30:00", "2025-09-27 09:30:00", "2025-10-04 09:30:00", "2025-10-11 09:30:00", "2025-11-08 09:30:00", "2025-11-15 09:30:00", "2025-11-22 09:30:00", "2025-11-29 09:30:00", "2025-12-06 09:30:00", "2025-12-13 09:30:00", "2026-01-10 09:30:00", "2026-01-17 09:30:00", "2026-01-24 09:30:00", "2026-01-31 09:30:00", "2026-02-07 09:30:00", "2026-03-07 09:30:00", "2026-03-14 09:30:00", "2026-03-21 09:30:00", "2026-03-28 09:30:00", "2026-04-04 09:30:00", "2026-04-11 09:30:00", "2026-05-09 09:30:00", "2026-05-16 09:30:00", "2026-05-23 09:30:00", "2026-05-30 09:30:00", "2026-06-06 09:30:00", "2026-06-13 09:30:00", "2026-06-20 09:30:00", "2026-06-27 09:30:00", "2026-09-05 09:30:00", "2026-09-12 09:30:00", "2026-09-19 09:30:00", "2026-09-26 09:30:00", "2026-10-03 09:30:00", "2026-10-10 09:30:00", "2026-11-07 09:30:00", "2026-11-14 09:30:00", "2026-11-21 09:30:00", "2026-11-28 09:30:00", "2026-12-05 09:30:00", "2026-12-12 09:30:00", "2027-01-09 09:30:00", "2027-01-16 09:30:00", "2027-01-23 09:30:00", "2027-01-30 09:30:00", "2027-02-06 09:30:00", "2027-03-06 09:30:00", "2027-03-13 09:30:00", "2027-03-20 09:30:00", "2027-03-27 09:30:00", "2027-04-03 09:30:00", "2027-04-10 09:30:00", "2027-05-08 09:30:00", "2027-05-15 09:30:00", "2027-05-22 09:30:00", "2027-05-29 09:30:00", "2027-06-05 09:30:00", "2027-06-12 09:30:00", "2027-06-19 09:30:00", "2027-06-26 09:30:00"]',
  50.00, 18.00, 10,
  '["especes","virement","cesu"]',
  'Virement mensuel — coordonnées communiquées à l inscription',
  'Chèques CESU acceptés pour l abonnement mensuel',
  'Thonon-les-Bains — Point de RDV à confirmer', 6, 14, 1,
  NOW(), NOW()
);

-- 2. SKI — Mercredis après-midi hiver hors vacances
INSERT INTO activities (
  titre, description, type, schedule_type, dates, prix, prix_seance,
  places_max, payment_methods, virement_info, cesu_info,
  lieu, age_min, age_max, actif, created_at, updated_at
) VALUES (
  'Ski & Montagne — Mercredis hiver',
  'Les sorties ski du mercredi après-midi ! Direction Bernex ou Thollon-les-Mémises selon les conditions. Initiation pour les débutants, progression pour les confirmés. Casque obligatoire. Départ depuis Thonon en covoiturage.',
  'ski', 'multi_dates',
  '["2025-12-03 14:00:00", "2025-12-10 14:00:00", "2025-12-17 14:00:00", "2026-01-07 14:00:00", "2026-01-14 14:00:00", "2026-01-21 14:00:00", "2026-01-28 14:00:00", "2026-02-04 14:00:00", "2026-02-11 14:00:00", "2026-03-04 14:00:00", "2026-03-11 14:00:00", "2026-03-18 14:00:00", "2026-03-25 14:00:00", "2026-12-02 14:00:00", "2026-12-09 14:00:00", "2026-12-16 14:00:00", "2027-01-06 14:00:00", "2027-01-13 14:00:00", "2027-01-20 14:00:00", "2027-01-27 14:00:00", "2027-02-03 14:00:00", "2027-02-10 14:00:00", "2027-03-03 14:00:00", "2027-03-10 14:00:00", "2027-03-17 14:00:00", "2027-03-24 14:00:00", "2027-03-31 14:00:00"]',
  25.00, 25.00, 10,
  '["especes","virement","cesu"]',
  'Virement à CapAventure — coordonnées communiquées à l inscription',
  'Chèques CESU acceptés',
  'Bernex / Thollon-les-Mémises (départ Thonon)', 6, 14, 1,
  NOW(), NOW()
);

-- 3. VTT — Mercredis après-midi printemps/été hors vacances
INSERT INTO activities (
  titre, description, type, schedule_type, dates, prix, prix_seance,
  places_max, payment_methods,
  lieu, age_min, age_max, actif, created_at, updated_at
) VALUES (
  'VTT & Vélo — Mercredis printemps/été',
  'Les sorties vélo du mercredi ! Pistes cyclables des bords du lac Léman, chemins du Chablais et forêts autour de Thonon. Technique, découverte et bonne humeur garanties. Prévoir vélo et casque.',
  'vtt', 'multi_dates',
  '["2025-09-03 14:00:00", "2025-09-10 14:00:00", "2025-09-17 14:00:00", "2025-09-24 14:00:00", "2026-04-01 14:00:00", "2026-04-08 14:00:00", "2026-04-15 14:00:00", "2026-05-06 14:00:00", "2026-05-13 14:00:00", "2026-05-20 14:00:00", "2026-05-27 14:00:00", "2026-06-03 14:00:00", "2026-06-10 14:00:00", "2026-06-17 14:00:00", "2026-06-24 14:00:00", "2026-07-01 14:00:00", "2026-09-02 14:00:00", "2026-09-09 14:00:00", "2026-09-16 14:00:00", "2026-09-23 14:00:00", "2026-09-30 14:00:00", "2027-04-07 14:00:00", "2027-04-14 14:00:00", "2027-05-05 14:00:00", "2027-05-12 14:00:00", "2027-05-19 14:00:00", "2027-05-26 14:00:00", "2027-06-02 14:00:00", "2027-06-09 14:00:00", "2027-06-16 14:00:00", "2027-06-23 14:00:00", "2027-06-30 14:00:00"]',
  25.00, 25.00, 10,
  '["especes","virement","cesu"]',
  'Thonon-les-Bains — Bords du lac Léman', 6, 14, 1,
  NOW(), NOW()
);

-- 4. ROLLER — Dimanches matin hors vacances (alternance)
INSERT INTO activities (
  titre, description, type, schedule_type, dates, prix, prix_seance,
  places_max, payment_methods,
  lieu, age_min, age_max, actif, created_at, updated_at
) VALUES (
  'Roller & Patins — Dimanches matin',
  'Sorties roller le dimanche matin sur les bords du lac Léman à Thonon. Initiation, slalom, jeux de vitesse et parcours. Casque + protections obligatoires. Alternance avec les sorties multi-activités.',
  'vtt', 'multi_dates',
  '["2025-09-07 10:00:00", "2025-09-21 10:00:00", "2025-10-05 10:00:00", "2025-11-09 10:00:00", "2025-11-23 10:00:00", "2025-12-07 10:00:00", "2026-01-11 10:00:00", "2026-01-25 10:00:00", "2026-02-08 10:00:00", "2026-03-15 10:00:00", "2026-03-29 10:00:00", "2026-04-12 10:00:00", "2026-05-17 10:00:00", "2026-05-31 10:00:00", "2026-06-14 10:00:00", "2026-06-28 10:00:00", "2026-09-13 10:00:00", "2026-09-27 10:00:00", "2026-10-11 10:00:00", "2026-11-15 10:00:00", "2026-11-29 10:00:00", "2026-12-13 10:00:00", "2027-01-17 10:00:00", "2027-01-31 10:00:00", "2027-03-07 10:00:00", "2027-03-21 10:00:00", "2027-04-04 10:00:00", "2027-05-09 10:00:00", "2027-05-23 10:00:00", "2027-06-06 10:00:00", "2027-06-20 10:00:00"]',
  25.00, 25.00, 10,
  '["especes","virement","cesu"]',
  'Thonon-les-Bains — Bords du lac Léman', 6, 14, 1,
  NOW(), NOW()
);

-- 5. MULTI-ACTIVITÉS — Dimanches matin hors vacances (alternance)
INSERT INTO activities (
  titre, description, type, schedule_type, dates, prix, prix_seance,
  places_max, payment_methods,
  lieu, age_min, age_max, actif, created_at, updated_at
) VALUES (
  'Multi-activités — Dimanches matin',
  'Chaque dimanche en alternance avec le roller : jeux collectifs, défis sportifs, ateliers nature, sorties découverte autour de Thonon et du lac Léman. Programme surprise chaque semaine !',
  'autre', 'multi_dates',
  '["2025-09-14 10:00:00", "2025-09-28 10:00:00", "2025-10-12 10:00:00", "2025-11-16 10:00:00", "2025-11-30 10:00:00", "2025-12-14 10:00:00", "2026-01-18 10:00:00", "2026-02-01 10:00:00", "2026-03-08 10:00:00", "2026-03-22 10:00:00", "2026-04-05 10:00:00", "2026-05-10 10:00:00", "2026-05-24 10:00:00", "2026-06-07 10:00:00", "2026-06-21 10:00:00", "2026-09-06 10:00:00", "2026-09-20 10:00:00", "2026-10-04 10:00:00", "2026-11-08 10:00:00", "2026-11-22 10:00:00", "2026-12-06 10:00:00", "2027-01-10 10:00:00", "2027-01-24 10:00:00", "2027-02-07 10:00:00", "2027-03-14 10:00:00", "2027-03-28 10:00:00", "2027-04-11 10:00:00", "2027-05-16 10:00:00", "2027-05-30 10:00:00", "2027-06-13 10:00:00", "2027-06-27 10:00:00"]',
  25.00, 25.00, 10,
  '["especes","virement","cesu"]',
  'Thonon-les-Bains — Front de lac', 6, 14, 1,
  NOW(), NOW()
);

-- 6. MULTI-ACTIVITÉS — Pendant les vacances scolaires (lun-ven, hors été)
INSERT INTO activities (
  titre, description, type, schedule_type, dates, prix, prix_seance,
  places_max, payment_methods,
  lieu, age_min, age_max, actif, created_at, updated_at
) VALUES (
  'Vacances — Multi-activités tous les jours',
  'Pendant les vacances scolaires (Toussaint, Noël, Hiver, Printemps) : activités chaque matin du lundi au vendredi ! Jeux, sport, nature, sorties culturelles et découvertes autour de Thonon et du Chablais. Idéal pour occuper les enfants pendant les vacances.',
  'autre', 'multi_dates',
  '["2025-10-20 09:00:00", "2025-10-21 09:00:00", "2025-10-22 09:00:00", "2025-10-23 09:00:00", "2025-10-24 09:00:00", "2025-10-27 09:00:00", "2025-10-28 09:00:00", "2025-10-29 09:00:00", "2025-10-30 09:00:00", "2025-10-31 09:00:00", "2025-12-22 09:00:00", "2025-12-23 09:00:00", "2025-12-24 09:00:00", "2025-12-25 09:00:00", "2025-12-26 09:00:00", "2025-12-29 09:00:00", "2025-12-30 09:00:00", "2025-12-31 09:00:00", "2026-01-01 09:00:00", "2026-01-02 09:00:00", "2026-02-16 09:00:00", "2026-02-17 09:00:00", "2026-02-18 09:00:00", "2026-02-19 09:00:00", "2026-02-20 09:00:00", "2026-02-23 09:00:00", "2026-02-24 09:00:00", "2026-02-25 09:00:00", "2026-02-26 09:00:00", "2026-02-27 09:00:00", "2026-04-20 09:00:00", "2026-04-21 09:00:00", "2026-04-22 09:00:00", "2026-04-23 09:00:00", "2026-04-24 09:00:00", "2026-04-27 09:00:00", "2026-04-28 09:00:00", "2026-04-29 09:00:00", "2026-04-30 09:00:00", "2026-05-01 09:00:00", "2026-10-19 09:00:00", "2026-10-20 09:00:00", "2026-10-21 09:00:00", "2026-10-22 09:00:00", "2026-10-23 09:00:00", "2026-10-26 09:00:00", "2026-10-27 09:00:00", "2026-10-28 09:00:00", "2026-10-29 09:00:00", "2026-10-30 09:00:00", "2026-12-21 09:00:00", "2026-12-22 09:00:00", "2026-12-23 09:00:00", "2026-12-24 09:00:00", "2026-12-25 09:00:00", "2026-12-28 09:00:00", "2026-12-29 09:00:00", "2026-12-30 09:00:00", "2026-12-31 09:00:00", "2027-01-01 09:00:00", "2027-02-15 09:00:00", "2027-02-16 09:00:00", "2027-02-17 09:00:00", "2027-02-18 09:00:00", "2027-02-19 09:00:00", "2027-02-22 09:00:00", "2027-02-23 09:00:00", "2027-02-24 09:00:00", "2027-02-25 09:00:00", "2027-02-26 09:00:00", "2027-04-19 09:00:00", "2027-04-20 09:00:00", "2027-04-21 09:00:00", "2027-04-22 09:00:00", "2027-04-23 09:00:00", "2027-04-26 09:00:00", "2027-04-27 09:00:00", "2027-04-28 09:00:00", "2027-04-29 09:00:00", "2027-04-30 09:00:00"]',
  25.00, 25.00, 12,
  '["especes","virement","cesu"]',
  'Thonon-les-Bains — Variable selon le programme', 6, 14, 1,
  NOW(), NOW()
);

-- Vérification
SELECT id, titre, type, schedule_type,
  JSON_LENGTH(dates) as nb_dates,
  prix, places_max
FROM activities
ORDER BY id DESC
LIMIT 10;
