-- Migration pour mettre à jour les créneaux horaires
-- Mettre à jour les créneaux existants ou les créer s'ils n'existent pas

-- Supprimer les anciens créneaux si ils existent
DELETE FROM "TimeSlot" WHERE "name" IN ('Matin', 'Après-midi', 'Journée', 'Location classique');

-- Créer les nouveaux créneaux avec les horaires mis à jour
INSERT INTO "TimeSlot" ("id", "name", "startTime", "endTime", "description", "createdAt", "updatedAt")
VALUES 
  ('timeslot_morning', 'Matin', '08:00', '12:00', 'Créneau matinal de 8h à 12h', NOW(), NOW()),
  ('timeslot_afternoon', 'Après-midi', '12:00', '17:00', 'Créneau après-midi de 12h à 17h', NOW(), NOW()),
  ('timeslot_fullday', 'Journée', '08:00', '17:00', 'Créneau journée complète de 8h à 17h', NOW(), NOW()),
  ('timeslot_classic', 'Location classique', '12:00', '12:00', 'Location de 12h à 12h le lendemain (24h)', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "startTime" = EXCLUDED."startTime",
  "endTime" = EXCLUDED."endTime",
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

